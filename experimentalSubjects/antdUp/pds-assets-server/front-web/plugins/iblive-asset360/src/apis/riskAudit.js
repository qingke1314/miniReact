/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-06-20 11:26:04
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-17 18:59:30
 * @Description:
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/risk/audit';

// 动态分页查询送审条目列表
export const queryRiskAuditList = (params) => {
  return request(`${prefix}/query`, {
    method: 'get',
    params,
  });
};
// 动态分页查询送审条目列表
export const updateRiskAudit = (data = {}) => {
  return request(`${prefix}/update`, {
    method: 'post',
    ...data,
  });
};
