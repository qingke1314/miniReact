/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-12-23 14:01:34
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-08 09:09:38
 * @Description:
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/assets360/common';

// 查询币种字典
export const queryCurrency = () => {
  return request(`${prefix}/queryCurrency`, {
    method: 'POST',
  });
};

// 执行指标API
export const executeApi = (data = {}, config) => {
  return request(
    `${prefix}/execute/api`,
    {
      method: 'POST',
      timeout: 40000,
      ...data,
    },
    false,
    config,
  );
};

// 查询资产列表
export const queryAssetList = (data = {}) => {
  return request(`/assets360/invest/asset/query`, {
    method: 'post',
    ...data,
  });
};
