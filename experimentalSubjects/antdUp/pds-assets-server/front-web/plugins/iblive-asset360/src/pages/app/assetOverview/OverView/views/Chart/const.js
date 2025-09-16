import { moneyFormat } from 'iblive-base';
const formatW = (a) =>
  moneyFormat({
    num: (a || 0) / 100000000,
  });
const formatP = (a) => `${((a || 0) * 100).toFixed(2)}%`;
export const CARD_LIST = [
  {
    label: '总资产规模(亿)',
    value: '',
    valueMap: (data) => `${formatW(data?.totalAmount)}`,
    compareValue: '',
    compareValueMap: (data) => formatP(data?.overLastMonthAmountRatio),
    up: (data) => data?.overLastMonthAmountRatio > 0,
  },
  // {
  //   label: '非货规模(亿)',
  //   value: '',
  //   valueMap: (data) => `￥${formatW(data?.noloanAmount)}`,
  //   compareValue: '',
  //   compareValueMap: (data) => formatP(data?.overLastMonthToloanRatio),
  //   up: (data) => data?.overLastMonthToloanRatio > 0,
  // },
  {
    label: '产品总数(只)',
    value: '',
    valueMap: (data) => data?.totalFundNumbs,
    compareValue: '',
    compareValueMap: (data) => `${data?.overLastMonthTotalFundNumbs || 0}只`,
    up: (data) => data?.overLastMonthTotalFundNumbs > 0,
  },
  // {
  //   label: '平均收益率(年化)',
  //   value: '',
  //   valueMap: (data) => formatP(data?.avgIncomeRate),
  //   compareValue: '',
  //   compareValueMap: (data) => formatP(data?.overLastMonthAvgIncomeRate),
  //   up: (data) => data?.overLastMonthAvgIncomeRate > 0,
  // },
  {
    label: '投资经理(人)',
    value: '',
    valueMap: (data) => data?.managerNum,
    compareValue: '',
    compareValueMap: (data) => `${data?.overLastMonthManagerNum || 0}人`,
    up: (data) => data?.overLastMonthManagerNum > 0,
  },
];
