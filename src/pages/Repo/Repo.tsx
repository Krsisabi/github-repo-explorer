import { Link, useParams } from 'react-router-dom';

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
        <div className={styles.message}>
          {error === 'not-found' ? (
            <>
              <span>Repository not found</span>
              <h3 className={styles.error}>
                There is no <b>{`${owner}/${reponame}`}</b> on GitHub. Check the
                address, or <Link to="/">search from the start</Link>.
              </h3>
            </>
          ) : (
            <>
              <span>Could not load the repository</span>
              <h3 className={styles.error}>
                GitHub is not answering right now. Try again in a moment.
              </h3>
            </>
          )}
        </div>
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
