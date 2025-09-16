
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/risk/common';

// 查询列表项
export const queryListItem = (params) => {
  return request(`${prefix}/queryListItem`, {
    method: 'get',
    params,
  });
};
