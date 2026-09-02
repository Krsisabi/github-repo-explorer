import { Link } from 'react-router-dom';
import GitIcon from '~/assets/git-icon.svg?react';

import styles from './Header.module.scss';

export const Header = () => (
  <header className={styles.header}>
    <Link to="/" className={styles.logo}>
      Repo Explorer
    </Link>
    <a
      href="https://github.com/Krsisabi"
      target="_blank"
      rel="noreferrer"
      // The icon carries `aria-hidden`, so without this the link reaches the
      // accessibility tree with no name at all.
      aria-label="GitHub profile of the author"
    >
      <GitIcon data-testid="git-icon" />
    </a>
  </header>
);
