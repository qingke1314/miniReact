/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-06-27 13:56:01
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-17 15:26:08
 * @Description:
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/pds/position-std/emailTemplate';

// 分页查询邮件模板
export const queryEmailTemplatesByPage = (params = {}) => {
  return request(`${prefix}/queryByPage`, {
    method: 'GET',
    params,
  });
};
// 根据ID删除邮件模板
export const removeEmailTemplate = (params = {}) => {
  return request(`${prefix}/remove`, {
    method: 'GET',
    params,
  });
};
// 新增邮件模板
export const saveEmailTemplate = (data = {}) => {
  return request(`${prefix}/save`, {
    method: 'POST',
    ...data,
  });
};
// 修改邮件模板
export const updateEmailTemplate = (data = {}) => {
  return request(`${prefix}/update`, {
    method: 'POST',
    ...data,
  });
};
