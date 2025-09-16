/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2025-02-18 14:14:03
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2025-02-19 09:22:40
 * @Description:
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/pds/position/common';

// 获取产品类型信息
export const queryFundTypeInfo = (params) => {
  return request(`${prefix}/queryFundTypeInfo`, {
    method: 'GET',
    params,
  });
};
