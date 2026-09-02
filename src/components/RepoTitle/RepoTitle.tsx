import { Repo } from '~/services/types';
import { formatCount, formatDate } from '~/lib/format';

import styles from './RepoTitle.module.scss';

export const RepoTitle = ({
  updatedAt,
  login,
  ownerUrl,
  name,
  stargazerCount,
  url,
}: Pick<
  Repo,
  'updatedAt' | 'login' | 'ownerUrl' | 'name' | 'stargazerCount' | 'url'
>) => (
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
          href={ownerUrl}
          className={`${styles.login} ${styles.link}`}
          target="_blank"
          rel="noreferrer"
        >
          by - {login}
        </a>
      </div>
    )}
    {updatedAt && <span>Last updated - {formatDate(updatedAt)}</span>}
    {stargazerCount != null && (
      <span>Stars at the repository - {formatCount(stargazerCount)}</span>
    )}
  </div>
);
