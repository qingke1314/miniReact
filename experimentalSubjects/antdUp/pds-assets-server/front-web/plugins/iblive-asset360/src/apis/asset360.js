import { requestUtils } from 'iblive-base';
const { request } = requestUtils;

const prefix = '/assets360/simulate/fund';

export const handleQueryAllFund = (data = {}) => {
  return request(`${prefix}/queryAllFund`, {
    method: 'post',
    ...data,
  });
};

export const getVirtualList = (data = {}) => {
  return request(`/assets360/virtual/group/queryAll`, {
    method: 'post',
    ...data,
  });
};

/**
 * 模拟组合-新增资产单元
 */
export const handleAddAsset = (data = {}) => {
  return request(`${prefix}/addAstUnit`, {
    method: 'post',
    ...data,
  });
};

/**
 * 模拟组合-新增基金
 */
export const handleAddFund = (data = {}) => {
  return request(`${prefix}/addFund`, {
    method: 'post',
    ...data,
  });
};

/**
 * 模拟组合-新增组合
 */
export const handleAddCombi = (data = {}) => {
  return request(`${prefix}/addCombi`, {
    method: 'post',
    ...data,
  });
};

/**
 * 删除资产单元
 */
export const handleRemoveAstUnit = (data = {}) => {
  return request(`${prefix}/removeAstUnit`, {
    method: 'post',
    ...data,
  });
};

/**
 * 删除资产组合
 */
export const handleRemoveCombi = (data = {}) => {
  return request(`${prefix}/removeCombi`, {
    method: 'post',
    ...data,
  });
};

/**
 * 删除模拟产品
 */
export const handleRemoveFund = (data = {}) => {
  return request(`${prefix}/removeFund`, {
    method: 'post',
    ...data,
  });
};

/**
 * 复制持仓
 */
export const handleCopyHold = (data = {}) => {
  return request(`/assets360/simulate/hold/copyHoldFromFund`, {
    method: 'post',
    ...data,
  });
};

/**
 * 删除持仓
 */
export const handleRemoveHold = (data = {}) => {
  return request(`/assets360/simulate/hold/remove`, {
    method: 'post',
    ...data,
  });
};

/**
 * 新增持仓
 */
export const handleAddHold = (data = {}) => {
  return request(`/assets360/simulate/hold/create`, {
    method: 'post',
    ...data,
  });
};

/**
 * 查询所有基金
 */
export const handleQueryAllFundWithReal = (data = {}) => {
  return request('/assets360/inf/fund/queryAllFund', {
    method: 'post',
    ...data,
  });
};
