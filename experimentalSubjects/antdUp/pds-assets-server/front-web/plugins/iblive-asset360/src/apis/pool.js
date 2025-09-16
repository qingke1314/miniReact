/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2023-11-28 13:39:20
 * @LastEditTime: 2023-12-13 11:01:24
 * @LastEditors: chenzongjun chenzongjun@apexsoft.com.cn
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;
const companyPrefix = '/risk/companyPool';

const stockPoolPrefix = '/risk/stockPool';

// 动态分页查询公司池
export const queryAllCompanyPool = () =>
  request(`${companyPrefix}/query`, { method: 'get' });
// 新增公司池
export const addCompanyPool = (data) =>
  request(`${companyPrefix}/add`, { method: 'post', ...data });
// 更新公司池
export const updateCompanyPool = (data) =>
  request(`${companyPrefix}/update`, { method: 'post', ...data });
// 删除公司池
export const deleteCompanyPool = (id) =>
  request(`${companyPrefix}/delete?id=${id}`, { method: 'get' });
// 批量导入公司池证券
export const batchImportCompany = (data) =>
  request(`${companyPrefix}/batchImportCompany`, { method: 'post', ...data });
// 批量移除公司池证券
export const batchRemoveCompany = (data) =>
  request(`${companyPrefix}/batchRemoveCompany`, { method: 'post', ...data });
// 查询所有公司池
export const queryAllCompany = () =>
  request(`${companyPrefix}/queryAll`, { method: 'get' });

// 动态分页查询证券池
export const queryAllStockPool = () =>
  request(`${stockPoolPrefix}/queryAll`, { method: 'get' });
// 新增证券池
export const addStockPool = (data) =>
  request(`${stockPoolPrefix}/add`, { method: 'post', ...data });
// 更新证券池
export const updateStockPool = (data) =>
  request(`${stockPoolPrefix}/update`, { method: 'post', ...data });
// 删除证券池
export const deleteStockPool = (id) =>
  request(`${stockPoolPrefix}/delete?id=${id}`, { method: 'get' });
// 批量导入证券池证券
export const batchImportStock = (data) =>
  request(`${stockPoolPrefix}/batchImportStock`, { method: 'post', ...data });
// 批量移除证券池证券
export const batchRemoveStock = (data) =>
  request(`${stockPoolPrefix}/batchRemoveStock`, { method: 'post', ...data });
// 查询所有证券池
export const queryAllStock = () =>
  request(`${stockPoolPrefix}/queryAll`, { method: 'get' });

// 新增证券
export const addStock = (data) =>
  request('/risk/stock/add', { method: 'post', ...data });
// 删除证券
export const deleteStock = (id) =>
  request(`/risk/stock/delete?id=${id}`, { method: 'get' });
// 动态分页查询证券
export const queryStock = (params) =>
  request(`/risk/stock/query`, { method: 'get', params });
// 更新证券
export const updateStock = (data) =>
  request('/risk/stock/update', { method: 'post', ...data });

// 新增公司
export const addCompany = (data) =>
  request('/risk/company/add', { method: 'post', ...data });
// 删除公司
export const deleteCompany = (id) =>
  request(`/risk/company/delete?id=${id}`, { method: 'get' });
// 动态分页查询公司
export const queryCompany = (params) =>
  request(`/risk/company/query`, { method: 'get', params });
// 更新公司
export const updateCompany = (data) =>
  request('/risk/company/update', { method: 'post', ...data });
