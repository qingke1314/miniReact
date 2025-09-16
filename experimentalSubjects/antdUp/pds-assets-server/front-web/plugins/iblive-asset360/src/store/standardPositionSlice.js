import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const standardPositionSlice = createSlice({
  name: 'asset360StandardPosition',
  initialState: {
    fundCode: '',
    astUnitId: '',
    date: moment(),
  },
  reducers: {
    setFundCode: (state, action) => {
      state.fundCode = action.payload;
    },
    setAstUnitId: (state, action) => {
      state.astUnitId = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
  },
});

export const {
  setFundCode,
  setAstUnitId,
  setDate,
} = standardPositionSlice.actions;
export default standardPositionSlice.reducer;
