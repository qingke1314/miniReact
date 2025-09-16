/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2023-11-21 11:24:55
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-06-05 09:42:26
 * @Description:
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const groupRrefix = '/risk/rangeGroup';

const configPrefix = '/risk/rangeConfig';

// 动态分页查询范围分组
export const queryRangeGroupByPage = () =>
  request(`${groupRrefix}/query`, { method: 'get' });
// 新增范围分组
export const addRangeGroup = (data) =>
  request(`${groupRrefix}/add`, { method: 'post', ...data });
// 更新范围分组
export const updateRangeGroup = (data) =>
  request(`${groupRrefix}/update`, { method: 'post', ...data });
// 删除范围分组
export const deleteRangeGroup = (id) =>
  request(`${groupRrefix}/delete?id=${id}`, { method: 'get' });
// 查询全部范围分组
export const queryAllRangeGroup = () =>
  request(`${groupRrefix}/queryAll`, { method: 'get' });

// 动态分页查询范围配置
export const queryAllRangeConfig = () =>
  request(`${configPrefix}/query`, { method: 'get' });
// 新增范围配置
export const addRangeConfig = (data) =>
  request(`${configPrefix}/add`, { method: 'post', ...data });
// 更新范围配置
export const updateRangeConfig = (data) =>
  request(`${configPrefix}/update`, { method: 'post', ...data });
// 删除范围配置
export const deleteRangeConfig = (id) =>
  request(`${configPrefix}/delete?id=${id}`, { method: 'get' });
// 根据参数查询范围配置
export const queryByParam = (params) =>
  request(`${configPrefix}/queryByParam`, { method: 'get', params });
// 根据范围ID查询范围配置
export const queryById = (params) =>
  request(`${configPrefix}/queryById`, { method: 'get', params });
// 根据范围ID查询范围配置
export const queryByIdIn = (ids = []) =>
  request(`${configPrefix}/queryByIdIn`, { method: 'post', postText: ids });

// 查询左侧配置
export const queryAllConfig = () =>
  request('/risk/rangeConfig/queryAll', { method: 'get' });

// 查询左侧分组
export const queryAllGroup = () =>
  request('/risk/rangeGroup/queryAll', { method: 'get' });
