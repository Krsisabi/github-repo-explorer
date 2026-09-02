import { useEffect, useMemo } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useSearchParams } from 'react-router-dom';

import { useGetReposQuery, useSearchRepoQuery } from '~/services/api';
import { useCursorTrail } from '~/hooks/useCursorTrail';
import { formatCount } from '~/lib/format';
import {
  PAGE_KEY,
  PAGE_SIZE,
  PAGES_PER_WINDOW,
  SEARCH_CEILING,
  lastReachablePage,
} from '~/constants/pagination';

import { RepoItem } from '../RepoItem';
import { Pagination } from '../Pagination';
import { SEARCH_KEY } from '../SearchInput';

import styles from './RepoList.module.scss';

const readPage = (raw: string | null) => {
  const page = Number(raw);
  return Number.isInteger(page) && page > 0 ? page : 1;
};

export const RepoList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQueryParam = searchParams.get(SEARCH_KEY);
  const requestedPage = readPage(searchParams.get(PAGE_KEY));

  const { trail, learn } = useCursorTrail(searchQueryParam ?? '');

  // Which window of results the requested page falls in, and the deepest one we
  // hold a cursor for. While the second lags behind the first we are walking.
  const requestedWindow = Math.floor((requestedPage - 1) / PAGES_PER_WINDOW);
  const windowIndex = Math.min(requestedWindow, trail.length - 1);
  const after = trail[windowIndex];

  const reposResult = useGetReposQuery(
    searchQueryParam ? skipToken : { after }
  );
  const searchResult = useSearchRepoQuery(
    searchQueryParam ? { name: searchQueryParam, after } : skipToken
  );

  const {
    currentData: loadedWindow,
    isFetching,
    error,
  } = searchQueryParam ? searchResult : reposResult;

  // GitHub reports how many repositories matched, but hands out only the first
  // thousand of them, so the last page anyone can reach is capped.
  const totalPages = loadedWindow
    ? lastReachablePage(loadedWindow.totalCount)
    : requestedPage;
  const page = Math.min(requestedPage, totalPages);
  const targetWindow = Math.floor((page - 1) / PAGES_PER_WINDOW);
  const isWalking = windowIndex < targetWindow;

  // Every window we load tells us where the next one begins. Learning that
  // cursor lengthens the trail, which moves `windowIndex` a step closer and
  // starts the next request - the walk is driven by rendering, not by a loop.
  useEffect(() => {
    if (!loadedWindow || !isWalking) return;
    if (!loadedWindow.hasNextPage || !loadedWindow.endCursor) return;

    learn(windowIndex + 1, loadedWindow.endCursor);
  }, [loadedWindow, isWalking, windowIndex, learn]);

  // A page number past the end - a stale link, a hand-typed URL - is corrected
  // in the address bar too, so a reload does not repeat the walk to nowhere.
  useEffect(() => {
    if (page === requestedPage) return;

    setSearchParams(
      (params) => {
        params.set(PAGE_KEY, String(page));
        return params;
      },
      { replace: true }
    );
  }, [page, requestedPage, setSearchParams]);

  const offset = ((page - 1) % PAGES_PER_WINDOW) * PAGE_SIZE;
  const pageItems = useMemo(
    () =>
      loadedWindow && !isWalking
        ? loadedWindow.items.slice(offset, offset + PAGE_SIZE)
        : null,
    [loadedWindow, isWalking, offset]
  );

  const goToPage = (next: number) => {
    setSearchParams((params) => {
      params.set(PAGE_KEY, String(next));
      return params;
    });
  };

  if (error) {
    // The raw GraphQL error is a wall of JSON, sometimes an upstream nginx
    // page. Useful in the console, not on screen.
    return (
      <div className={styles.parentMessage}>
        <div className={styles.message}>
          <span>Could not load repositories</span>
          <p className={styles.error}>
            GitHub is not answering right now. Try again in a moment.
          </p>
        </div>
      </div>
    );
  }

  // `isWalking` counts as loading: the window on screen is not the one asked
  // for, so showing its contents would be showing the wrong page.
  if (isFetching || isWalking || !loadedWindow || !pageItems) {
    return (
      <div className={styles.parentMessage}>
        <p className={styles.message}>Searching...</p>
      </div>
    );
  }

  if (loadedWindow.totalCount === 0) {
    return (
      <div className={styles.parentMessage}>
        <p className={styles.message}>Nothing found</p>
      </div>
    );
  }

  const reachable = Math.min(loadedWindow.totalCount, SEARCH_CEILING);
  const from = (page - 1) * PAGE_SIZE + 1;
  const to = from + pageItems.length - 1;

  return (
    <>
      <p className={styles.summary}>
        {formatCount(loadedWindow.totalCount)} repositories found &middot;
        showing {formatCount(from)}
        &ndash;{formatCount(to)}
        {loadedWindow.totalCount > SEARCH_CEILING && (
          <span className={styles.note}>
            {' '}
            of the first {formatCount(SEARCH_CEILING)}, which is as deep as
            GitHub search goes
          </span>
        )}
      </p>

      <div className={styles.repoList} data-testid="repo-list">
        {pageItems.map((el) => (
          <RepoItem key={el.id} {...el} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalCount={reachable}
        pageSize={PAGE_SIZE}
        onPageChange={goToPage}
      />
    </>
  );
};
