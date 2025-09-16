import { moneyFormat } from 'iblive-base';

const moneyRender = (text) => (
  <div>
    {moneyFormat({
      num: (text || 0) / 10000,
      decimal: 2,
      // needColor: true,
    })}
  </div>
);

export const column = [
  {
    title: '业务日期',
    dataIndex: 'businDate',
  },
  {
    title: '所属资产单元',
    dataIndex: 'astUnitName',
  },
  {
    title: '虚拟现金账号',
    dataIndex: 'virtualCashAcc',
  },
  {
    title: '费用类型',
    dataIndex: 'feeType',
  },
  {
    title: '币种',
    dataIndex: 'crrcNo',
  },
  {
    title: '费用发生金额(万元)',
    dataIndex: 'occurAmt',
    render: moneyRender,
    align: 'right',
  },
  {
    title: '未结清金额',
    dataIndex: 'unclearAmt',
    render: moneyRender,
    align: 'right',
  },
  {
    title: '费率',
    dataIndex: 'feeRate',
    align: 'right',
    render: (text) => `${(text || 0) * 100}%`,
  },
];

export const columnWithAll = [
  {
    title: '资产单元',
    dataIndex: 'astUnitName',
  },
  {
    title: '金额(万元)',
    dataIndex: 'amount',
    render: moneyRender,
    align: 'right',
  },
];
