/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-11-26 15:59:07
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-17 17:01:04
 * @Description:
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/pds/position-std/position/rule';
// 删除节点
export const deleteNode = (data = {}) => {
  return request(`${prefix}/deleteNode`, {
    method: 'POST',
    ...data,
  });
};
// 查询头寸规则
export const queryRule = (data = {}) => {
  return request(`${prefix}/query`, {
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
    method: 'post',
    ...data,
  });
};
// 保存至模板
export const saveToTemplate = (data = {}) => {
  return request(`${prefix}/saveToTemplate`, {
    method: 'post',
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

// 使用模板（标准版）
export const saveForTemplate = (data) => {
  return request(`${prefix}/saveForTemplate`, {
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

// 保存头寸规则
export const updateRule = (data) => {
  return request(`${prefix}/inst/update`, {
    method: 'POST',
    ...data,
  });
};
