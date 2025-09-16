/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2023-12-21 09:46:09
 * @LastEditTime: 2024-06-05 14:25:26
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/risk/riskItem/execute/latestResult';
// 查询
export const queryExecuteHistory = (
  productCode,
  page,
  size,
  code,
  businessDate,
  executeStatus,
) =>
  request(`${prefix}/query`, {
    method: 'get',
    params: {
      productCode,
      page,
      size,
      code,
      businessDate,
      executeStatus,
    },
  });

// 查询
export const queryDynamicExecuteHistory = (productCode, code, businessDate) =>
  request(`${prefix}/queryDynamic`, {
    method: 'get',
    params: {
      productCode,
      code,
      businessDate,
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
export const queryProductStatisticInfo = (groupId, businessDate) =>
  request(
    `${prefix}/queryProductStatisticInfo${
      groupId ? `?groupId=${groupId}` : ''
    }`,
    {
      method: 'get',
      params: {
        businessDate,
      },
    },
  );

export const statisticsExecuteHistory = (params) =>
  request(`${prefix}/statisticsExecuteHistory`, {
    method: 'post',
    ...params,
  });

export const exposeSchedule = (params) =>
  request(`/risk/expose/exposeSchedule`, {
    method: 'post',
    ...params,
    timeout: 60000,
  });
