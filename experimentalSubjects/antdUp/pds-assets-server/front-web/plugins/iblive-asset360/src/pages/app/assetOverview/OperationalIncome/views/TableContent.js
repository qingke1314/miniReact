import OverviewTable from '@asset360/components/OverviewTable';
import { Checkbox, Col, Form, Input, Radio, Row, Space } from 'antd';
import { getFormatDate, moneyFormat } from 'iblive-base';
import { debounce } from 'lodash';
import moment from 'moment';
import { useState } from 'react';
import styles from '../index.less';

const TableContent = ({
  info,
  loading,
  searchForm,
  queryInfo,
  height,
  checkbox,
  setCheckbox,
  dataType,
  setDataType,
}) => {
  const [unit, setUnit] = useState(1); // 单位选择联动

  const tableContentRender = (text, record, dataIndex) => {
    if (!record?.tradeDetails) return;
    return (
      <div className={styles.table_content_wrap}>
        {record?.tradeDetails.map((item, index) => (
          <div
            key={index}
            className={
              record.tradeDetails.length === 1
                ? ''
                : index === 0
                ? styles.content_first_merge_text
                : index === record.tradeDetails.length - 1
                ? styles.content_last_merge_text
                : styles.content_merge_text
            }
          >
            {dataIndex === 'businDate' && getFormatDate(item?.[dataIndex])}
            {dataIndex === 'matchTime' &&
              moment(item?.[dataIndex], 'HHmmss').format('HH:mm:ss')}
            {dataIndex === 'etruDire' && (
              <span>{item?.[dataIndex] === 'GPJY_BUY' ? '买入' : '卖出'}</span>
            )}
            {dataIndex === 'matchQty' &&
              moneyFormat({ num: item?.[dataIndex], decimal: 0 })}
            {dataIndex === 'matchPrice' &&
              moneyFormat({ num: item?.[dataIndex], decimal: 2 })}
          </div>
        ))}
      </div>
    );
  };

  const totalColumn = [
    {
      dataIndex: 'index',
      title: '序号',
      width: 50,
      render: (test, record, index) => index + 1,
    },
    {
      title: '证券代码',
      dataIndex: 'interCode',
    },
    {
      title: '证券名称',
      dataIndex: 'secName',
    },
    {
      title: '期初持仓',
      dataIndex: 'beginQty',
      align: 'right',
      sorter: (a, b) => a.beginQty - b.beginQty,
      render: (text) => moneyFormat({ num: text, decimal: 0 }),
    },
    {
      title: '期末持仓',
      dataIndex: 'currentQty',
      align: 'right',
      sorter: (a, b) => a.currentQty - b.currentQty,
      render: (text) => moneyFormat({ num: text, decimal: 0 }),
    },
    {
      title: '期间买入数量',
      dataIndex: 'buyNum',
      align: 'right',
      sorter: (a, b) => a.buyNum - b.buyNum,
      render: (text) => moneyFormat({ num: text, decimal: 0 }),
    },
    {
      title: '期间卖出数量',
      dataIndex: 'sellNum',
      align: 'right',
      sorter: (a, b) => a.sellNum - b.sellNum,
      render: (text) => moneyFormat({ num: text, decimal: 0 }),
    },
    {
      title: '持仓变动',
      dataIndex: 'holdChangeNum',
      align: 'right',
      sorter: (a, b) => a.holdChangeNum - b.holdChangeNum,
      render: (text) => moneyFormat({ num: text, decimal: 0 }),
    },
    {
      title: '持有盈亏',
      dataIndex: 'holdErngins',
      align: 'right',
      sorter: (a, b) => a.holdErngins - b.holdErngins,
      render: (text) =>
        moneyFormat({ num: text / unit, decimal: 2, needColor: true }),
    },
    {
      title: '操作盈亏',
      dataIndex: 'operationErngins',
      align: 'right',
      sorter: (a, b) => a.operationErngins - b.operationErngins,
      render: (text) =>
        moneyFormat({ num: text / unit, decimal: 2, needColor: true }),
    },
    {
      title: '实际盈亏',
      dataIndex: 'actualErngins',
      align: 'right',
      sorter: (a, b) => a.actualErngins - b.actualErngins,
      render: (text) =>
        moneyFormat({ num: text / unit, decimal: 2, needColor: true }),
    },
  ];

  const detailColumn = [
    {
      dataIndex: 'index',
      title: '序号',
      width: 50,
      render: (test, record, index) => index + 1,
    },
    {
      title: '证券代码',
      dataIndex: 'interCode',
    },
    {
      title: '证券名称',
      dataIndex: 'secName',
    },
    {
      title: '期初持仓',
      dataIndex: 'beginQty',
      align: 'right',
      sorter: (a, b) => a.beginQty - b.beginQty,
      render: (text) => moneyFormat({ num: text, decimal: 0 }),
    },
    {
      title: '期末持仓',
      dataIndex: 'currentQty',
      align: 'right',
      sorter: (a, b) => a.currentQty - b.currentQty,
      render: (text) => moneyFormat({ num: text, decimal: 0 }),
    },
    {
      title: '执行日期',
      dataIndex: 'businDate',
      render: (text, record) => tableContentRender(text, record, 'businDate'),
    },
    {
      title: '执行时间',
      dataIndex: 'matchTime',
      render: (text, record) => tableContentRender(text, record, 'matchTime'),
    },
    {
      title: '操作',
      dataIndex: 'etruDire',
      render: (text, record) => tableContentRender(text, record, 'etruDire'),
    },
    {
      title: '成交数量',
      dataIndex: 'matchQty',
      align: 'right',
      render: (text, record) => tableContentRender(text, record, 'matchQty'),
    },
    {
      title: '成交均价',
      dataIndex: 'matchPrice',
      align: 'right',
      render: (text, record) => tableContentRender(text, record, 'matchPrice'),
    },
    {
      title: '最新价格',
      dataIndex: 'lastPrice',
      align: 'right',
      sorter: (a, b) => a.lastPrice - b.lastPrice,
      render: (text) => moneyFormat({ num: text, decimal: 2 }),
    },
    {
      title: '操作盈亏',
      dataIndex: 'operationErngins',
      align: 'right',
      sorter: (a, b) => a.operationErngins - b.operationErngins,
      render: (text) =>
        moneyFormat({ num: text / unit, decimal: 2, needColor: true }),
    },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <div
        className="blank-card-asset"
        style={{
          width: '100%',
          height: height - 102,
        }}
      >
        <Form form={searchForm}>
          <Row justify="space-between">
            <Col>
              <Row gutter={[8, 8]}>
                <Col>
                  <Form.Item name="secCodeOrName" label="证券代码/名称">
                    <Input
                      style={{
                        width: 160,
                      }}
                      onChange={debounce(() => queryInfo(false), 300)}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    shouldUpdate={(prevValue, curValue) =>
                      prevValue.secCodeOrName !== curValue.secCodeOrName
                    }
                    noStyle
                  >
                    {({ getFieldValue }) => {
                      const secCodeOrName = getFieldValue('secCodeOrName');
                      return (
                        secCodeOrName && (
                          <Col>
                            <a
                              className={styles.filter_title}
                              onClick={() => {
                                searchForm.setFieldsValue({
                                  secCodeOrName: '',
                                });
                                queryInfo(false);
                              }}
                            >
                              取消筛选
                            </a>
                          </Col>
                        )
                      );
                    }}
                  </Form.Item>
                </Col>
                <Col>
                  <Space align="center">
                    <Radio.Group
                      value={dataType}
                      onChange={(e) => {
                        setDataType(e.target.value);
                      }}
                      style={{ marginTop: 4 }}
                    >
                      <Radio value={'TOTAL'}>汇总</Radio>
                      <Radio value={'DETAILS'}>明细</Radio>
                    </Radio.Group>
                  </Space>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row gutter={[8, 8]}>
                <Col style={{ marginTop: 5 }}>
                  <Space align="center">
                    <Checkbox
                      checked={checkbox}
                      onChange={(e) => setCheckbox(e.target.checked)}
                    />
                    <span>显示期间清仓股票</span>
                  </Space>
                </Col>
                <Col>
                  <Space>
                    单位 :
                    <Radio.Group
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      optionType="button"
                      buttonStyle="solid"
                    >
                      <Radio value={1}>元</Radio>
                      <Radio value={10000}>万</Radio>
                      <Radio value={100000000}>亿</Radio>
                    </Radio.Group>
                  </Space>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
        <OverviewTable
          dataSource={info.records || []}
          //dataSource={dataType === 'TOTAL' ? info.records : info.tradeDetails}

          loading={loading}
          height={500}
          columns={dataType === 'TOTAL' ? totalColumn : detailColumn}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default TableContent;
