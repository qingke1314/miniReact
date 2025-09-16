/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-02-04 09:10:43
 * @LastEditTime: 2025-02-17 18:58:21
 * @LastEditors: guoxuan
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/risk/computeRuleTemplate';

export const addComputeRuleTemplate = (data) => {
  return request(`${prefix}/add`, {
    method: 'post',
    ...data,
  });
};

export const deleteComputeRuleTemplate = (id) => {
  return request(`${prefix}/deleteById?id=${id}`, {
    method: 'get',
  });
};

export const queryComputeRuleTemplate = (params) => {
  return request(`${prefix}/query`, { method: 'get', params });
};

export const updateComputeRuleTemplate = (data) => {
  return request(`${prefix}/update`, {
    method: 'post',
    ...data,
  });
};

export const queryAllItem = (params) => {
  return request(`${prefix}/queryAllItem`, { method: 'get', params });
};

export const queryById = (id) => {
  return request(`${prefix}/queryById?id=${id}`, {
    method: 'get',
  });
};
