import { Link, generatePath } from 'react-router-dom';

import { RepoItem as RepoItemProps } from '~/services/types';
import { REPO_PAGE_ROUTE } from '~/constants/routes';

import styles from './RepoItem.module.scss';

const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
} as Intl.DateTimeFormatOptions;

export const RepoItem = ({
  name,
  stargazersCount,
  url,
  committedDate,
}: RepoItemProps) => {
  const formattedDate = committedDate
    ? new Date(committedDate).toLocaleDateString('en-US', options)
    : undefined;

  const styledName = name.length > 15 ? name.slice(0, 15) + '...' : name;

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
        {styledName}
      </a>
      <div className={styles.descriptionBlock}>
        {formattedDate && <p>Last commit - {formattedDate}</p>}
        <p>Stars at the repository - {stargazersCount}</p>
      </div>
      <Link
        to={generatePath(REPO_PAGE_ROUTE, {
          owner: username,
          reponame: name,
        })}
        className={styles.link}
      >
        More...
      </Link>
    </div>
  );
};
