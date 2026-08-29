import { useAppDispatch, useAppSelector } from '~/hooks/redux';
import { searchRepo } from '~/store/reposSlice';
import { getReposSearchValue } from '~/store/selectors';
import { ReactComponent as SearchIcon } from 'assets/icon-search.svg';

import styles from './SearchInput.module.scss';

export const SearchInput = () => {
  const dispatch = useAppDispatch();
  const searchValue = useAppSelector(getReposSearchValue);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(searchRepo(e.currentTarget.value));

  return (
    <div className={styles.search}>
      <label htmlFor="search" className={styles.label}>
        <div className={styles.searchIcon}>
          <SearchIcon />
        </div>
        <input
          type="text"
          autoComplete="off"
          className={styles.inputSearch}
          id="search"
          value={searchValue}
          name="reponame"
          placeholder="Search GitHub Repo..."
          onChange={onChangeHandler}
        />
      </label>
    </div>
  );
};
