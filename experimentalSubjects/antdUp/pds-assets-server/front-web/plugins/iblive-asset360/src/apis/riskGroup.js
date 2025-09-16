/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2023-11-21 11:24:55
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2023-12-26 11:31:08
 * @Description:
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/risk/riskGroup';
// 查询风控规则分组
export const queryAllRiskGroupList = () =>
  request(`${prefix}/queryAll`, { method: 'get' });
// 新增风控规则分组
export const addRiskGroup = (data) =>
  request(`${prefix}/add`, { method: 'post', ...data });
// 更新风控规则分组
export const updateRiskGroup = (data) =>
  request(`${prefix}/update`, { method: 'post', ...data });
// 更新风控规则分组
export const deleteRiskGroup = (params) =>
  request(`${prefix}/delete`, { method: 'get', params });
