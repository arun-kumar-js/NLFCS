import { createSlice } from '@reduxjs/toolkit';

const IcSlice = createSlice({
  name: 'ic',
  initialState: {
    data: null,
    ic_number: '',
    mobile: '',
  },
  reducers: {
    setIcData: (state, action) => {
      state.data = action.payload;
      state.ic_number = action.payload.ic_number || '';
      state.mobile = action.payload.mobile || '';
    },
  },
});

export const { setIcData } = IcSlice.actions;
export default IcSlice.reducer;
