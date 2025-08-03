import { createSlice } from '@reduxjs/toolkit';

const userDataSlice = createSlice({
  name: 'userData',
  initialState: {
    otpVerificationResponse: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.otpVerificationResponse = action.payload;
    },
  },
});

export const { setUserData } = userDataSlice.actions;
export default userDataSlice.reducer;