/*
 * @Author: wenyiqian
 * @Date: 2025-01-08 15:37:58
 * @LastEditors: wenyiqian
 * @LastEditTime: 2025-01-08 15:37:58
 * @Description: desc
 */
import { requestUtils, securityUtils } from 'iblive-base';
const { encrypt } = securityUtils;
const { request } = requestUtils;

const prefix = '/ficp/user';
// 用户登录
export const login = ({ password, userAcc }) => {
  return request(`${prefix}/login`, {
    method: 'POST',
    password: encrypt(password),
    userAcc: encrypt(userAcc),
  });
};
// 用户登出
export const loginOut = (userAcc) => {
  return request(`${prefix}/loginOut`, {
    method: 'get',
    params: { userAcc },
  });
};

export const addUser = (data) => {
  return request(`${prefix}/add`, {
    method: 'post',
    ...data,
  });
};

export const deleteUserBatch = (data) => {
  return request(`${prefix}/deleteUserBatch`, {
    method: 'post',
    ...data,
  });
};

export const getAllUsers = (data) => {
  return request(`${prefix}/getAllUsers`, {
    method: 'post',
    ...data,
  });
};

export const offUserBatch = (data) => {
  return request(`${prefix}/offUserBatch`, {
    method: 'post',
    ...data,
  });
};

export const onUserBatch = (data) => {
  return request(`${prefix}/onUserBatch`, {
    method: 'post',
    ...data,
  });
};

export const queryUserListByPage = (data) => {
  return request(`${prefix}/queryUserListByPage`, {
    method: 'post',
    ...data,
  });
};

export const resetPwdBatch = (data) => {
  return request(`${prefix}/resetPwdBatch`, {
    method: 'post',
    ...data,
  });
};

export const updateUser = (data) => {
  return request(`${prefix}/update`, {
    method: 'post',
    ...data,
  });
};

export const detail = (userAcc) => {
  return request(`${prefix}/detail?userAcc=${userAcc}`, {
    method: 'get',
  });
};

export const queryUserListByRoleIds = (data) => {
  return request(`${prefix}/queryUserListByRoleIds`, {
    method: 'post',
    ...data,
  });
};
// 图标下拉修改用户密码
export const editPwd = (data) => {
  return request(`${prefix}/editPwd`, {
    method: 'post',
    ...data,
  });
};
// 图标下拉修改用户部分信息
export const editUserInfo = (data) => {
  return request(`${prefix}/edit`, {
    method: 'post',
    ...data,
  });
};
// 图标下拉查询用户部分信息
export const queryUserUnit = (userAcc) => {
  return request(`${prefix}/queryUserUnit`, {
    method: 'get',
    params: { userAcc },
  });
};
