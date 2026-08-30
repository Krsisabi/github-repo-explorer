import { useParams } from 'react-router-dom';

import { LanguagesList } from '~/components/LanguagesList';
import { RepoTitle } from '~/components/RepoTitle';
import { useGetRepoQuery } from '~/services/api';

import styles from './Repo.module.scss';

export const Repo = () => {
  const { owner, reponame } = useParams();

  const { data, isLoading, error } = useGetRepoQuery({
    name: reponame ?? '',
    owner: owner ?? '',
  });

  const typedError = error as Error | undefined;

  const {
    avatar,
    stargazerCount,
    description,
    languages,
    login,
    name,
    updatedAt,
    url,
  } = data || {};

  if (isLoading) {
    return (
      <div className={styles.parentMessage}>
        <p className={styles.message}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.parentMessage}>
        <p className={styles.message}>
          <span>Что-то пошло не так</span>
          {typedError?.name && (
            <h3 className={styles.error}>{typedError.name}</h3>
          )}
          {typedError?.message && (
            <h3 className={styles.error}>{typedError.message}</h3>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.repo}>
      <img src={avatar} alt={login} className={styles.avatar} />
      <RepoTitle
        updatedAt={updatedAt}
        login={login}
        name={name}
        stargazerCount={stargazerCount}
        url={url}
      />
      <p
        className={`${styles.description}${
          description ? '' : ` ${styles.empty}`
        }`}
      >
        {description || 'This profile has no description'}
      </p>
      {languages && <LanguagesList languages={languages} />}
    </div>
  );
};
