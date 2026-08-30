import { Link } from 'react-router-dom';
import { ReactComponent as GitIcon } from 'assets/git-icon.svg';

import styles from './Header.module.scss';

export const Header = () => (
  <header className={styles.header}>
    <Link to="/" className={styles.logo}>
      GitRepoFinder
    </Link>
    <a href="https://github.com/" target="_blank" rel="noreferrer">
      <GitIcon />
    </a>
  </header>
);
