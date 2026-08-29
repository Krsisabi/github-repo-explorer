import { useLayoutEffect } from 'react';

import { useAppSelector } from '~/hooks/redux';
import { useLazyGetReposQuery, useLazySearchRepoQuery } from '~/services/api';
import { getReposSearchValue } from '~/store/selectors';
import { useDebounce } from '~/hooks/useDebounce';

import { RepoItem } from '../RepoItem';

import styles from './RepoList.module.scss';

export const RepoList = () => {
  const searchValue = useAppSelector(getReposSearchValue);
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const [triggerGetRepos, resultGetRepos] = useLazyGetReposQuery();
  const [triggerSearchRepo, resultSearchRepo] = useLazySearchRepoQuery();
  const { data, isFetching, error } = debouncedSearchValue
    ? resultSearchRepo
    : resultGetRepos;

  const repoItems = data?.repoItems;

  useLayoutEffect(() => {
    if (!debouncedSearchValue) {
      triggerGetRepos({});
      return;
    }

    triggerSearchRepo({
      name: debouncedSearchValue,
    });
  }, [debouncedSearchValue]);

  const typedError = error as Error | undefined;

  if (isFetching) {
    return (
      <div className={styles.parentMessage}>
        <p className={styles.message}>Searching...</p>
      </div>
    );
  }

  if (repoItems?.length === 0) {
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
    <div className={styles.repoList}>
      {repoItems?.map((el) => (
        <RepoItem key={el.id} {...el} />
      ))}
    </div>
  );
};
