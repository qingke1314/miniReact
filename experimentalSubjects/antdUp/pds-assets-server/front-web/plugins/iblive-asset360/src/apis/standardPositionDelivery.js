/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-10-11 09:57:58
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-17 17:02:09
 * @Description:
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/pds/position-std/settleDayConfig';

// 获取所有渠道信息
export const queryAllChannel = () => {
  return request(`${prefix}/channel/queryAll`, {
    method: 'GET',
  });
};
// 获取交割日配置信息
export const queryConfigById = (id) => {
  return request(`${prefix}/getById`, {
    method: 'GET',
    params: {
      id,
    },
  });
};
// 获取所有交割日配置信息
export const queryAllConfig = (params) => {
  return request(`${prefix}/queryAll`, {
    method: 'GET',
    params,
  });
};
// 删除交割日配置
export const removeConfig = (id) => {
  return request(`${prefix}/remove`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    postText: `id=${id}`,
  });
};
// 新增交割日配置
export const saveConfig = (data = {}) => {
  return request(`${prefix}/save`, {
    method: 'POST',
    ...data,
  });
};
// 修改交割日配置
export const updateConfig = (data = {}) => {
  return request(`${prefix}/update`, {
    method: 'POST',
    ...data,
  });
};
// 获取申赎配置信息
export const getRedeemConfigInfo = (fundCode) => {
  return request(`${prefix}/getRedeemConfigInfo`, {
    method: 'GET',
    params: {
      fundCode,
    },
  });
};
// 获取所有数据来源信息
export const queryAllSource = () => {
  return request(`${prefix}/queryAllSource`, {
    method: 'GET',
  });
};
// 保存申赎配置
export const updateRedeemConfig = (data = {}) => {
  return request(`${prefix}/updateRedeemConfig`, {
    method: 'POST',
    ...data,
  });
};
