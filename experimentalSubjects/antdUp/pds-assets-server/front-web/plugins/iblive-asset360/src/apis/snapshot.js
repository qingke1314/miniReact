/*
 * @Author: guoxuan
 * @Date: 2025-02-17 15:26:28
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-17 15:26:45
 * @Description: 
 */

import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/pds/position/snapshot';

//获取快照记录
export const querySnapshotRecord = (params) => {
  return request(`${prefix}/querySnapshotRecord`, { method: 'get', params });
};

//获取快照明细
export const queryPositionSnapshot = (params) => {
  return request(`${prefix}/queryPositionSnapshot`, { method: 'get', params });
};

//快照
export const doSnapshot = (data) => {
  return request(`${prefix}/doSnapshot`, {
    method: 'post',
    ...data,
  });
};
