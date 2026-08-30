import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '~/hooks/redux';
import { searchRepo } from '~/store/reposSlice';
import { useDebounce } from '~/hooks/useDebounce';
import {
  getIsSearchValueChanged,
  getReposSearchValue,
} from '~/store/selectors';

import { ReactComponent as SearchIcon } from 'assets/icon-search.svg';
import styles from './SearchInput.module.scss';

export const SEARCH_KEY = 'search';

export const SearchInput = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchValue = useAppSelector(getReposSearchValue);
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const isSearchValueChanged = useAppSelector(getIsSearchValueChanged);

  const searchQueryParam = searchParams.get(SEARCH_KEY) ?? '';

  useEffect(() => {
    if (!isSearchValueChanged) return;
    if (!debouncedSearchValue) {
      searchParams.delete(SEARCH_KEY);
      setSearchParams(searchParams);
      return;
    }

    setSearchParams({ [SEARCH_KEY]: debouncedSearchValue });
  }, [debouncedSearchValue]);

  useEffect(() => {
    dispatch(searchRepo(searchQueryParam));
  }, [searchQueryParam]);

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
