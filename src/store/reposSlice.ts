import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const initialState = {
  searchValue: '',
  currentPage: 1,
  isSearchValueChanged: false,
};

const reposSlice = createSlice({
  name: 'repos',
  initialState,
  reducers: {
    searchRepo: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload;
      state.isSearchValueChanged = true;
    },
    setCurrentPageNumber: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
});

export const { searchRepo, setCurrentPageNumber } = reposSlice.actions;
export default reposSlice.reducer;
