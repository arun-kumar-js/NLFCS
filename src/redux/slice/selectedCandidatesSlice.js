

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selected: [],
};

const selectedCandidatesSlice = createSlice({
  name: 'selectedCandidates',
  initialState,
  reducers: {
    setSelectedCandidates: (state, action) => {
      state.selected = action.payload;
    },
    clearSelectedCandidates: (state) => {
      state.selected = [];
    },
  },
});

export const { setSelectedCandidates, clearSelectedCandidates } = selectedCandidatesSlice.actions;
export default selectedCandidatesSlice.reducer;