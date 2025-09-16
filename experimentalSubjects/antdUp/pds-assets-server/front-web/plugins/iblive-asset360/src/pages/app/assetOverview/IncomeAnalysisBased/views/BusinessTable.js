import OverviewTable from '@asset360/components/OverviewTable';
import { moneyFormat } from 'iblive-base';
import { isNumber } from 'lodash';
import styles from '../index.less';

const columns = [
  {
    title: '资产类别',
    dataIndex: 'item',
    render: (text) =>
      text === '汇总' ? (
        <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
          {text}
        </span>
      ) : (
        text
      ),
  },
  {
    title: '收益拆分',
    dataIndex: '1',
    align: 'right',
    render: (text) =>
      isNumber(text)
        ? !text
          ? '0.00%'
          : moneyFormat({ num: text * 1000, unit: '%', needColor: true }) // 假数据特殊处理
        : '--',
  },
  {
    title: '资产盈亏（元）',
    dataIndex: '2',
    align: 'right',
    render: (text) =>
      isNumber(text) ? moneyFormat({ num: text * 1000 }) : '--', // 假数据特殊处理
  },
];

const data = [
  {
    item: '股票',
    1: 0.0137,
    2: 69298.25,
  },
  {
    item: '债券',
    1: 0.003,
    2: 12842.15,
  },
  {
    item: '现金',
    1: 0,
    2: 0.65,
  },
  {
    item: '其他',
    1: 0.0036,
    2: 18785.79,
  },
  {
    item: '汇总',
    1: 0.0204,
    2: 101151.43,
  },
];
export default () => {
  return (
    <>
      <div className="important-title m-b-8">资产收益贡献占比</div>
      <OverviewTable
        pagination={false}
        showTotal={false}
        columns={columns}
        dataSource={data}
        onRow={(record) =>
          record.item === '汇总' ? { className: styles.collect_row } : {}
        }
      />
    </>
  );
};
