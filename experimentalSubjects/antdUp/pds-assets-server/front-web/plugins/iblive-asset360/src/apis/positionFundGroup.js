/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2025-02-18 14:14:03
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2025-02-19 09:50:45
 * @Description: 
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/pds/position/fundGroup';

// 批量导入产品
export const batchImportProduct = (data = {}) => {
  return request(`${prefix}/batchImportProduct`, {
    method: 'POST',
    ...data,
  });
};

// 批量移除产品
export const batchRemoveProduct = (data = {}) => {
  return request(`${prefix}/batchRemoveProduct`, {
    method: 'POST',
    ...data,
  });
};

// 获取产品组树
export const queryGroupTree = (data = {}) => {
  return request(`${prefix}/queryGroupTree`, {
    method: 'POST',
    ...data,
  });
};

// 删除产品组
export const removeFundGroup = (params) => {
  return request(`${prefix}/remove`, {
    method: 'POST',
    params,
  });
};

// 新增产品组
export const saveFundGroup = (data = {}) => {
  return request(`${prefix}/save`, {
    method: 'POST',
    ...data,
  });
};

// 修改产品组
export const updateFundGroup = (data = {}) => {
  return request(`${prefix}/update`, {
    method: 'POST',
    ...data,
  });
};
