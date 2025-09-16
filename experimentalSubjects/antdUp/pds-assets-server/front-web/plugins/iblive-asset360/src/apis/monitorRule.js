/*
 * @Author: guoxuan
 * @Date: 2025-02-17 15:23:01
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-17 15:23:14
 * @Description: 
 */

import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/pds/position/monitorRule';

// 新增头寸项
export const saveMonitorRuleItem = (data) => {
  return request(`${prefix}/save`, {
    method: 'POST',
    ...data,
  });
};

// 修改头寸项
export const updateMonitorRuleItem = (data) => {
  return request(`${prefix}/update`, {
    method: 'POST',
    ...data,
  });
};

// 删除头寸项
export const removeMonitorRuleItem = (id) => {
  return request(`${prefix}/remove?id=${id}`, {
    method: 'GET',
  });
};

// 分页查询头寸项
export const queryByPage = (params) => {
  return request(`${prefix}/queryPage`, {
    method: 'GET',
    params,
  });
};

// 根据ID查询头寸项
export const queryDeatilById = (id) => {
  return request(`${prefix}/getById?id=${id}`, {
    method: 'GET',
  });
};
