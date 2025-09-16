import OverviewTable from '@asset360/components/OverviewTable';
import { history } from '@umijs/max';
import { Radio, Row, Space } from 'antd';
import { desensitization, getRealPath, moneyFormat } from 'iblive-base';
import { isNumber } from 'lodash';
import { useState } from 'react';

const handleJump = (record) => {
  history.push(getRealPath('/APP/assetOverview/product'), {
    code: record.fundCode,
    name: record.fundName,
  });
};

const initData = [
  {
    fundTotalValue: 87263287,
    netValue: 0.6229,
    ljjz: 0.6229,
    range: 0.0037,
    faFundType: '混合型-偏股',
    fundManager: '华泰柏瑞基金',
  },
  {
    fundTotalValue: 2092325716,
    netValue: 1.0959,
    ljjz: 1.0959,
    range: 0.0021,
    faFundType: '债券型-混合二级',
    fundManager: '景顺长城基金',
  },
];

export default ({ productList }) => {
  const [unit, setUnit] = useState(1);
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: '代码',
      dataIndex: 'fundCode',
      render: (text) => desensitization(text),
    },
    {
      title: '名称',
      dataIndex: 'fundName',
      render: (text, record) => (
        <a
          onClick={() => {
            handleJump(record);
          }}
        >
          {desensitization(record.fundName)}
        </a>
      ),
    },
    {
      title: '规模',
      dataIndex: 'fundTotalValue',
      align: 'right',
      render: (text) =>
        isNumber(text) ? moneyFormat({ num: text / unit, decimal: 2 }) : '--',
      sorter: (a, b) => a.fundTotalValue - b.fundTotalValue,
    },
    {
      title: '净值',
      dataIndex: 'netValue',
      align: 'right',
      render: (text) => moneyFormat({ num: text, decimal: 3 }),
      sorter: (a, b) => a.netValue - b.netValue,
    },
    {
      title: '累计净值',
      dataIndex: 'ljjz',
      align: 'right',
      render: (text) => moneyFormat({ num: text, decimal: 3 }),
      sorter: (a, b) => a.netValue - b.netValue,
    },
    {
      title: '日增长率',
      dataIndex: 'range',
      align: 'right',
      render: (text) =>
        isNumber(text)
          ? moneyFormat({
              num: text * 100,
              decimal: 2,
              needColor: true,
              unit: '%',
            })
          : '--',
      sorter: (a, b) => a.monthChange - b.monthChange,
    },
    {
      title: '类型',
      dataIndex: 'faFundType',
    },
    {
      title: '管理人',
      dataIndex: 'fundManager',
    },
  ];
  const dataSource = productList.map((item, index) => {
    return { ...item, ...initData[index] };
  });
  return (
    <>
      <Row justify="space-between" align="middle" className="m-b-8">
        <div className="important-title">当前比较</div>
        <Space>
          单位 :
          <Radio.Group
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value={1}>元</Radio.Button>
            <Radio.Button value={10000}>万</Radio.Button>
            <Radio.Button value={100000000}>亿</Radio.Button>
          </Radio.Group>
        </Space>
      </Row>
      <OverviewTable
        showTotal={false}
        pagination={false}
        columns={columns}
        dataSource={dataSource}
      />
    </>
  );
};
