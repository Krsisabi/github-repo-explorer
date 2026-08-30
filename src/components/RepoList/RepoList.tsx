import { useLayoutEffect, useMemo, useState } from 'react';

import { useAppSelector } from '~/hooks/redux';
import { useLazyGetReposQuery, useLazySearchRepoQuery } from '~/services/api';
import { getReposSearchValue } from '~/store/selectors';
import { useDebounce } from '~/hooks/useDebounce';

import { RepoItem } from '../RepoItem';
import { Pagination } from '../Pagination';

import styles from './RepoList.module.scss';

const PageSize = 10;

export const RepoList = () => {
  const searchValue = useAppSelector(getReposSearchValue);
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const [triggerGetRepos, resultGetRepos] = useLazyGetReposQuery();
  const [triggerSearchRepo, resultSearchRepo] = useLazySearchRepoQuery();
  const { data, isFetching, error } = debouncedSearchValue
    ? resultSearchRepo
    : resultGetRepos;

  const [currentPage, setCurrentPage] = useState(1);

  useLayoutEffect(() => {
    if (!debouncedSearchValue) {
      triggerGetRepos({});
      return;
    }

    triggerSearchRepo({
      name: debouncedSearchValue,
    });
  }, [debouncedSearchValue]);

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
        <p className={styles.message}>
          <span>Что-то пошло не так</span>
          <h3 className={styles.error}>{typedError.name}</h3>
          <h3 className={styles.error}>{typedError.message}</h3>
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.repoList}>
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
