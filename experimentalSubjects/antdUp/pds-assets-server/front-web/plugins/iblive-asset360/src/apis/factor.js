/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-02-04 09:10:43
 * @LastEditTime: 2024-02-18 14:36:47
 * @LastEditors: chenzongjun chenzongjun@apexsoft.com.cn
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/risk/dynamicFactor';

export const addDynamicFactor = (data) => {
  return request(`${prefix}/add`, {
    method: 'post',
    ...data,
  });
};

export const deleteDynamicFactor = (id) => {
  return request(`${prefix}/deleteById?id=${id}`, {
    method: 'get',
  });
};

export const queryDynamicFactor = (params) => {
  return request(`${prefix}/query`, { method: 'get', params });
};

export const updateDynamicFactor = (data) => {
  return request(`${prefix}/update`, {
    method: 'post',
    ...data,
  });
};

export const queryAllItem = () => {
  return request(`${prefix}/queryAllItem`, {
    method: 'get',
  });
};
