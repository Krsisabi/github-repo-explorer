import { Link } from 'react-router-dom';
import GitIcon from '~/assets/git-icon.svg?react';

import styles from './Header.module.scss';

export const Header = () => (
  <header className={styles.header}>
    <Link to="/" className={styles.logo}>
      Repo Explorer
    </Link>
    <a href="https://github.com/" target="_blank" rel="noreferrer">
      <GitIcon data-testid="git-icon" />
    </a>
  </header>
);
