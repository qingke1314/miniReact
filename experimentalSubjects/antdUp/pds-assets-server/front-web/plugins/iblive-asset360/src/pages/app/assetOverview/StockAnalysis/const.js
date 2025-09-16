import { BellFilled } from '@ant-design/icons';
import styles from './index.less';

export const tabList = [
  {
    value: 'market',
    label: '市场池',
  },
  {
    value: 'analysis',
    label: '研究池',
  },
];

export const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    render: (_v, _r, i) => i + 1,
  },
  {
    title: '股票代码',
    dataIndex: 'secCode',
    render: (code, record) => (
      <span>
        {code}
        {record.alert && <BellFilled className={styles.bell} />}
      </span>
    ),
  },
  {
    title: '股票名称',
    dataIndex: 'secName',
  },
  {
    title: '行业',
    dataIndex: 'sectorName',
    width: 80,
  },
  {
    title: '待回复',
    dataIndex: 'unAnswerNum',
    render: (v) => (
      <span style={{ color: 'var(--warning-color)' }}>{v || '0'}</span>
    ),
  },
  {
    title: '待评价',
    dataIndex: 'unCommentNum',
    render: (v) => (
      <span style={{ color: 'var(--warning-color)' }}>{v || '0'}</span>
    ),
  },
  // {
  //   title: '总股本',
  //   dataIndex: 'totalAmount',
  //   render: (v) => moneyFormat({ num: v, decimal: 2 }),
  //   align: 'right',
  // },
  // {
  //   title: '流通股本',
  //   dataIndex: 'turnoverAmount',
  //   render: (v) => moneyFormat({ num: v, decimal: 2 }),
  //   align: 'right',
  // },
  // {
  //   title: '现价',
  //   dataIndex: 'lastPrice',
  //   render: (v) => moneyFormat({ num: v, decimal: 2 }),
  //   align: 'right',
  // },
  // {
  //   title: '本日涨跌',
  //   dataIndex: 'totalRatio',
  //   align: 'right',
  //   render: (v) => (
  //     <div style={{ color: v > 0 ? 'var(--red-color)' : 'var(--green-color)' }}>
  //       {v ? `${moneyFormat({ num: v, decimal: 0 })}%` : '-'}
  //     </div>
  //   ),
  // },
  // {
  //   title: '盘值',
  //   dataIndex: 'marketValue',
  //   align: 'right',
  //   render: (v) => moneyFormat({ num: v, decimal: 2 }),
  // },
];

export const tagsStatusOptions = [
  {
    label: '基本面问题',
    color: 'var(--green-color)',
    value: '基本面',
  },
  {
    label: '行业问题',
    color: 'yellow',
    value: '行业',
  },
  {
    label: '估值问题',
    value: '估值',
    color: 'var(--primary-color)',
  },
  {
    label: '其他问题',
    value: '其他',
    color: 'var(--normal-color)',
  },
];

export const statusOptions = [
  {
    label: '研究中',
    value: '1',
    color: 'var(--normal-color)',
  },
  {
    label: '已回复',
    value: '2',
    color: 'var(--primary-color)',
  },
  {
    label: '已点评',
    value: '3',
    color: 'var(--success-color)',
  },
];

export const tagList = [
  {
    label: '基本面问题',
    value: '1',
  },
  {
    label: '行业问题',
    value: '2',
  },
  {
    label: '估值问题',
    value: '3',
  },
  {
    label: '其他问题',
    value: '4',
  },
];
