

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
};

const electionListSlice = createSlice({
  name: 'electionList',
  initialState,
  reducers: {
    setElectionList: (state, action) => {
      state.data = action.payload;
    }
  },
});

export const { setElectionList, clearElectionList } = electionListSlice.actions;
export default electionListSlice.reducer;