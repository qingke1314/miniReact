/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-02-04 09:10:43
 * @LastEditTime: 2024-09-25 09:12:33
 * @LastEditors: chenzongjun chenzongjun@apexsoft.com.cn
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/pds/position/general';

export const queryCalendarDetails = (params) => {
  return request(`${prefix}/queryCalendarDetails`, {
    method: 'get',
    params,
  });
};

export const queryCalendarDetailsByTab = (params) => {
  return request(`${prefix}/queryCalendarDetailsByTab`, {
    method: 'get',
    params,
  });
};
