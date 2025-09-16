/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-06-27 13:36:31
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-17 15:25:41
 * @Description:
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/pds/position/eventRecord';

// 分页查询头寸事件
export const queryEventRecordsByPage = (data = {}) => {
  return request(`${prefix}/queryByPage`, {
    method: 'POST',
    ...data,
  });
};

// 批量删除头寸事件
export const removeEventRecords = (postText) => {
  return request(`${prefix}/remove`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    postText,
  });
};
