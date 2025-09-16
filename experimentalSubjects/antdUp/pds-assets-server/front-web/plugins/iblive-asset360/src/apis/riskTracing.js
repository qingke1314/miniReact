
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/risk/tracing';

// 查询列表
export const queryRootTracing = (params) => {
  return request(`${prefix}/rootTracing`, {
    method: 'get',
    params,
  });
};
// 查询详情
export const getTracingItemByParentId = (params) => {
  return request(`${prefix}/getByParentId`, {
    method: 'get',
    params,
  });
};
