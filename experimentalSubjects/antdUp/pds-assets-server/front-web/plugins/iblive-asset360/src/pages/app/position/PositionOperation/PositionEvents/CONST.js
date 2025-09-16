/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-06-19 09:43:32
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-10-11 16:11:12
 * @Description:
 */
export const EVENT_TYPE_LIST = [
  {
    label: '负头寸',
    value: 'NEGATIVE_POSITION',
  },
  {
    label: '标准券不足',
    value: 'LACKING_STANDARD_COUPON',
  },
  {
    label: '现金比例不合规',
    value: 'ILLEGAL_CASH_RATIO',
  },
  {
    label: '资金未到账',
    value: 'NON_RECEIVED_FUND',
  },
  {
    label: 'T+1正回购到期预警',
    value: 'ZHG_DQ_WARNING',
  },
];
export const EVENT_STATUS_LIST = [
  {
    label: '失败',
    value: 'FAIL',
    color: 'error',
  },
  {
    label: '未开始',
    value: 'NOT_START',
    color: 'warning',
  },
  {
    label: '成功',
    value: 'SUCCESS',
    color: 'success',
  },
  {
    label: '部分成功',
    value: 'PART_SUCCESS',
    color: 'success',
  },
];

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
