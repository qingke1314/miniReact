/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-12-26 16:57:27
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-14 11:12:18
 * @Description:
 */
import { executeApi } from '@asset360/apis/appCommon';
import { Col, Radio, Row, Space, Spin } from 'antd-v5';
import { CustomTable, moneyFormat } from 'iblive-base';
import moment from 'moment';
import { useEffect, useState } from 'react';
import styles from '../index.less';

const MODE_TABLE = '1';
const MODE_TIMELINE = '2';

const columns = [
  {
    title: '日期',
    dataIndex: 'businDate',
    onCell: (row) => ({
      rowSpan: row.rowSpan,
    }),
    render: (text) => moment(text, 'YYYYMMDD').format('YYYY-MM-DD'),
  },
  {
    title: '名称/代码',
    dataIndex: 'compCode',
    render: (text, record) => `${record.compName} / ${record.compCode}`,
  },
  {
    title: '类别',
    dataIndex: 'compTypeName',
  },
  {
    title: '归属市场',
    dataIndex: 'compMarketName',
  },
  {
    title: '权重变化',
    dataIndex: 'weight',
    align: 'right',
    render: (text, record) => (
      <Space
        size={16}
        className={
          (record.newWeight || 0) > (record.oldWeight || 0)
            ? styles.rise
            : (record.newWeight || 0) < (record.oldWeight || 0)
            ? styles.down
            : ''
        }
      >
        {moneyFormat({ num: record.oldWeight })}
        {'=>'}
        {moneyFormat({ num: record.newWeight })}
      </Space>
    ),
  },
];

export default ({ tabKey, activedTab, selectedMarket }) => {
  const [updateTime, setUpdateTime] = useState('xxxx-xx-xx xx:xx');
  const [mode, setMode] = useState('1');
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const updateTable = async () => {
    setLoading(false);
    const res = await executeApi({
      serviceId: 'APEX_ASSET_INDEX_CHANGE_HISTORY',
      data: {
        interCode: selectedMarket,
      },
    });
    const data = res?.data?.eventData || [];
    const dateObj = {};
    data.forEach((item, index) => {
      if (dateObj[item.businDate]) {
        dateObj[item.businDate].count += 1;
        item.rowSpan = 0;
      } else {
        dateObj[item.businDate] = { count: 1, index };
      }
    });
    Object.keys(dateObj).forEach((date) => {
      const { count, index } = dateObj[date];
      data[index].rowSpan = count;
    });
    setUpdateTime(moment().format('YYYY-MM-DD HH:mm'));
    setData(data);
    setLoading(false);
  };

  useEffect(() => {
    if (activedTab === tabKey) {
      updateTable();
    }
  }, [activedTab, selectedMarket]);

  return (
    <>
      <Row justify="space-between" align="middle" className="m-b-8">
        <Col>
          <Radio.Group
            buttonStyle="solid"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <Radio.Button value={MODE_TABLE}>表格</Radio.Button>
            <Radio.Button value={MODE_TIMELINE}>时间轴</Radio.Button>
          </Radio.Group>
        </Col>
        <Col>
          <span>更新日期：{updateTime}</span>
        </Col>
      </Row>
      <Spin spinning={loading}>
        <div>
          {mode === MODE_TABLE ? (
            <CustomTable
              loading={loading}
              total={data?.length}
              pagination={false}
              dataSource={data}
              columns={columns}
            />
          ) : (
            <>开发中...</>
          )}
        </div>
      </Spin>
    </>
  );
};
