/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2023-01-16 15:51:46
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-17 15:24:54
 * @Description: /ficp/dept 路径接口 ——部门管理
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;
const prefix = '/ficp/dept';

// 新增部门
export const addDept = (data) => {
  return request(`${prefix}/addDept`, {
    method: 'post',
    ...data,
  });
};

// 修改部门
export const updateDept = (data) => {
  return request(`${prefix}/updateDept`, {
    method: 'post',
    ...data,
  });
};

// 查询部门
export const getDept = (data) => {
  return request(`${prefix}/getDept`, {
    method: 'post',
    ...data,
  });
};

/**
 * @description: 查询全部部门
 */
export const getAllDept = () => {
  return request(`${prefix}/getDeptList`, {
    method: 'post',
  });
};
