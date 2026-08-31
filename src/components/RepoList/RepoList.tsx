import { useLayoutEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useLazyGetReposQuery, useLazySearchRepoQuery } from '~/services/api';
import { useLocalStorage } from '~/hooks/useLocalStorage';

import { RepoItem } from '../RepoItem';
import { Pagination } from '../Pagination';
import { SEARCH_KEY } from '../SearchInput';

import styles from './RepoList.module.scss';

const PageSize = 10;

export const RepoList = () => {
  const [searchParams] = useSearchParams();
  const searchQueryParam = searchParams.get(SEARCH_KEY);

  const [triggerGetRepos, resultGetRepos] = useLazyGetReposQuery();
  const [triggerSearchRepo, resultSearchRepo] = useLazySearchRepoQuery();
  const { data, isFetching, error } = searchQueryParam
    ? resultSearchRepo
    : resultGetRepos;

  const [currentPage, setCurrentPage] = useLocalStorage('currentPage', 1);

  // Reloading straight onto ?search=... keeps the stored page number; every
  // later change of the query is a new search and starts from page one.
  const isFirstRender = useRef(true);

  useLayoutEffect(() => {
    if (!isFirstRender.current || !searchQueryParam) setCurrentPage(1);
    isFirstRender.current = false;

    if (!searchQueryParam) {
      triggerGetRepos({});
      return;
    }

    triggerSearchRepo({
      name: searchQueryParam,
    });
  }, [searchQueryParam, setCurrentPage, triggerGetRepos, triggerSearchRepo]);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return data?.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, data]);

  const typedError = error as Error | undefined;

  if (isFetching) {
    return (
      <div className={styles.parentMessage}>
        <p className={styles.message}>Searching...</p>
      </div>
    );
  }

  if (data?.length === 0) {
    return (
      <div className={styles.parentMessage}>
        <p className={styles.message}>Nothing</p>
      </div>
    );
  }

  if (typedError?.message) {
    return (
      <div className={styles.parentMessage}>
        <div className={styles.message}>
          <span>Что-то пошло не так</span>
          <h3 className={styles.error}>{typedError.name}</h3>
          <h3 className={styles.error}>{typedError.message}</h3>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.repoList} data-testid="repo-list">
        {currentTableData?.map((el) => (
          <RepoItem key={el.id} {...el} />
        ))}
      </div>
      {data && (
        <Pagination
          currentPage={currentPage}
          totalCount={data.length}
          pageSize={PageSize}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
};
