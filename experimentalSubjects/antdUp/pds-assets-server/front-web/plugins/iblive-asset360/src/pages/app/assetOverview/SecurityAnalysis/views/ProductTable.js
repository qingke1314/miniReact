/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-26 09:38:08
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 * @LastEditTime: 2024-11-15 11:26:33
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\OverView\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { executeApi } from '@asset360/apis/appCommon';
import OverviewTable from '@asset360/components/OverviewTable';
import { Col, Form, Input, Radio, Row, Space } from 'antd-v5';
import { desensitization, getRealPath, moneyFormat } from 'iblive-base';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { history } from 'umi';
const pageSize = 12;

export default function ProductTable({ detailInfo, secType, height }) {
  const date = moment();
  const [current, setCurrent] = useState(1);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState();
  const [form] = Form.useForm();

  const [unit, setUnit] = useState(100000000);
  const [colunms, setColunms] = useState([]);
  const baseColumns2 = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (text, record, index) => (current - 1) * pageSize + index + 1,
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
  ];
  const baseColumns = [
    {
      title: '规模',
      dataIndex: 'totalAsset',
      align: 'right',
      render: (text) => moneyFormat({ num: text / unit, decimal: 2 }),
      defaultSortOrder: detailInfo == 'GP' ? '' : 'descend',
      sorter: (a, b) => a.totalAsset - b.totalAsset,
    },

    {
      title: '净值',
      dataIndex: 'unitNet',
      align: 'right',
      render: (text) => moneyFormat({ num: text, decimal: 3 }),
      sorter: (a, b) => a.unitNet - b.unitNet,
    },
    {
      title: '持仓数量',
      dataIndex: 'holdQty',
      align: 'right',

      sorter: (a, b) => a.holdQty - b.holdQty,
    },
    {
      title: '持仓市值占净比',
      dataIndex: 'netValueRatio',
      align: 'right',
      render: (text) =>
        moneyFormat({
          num: text * 100,
          decimal: 2,

          unit: '%',
        }),
      sorter: (a, b) => a.netValueRatio - b.netValueRatio,
    },
    // {
    //   title: '份额',
    //   dataIndex: 'shares',
    //   align: 'right',
    //   render: (text) => moneyFormat({ num: text, decimal: 0 }),
    //   sorter: (a, b) => a.shares - b.shares,
    // },

    {
      title: '类型',
      dataIndex: 'fundInvestType',
    },
    {
      title: '基金经理',
      dataIndex: 'fundManagerName',
    },
  ];

  const colunms1 = [
    {
      title: `持仓数量(${detailInfo?.title})`,
      dataIndex: 'currentQty',
      align: 'right',
      defaultSortOrder: 'descend',
      render: (text) => moneyFormat({ num: text, decimal: 0 }),
      sorter: (a, b) => a.currentQty - b.currentQty,
    },
    {
      title: '占净比',
      dataIndex: 'netValueRatio',
      align: 'right',
      render: (text) => moneyFormat({ num: text, unit: '%' }),
      sorter: (a, b) => a.netValueRatio - b.netValueRatio,
    },

    {
      title: '占流通股比',
      dataIndex: 'turnoverAmountRatio',
      align: 'right',
      render: (text) => moneyFormat({ num: text, unit: '%' }),
      sorter: (a, b) => a.turnoverAmountRatio - b.turnoverAmountRatio,
    },
    {
      title: '业绩收益贡献',
      dataIndex: 'YJSYGX',
    },
  ];

  const handleJump = (record) => {
    history.push(getRealPath('/APP/assetOverview/product'), {
      code: record.fundCode,
      name: record.fundName,
    });
  };

  const updateData = async (current) => {
    form.validateFields().then(async (values) => {
      setTableLoading(true);
      const data = {
        businDate: moment(date).format('YYYYMMDD') || '',
        assetType: detailInfo.secType,
        interCode: detailInfo.key,
        ...values,
      };
      let serviceId = '';
      if (secType == 'GP') {
        setColunms([...baseColumns2, ...colunms1, ...baseColumns]);
      } else {
        setColunms([...baseColumns2, ...baseColumns]);
      }
      serviceId = 'DD_API_HOLD_SEC_FUND_INFO';
      const res = await executeApi({
        serviceId,
        data,
      });
      setTableData(res?.records || []);
      setTotal(res?.records?.length || 0);
      setCurrent(current);
      setTableLoading(false);
    });
  };

  useEffect(() => {
    if (detailInfo) {
      updateData(1);
    }
  }, [detailInfo]);

  return (
    <>
      <Row justify="space-between">
        <span className="important-title">
          {detailInfo?.secType == 'GP' ? '持有产品清单' : '产品列表'}
        </span>
        <Row>
          <Form
            form={form}
            onValuesChange={() => {
              updateData(1);
            }}
          >
            <Row align="middle">
              <Form.Item
                label="代码/名称"
                name={'fundCodeOrName'}
                style={{ marginBottom: 0 }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                shouldUpdate={(prevValue, curValue) =>
                  prevValue.fundCodeOrName !== curValue.fundCodeOrName
                }
                noStyle
              >
                {({ getFieldValue }) => {
                  const fundCodeOrName = getFieldValue('fundCodeOrName');
                  return (
                    fundCodeOrName && (
                      <Col>
                        <a
                          style={{
                            marginLeft: 8,
                            color: '#108EE9',
                            fontWeight: 'bold',
                          }}
                          onClick={() => {
                            form.resetFields();
                            updateData(1);
                          }}
                        >
                          取消筛选
                        </a>
                      </Col>
                    )
                  );
                }}
              </Form.Item>
            </Row>
          </Form>

          <Space style={{ marginLeft: 16 }}>
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
        </Row>
      </Row>
      <div style={{ marginTop: 8 }}>
        <OverviewTable
          pageSize={pageSize}
          current={current}
          dataSource={tableData}
          loading={tableLoading}
          columns={colunms}
          onPageChange={(current) => setCurrent(current)}
          total={total}
          height={height}
        />
      </div>
    </>
  );
}
