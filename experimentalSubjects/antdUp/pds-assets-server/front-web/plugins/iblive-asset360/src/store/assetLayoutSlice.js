/*
 * @Author: guoxuan
 * @Date: 2025-02-08 17:12:47
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-15 09:38:55
 * @Description:
 */
import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const assetLayoutSlice = createSlice({
  name: 'asset360AssetLayout',
  initialState: {
    productCode: '',
    astUnitId: null,
    showTop10Stocks: '',
    showTop10Bonds: '',
    date: moment(),
  },
  reducers: {
    setAstUnitId: (state, action) => {
      if (action.payload) {
        state.astUnitId = Number(action.payload);
      } else {
        state.astUnitId = null;
      }
    },
    setProductCode: (state, action) => {
      state.productCode = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
    resetData: (state) => {
      state.productCode = '';
      state.date = moment();
    },
    setShowTop10Stocks: (state, action) => {
      state.showTop10Stocks = action.payload;
    },
    setShowTop10Bonds: (state, action) => {
      state.showTop10Bonds = action.payload;
    },
  },
});

export const {
  setAstUnitId,
  setProductCode,
  resetData,
  setShowTop10Stocks,
  setShowTop10Bonds,
  setDate,
} = assetLayoutSlice.actions;
export default assetLayoutSlice.reducer;
