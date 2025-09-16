/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2025-02-18 14:14:03
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2025-02-18 17:58:40
 * @Description:
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/pds/position/fund';

// 分页查询分组内所有产品
export const findGroupFundPage = (params) => {
  return request(`${prefix}/findGroupFundPage`, {
    method: 'GET',
    params,
  });
};
// 查询分组内所有产品
export const findGroupFund = (params) => {
  return request(`${prefix}/findGroupFund`, {
    method: 'GET',
    params,
  });
};
// 查询所有产品
export const findAllFund = () => {
  return request(`${prefix}/findAll`, {
    method: 'GET',
  });
};
