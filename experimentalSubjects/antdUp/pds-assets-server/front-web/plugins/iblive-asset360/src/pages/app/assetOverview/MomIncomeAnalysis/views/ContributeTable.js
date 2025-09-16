/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-11-20 17:56:41
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-11-21 10:09:11
 * @Description:
 */
import OverviewTable from '@asset360/components/OverviewTable';
import { moneyFormat } from 'iblive-base';
import { isNumber } from 'lodash';
import styles from '../index.less';

const columns = [
  {
    title: '证券内码',
    dataIndex: 'code',
    render: (text) =>
      text === '汇总' ? (
        <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
          {text}
        </span>
      ) : (
        text
      ),
    onCell: (record) => ({ colSpan: record.code === '汇总' ? 2 : 1 }),
  },
  {
    title: '证券名称',
    dataIndex: 'name',
    render: (text) => text || '--',
    onCell: (record) => ({ colSpan: record.code === '汇总' ? 0 : 1 }),
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
    title: '资产收益（元）',
    dataIndex: '2',
    align: 'right',
    render: (text) =>
      isNumber(text) ? moneyFormat({ num: text * 1000 }) : '--', // 假数据特殊处理
  },
];

const data_1 = [
  {
    code: '600519.XSHG',
    name: '贵州茅台',
    1: 0.0057,
    2: 28262.9,
  },
  {
    code: '000858.XSHE',
    name: '五粮液',
    1: 0.0029,
    2: 24379.37,
  },
  {
    code: '300760.XSHE',
    name: '迈瑞医疗',
    1: 0.0012,
    2: 5950.08,
  },
  {
    code: '000568.XSHE',
    name: '泸州老窖',
    1: 0.0007,
    2: 3470.88,
  },
  {
    code: '000333.XSHE',
    name: '美的集团',
    1: 0.0002,
    2: 991.68,
  },
  {
    code: '汇总',
    name: '',
    1: 0.0107,
    2: 53054.92,
  },
];

const data_2 = [
  {
    code: '688111.XSHG',
    name: '金山办公',
    1: -0.00008,
    2: -390.68,
  },
  {
    code: '000733.XSHE',
    name: '振华科技',
    1: -0.00003,
    2: -146.5,
  },
  {
    code: '601208.XSHG',
    name: '东材科技',
    1: 0.00002,
    2: 99.17,
  },
  {
    code: '300496.XSHE',
    name: '中科创达',
    1: 0.00001,
    2: 49.83,
  },
  {
    code: '00981.HKCS',
    name: '中芯国际',
    1: 0.00001,
    2: 47.52,
  },
  {
    code: '汇总',
    name: '',
    1: -0.00007,
    2: -733.7,
  },
];

const obj = [data_1, data_2];
export default function ContributeTable({ title, dataKey }) {
  return (
    <>
      <div className="important-title m-b-8">{title}</div>
      <OverviewTable
        pagination={false}
        showTotal={false}
        columns={columns}
        dataSource={obj[dataKey]}
        onRow={(record) =>
          record.code === '汇总' ? { className: styles.collect_row } : {}
        }
      />
    </>
  );
}
