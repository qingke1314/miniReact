/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-19 15:01:30
 * @LastEditTime: 2025-01-06 11:42:50
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/pds/position-std/positionItem';

// 新增头寸项
export const savePositionItem = (data) => {
  return request(`${prefix}/save`, {
    method: 'POST',
    ...data,
  });
};

// 修改头寸项
export const updatePositionItem = (data) => {
  return request(`${prefix}/update`, {
    method: 'POST',
    ...data,
  });
};

// 删除头寸项
export const removePositionItem = (id) => {
  return request(`${prefix}/remove?id=${id}`, {
    method: 'GET',
  });
};

// 分页查询头寸项
export const queryByPage = (params) => {
  return request(`${prefix}/queryByPage`, {
    method: 'GET',
    params,
  });
};

// 根据ID查询头寸项
export const queryById = (id) => {
  return request(`${prefix}/queryById?id=${id}`, {
    method: 'GET',
  });
};

// 根据条件查询
export const queryAll = (params) => {
  return request(`${prefix}/queryAll`, {
    method: 'GET',
    ...params,
  });
};

// 批量删除头寸项
export const removeBatch = (array) => {
  return request(`${prefix}/removeBatch`, {
    method: 'POST',
    postText: array,
  });
};
