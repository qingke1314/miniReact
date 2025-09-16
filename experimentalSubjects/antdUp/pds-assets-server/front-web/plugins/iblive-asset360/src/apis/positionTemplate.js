/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-19 15:01:30
 * @LastEditTime: 2025-02-17 15:18:30
 * @LastEditors: guoxuan
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/pds/position/position/template';

// 添加模板（估值维度）
export const instAddTemplate = (data) => {
  return request(`${prefix}/addTemplate`, {
    method: 'POST',
    ...data,
  });
};

// 添加模板
export const addTemplate = (data) => {
  return request(`${prefix}/inst/addTemplate`, {
    method: 'POST',
    ...data,
  });
};

// 查询头寸模板（估值维度）
export const query = (data) => {
  return request(`${prefix}/inst/query`, {
    method: 'POST',
    ...data,
  });
};

// 查询头寸模板
export const instQuery = (data) => {
  return request(`${prefix}/query`, {
    method: 'POST',
    ...data,
  });
};

// 查询头寸模板列表
export const queryTemplate = (params) => {
  return request(`${prefix}/queryTemplate`, {
    method: 'GET',
    params,
  });
};

// 修改模板（估值维度）
export const instUpdateTemplate = (data) => {
  return request(`${prefix}/updateTemplate`, {
    method: 'POST',
    ...data,
  });
};

// 保存模板
export const updateTemplate = (data) => {
  return request(`${prefix}/inst/updateTemplate`, {
    method: 'POST',
    ...data,
  });
};

// 保存模板和产品引用关系
export const updateTemplateRef = (data) => {
  return request(`${prefix}/updateTemplateRef`, {
    method: 'POST',
    ...data,
  });
};

// 查询模板和产品引用关系
export const queryTemplateRef = (data) => {
  return request(`${prefix}/queryTemplateRef`, {
    method: 'POST',
    ...data,
  });
};

// 删除模板
export const delTemplate = (data) => {
  return request(`${prefix}/delTemplate`, {
    method: 'POST',
    ...data,
  });
};
