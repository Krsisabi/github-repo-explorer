import { Link, useLocation } from 'react-router-dom';

import styles from './Error.module.scss';

export const Error = () => {
  const { pathname } = useLocation();

  return (
    <div className={styles.error} id="error-page">
      <h1 className={styles.heading}>Page not found</h1>
      <p>
        There is nothing at <b>{pathname}</b> in this application. A repository
        page looks like <b>/facebook/react</b>.
      </p>
      <p>
        <Link to="/">Back to the search</Link>
      </p>
    </div>
  );
};
