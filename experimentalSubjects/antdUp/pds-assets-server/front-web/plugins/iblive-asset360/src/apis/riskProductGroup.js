/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2023-11-24 09:17:16
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2023-11-24 14:13:13
 * @Description:
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/risk/productGroup';

// 查询所有产品组
export const queryAllProductGroup = () => {
  return request(`${prefix}/queryAll`, {
    method: 'get',
  });
};
// 实时风险查询所有产品组
export const queryAllProductLeaf = () => {
  return request(`${prefix}/queryAllLeaf`, {
    method: 'get',
  });
};
// 查询所有产品组
export const querySubById = (params) => {
  return request(`${prefix}/querySub`, {
    method: 'get',
    params,
  });
};
// 查询
export const queryRiskProductGroup = (params) =>
  request(`${prefix}/query`, { method: 'get', params });
// 新增
export const addRiskProductGroup = (data) =>
  request(`${prefix}/add`, { method: 'post', ...data });
// 更新
export const updateRiskProductGroup = (data) =>
  request(`${prefix}/update`, { method: 'post', ...data });
// 删除
export const deleteRiskProductGroup = (params) =>
  request(`${prefix}/delete`, { method: 'get', params });
// 批量导入
export const batchImportRiskProductGroup = (data) =>
  request(`${prefix}/batchImportProduct`, { method: 'post', ...data });
// 批量删除
export const batchRemoveProductGroup = (data) =>
  request(`${prefix}/batchRemoveProduct`, { method: 'post', ...data });
