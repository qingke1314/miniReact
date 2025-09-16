/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-19 15:01:30
 * @LastEditTime: 2025-02-17 15:23:32
 * @LastEditors: guoxuan
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/pds/position/positionDict';

// 新增头寸字典
export const savePositionDict = (data) => {
  return request(`${prefix}/save`, {
    method: 'POST',
    ...data,
  });
};

// 修改头寸字典
export const updatePositionDict = (data) => {
  return request(`${prefix}/update`, {
    method: 'POST',
    ...data,
  });
};

// 删除头寸字典
export const removePositionDict = (id) => {
  return request(`${prefix}/remove?id=${id}`, {
    method: 'GET',
  });
};

// 根据ID查询字典
export const queryById = (id) => {
  return request(`${prefix}/queryById?id=${id}`, {
    method: 'GET',
  });
};

// 通过字典ID查询字典树
export const queryDictTreeById = (id) => {
  return request(`${prefix}/queryDictTreeById?id=${id}`, {
    method: 'GET',
  });
};

// 查询字典树（全部）
export const queryDictTree = (params) => {
  return request(`${prefix}/queryDictTree`, {
    method: 'GET',
    params,
  });
};

// 查询字典树（全部）
export const queryDictTreeByCode = (params) => {
  return request(`${prefix}/queryDictTreeByCode`, {
    method: 'GET',
    params,
  });
};
