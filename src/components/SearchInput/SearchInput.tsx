import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '~/hooks/redux';
import { searchRepo } from '~/store/reposSlice';
import { useDebounce } from '~/hooks/useDebounce';
import { getIsSearchValueChanged } from '~/store/selectors';
import { PAGE_KEY } from '~/constants/pagination';

import SearchIcon from '~/assets/icon-search.svg?react';
import styles from './SearchInput.module.scss';

export const SEARCH_KEY = 'search';

export const SearchInput = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const isSearchValueChanged = useAppSelector(getIsSearchValueChanged);

  const searchQueryParam = searchParams.get(SEARCH_KEY) ?? '';

  const [searchValue, setSearchValue] = useState(searchQueryParam);
  const debouncedSearchValue = useDebounce(searchValue, 500);

  // The URL is the source of truth: when it changes from the outside (logo
  // click, back button), the field follows. Adjusting state during render
  // instead of in an effect avoids a second render pass.
  const [lastQueryParam, setLastQueryParam] = useState(searchQueryParam);
  if (searchQueryParam !== lastQueryParam) {
    setLastQueryParam(searchQueryParam);
    setSearchValue(searchQueryParam);
  }

  useEffect(() => {
    if (!isSearchValueChanged) return;

    setSearchParams(
      (params) => {
        if (debouncedSearchValue) {
          params.set(SEARCH_KEY, debouncedSearchValue);
        } else {
          params.delete(SEARCH_KEY);
        }
        // A new query means a new result set, so the page number from the old
        // one is meaningless - and its cursor points into results that are
        // gone.
        params.delete(PAGE_KEY);
        return params;
      },
      { replace: true }
    );
  }, [debouncedSearchValue, isSearchValueChanged, setSearchParams]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(searchRepo());
    setSearchValue(e.currentTarget.value);
  };

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
