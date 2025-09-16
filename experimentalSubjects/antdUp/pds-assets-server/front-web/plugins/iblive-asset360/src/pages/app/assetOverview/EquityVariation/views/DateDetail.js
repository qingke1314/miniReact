import OverviewTable from '@asset360/components/OverviewTable';
import { moneyFormat } from 'iblive-base';

const data = [
  {
    occur_qty: 660,
    tax_fee: 0,
    sec_name: '平安银行',
    occur_price: 17.62,
    inter_code: '000001.XSHE',
    occur_amt: 1162.92,
    busin_caption: '红股登记',
    trade_date: 20241017,
    busin_flag: '41801',
  },
  {
    occur_qty: 1000,
    send_qty: 30,
    tax_fee: 0,
    sec_name: '贵州茅台',
    occur_price: 1928.26,
    inter_code: '600519.XSHG',
    occur_amt: 19282.6,
    busin_caption: '红股登记',
    trade_date: 20241017,
    busin_flag: '41801',
  },
  {
    occur_qty: 1000,
    tax_fee: 0,
    sec_name: '中国石油',
    occur_price: 4.81,
    inter_code: '601857.XSHG',
    occur_amt: 4810,
    busin_caption: '红股登记',
    trade_date: 20241017,
    busin_flag: '41801',
  },
];

const columns_1 = [
  {
    title: '序号',
    dataIndex: 'index',
    render: (text, record, index) => index + 1,
  },
  {
    title: '证券代码',
    dataIndex: 'inter_code',
  },
  {
    title: '证券名称',
    dataIndex: 'sec_name',
  },
  {
    title: '操作',
    dataIndex: 'busin_caption',
  },
  {
    title: '持有股数',
    dataIndex: 'occur_qty',
    align: 'right',
    render: (text, record) =>
      moneyFormat({ num: record.occur_qty, decimal: 0 }),
  },
  {
    title: '分红',
    dataIndex: 'param1',
    align: 'right',
    render: (text, record) => (
      <span style={{ color: 'var(--red-color)' }}>
        {moneyFormat({ num: record.occur_amt })}
      </span>
    ),
  },
  {
    title: '送股',
    dataIndex: 'param2',
    align: 'right',
    render: (text, record) => (
      <span style={{ color: 'var(--primary-color)' }}>
        {moneyFormat({ num: record.send_qty, decimal: 0 })}
      </span>
    ),
  },
];

const columns_2 = [
  {
    title: '序号',
    dataIndex: 'index',
    render: (text, record, index) => index + 1,
  },
  {
    title: '证券代码',
    dataIndex: 'inter_code',
  },
  {
    title: '证券名称',
    dataIndex: 'sec_name',
  },
  {
    title: '操作',
    dataIndex: 'busin_caption',
  },
  {
    title: '说明',
    dataIndex: 'param2',
    render: () => '向全体股东每10股派发现金股利 2 元(含税)',
  },
];

export default ({ isFuture }) => {
  return (
    <>
      <OverviewTable
        dataSource={data}
        columns={isFuture ? columns_2 : columns_1}
      />
    </>
  );
};
