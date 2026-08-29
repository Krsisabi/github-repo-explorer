import { RepoList } from '~/components/RepoList';
import { SearchInput } from '~/components/SearchInput';

import styles from './Main.module.scss';

export const Main = () => {
  return (
    <div className={styles.main}>
      <SearchInput />
      <RepoList />
    </div>
  );
};
