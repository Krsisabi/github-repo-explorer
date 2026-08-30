import { Repo } from '~/services/types';
import styles from './RepoTitle.module.scss';

const localDate = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export const RepoTitle = ({
  updatedAt,
  login,
  name,
  stargazerCount,
  url,
}: Pick<Repo, 'updatedAt' | 'login' | 'name' | 'stargazerCount' | 'url'>) => {
  let lastCommitDate;
  if (updatedAt) {
    lastCommitDate = localDate.format(new Date(updatedAt));
  }
  const formattedStargazersCount = String(stargazerCount).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ' '
  );

  return (
    <div className={styles.repoTitle}>
      {name && (
        <div>
          <a
            href={url}
            className={`${styles.name} ${styles.link}`}
            target="_blank"
            rel="noreferrer"
          >
            {name}
          </a>
        </div>
      )}
      {login && (
        <div>
          <a
            href={url}
            className={`${styles.login} ${styles.link}`}
            target="_blank"
            rel="noreferrer"
          >
            by - {login}
          </a>
        </div>
      )}
      {lastCommitDate && <span>Last commit - {lastCommitDate}</span>}
      {stargazerCount != null && (
        <span>Stars at the repository - {formattedStargazersCount}</span>
      )}
    </div>
  );
};
