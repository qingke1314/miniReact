
import { requestUtils } from 'iblive-base';
const { request, requestErrorDirectExport } = requestUtils;

const prefix = '/ficp/index/manager';
// 新增指标
export const addIndex = (data) =>
  request(`${prefix}/add`, { method: 'post', ...data });
// 删除指标
export const deleteIndex = (indexCode) =>
  request(`${prefix}/delete`, { method: 'get', params: { indexCode } });
// 指标发布
export const onReleaseIndex = (data) =>
  request(`${prefix}/release`, { method: 'post', ...data });
// 指标上线
export const onLineIndex = (data) =>
  request(`${prefix}/online`, { method: 'post', ...data });
// 指标下线
export const offLineIndex = (indexCode) =>
  request(`${prefix}/offline`, { method: 'get', params: { indexCode } });
// 获取指标明细
export const getIndexDetail = (indexCode) =>
  request(`${prefix}/detail`, { method: 'get', params: { indexCode } });
// 获取指标明细
export const getIndexDetailOnRelease = (indexCode, config) =>
  request(
    `${prefix}/detailOnRelease`,
    {
      method: 'get',
      params: { indexCode },
    },
    false,
    config,
  );
// 测试指标
export const testIndex = (data) =>
  requestErrorDirectExport(`${prefix}/test`, {
    method: 'post',
    ...data,
    timeout: 30 * 60 * 1000,
  });
// 更新指标
export const updateIndex = (data) =>
  request(`${prefix}/update`, { method: 'post', ...data });
// 获取目录列表
export const getIndexList = (data = {}) =>
  request(`${prefix}/catalog/getAll`, {
    method: 'post',
    ...data,
  });
// 更新、新增目录
export const updateIndexCatalog = (data) =>
  request(`${prefix}/catalog/update`, { method: 'post', ...data });
// 删除目录
export const deleteIndexCatalog = (nodeKey) =>
  request(`${prefix}/catalog/delete`, { method: 'get', params: { nodeKey } });
// 指标版本列表
export const getReleaseIndexVersions = (indexCode) =>
  request(`${prefix}/releaseIndexVersions`, {
    method: 'get',
    params: { indexCode },
  });
// 获取其他已发布版本的指标
export const getReleaseIndex = (data) =>
  request(`${prefix}/releaseIndex`, { method: 'post', ...data });
// 获取所有测试记录
export const getIndexTestRecord = (data) =>
  request(`${prefix}/indexTestRecord`, { method: 'post', ...data });
// 指标锁定
export const setIndexLock = (data) =>
  request(`${prefix}/indexLock`, { method: 'post', ...data });
// 指标解锁
export const setIndexUnLock = (data) =>
  request(`${prefix}/indexUnLock`, { method: 'post', ...data });
// 批量上线
export const multiOnline = (strings = []) =>
  request(`${prefix}/multiOnline`, { method: 'post', postText: strings });
// 批量发布
export const multiRelease = (strings = []) =>
  request(`${prefix}/multiRelease`, { method: 'post', postText: strings });
// 指标指定版本切换
export const releaseVersionSwitch = (data) =>
  request(`${prefix}/releaseVersionSwitch`, { method: 'post', ...data });
// 下线指定版本
export const offline = (indexCode) =>
  request(`${prefix}/offline?indexCode=${indexCode}`, { method: 'get' });
// 获取已发布指定应用下的所有指标
export const getAllReleaseIndexesByApp = (appId) =>
  request(`${prefix}/getAllReleaseIndexesByApp`, {
    method: 'get',
    params: { appId },
  });
// 获取上线的指定应用下的所有指标
export const getAllOnlineIndexesByApp = (appId) =>
  request(`${prefix}/getAllOnlineIndexesByApp`, {
    method: 'get',
    params: { appId },
  });
// 获取用以配置监听的PDS模型表信息
export const getPdsModelTable = (tableName) =>
  request(`${prefix}/getPdsModelTable`, {
    method: 'get',
    params: { tableName },
  });
// 获取指定应用下的所有指标
export const getPdsModelTableNames = () =>
  request(`${prefix}/getPdsModelTableNames`, { method: 'get' });
// 获取可选监听事件
export const getListenEvents = () =>
  request(`${prefix}/getListenEvents`, { method: 'get' });
// 触发所有指标执行
export const triggerAllIndex = () =>
  request(`${prefix}/triggerAllIndex`, { method: 'get', timeout: 60000 });
// 获取行情类型字典
export const getQuotationTypeMap = () =>
  request(`${prefix}/getQuotationTypeMap`, { method: 'get' });
// 获取交易事件字典
export const getTradeEventMap = () =>
  request(`${prefix}/getTradeEventMap`, { method: 'get' });
// 指标关系树查询
export const getIndexTree = (indexCode) =>
  request(`${prefix}/indexReleaseTreePreview/${indexCode}`, { method: 'get' });
// 指标关系树预览
export const getPreviewIndexTree = (indexCode) =>
  request(`${prefix}/indexTreePreview/${indexCode}`, { method: 'get' });
// 根据指标层级查询指标
export const findAllIndexesByIndexLevel = (params) =>
  request(`${prefix}/findAllIndexesByIndexLevel`, { method: 'get', params });
// 查询单一指标信息
export const getIndexInfo = (indexCode) =>
  request(`${prefix}/indexInfo?indexCode=${indexCode}`, { method: 'get' });
// 获取全部应用的全部指标
export const getAllAppIndex = () =>
  request(`${prefix}/getAllAppIndex`, { method: 'get' });
// 获取指标运行日志
export const getIndexExcuteLog = (params = {}) =>
  request(`${prefix}/getIndexExcuteLog`, { method: 'get', params });
// 获取指标运行日志
export const indexCatalogModify = (data = {}) =>
  request(`${prefix}/indexCatalogModify`, { method: 'post', ...data });
// 通过标签查找指标
export const findAllIndexByLabel = (data = {}) =>
  request(`${prefix}/findAllIndexByLabel`, { method: 'post', ...data });
// 获取指标跑批
export const indexRunBatch = (data = {}) =>
  request(`${prefix}/indexRunBatch`, { method: 'post', ...data });
// 复制指标
export const copyIndex = (data = {}) =>
  request(`${prefix}/copy`, { method: 'post', ...data });
// 指标目录数量查询
export const queryNumber = (data = {}) =>
  request(`${prefix}/catalog/queryNumber`, { method: 'post', ...data });
