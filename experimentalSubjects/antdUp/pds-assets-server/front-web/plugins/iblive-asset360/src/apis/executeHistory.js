/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2023-12-21 09:46:09
 * @LastEditTime: 2024-05-24 11:54:09
 * @LastEditors: chenzongjun chenzongjun@apexsoft.com.cn
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/risk/executeHistory';
// 查询
export const queryExecuteHistory = (productCode, page, size, code) =>
  request(`${prefix}/query`, {
    method: 'get',
    params: {
      executeStatus: 'SUCCESS',
      productCode,
      page,
      size,
      code,
    },
  });

// 查询
export const queryDynamicExecuteHistory = (productCode, code) =>
  request(`${prefix}/queryDynamic`, {
    method: 'get',
    params: {
      productCode,
      code,
    },
  });
// 查询列表
export const queryExecuteHistoryByParams = (params) =>
  request(`${prefix}/query`, {
    method: 'get',
    params,
  });
// 查询详情
export const queryExecuteDetail = (params) =>
  request(`${prefix}/queryExecuteDetail`, {
    method: 'get',
    params,
  });

// 查询产品触发统计信息
export const queryStatisticInfo = (params) =>
  request(`${prefix}/queryStatisticInfo`, { method: 'get', params });

// 查询产品组触发统计信息
export const queryProductStatisticInfo = (groupId) =>
  request(
    `${prefix}/queryProductStatisticInfo${
      groupId ? `?groupId=${groupId}` : ''
    }`,
    {
      method: 'get',
    },
  );

export const statisticsExecuteHistory = (date) =>
  request(`${prefix}/statisticsExecuteHistory`, {
    method: 'post',
    ...date,
  });
