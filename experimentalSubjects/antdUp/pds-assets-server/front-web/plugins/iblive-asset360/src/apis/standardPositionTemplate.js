/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-11-26 15:59:07
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2025-01-06 18:29:22
 * @Description:
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/pds/position-std/position/template';
// 添加模板（估值维度）
export const instAddTemplate = (data) => {
  return request(`${prefix}/addTemplate`, {
    method: 'POST',
    ...data,
  });
};
// 删除模板
export const delTemplate = (data = {}) => {
  return request(`${prefix}/delTemplate`, {
    method: 'POST',
    ...data,
  });
};
// 删除节点
export const deleteNode = (data = {}) => {
  return request(`${prefix}/deleteNode`, {
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
// 查看模板和产品引用关系
export const queryTemplateRef = (data = {}) => {
  return request(`${prefix}/queryTemplateRef`, {
    method: 'POST',
    ...data,
  });
};
// 编辑公式
export const saveFormula = (data = {}) => {
  return request(`${prefix}/saveFormula`, {
    method: 'POST',
    ...data,
  });
};
// 编辑节点
export const saveNode = (data = {}) => {
  return request(`${prefix}/saveNode`, {
    method: 'POST',
    ...data,
  });
};
// 保存模板和产品引用关系
export const updateTemplateRef = (data = {}) => {
  return request(`${prefix}/updateTemplateRef`, {
    method: 'POST',
    ...data,
  });
};
// 查询头寸模板
export const queryTemplateDetail = (templateId) => {
  return request(`${prefix}/query`, {
    method: 'POST',
    templateId,
  });
};
// 添加模板
export const addTemplate = (data = {}) => {
  return request(`${prefix}/addTemplate`, {
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

// 添加模板
export const addTemplate2 = (data) => {
  return request(`${prefix}/inst/addTemplate`, {
    method: 'POST',
    ...data,
  });
};
