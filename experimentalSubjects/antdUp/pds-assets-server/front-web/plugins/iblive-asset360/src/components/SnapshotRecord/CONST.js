/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-12-02 17:14:13
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2025-02-11 16:58:45
 * @Description:
 */
export const WARN_LEVEL = [
  {
    label: '产品',
    value: 'FUND',
  },
  {
    label: '资产单元',
    value: 'ASTUNIT',
  },
];
export const FOREAST_INDEX = [
  {
    value: 'instAvailT0',
    label: 'T0指令可用',
  },
  {
    value: 'instAvailT1',
    label: 'T1指令可用',
  },
  {
    value: 'cashAvailT0',
    label: 'T0头寸可用',
  },
  {
    value: 'cashAvailT1',
    label: 'T1头寸可用',
  },
];

export const OFFSET_DAY_DICT = [
  {
    label: '3天',
    value: 3,
  },
  {
    label: '5天',
    value: 5,
  },
  {
    label: '7天',
    value: 7,
  },
];

export const DAY_TYPE_REALTIME = 'REALTIME';
export const DAY_TYPE_BEGIN = 'BEGIN';
export const DAY_TYPE_END = 'END';
export const DAY_TYPE_LIST = [
  {
    label: '实时头寸',
    value: DAY_TYPE_REALTIME,
  },
  {
    label: '日初头寸',
    value: DAY_TYPE_BEGIN,
  },
  {
    label: '日终头寸',
    value: DAY_TYPE_END,
  },
];

export const POSITION_LINK_INST = 'INST';
export const POSITION_LINK_ETRU = 'ETRU';
export const POSITION_LINK_SETP = 'SETP';
export const POSITION_LINK_SETL = 'SETL';
export const POSITION_LINK_DICT = [
  {
    value: POSITION_LINK_INST,
    label: '指令可用',
  },
  {
    value: POSITION_LINK_ETRU,
    label: '委托可用',
  },
  {
    value: POSITION_LINK_SETP,
    label: '交收预测',
  },
  {
    value: POSITION_LINK_SETL,
    label: '交收可用',
  },
];

export const POSITION_LINK_TRADE = 'TRADE';
export const POSITION_LINK_DEAL_FORECAST = 'DEAL_FORECAST';
export const POSITION_LINK_BEGIN = 'BEGIN';
export const POSITION_LINK_SETTLE = 'SETTLE';
export const POSITION_LINK = [
  {
    value: POSITION_LINK_INST,
    label: '指令',
  },
  {
    value: POSITION_LINK_TRADE,
    label: '交易',
  },
  {
    value: POSITION_LINK_SETTLE,
    label: '交收预测',
  },
  {
    value: POSITION_LINK_BEGIN,
    label: '日初',
  },
  // {
  //   value: POSITION_LINK_SETTLE,
  //   label: '盘后',
  // },
];

export const PAGE_TYPE_CASH_FORECAST = 'cashForecast'; // 现金流预测
export const PAGE_TYPE_CASH_RECONCILIATION = 'cashReconciliation'; // 日终头寸
export const PAGE_TYPE_DEAL_INDEX = 'dealIndex'; // O32交易头寸
export const PAGE_TYPE_FUND_CALENDAR = 'fundCalendar'; // 资金日历

export const PRODUCT_TAB_REALTIME = '1'; // 实时头寸
export const PRODUCT_TAB_START_OF_DAY = '2'; // 日初头寸
