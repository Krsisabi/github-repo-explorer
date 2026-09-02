import { Link, generatePath } from 'react-router-dom';

import { RepoItem as RepoItemProps } from '~/services/types';
import { REPO_PAGE_ROUTE } from '~/constants/routes';
import { formatCount, formatDate } from '~/lib/format';

import styles from './RepoItem.module.scss';

export const RepoItem = ({
  name,
  stargazersCount,
  url,
  lastPushedAt,
}: RepoItemProps) => {
  const formattedDate = lastPushedAt ? formatDate(lastPushedAt) : undefined;

  const urlObj = new URL(url);
  const username = urlObj.pathname.split('/')[1];

  return (
    <div className={styles.repoItem}>
      <a
        target="_blank"
        href={url}
        rel="noreferrer"
        className={styles.nameRepo}
        title={url}
      >
        {name}
      </a>
      <div className={styles.descriptionBlock}>
        {formattedDate && <p>Last push - {formattedDate}</p>}
        <p>Stars at the repository - {formatCount(stargazersCount)}</p>
      </div>
      <Link
        to={generatePath(REPO_PAGE_ROUTE, {
          owner: username,
          reponame: name,
        })}
        className={styles.link}
        // "More..." on its own tells a screen reader nothing about which of
        // the ten rows it belongs to.
        aria-label={`More about ${name}`}
      >
        More...
      </Link>
    </div>
  );
};
