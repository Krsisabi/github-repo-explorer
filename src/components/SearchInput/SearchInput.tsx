import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useDebounce } from '~/hooks/useDebounce';
import { PAGE_KEY } from '~/constants/pagination';

import SearchIcon from '~/assets/icon-search.svg?react';
import styles from './SearchInput.module.scss';

export const SEARCH_KEY = 'search';

export const SearchInput = () => {
  const [searchParams, setSearchParams] = useSearchParams();

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

  // Publishing a query is the one thing that may erase the page number, so this
  // effect has to fire for a new query and for nothing else. It cannot rely on
  // its own dependencies to enforce that: `setSearchParams` is a fresh function
  // after every URL change, so React re-runs the effect when the page number
  // changes as well. Both guards below exist to answer "did the field really
  // produce something the URL does not have yet".
  useEffect(() => {
    // Still mid-debounce. The field has moved on but `debouncedSearchValue`
    // holds the previous query, and writing that back would undo whatever just
    // changed the URL - clicking the logo would bounce to the old search.
    if (debouncedSearchValue !== searchValue) return;

    // The URL already carries this query. Rewriting it changes nothing except
    // dropping PAGE_KEY.
    if (debouncedSearchValue === searchQueryParam) return;

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
  }, [debouncedSearchValue, searchValue, searchQueryParam, setSearchParams]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.currentTarget.value);
  };

  return (
    <div className={styles.search}>
      <label htmlFor="search" className={styles.label}>
        <span className={styles.labelText}>Search GitHub repositories</span>
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
