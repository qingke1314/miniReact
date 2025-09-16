import { moneyFormat } from 'iblive-base';

const moneyRender = (text) => (
  <div>
    {moneyFormat({
      num: (text || 0) / 10000,
      decimal: 2,
    })}
  </div>
);

export const columnWithAll = [
  {
    title: '资产单元',
    dataIndex: 'astUnitName',
  },
  {
    title: '金额(万元)',
    dataIndex: 'amount',
    render: (text) => (
      <div>
        {moneyFormat({
          num: (text || 0) / 10000,
          decimal: 2,
          needColor: true,
        })}
      </div>
    ),
    align: 'right',
  },
];

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
    title: '方向',
    dataIndex: 'businType',
    render: (text) =>
      text === 'TAXS_SG' ? (
        <span style={{ color: 'var(--red-color)' }}>入金</span>
      ) : (
        <span style={{ color: 'var(--blue-color)' }}>出金</span>
      ),
  },
  {
    title: '金额(万元)',
    dataIndex: 'dealAmt',
    render: moneyRender,
    align: 'right',
  },
];
