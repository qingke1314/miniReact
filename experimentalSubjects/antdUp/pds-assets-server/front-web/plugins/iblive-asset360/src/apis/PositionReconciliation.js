/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-19 15:01:30
 * @LastEditTime: 2025-02-17 15:22:42
 * @LastEditors: guoxuan
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/pds/position/compare';

// 获取头寸对账信息
export const queryPositionCompareInfo = (params) => {
  return request(`${prefix}/queryPositionCompareInfo`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
};
