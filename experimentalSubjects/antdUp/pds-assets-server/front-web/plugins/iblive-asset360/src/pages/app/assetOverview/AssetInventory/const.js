/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-10-12 14:46:53
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 * @LastEditTime: 2024-11-07 17:53:18
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\AssetInventory\const.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const sameStyleList = [
  'gupiao',
  'zhaiquan',
  'huigou',
  'jijinlicai',
  // 'quanzheng',
  'qihuo',
  'qiquan',
  'qita',
];

const restrictedDictObj = {
  SS: '上市流通',
  WSS: '新股IPO',
  WSS_WS_PG: '配股',
  WSS_WX_ZF: '增发',
  WSS_WX_FGKXS: '非公开发行',
  WSS_WX_LTSX: '流通受限',
  WSS_WX_ZLPSXS: '战略配售',
  SS_JYS_ZY: '上市_交易所_质押',
  SS_YHJ_ZY: '上市_银行间_质押',
};

const positionFlagDictObj = {
  IC_TD: '可交易',
  IC_HM: '持有到期',
  IC_FS: '可供出售',
};

const circulateFlagDictObj = {
  0: '非流通',
  1: '流通',
};

const depositStateDictObj = {
  1: '存款存入',
  2: '到期兑付',
  3: '提前兑付',
  4: '提前解约',
  5: '一次性还本付息',
  6: '无效存单',
  7: '已销户',
};

const cashAccountTypeDictObj = {
  1: '托管户',
  2: 'DVP账户',
  3: '上海非担保结算账户',
  4: '深圳非担保结算账户',
  5: '公共银行账户',
  6: '存款账户',
  7: '三方存管',
};

const lendingDirectionDictObj = {
  1: '借方',
  '-1': '贷方',
  0: '平',
};

const lendingDirectionhuigouDictObj = {
  1: '逆回购',
  '-1': '正回购',
};

export const restrictedTypeTransform = (type) => {
  return restrictedDictObj[type] || type;
};

export const positionFlagTransform = (type) => {
  return positionFlagDictObj[type] || type;
};

export const circulateFlagTransform = (type) => {
  return circulateFlagDictObj[type] || type;
};

export const depositStateTransform = (type) => {
  return depositStateDictObj[type] || type;
};

export const cashAccountTypeTransform = (type) => {
  return cashAccountTypeDictObj[type] || type;
};

//期货
export const lendingDirectionTransform = (type) => {
  return lendingDirectionDictObj[type] || type;
};

//回购
export const lendingDirectionhuigouTransform = (type) => {
  return lendingDirectionhuigouDictObj[type] || type;
};

export const ZLFX_MR = '1'; // 指令方向 买入
export const ZLFX_MC = '2'; // 指令方向 卖出
