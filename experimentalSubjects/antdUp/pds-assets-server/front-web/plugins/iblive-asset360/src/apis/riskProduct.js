
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/risk/product';
// 查询
export const queryRiskProduct = (params) =>
  request(`${prefix}/query`, { method: 'get', params });
// 新增
export const addRiskProduct = (data) =>
  request(`${prefix}/add`, { method: 'post', ...data });
// 更新
export const updateRiskProduct = (data) =>
  request(`${prefix}/update`, { method: 'post', ...data });
// 删除
export const deleteRiskProduct = (params) =>
  request(`${prefix}/delete`, { method: 'get', params });
// 查询全部
export const queryAllRiskProduct = () =>
  request(`${prefix}/queryAll`, { method: 'get' });
