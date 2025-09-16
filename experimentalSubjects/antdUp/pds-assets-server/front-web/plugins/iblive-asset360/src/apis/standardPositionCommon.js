/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-19 15:01:30
 * @LastEditTime: 2025-02-11 16:00:15
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/pds/position-std/common';
// 调用指标服务接口
export const executeIndex = (data = {}, config) =>
  request(
    `${prefix}/execute/api`,
    { method: 'post', timeout: 40000, ...data },
    false,
    config,
  );
// 获取交易日历类型信息
export const queryTradeDayTypeInfo = (data = {}) =>
  request(`${prefix}/queryTradeDayTypeInfo`, { method: 'post', ...data });
