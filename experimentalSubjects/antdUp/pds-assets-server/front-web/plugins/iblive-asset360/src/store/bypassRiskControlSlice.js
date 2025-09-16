/*
 * @Author: guoxuan
 * @Date: 2025-02-08 17:12:47
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-15 09:38:55
 * @Description:
 */
import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const bypassRiskControlSlice = createSlice({
  name: 'asset360BypassRiskControl',
  initialState: {
    businessDate: moment(Date.now()).format('YYYYMMDD'),
  },
  reducers: {
    setBusinessDate: (state, action) => {
      state.businessDate = action.payload;
    },
  },
});

export const { setBusinessDate } = bypassRiskControlSlice.actions;
export default bypassRiskControlSlice.reducer;
