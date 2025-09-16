/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-14 10:54:31
 * @LastEditTime: 2025-02-26 15:52:58
 * @LastEditors: guoxuan
 */
import { RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { queryCalendarDetailsByTab } from '@asset360/apis/general';
import CustomCard from '@asset360/components/CustomCard';
import OperationColunm from '@asset360/components/OperationColunm';
import { history } from '@umijs/max';
import { useGetState } from 'ahooks';
import { Button, Col, DatePicker, Form, Input, Row, Space, Tabs } from 'antd';
import {
  desensitization,
  moneyFormat,
  useGetHeight,
  getRealPath,
} from 'iblive-base';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import NumberCel from '../components/NumberCel';
import PositionTable from '../components/PositionTable';
import GzDetailModal from './components/GzDetailModal';
import TradeDetailModal from './components/TradeDetailModal';

const pageSize = 15;

export default () => {
  const sortRef = useRef();
  const [sort, setSort] = useGetState();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(0);
  const [tabKey, setTabKey] = useState('TRADE');
  const itemType = [
    {
      key: 'TRADE',
      label: '交易维度',
    },
    {
      key: 'GZ',
      label: '估值维度',
    },
  ];

  const [updateDate, setUpdateDate] = useState(moment());
  const tableWrapperRef = useRef();
  const tableWrapperHeight = useGetHeight(tableWrapperRef.current, 300);
  const tableHeight =
    total > pageSize ? tableWrapperHeight - 75 : tableWrapperHeight - 8;

  const [tradeDetail, setTradeDetail] = useState({
    visible: false,
    title: '',
    type: '',
    fundCode: '',
    astUnitId: '',
  });

  const [gzDetail, setGzDetail] = useState({
    visible: false,
    title: '',
    type: '',
    fundCode: '',
    astUnitId: '',
  });

  const getData = async (pageNumber) => {
    const { businDate, fundCodeOrName } = form.getFieldsValue();
    const sort = sortRef.current;
    const res = await queryCalendarDetailsByTab({
      businDate: moment(businDate).format('YYYYMMDD'),
      fundCodeOrName,
      positionType: tabKey,
      pageNumber,
      pageSize,
      sortField: sort?.field,
      sortDire: sort?.order ? (sort.order === 'ascend' ? 'ASC' : 'DESC') : null,
    });
    setData(res?.records || []);
    setTotal(res?.totalRecord || 0);
    setCurrent(pageNumber);
  };
  const sortOrder = (dataIndex) =>
    sort?.field === dataIndex ? sort?.order : null;
  const array1 = [
    {
      dataIndex: 't0InstAmount',
      title: 'T+0指令可用',
      code: 'instAvailT0',
    },
    {
      dataIndex: 't1InstAmount',
      title: 'T+1指令可用',
      code: 'instAvailT1',
    },
    {
      dataIndex: 't0Amount',
      title: 'T+0交易可用',
      code: 'cashAvailT0',
    },
    {
      dataIndex: 't1Amount',
      title: 'T+1交易可用',
      code: 'cashAvailT1',
    },
  ];

  const array2 = [
    {
      dataIndex: 't0SettleAmount',
      title: 'T+0交收可用',
      type: 'SETTLE',
    },
    {
      dataIndex: 't1SettleAmount',
      title: 'T+1交收可用',
      type: 'SETTLE',
    },
    {
      dataIndex: 't0TradeAmount',
      title: 'T+0交易可用',
      type: 'TRADE',
    },
    {
      dataIndex: 't1TradeAmount',
      title: 'T+1交易可用',
      type: 'TRADE',
    },
  ];

  const colunms1 = array1.map((item) => ({
    ...item,
    sorter: true,
    sortOrder: sort?.field === item.dataIndex ? sort?.order : null,
    render: (text, record) => {
      return (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <NumberCel number={text}>
            <a
              style={{ color: 'inherit', fontWeight: 'bold' }}
              onClick={() => {
                setTradeDetail({
                  visible: true,
                  title: item.title,
                  type: item.code,
                  fundCode: record.fundCode,
                  astUnitId: record.unitId,
                });
              }}
            >
              {moneyFormat({ num: text, decimal: 2 })}
            </a>
          </NumberCel>
          <SearchOutlined style={{ fontSize: 10, marginLeft: 2 }} />
        </div>
      );
    },
  }));

  const colunms2 = array2.map((item) => ({
    ...item,
    sorter: true,
    sortOrder: sort?.field === item.dataIndex ? sort?.order : null,
    render: (text, record) => {
      return (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <NumberCel number={text}>
            <a
              style={{ color: 'inherit', fontWeight: 'bold' }}
              onClick={() => {
                setGzDetail({
                  visible: true,
                  title: item.title,
                  type: item.type,
                  fundCode: record.fundCode,
                  astUnitId: record.unitId,
                });
              }}
            >
              {moneyFormat({ num: text, decimal: 2 })}
            </a>
          </NumberCel>
          <SearchOutlined style={{ fontSize: 10, marginLeft: 2 }} />
        </div>
      );
    },
  }));

  const columns = [
    {
      dataIndex: 'businDate',
      title: '业务日期',
      fixed: 'left',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      dataIndex: 'codeAndName',
      title: '产品代码/名称',
      fixed: 'left',
      render: (text, record) => (
        <div>
          <div style={{ color: '#777777' }}>
            {desensitization(record.fundCode)}
          </div>
          <div style={{ color: 'var(--text-color)' }}>
            {desensitization(record.fundName)}
          </div>
        </div>
      ),
    },
    {
      dataIndex: 'unitIdAndName',
      title: '资产单元序号/名称',
      render: (text, record) => (
        <div>
          <div style={{ color: '#777777' }}>{record.unitId}</div>
          <div style={{ color: 'var(--text-color)' }}>{record.unitName}</div>
        </div>
      ),
    },
    {
      dataIndex: 'trusteeBalance',
      title: '托管户日初余额',
      align: 'right',
      sorter: true,
      sortOrder: sortOrder('trusteeBalance'),
      render: (text) => {
        return (
          <span style={{ fontWeight: 'bold' }}>
            <NumberCel number={text}>
              {moneyFormat({ num: text, decimal: 2 })}
            </NumberCel>
          </span>
        );
      },
    },
    ...(tabKey == 'TRADE' ? colunms1 : colunms2),
    {
      dataIndex: 'cashScale',
      title: '现金比例',
      align: 'right',
      sorter: true,
      sortOrder: sortOrder('cashScale'),
      render: (text) => (
        <span style={{ fontWeight: 'bold' }}>
          <NumberCel number={text}>
            {moneyFormat({ num: text * 100, decimal: 2, unit: '%' })}
          </NumberCel>
        </span>
      ),
    },
    {
      dataIndex: 'threeFeeAmountAndThreeFeeScale',
      title: '三费金额/占比',
      align: 'right',
      sorter: true,
      sortOrder: sortOrder('threeFeeAmountAndThreeFeeScale'),
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>
            <NumberCel number={record.threeFeeAmount}>
              {moneyFormat({ num: record.threeFeeAmount })}
            </NumberCel>
          </div>
          <div style={{ color: '#777777' }}>
            <NumberCel number={record.threeFeeScale}>
              {moneyFormat({
                num: record.threeFeeScale * 100,
                decimal: 2,
                unit: '%',
              })}
            </NumberCel>
          </div>
        </div>
      ),
    },
    {
      dataIndex: 'twoGoldAmountAndTwoGoldScale',
      title: '两金金额/占比',
      align: 'right',
      sorter: true,
      sortOrder: sortOrder('twoGoldAmountAndTwoGoldScale'),
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>
            <NumberCel number={record.twoGoldAmount}>
              {moneyFormat({ num: record.twoGoldAmount })}
            </NumberCel>
          </div>
          <div style={{ color: '#777777' }}>
            <NumberCel number={record.twoGoldScale}>
              {moneyFormat({
                num: record.twoGoldScale * 100,
                decimal: 2,
                unit: '%',
              })}
            </NumberCel>
          </div>
        </div>
      ),
    },
    {
      dataIndex: 'operation',
      title: '头寸详情',
      align: 'center',
      fixed: 'right',
      render: (text, record) => (
        <OperationColunm
          showDetail={true}
          detailFunc={() => {
            history.push(getRealPath('/APP/realTimePosition/cashPosition'), {
              info: { ...record, tabKey },
            });
          }}
        />
      ),
    },
  ];

  const onTableChange = ({ current }, _, { field, order }) => {
    const newSort = {
      field: order ? field : undefined,
      order,
    };
    sortRef.current = newSort;
    setSort(newSort);
    getData(current);
  };

  useEffect(() => {
    const initSort = {
      field: tabKey == 'TRADE' ? array1[0].dataIndex : array2[0].dataIndex,
      order: 'ascend',
    };
    sortRef.current = initSort;
    setSort(initSort);
    getData(1);
  }, [tabKey]);

  return (
    <>
      <Row justify="space-between" className="m-t-8 m-b-8">
        <Col>
          <Form
            form={form}
            style={{ alignItems: 'center' }}
            onValuesChange={() => {
              getData(1);
            }}
          >
            <Row gutter={8}>
              <Col>
                <Form.Item
                  name="businDate"
                  style={{ marginBottom: 0 }}
                  initialValue={moment()}
                >
                  <DatePicker allowClear={false} placeholder="请选择日期" />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="fundCodeOrName" style={{ marginBottom: 0 }}>
                  <Input
                    allowClear
                    size="small"
                    placeholder="请输入产品代码/名称"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>

        <Col>
          <Space>
            <span style={{ color: 'var(--text-color)', fontSize: 12 }}>
              更新时间：{moment(updateDate).format('YYYY/MM/DD HH:mm:ss')}
            </span>
            <Button
              type="text"
              bordered={false}
              icon={<RedoOutlined />}
              onClick={() => {
                getData(current);
                setUpdateDate(moment());
              }}
              style={{ width: 28, height: 28 }}
            />
          </Space>
        </Col>
      </Row>

      <CustomCard bodyStyle={{ padding: 8 }} style={{ border: 'none' }}>
        <Tabs
          type="card"
          onChange={(e) => {
            setTabKey(e);
          }}
          activeKey={tabKey}
          destroyInactiveTabPane
        >
          {itemType.map((item) => (
            <Tabs.TabPane tab={item.label} key={item.key}>
              <div
                ref={tableWrapperRef}
                style={{ marginTop: -8 }}
                id={item.key}
              >
                <PositionTable
                  columns={columns}
                  dataSource={data}
                  bordered={false}
                  rowKey={(record) => {
                    return record.fundCode + record.unitId;
                  }}
                  current={current}
                  total={total}
                  pageSize={pageSize}
                  onChange={onTableChange}
                  height={tableHeight > 300 ? tableHeight : 300}
                />
              </div>
            </Tabs.TabPane>
          ))}
        </Tabs>
      </CustomCard>

      <TradeDetailModal
        {...tradeDetail}
        updateDate={updateDate}
        onCancel={() => {
          setTradeDetail({
            visible: false,
            title: '',
            fundCode: '',
            astUnitId: '',
          });
        }}
      />

      <GzDetailModal
        {...gzDetail}
        updateDate={updateDate}
        onCancel={() => {
          setGzDetail({
            visible: false,
            title: '',
            fundCode: '',
            astUnitId: '',
          });
        }}
      />
    </>
  );
};
