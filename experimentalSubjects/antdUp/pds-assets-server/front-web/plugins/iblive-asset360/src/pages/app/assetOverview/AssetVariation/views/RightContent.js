/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-11 09:43:05
 * @LastEditors: chenzongjun chenzongjun@apexsoft.com.cn
 * @LastEditTime: 2024-10-30 17:32:05
 * @FilePath: \invest-index-server-front\src\pages\monitor\CashPosition\views\ConfigTabs.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { executeApi } from '@asset360/apis/appCommon';
import OverviewTable from '@asset360/components/OverviewTable';
import { Col, DatePicker, Form, Radio, Row } from 'antd-v5';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatDate, formatTime } from '../formatTimeAndDate';
import styles from '../index.less';
import RightDetailCard from './RightDetailCard';

/**
 * 指令状态集合
 * @param {*} status 指令状态
 * @returns 指令状态名称
 */
const getInstStatusName = (status) => {
  switch (status) {
    case '1':
      return '有效';
    case '2':
      return '已修改';
    case '3':
      return '已撤销';
    case '4':
      return '已暂停';
    case '5':
      return '审批拒绝';
    case '6':
      return '分发拒绝';
    case '7':
      return '指令录入';
    case '8':
      return '分仓失败';
    case '9':
      return '草稿指令';
    case 'a':
      return '临时下达';
    case 'b':
      return '临时修改';
    case 'c':
      return '撤消失败';
    case 'd':
      return '风控临时指令';
    case 'e':
      return '草稿生效';
    default:
      return '';
  }
};

/**
 * 指令类型集合
 * @param {*} type 指令类型
 * @returns 指令类型名称
 */
const getInstTypeName = (type) => {
  switch (type) {
    case '1':
      return '个股';
    case '2':
      return '组合';
    case '3':
      return '个股批量';
    case '4':
      return '组合批量';
    default:
      return '';
  }
};

/**
 * 目标类型集合
 * @param {*} type 目标类型
 * @returns 目标类型名称
 */
const getTargetTypeName = (type) => {
  switch (type) {
    case '1':
      return '绝对数量';
    case '2':
      return '绝对金额';
    case '3':
      return '持仓数量比例';
    case '4':
      return '净值比例';
    case '5':
      return 'ETF篮子';
    case '6':
      return '单元净值比例';
    case '7':
      return '可用金额比例';
    case '8':
      return '可用标准券比例';
    case '9':
      return '资产配置市值比例';
    default:
      return '';
  }
};

const pageSize = 15;
const RightContent = ({ height }) => {
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [searchForm] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState({});
  const { date, productCode } = useSelector(
    (state) => state.asset360AssetLayout,
  );
  const getData = async (page) => {
    setCurrent(page);
    setTableLoading(true);
    const { time, historyDate } = searchForm.getFieldsValue();
    let serviceId = ' ';
    const data = {
      fundCode: productCode,
      pageSize: pageSize.toString(),
      page: page.toString(),
    };
    if (time) {
      serviceId = 'DD_API_INST_STOCK_INFO';
      data.beginDate = moment(date).format('YYYYMMDD');
    } else {
      const [startDate, endDate] = historyDate || [];
      serviceId = 'DD_API_INST_STOCK_INFO';
      data.beginDate = startDate
        ? moment(startDate).format('YYYYMM')
        : moment().format('YYYYMM');
      data.endDate = endDate
        ? moment(endDate).format('YYYYMM')
        : moment().format('YYYYMM');
    }
    const res = await executeApi({
      serviceId,
      data,
    });
    setInfo({});
    setVisible(false);
    setTableData(res?.data?.resultList || []);
    setTotal(res?.data?.totalRecord);
    setTableLoading(false);
  };

  useEffect(() => {
    if (productCode) {
      getData(1);
    }
  }, [productCode]);

  const disabledDate = (current) => {
    return current && current > moment().endOf('month');
  };

  const baseColunms = [
    {
      title: '指令描述',
      dataIndex: 'description',
      // render: (_text, record) => {
      //   return (
      //     record.etru_dire_name +
      //     record.sec_name +
      //     ' 指令数量:' +
      //     moneyFormat({ num: record.inst_quantity, decimal: 0 })
      //   );
      // },
    },
    // {
    //   title: '证券名称',
    //   dataIndex: 'sec_name',
    // },
    {
      title: '证券内码',
      dataIndex: 'inter_code',
    },
    {
      title: '指令序号',
      dataIndex: 'inst_no',
    },
    {
      title: '指令类型',
      dataIndex: 'inst_type',
      render: (text) => getInstTypeName(text),
    },
    {
      title: '指令有效期',
      dataIndex: 'inst_end_date',
      render: (text) => formatDate(text),
    },
    // {
    //   title: '委托方向',
    //   dataIndex: 'etru_dire_name',
    // },
    {
      title: '目标类型',
      dataIndex: 'target_type',
      render: (text) => getTargetTypeName(text),
    },
    {
      title: '下达人',
      dataIndex: 'inst_operactor',
    },
    {
      title: '投资组合',
      dataIndex: 'combi_name',
      render: (text) => text || '--',
    },
    {
      title: '资产单元',
      dataIndex: 'ast_unit_name',
    },
    {
      title: '指令状态',
      dataIndex: 'inst_status',
      sorter: (a, b) => a.inst_status_name - b.inst_status_name,
      fixed: 'right',
      render: (text) => <span>{getInstStatusName(text)}</span>,
    },
  ];

  const [columns, setColumns] = useState([
    {
      title: '序号',
      dataIndex: 'index',
      render: (_text, _record, index) => (current - 1) * pageSize + index + 1,
    },
    {
      title: '下达时间',
      dataIndex: 'inst_direct_time',
      render: (text) =>
        text
          ? text?.toString()?.length === 6
            ? formatTime(text)
            : formatTime('0' + text)
          : '--',
    },
    ...baseColunms,
  ]);

  return (
    <Row gutter={8}>
      <Col style={{ width: visible ? 'calc(100% - 508px)' : '100%' }}>
        <div className="blank-card-asset" style={{ height }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Form
                form={searchForm}
                onValuesChange={() => {
                  getData(1);
                }}
              >
                <Row gutter={8}>
                  <Col>
                    <Form.Item
                      label={'时间'}
                      name="time"
                      style={{ marginBottom: 8 }}
                      initialValue={true}
                    >
                      <Radio.Group
                        optionType="button"
                        buttonStyle="solid"
                        onChange={(e) => {
                          const array = [];
                          if (!e.target.value) {
                            array.push({
                              title: '日期',
                              dataIndex: 'busin_date',
                              render: (text) => formatDate(text),
                            });
                          }
                          array.push({
                            title: '下达时间',
                            dataIndex: 'inst_direct_time',
                            render: (text) =>
                              text
                                ? text?.toString()?.length === 6
                                  ? formatTime(text)
                                  : formatTime('0' + text)
                                : '--',
                          });
                          setColumns([
                            {
                              title: '序号',
                              dataIndex: 'index',
                              render: (_text, _record, index) =>
                                (current - 1) * pageSize + index + 1,
                            },
                            ...array,
                            ...baseColunms,
                          ]);
                        }}
                      >
                        <Radio value={true}>当日</Radio>

                        <Radio value={false}>历史</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>

                  <Form.Item
                    shouldUpdate={(prevValue, curValue) =>
                      prevValue.time !== curValue.time
                    }
                    noStyle
                  >
                    {({ getFieldValue }) => {
                      const time = getFieldValue('time');
                      if (!time) {
                        return (
                          <Col>
                            <Form.Item
                              label={'历史区间'}
                              name="historyDate"
                              style={{ marginBottom: 8 }}
                            >
                              <DatePicker.RangePicker
                                picker="month"
                                allowClear
                                style={{ width: 200 }}
                                disabledDate={disabledDate}
                              />
                            </Form.Item>
                          </Col>
                        );
                      }
                      return null;
                    }}
                  </Form.Item>
                </Row>
              </Form>
            </Col>
          </Row>
          <OverviewTable
            pageSize={pageSize}
            current={current}
            total={total}
            dataSource={tableData}
            loading={tableLoading}
            columns={columns}
            onPageChange={(current) => {
              getData(current);
            }}
            onRow={(record, index) => {
              return {
                onClick: () => {
                  setVisible(true);
                  setInfo({
                    interCode: record.inter_code,
                    instNo: record.inst_no?.toString(),
                    indexModify: record.index_modify?.toString(),
                    index,
                  });
                }, // 点击行
              };
            }}
            rowClassName={(_record, index) => {
              if (index === info.index) {
                return styles.table_content;
              }
            }}
            height={height - 65}
          />
        </div>
      </Col>
      {visible && (
        <Col>
          <RightDetailCard
            visible={visible}
            onCancel={() => {
              setVisible(false);
              setInfo({});
            }}
            info={info}
            isDay={searchForm.getFieldsValue()?.time}
            height={height}
          />
        </Col>
      )}
    </Row>
  );
};

export default RightContent;
