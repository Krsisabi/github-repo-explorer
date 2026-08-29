import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const initialState = {
  searchValue: '',
};

const reposSlice = createSlice({
  name: 'repos',
  initialState,
  reducers: {
    searchRepo: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload;
    },
  },
});

export const { searchRepo } = reposSlice.actions;
export default reposSlice.reducer;
