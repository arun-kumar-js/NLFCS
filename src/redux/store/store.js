import { configureStore } from '@reduxjs/toolkit';
import IcReducer from '../slice/IcSlice';
import userDataReducer from '../slice/userDataSlice';
import electionListReducer from '../slice/ElectionListSlice';
import selectedCandidatesReducer from '../slice/selectedCandidatesSlice';

const store = configureStore({
  reducer: {
    ic: IcReducer,
    userData: userDataReducer,
    electionList: electionListReducer,
    selectedCandidates: selectedCandidatesReducer,
  },
});

export default store;
