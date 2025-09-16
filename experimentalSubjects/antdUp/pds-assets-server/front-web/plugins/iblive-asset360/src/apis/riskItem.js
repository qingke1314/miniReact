/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2023-11-21 11:24:55
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-05-29 14:10:50
 * @Description:
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/risk/riskItem';
// 动态分页查询风控规则
export const queryRiskItemList = (params) =>
  request(`${prefix}/query`, { method: 'get', params });
export const queryAllRiskItemList = (params) =>
  request(`${prefix}/queryAll`, { method: 'get', params });
// 新增风控规则
export const addRiskItem = (data) =>
  request(`${prefix}/add`, { method: 'post', ...data });
// 更新风控规则
export const updateRiskItem = (data) =>
  request(`${prefix}/update`, { method: 'post', ...data });
// 删除风控规则
export const deleteRiskItem = (params) =>
  request(`${prefix}/delete`, { method: 'get', params });
// 禁用风控规则
export const disableRiskItem = (params) =>
  request(`${prefix}/disable`, { method: 'get', params });
// 启用风控规则
export const enableRiskItem = (params) =>
  request(`${prefix}/enable`, { method: 'get', params });
// 风险试算
export const tryCalculate = (data) =>
  request(`${prefix}/tryCalculate`, { method: 'post', ...data });
// 执行风控条目
export const executeByRiskItem = (data) =>
  request(`${prefix}/executeByRiskItem`, {
    method: 'post',
    ...data,
    timeout: 30000,
  });
// 根据产品获取全部风控规则
export const queryByProductCode = (productCode) =>
  request(`${prefix}/queryByProductCode?productCode=${productCode}`, {
    method: 'get',
    timeout: 30000,
  });
// 根据产品分页获取风控规则
export const queryPageByProductCode = (params) =>
  request(`${prefix}/queryPageByProductCode`, {
    method: 'get',
    params,
  });
export const queryAllRiskItem = () =>
  request(`${prefix}/queryAll`, {
    method: 'get',
  });

export const queryRiskItemHistory = (id) =>
  request(`/risk/riskItemHistory/queryByRiskItemId?riskItemId=${id}`, {
    method: 'get',
  });
