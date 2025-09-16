/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-06-14 09:17:17
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-06-14 17:35:24
 * @Description:
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/risk/taskConfig';

// 动态分页查询任务执行记录
export const queryTaskExecResult = (params) => {
  return request(`${prefix}/record/query`, {
    method: 'get',
    params,
  });
};
// 新增任务目录
export const addTaskCatalog = (data = {}) => {
  return request(`${prefix}/catalog/add`, {
    method: 'post',
    ...data,
  });
};
// 更新任务目录
export const updateTaskCatalog = (data = {}) => {
  return request(`${prefix}/catalog/update`, {
    method: 'post',
    ...data,
  });
};
// 删除任务目录
export const deleteTaskCatalog = (params) => {
  return request(`${prefix}/catalog/delete`, {
    method: 'get',
    params,
  });
};
// 查看所有任务目录
export const queryAllTaskCatalog = () => {
  return request(`${prefix}/catalog/queryAll`, {
    method: 'get',
  });
};
// 新增任务目录
export const addTaskConfig = (data = {}) => {
  return request(`${prefix}/add`, {
    method: 'post',
    ...data,
  });
};
// 新增任务目录
export const updateTaskConfig = (data = {}) => {
  return request(`${prefix}/update`, {
    method: 'post',
    ...data,
  });
};
// 删除任务配置
export const deleteTaskConfig = (params) => {
  return request(`${prefix}/delete`, {
    method: 'get',
    params,
  });
};
// 动态分页查询查询任务监控信息
export const queryTaskConfigList = (params) => {
  return request(`${prefix}/query`, {
    method: 'get',
    params,
  });
};
// 根据ID查询任务配置
export const queryTaskConfigById = (params) => {
  return request(`${prefix}/queryById`, {
    method: 'get',
    params,
  });
};
// 单次执行任务
export const executeTaskOnce = (data = {}) => {
  return request(`${prefix}/execute`, {
    method: 'post',
    ...data,
    timeout: 10000,
  });
};
// 禁用任务
export const disableTask = (params) => {
  return request(`${prefix}/disable`, {
    method: 'get',
    params,
  });
};
// 禁用任务
export const enableTask = (params) => {
  return request(`${prefix}/enable`, {
    method: 'get',
    params,
  });
};
