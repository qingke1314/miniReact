import { requestUtils } from 'iblive-base';
const { request, requestErrorDirectExport } = requestUtils;

const prefix = '/assets360/common/execute/api';
// 调用指标服务接口
export const invokeAPIIndex = (data = {}, config) =>
  request(
    `${prefix}`,
    { method: 'post', timeout: 40000, ...data },
    false,
    config,
  );
// 发布指标测试，调用指标服务接口(code = -1 也正常返回数据)
export const indicatorTest = async (data = {}) =>
  requestErrorDirectExport(`${prefix}`, {
    method: 'post',
    timeout: 30 * 60 * 1000,
    ...data,
  });
// 批量调用api指标
export const batchInvokeAPIIndex = (data = {}) => {
  return request(`${prefix}/batch`, {
    method: 'post',
    ...data,
  });
};
