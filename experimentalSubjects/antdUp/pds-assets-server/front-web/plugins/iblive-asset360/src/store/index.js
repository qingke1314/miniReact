/*
 * @Author: guoxuan
 * @Date: 2025-02-08 17:12:47
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-17 10:16:18
 * @Description:
 */
import { configureStore } from '@reduxjs/toolkit';
import assetLayoutReducer from './assetLayoutSlice';
import bypassRiskControlReducer from './bypassRiskControlSlice';
import standardPositionReducer from './standardPositionSlice';

export const reducer = {
  asset360AssetLayout: assetLayoutReducer,
  asset360StandardPosition: standardPositionReducer,
  asset360BypassRiskControl: bypassRiskControlReducer,
};
export const store = configureStore({
  reducer,
  //解决'index.js:205 A non-serializable...'报错提示
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
