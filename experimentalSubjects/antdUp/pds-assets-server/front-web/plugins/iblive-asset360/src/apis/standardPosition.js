/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-11-26 15:59:07
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2025-02-12 10:19:48
 * @Description:
 */
import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/pds/position-std';
// 根据权限查询所有产品
export const findAllWithAuth = () => {
  return request(`${prefix}/fund/findAllWithAuth`, {
    method: 'GET',
  });
};
// 根据权限查询所有产品及资产单元信息(树结构)
export const findAllForTreeWithAuth = () => {
  return request(`${prefix}/fund/findAllForTreeWithAuth`, {
    method: 'GET',
  });
};
// 获取资金日历信息
export const getCalendarDetails = (params) => {
  return request(`${prefix}/calendar/queryCalendarDetails`, {
    method: 'GET',
    params,
  });
};
//快照
export const doSnapshot = (data) => {
  return request(`${prefix}/snapshot/doSnapshot`, {
    method: 'post',
    ...data,
  });
};
//获取快照记录
export const querySnapshotRecord = (params) => {
  return request(`${prefix}/snapshot/querySnapshotRecord`, {
    method: 'get',
    params,
  });
};

//获取快照明细
export const queryPositionSnapshot = (params) => {
  return request(`${prefix}/snapshot/queryPositionSnapshot`, {
    method: 'get',
    params,
  });
};
//总览快照
export const doTotalSnapshot = (data) => {
  return request(`${prefix}/snapshot/doTotalSnapshot`, {
    method: 'post',
    ...data,
  });
};
//总览获取快照明细
export const queryPositionSnapshotPage = (params) => {
  return request(`${prefix}/snapshot/queryPositionSnapshotPage`, {
    method: 'get',
    params,
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
// 刷新头寸项数据
export const reloadPosition = (data) => {
  return request(`${prefix}/forecast/reloadPosition`, {
    method: 'POST',
    timeout: 60000,
    ...data,
  });
};
// 锁定头寸项
export const LockCashInfo = (data) => {
  return request(`${prefix}/forecast/updatePositionForecastInfo`, {
    method: 'POST',
    ...data,
  });
};

// 获取头寸预测信息
export const getCashByCode = (params, config) => {
  return request(
    `${prefix}/forecast/queryPositionForecastInfo`,
    {
      method: 'GET',
      params,
      timeout: 60000,
    },
    false,
    config,
  );
};
// 调用指标
export const executeIndex = (data) => {
  return request(`${prefix}/forecast/executeIndex`, {
    method: 'POST',
    timeout: 30000,
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

//全产品头寸-获取头寸总览信息-旧
export const queryCashInfo = (params) => {
  return request(`${prefix}/general/queryListForGz`, {
    method: 'get',
    params,
  });
};
//全产品头寸-获取头寸总览信息
export const queryCashInfos = (params) => {
  return request(`${prefix}/general/queryList`, {
    method: 'get',
    params,
  });
};
// 获取日初头寸（标准版）
export const queryBeginPositionForecastInfo = (params) => {
  return request(`${prefix}/forecast/queryBeginPositionForecastInfo`, {
    method: 'get',
    params,
  });
};

//全产品头寸-获取头寸总览信息日初头寸
export const queryBeginListForGz = (params) => {
  return request(`${prefix}/general/queryBeginListForGz`, {
    method: 'get',
    params,
  });
};
// 获取实时头寸统计信息（标准版）
export const queryPositionStat = (params) => {
  return request(`${prefix}/forecast/queryPositionStat`, {
    method: 'get',
    params,
  });
};

//全产品头寸-根据产品分类统计产品信息
export const findFundTypeStatInfo = (params) => {
  return request(`${prefix}/fund/findFundTypeStatInfo`, {
    method: 'get',
    params,
  });
};

// 查询头寸规则（估值维度）
export const queryPositionRule = (data) => {
  return request(`${prefix}/position/rule/inst/query`, {
    method: 'POST',
    ...data,
  });
};

// 查询头寸模板（估值维度）
export const queryPositionTemplate = (data) => {
  return request(`${prefix}/position/template/inst/query`, {
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
// 查询所有产品及资产单元信息(树结构)
export const getAllFundTree = () => {
  return request(`${prefix}/fund/findAllForTree`, {
    method: 'GET',
  });
};
// 根据用户账号查询信息
export const getPositionAuthByUserAcc = (params) => {
  return request(`${prefix}/userCfg/getByUserAcc`, {
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
// 保存账号配置
export const updatePositionAuth = (data = {}) => {
  return request(`${prefix}/userCfg/update`, {
    method: 'POST',
    ...data,
  });
};

// 获取产品类型信息
export const queryFundTypeInfo = () => {
  return request(`${prefix}/common/queryFundTypeInfo`, {
    method: 'GET',
  });
};

// 根据权限查询所有产品及资产单元信息(树结构)
export const getFundTreeByAuth = () => {
  return request(`${prefix}/fund/findAllForTreeWithAuth`, {
    method: 'GET',
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
// 分页查询日志
export const getAuditLogByPage = (params = {}) => {
  return request(`${prefix}/auditLog/queryPage`, {
    method: 'GET',
    params,
  });
};

// 查询字典树（全部）
export const queryDictTreeByCode = (params) => {
  return request(`${prefix}/positionDict/queryDictTreeByCode`, {
    method: 'GET',
    params,
  });
};

// 获取交易日历类型信息
export const queryTradeDayTypeInfo = (data = {}) => {
  return request(`${prefix}/common/queryTradeDayTypeInfo`, {
    method: 'POST',
    ...data,
  });
};

// 新增头寸字典
export const savePositionDict = (data) => {
  return request(`${prefix}/positionDict/save`, {
    method: 'POST',
    ...data,
  });
};

// 删除头寸字典
export const removePositionDict = (id) => {
  return request(`${prefix}/positionDict/remove?id=${id}`, {
    method: 'GET',
  });
};

// 修改头寸字典
export const updatePositionDict = (data) => {
  return request(`${prefix}/positionDict/update`, {
    method: 'POST',
    ...data,
  });
};
