/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-12 16:28:06
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2025-02-20 14:01:30
 * @FilePath: \invest-index-server-front\src\pages\monitor\CashPosition\views\CashForecast\EditModal.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  queryPositionSnapshot,
  querySnapshotRecord,
} from '@asset360/apis/snapshot';
import CustomModal from '@asset360/components/CustomModal';
import { Button, Col, DatePicker, Form, Row } from 'antd-v5';
import {
  CustomTable,
  CustomTableWithYScroll,
  moneyFormat,
  requestUtils,
} from 'iblive-base';
import moment from 'moment';
import { useEffect, useState } from 'react';
import NumberCel from '../../components/NumberCel';
import styles from '../index.less';

const { DownloadFile } = requestUtils;
const POSITION_LINK = [
  {
    name: '盘中',
    value: 'TRADE',
  },
  {
    name: '盘后',
    value: 'SETTLE',
  },
  {
    value: 'instAvailT0',
    name: 'T0指令可用',
  },
  {
    value: 'instAvailT1',
    name: 'T1指令可用',
  },
  {
    value: 'cashAvailT0',
    name: 'T0头寸可用',
  },
  {
    value: 'cashAvailT1',
    name: 'T1头寸可用',
  },
];
const SNAPSHOT_TYPE = [
  { name: '定时', value: 1 },
  { name: '归档', value: 2 },
  { name: '手动', value: 3 },
];
const pageSize = 6;
export default ({
  visible,
  onCancel,
  paramsForList,
  positionLink,
  activeTab,
  forecastType,
}) => {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState([]);
  const [detailTableData, setDeatilTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [dealIndexTitle, setDealIndexTitle] = useState('');
  const [detailTableLoading, setDetailTableLoading] = useState(false);
  const [current, setCurrent] = useState();
  const [detailVisivle, setDetailVisivle] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [overViewInfo, setOverViewInfo] = useState({});

  const handleExport = (id) => {
    let requestURL = '/pds/position/snapshot/exportPositionSnapshot';
    DownloadFile(requestURL, {
      method: 'GET',
      params: {
        snapshotId: id,
      },
    });
  };

  const columns = [
    {
      title: `快照时间`,
      dataIndex: 'snapshotTime',
    },
    {
      title: `头寸类型`,
      dataIndex: 'positionLink',
      render: (text) => POSITION_LINK.find((item) => item.value == text)?.name,
    },
    {
      title: `快照类型`,
      dataIndex: 'snapshotType',
      render: (text) => SNAPSHOT_TYPE.find((item) => item.value == text)?.name,
    },
    {
      title: '操作',
      width: 90,
      dataIndex: 'operation',
      fixed: 'right',
      align: 'center',
      render: (text, record) => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <a
            onClick={() => {
              setDetailVisivle(true);
              getDetailTableData(record?.id);
              activeTab === 'dealIndex' &&
                setDealIndexTitle(record?.positionLink);
            }}
          >
            查看
          </a>
          <a onClick={() => handleExport(record?.id)}>导出</a>
        </div>
      ),
    },
  ];

  const sharedOnCell = (record) => {
    if (record?.isPos === false) {
      return { colSpan: 0 };
    }

    return {};
  };

  const textRender = (text, record, type) => {
    if (record?.indexLevel === '2' && type == 't0Amount') {
      return (
        <span
          style={{
            color: record?.indexLevel === '2' ? '#186df5' : '',
          }}
        >
          <NumberCel number={text}>{moneyFormat({ num: text })}</NumberCel>
        </span>
      );
    }
    return <NumberCel number={text}>{moneyFormat({ num: text })}</NumberCel>;
  };

  const cashForecastColumns = [
    {
      title: (
        <span>
          项目 <span style={{ color: '#777', fontSize: 12 }}>单位(元)</span>
        </span>
      ),
      dataIndex: 'name',
      width: 250,
      onCell: (record) => ({
        colSpan: record?.isPos === false ? 7 : 1,
      }),
      render: (text, record) => (
        <span
          style={{
            color: record?.indexLevel === '2' ? '#186df5' : '',
            fontWeight: record?.indexLevel === '2' ? 'bold' : '',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'T0余额',
      dataIndex: 't0Amount',
      width: '80px',
      align: 'right',
      onCell: sharedOnCell,
      render: (text, record) => textRender(text, record, 't0Amount'),
    },
    {
      title: 'T1影响T0',
      dataIndex: 'affectsT0',
      width: '80px',
      align: 'right',
      onCell: sharedOnCell,
      render: (text, record) => textRender(text, record, 'affectsT0'),
    },
    {
      title: 'T1余额',
      dataIndex: 't1Amount',
      align: 'right',
      width: '80px',
      onCell: sharedOnCell,
      render: (text, record) => textRender(text, record, 't1Amount'),
    },
    {
      title: 'T2余额',
      dataIndex: 't2Amount',
      align: 'right',
      width: '80px',
      onCell: sharedOnCell,
      render: (text, record) => textRender(text, record, 't2Amount'),
    },
    {
      title: 'T3余额',
      dataIndex: 't3Amount',
      align: 'right',
      width: '80px',
      onCell: sharedOnCell,
      render: (text, record) => textRender(text, record, 't3Amount'),
    },
  ];

  const dealIndexColumns = [
    {
      dataIndex: 'name',
      title: '项目',
      render: (text, record) => {
        let fontWeight = 500;
        if (record.indexLevel == '2' || !record.isPos) {
          fontWeight = 'bold';
        }

        return <span style={{ fontWeight }}>{text}</span>;
      },
    },
    {
      dataIndex: 't0Amount',
      title: '金额',
      align: 'right',
      render: (text, record) => {
        if (record.isPos) {
          const color = record.indexLevel == '1' ? '#313131' : '#186df5';
          const fontWeight = record.indexLevel == '1' ? 500 : 'bold';
          return (
            <div style={{ display: 'flex', placeContent: 'flex-end' }}>
              <span style={{ color: color, fontWeight }}>
                <NumberCel number={text}>
                  {moneyFormat({ num: text || 0, decimal: 2 })}
                </NumberCel>
              </span>
            </div>
          );
        }
        return null;
      },
    },
  ];

  const onDetailCancel = () => {
    setDetailVisivle(false);
    setDeatilTableData([]);
  };

  const getDetailTableData = async (id) => {
    setDetailTableLoading(true);
    const res = await queryPositionSnapshot({
      snapshotId: id,
    });
    //children为[] 会导致空的扩展按钮出现
    let ExpandedRowKeys = [];
    const data = res?.records.map((item) => {
      ExpandedRowKeys.push(item.code);
      return {
        ...item,
        children: item?.children?.length == 0 ? null : item?.children,
      };
    });
    setExpandedRowKeys(ExpandedRowKeys);
    activeTab === 'dealIndex' &&
      setOverViewInfo(res?.records?.find((item) => item.code == '0'));
    setDeatilTableData(data);
    setDetailTableLoading(false);
  };

  const getTableData = async (pageNumber = 1) => {
    setTableLoading(true);
    const { headObjectCode, objectCode, parentObjectCode } = paramsForList;
    const businDate = form.getFieldValue('businDate');
    const param = {
      fundCode: headObjectCode === 'fund_code' ? objectCode : parentObjectCode,
      astUnitId: headObjectCode === 'ast_unit_code' ? objectCode : undefined,
      positionType: activeTab === 'dealIndex' ? 'TRADE' : 'GZ',
      tradeType: activeTab === 'dealIndex' ? forecastType : undefined,
      positionLink,
      businDate: businDate ? moment(businDate).format('yyyyMMDD') : undefined,
      pageSize,
      pageNumber,
    };
    const res = await querySnapshotRecord(param);
    setTableData(res?.records);
    setCurrent(pageNumber);
    setTableLoading(false);
  };

  useEffect(() => {
    if (visible && paramsForList) {
      getTableData();
    } else {
      setTableData([]);
      form.resetFields();
    }
  }, [visible]);

  return (
    <>
      <CustomModal
        title={'头寸快照'}
        visible={visible}
        width={'50vw'}
        onCancel={onCancel}
        footer={<Button onClick={onCancel}>关闭</Button>}
      >
        <Form form={form}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Row gutter={[16, 8]}>
              <Col>
                <Form.Item label="查询日期" name={'businDate'}>
                  <DatePicker allowClear />
                </Form.Item>
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={() => getTableData()}
                  style={{ marginLeft: 6 }}
                >
                  查询
                </Button>
              </Col>
            </Row>
          </div>
        </Form>
        <CustomTable
          columns={columns}
          dataSource={tableData}
          loading={tableLoading}
          rowKey={(record) => {
            return record.id;
          }}
          pagination={{
            pageSize,
            hideOnSinglePage: false,
            showSizeChanger: false,
            current,
            onChange: (page) => getTableData(page),
          }}
        />
      </CustomModal>
      <CustomModal
        title={'头寸快照详情'}
        visible={detailVisivle}
        width={'80vw'}
        onCancel={onDetailCancel}
        footer={<Button onClick={onDetailCancel}>关闭</Button>}
      >
        {activeTab === 'dealIndex' && (
          <div
            style={{ display: 'flex', alignItems: 'center', marginLeft: 10 }}
          >
            {POSITION_LINK.find((item) => item.value == dealIndexTitle)?.name}
            <div style={{ fontSize: 12, marginLeft: 8 }}>
              {overViewInfo?.t0Amount || overViewInfo?.t0Amount === 0 ? (
                <div>
                  <span
                    style={{
                      fontWeight: 'bold',
                      color: '#313131',
                    }}
                  >
                    <NumberCel number={overViewInfo?.t0Amount}>
                      {moneyFormat({ num: overViewInfo?.t0Amount, decimal: 2 })}
                    </NumberCel>
                  </span>
                  （金额）
                </div>
              ) : null}
              {overViewInfo?.formulaZh ? (
                <div>{overViewInfo?.formulaZh}（公式）</div>
              ) : null}
            </div>
          </div>
        )}

        <div className={styles.comm_table_container}>
          <CustomTableWithYScroll
            bordered={false}
            rowKey="code"
            columns={
              activeTab === 'dealIndex' ? dealIndexColumns : cashForecastColumns
            }
            loading={detailTableLoading}
            expandable={{
              expandedRowKeys: expandedRowKeys,
              onExpand: (expanded, record) => {
                if (expanded) {
                  expandedRowKeys.push(record.code);
                  setExpandedRowKeys(expandedRowKeys);
                } else {
                  setExpandedRowKeys(
                    expandedRowKeys.filter((item) => record.code !== item),
                  );
                }
              },
            }}
            dataSource={detailTableData}
            pagination={false}
            rowClassName={(record) => {
              if (record?.isPos === false) {
                return styles.table_content_title_bar;
              } else if (record?.indexLevel === '2') {
                return styles.table_content_total_bar;
              }
            }}
            height={380}
          />
        </div>
      </CustomModal>
    </>
  );
};
