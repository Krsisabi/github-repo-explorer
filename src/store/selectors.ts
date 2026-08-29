import { RootState } from './store';
import { createSelector } from '@reduxjs/toolkit';

const getReposStore = (state: RootState) => {
  return state.reposReducer;
};

export const getReposSearchValue = createSelector(
  getReposStore,
  ({ searchValue }) => searchValue
);
