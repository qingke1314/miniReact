/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-19 15:01:30
 * @LastEditTime: 2025-02-17 15:22:07
 * @LastEditors: guoxuan
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/pds/position/position/rule';

// 查询头寸规则（估值维度）
export const query = (data) => {
  return request(`${prefix}/inst/query`, {
    method: 'POST',
    ...data,
  });
};

// 头寸规则初始化（估值维度）
export const instInit = (data) => {
  return request(`${prefix}/init`, {
    method: 'POST',
    ...data,
  });
};

// 初始化
export const init = (data) => {
  return request(`${prefix}/inst/init`, {
    method: 'POST',
    ...data,
  });
};

// 查询原子项头寸目录列表（交易维度）
export const queryAtomicPositionCatalog = (data) => {
  return request(`${prefix}/queryAtomicPositionCatalog`, {
    method: 'POST',
    ...data,
  });
};

// 查询头寸规则
export const instQuery = (data) => {
  return request(`${prefix}/query`, {
    method: 'POST',
    ...data,
  });
};

// 保存头寸规则
export const updateRule = (data) => {
  return request(`${prefix}/inst/update`, {
    method: 'POST',
    ...data,
  });
};

// 修改头寸规则（估值维度）
export const instUpdate = (data) => {
  return request(`${prefix}/update`, {
    method: 'POST',
    ...data,
  });
};
