/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-06-13 09:17:31
 * @LastEditors: chenzongjun chenzongjun@apexsoft.com.cn
 * @LastEditTime: 2024-09-04 10:59:07
 * @Description:
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/pds/position';

// 分页查询日志
export const getAuditLogByPage = (params = {}) => {
  return request(`${prefix}/auditLog/queryPage`, {
    method: 'GET',
    params,
  });
};
// 查询配置列表
export const querySystemCfg = (params = {}) => {
  return request(`${prefix}/systemCfg/queryAuthList`, {
    method: 'GET',
    params,
  });
};
// 更新配置信息
export const updateSystemCfg = (data = {}) => {
  return request(`${prefix}/systemCfg/update`, {
    method: 'POST',
    ...data,
  });
};
// 根据用户账号查询信息
export const getPositionAuthByUserAcc = (params) => {
  return request(`${prefix}/userCfg/getByUserAcc`, {
    method: 'GET',
    params,
  });
};
// 保存账号配置
export const updatePositionAuth = (data = {}) => {
  return request(`${prefix}/userCfg/update`, {
    method: 'POST',
    ...data,
  });
};

// 分页查询权限配置
export const getPositionAuthList = (params) => {
  return request(`${prefix}/userCfg/queryPage`, {
    method: 'GET',
    params,
  });
};
// 查询所有岗位信息
export const getPositionRoleList = () => {
  return request(`${prefix}/userCfg/role/findAll`, {
    method: 'GET',
  });
};
// 查询所有产品
export const getAllFund = () => {
  return request(`${prefix}/fund/findAll`, {
    method: 'GET',
  });
};
// 根据权限查询所有产品
export const getFundByAuth = () => {
  return request(`${prefix}/fund/fund/findAllWithAuth`, {
    method: 'GET',
  });
};

// 查询所有产品及资产单元信息(树结构)
export const getAllFundTree = () => {
  return request(`${prefix}/fund/findAllForTree`, {
    method: 'GET',
  });
};
// 根据权限查询所有产品及资产单元信息(树结构)
export const getFundTreeByAuth = () => {
  return request(`${prefix}/fund/findAllForTreeWithAuth`, {
    method: 'GET',
  });
};
// 根据权限查询所有产品及资产单元的预警信息
export const getFundTreeStatusByAuth = (params) => {
  return request(`${prefix}/forecast/queryWarningPosition`, {
    method: 'GET',
    params,
  });
};
// 获取头寸预测信息
export const getCashByCode = (params) => {
  return request(`${prefix}/forecast/queryPositionForecastInfo`, {
    method: 'GET',
    params,
    timeout: 60000,
  });
};

// 锁定头寸项
export const LockCashInfo = (data) => {
  return request(`${prefix}/forecast/updatePositionForecastInfo`, {
    method: 'POST',
    ...data,
  });
};

// 获取头寸预测信息（估值维度）
export const queryTradePositionForecastInfo = (params) => {
  return request(`${prefix}/forecast/queryTradePositionForecastInfo`, {
    method: 'get',
    params,
    timeout: 60000,
  });
};

// 获取头寸监控信息
export const getCashMonitoring = (params) => {
  return request(`${prefix}/positionMonitor/queryByProduct`, {
    method: 'GET',
    params,
  });
};

// 获取债券/基金/定期/期货/回购/权证/股票资产持仓明细
export const getPositionDetailByType = (data) => {
  return request(`${prefix}/fundAssetHold/${data?.apiType}`, {
    method: 'POST',
    ...data,
  });
};

// 查询原子项头寸目录列表
export const getAtomicPositionCatalog = (data) => {
  return request(`${prefix}/position/rule/queryAtomicPositionCatalog`, {
    method: 'POST',
    ...data,
  });
};

// 查询交易明细头寸项列表（估值维度）
export const queryTradeDetailPositionList = (data) => {
  return request(`${prefix}/position/rule/queryTradeDetailPositionList`, {
    method: 'POST',
    ...data,
  });
};

// 交易资金明细查询
export const getTradeDetail = (data) => {
  return request(`${prefix}/indexResult/getTradeDetail`, {
    method: 'POST',
    timeout: 60000,
    ...data,
  });
};

// 获取资金日历信息
export const getCalendarDetails = (params) => {
  return request(`${prefix}/calendar/queryCalendarDetails`, {
    method: 'GET',
    params,
  });
};

// 查询全部警告信息
export const queryAllWarningInfo = () => {
  return request(`${prefix}/eventRecord/queryAll`, {
    method: 'GET',
  });
};

// 根据头寸事件ID查询
export const queryByEventId = (params) => {
  return request(`${prefix}/emailHistory/queryByEventId`, {
    method: 'GET',
    params,
  });
};

// 调用指标
export const executeIndex = (data) => {
  return request(`${prefix}/forecast/executeIndex`, {
    method: 'POST',
    timeout: 30000,
    ...data,
  });
};

// 刷新头寸项数据
export const reloadPosition = (data) => {
  return request(`${prefix}/forecast/reloadPosition`, {
    method: 'POST',
    timeout: 60000,
    ...data,
  });
};

// 产品参数-查询配置列表
export const queryFundCfgAll = (params = {}) => {
  return request(`${prefix}/fundCfg/findAll`, {
    method: 'GET',
    params,
  });
};
// 产品参数-更新配置信息
export const updateFundCfgUpdate = (data = {}) => {
  return request(`${prefix}/fundCfg/update`, {
    method: 'POST',
    ...data,
  });
};
// 现金头寸-手工调整资金明细查询
export const getCashManualDetail = (data = {}) => {
  return request(`${prefix}/indexResult/getCashManualDetail`, {
    method: 'POST',
    ...data,
  });
};
