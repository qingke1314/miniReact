/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-26 09:38:08
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-26 14:52:29
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\OverView\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { PRODUCT, MANAGER, TAG } from '../const';
import { invokeAPIIndex } from '@asset360/apis/api';
import OverviewTable from '@asset360/components/OverviewTable';
import { Col, Form, Input, Radio, Row, Space, Button, message } from 'antd-v5';
import {
  desensitization,
  getRealPath,
  moneyFormat,
  CustomModal,
  CustomForm,
} from 'iblive-base';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import DetailIcon from '@asset360/components/DetailIcon';
const pageSize = 12;

const ProductTable = ({ type, detailInfo, height }) => {
  const date = moment();
  const [tagForm] = Form.useForm();
  const [selectedRow, setSelectedRow] = useState(null);
  const [dialogType, setDialogType] = useState('add');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [historyTags, setHistoryTags] = useState([]);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(1);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState();
  const [form] = Form.useForm();

  const [unit, setUnit] = useState(10000);
  const [colunms, setColunms] = useState([]);
  const baseColumns = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (_text, _record, index) => (current - 1) * pageSize + index + 1,
    },
    {
      title: '代码',
      dataIndex: 'fundCode',
      render: (text) => desensitization(text),
    },
    {
      title: '名称',
      dataIndex: 'fundName',
      render: (_text, record) =>
        type === '1' ? (
          // type为1时，名称不可点击
          <span>{desensitization(record.fundName)}</span>
        ) : (
          // type不为1时，名称可点击跳转
          <a onClick={() => handleJump(record)}>
            {desensitization(record.fundName)}
          </a>
        ),
    },
    {
      title: '规模',
      dataIndex: type === '1' ? 'fundTotalValue' : 'totalAsset',
      align: 'right',
      render: (text) => {
        return moneyFormat({ num: text / unit, decimal: 2 });
      },
      defaultSortOrder: detailInfo === 'GP' ? '' : 'descend',
      sorter: (a, b) => a.totalAsset - b.totalAsset,
    },

    {
      title: '净值',
      dataIndex: type === '1' ? 'netValue' : 'unitNet',
      align: 'right',
      render: (text) => moneyFormat({ num: text, decimal: 3 }),
      sorter: (a, b) => a.unitNet - b.unitNet,
    },
    ...(type !== '1'
      ? [
          {
            title: '本月收益',
            dataIndex: 'monthChange',
            align: 'right',
            render: (text) =>
              moneyFormat({
                num: text * 100,
                decimal: 2,
                needColor: true,
                unit: '%',
              }),
            sorter: (a, b) => a.monthChange - b.monthChange,
          },
          {
            title: '本年收益',
            dataIndex: 'yearChange',
            align: 'right',
            render: (text) =>
              moneyFormat({
                num: text * 100,
                decimal: 2,
                needColor: true,
                unit: '%',
              }),
            sorter: (a, b) => a.yearChange - b.yearChange,
          },
        ]
      : []),
    // {
    //   title: '份额',
    //   dataIndex: type === '1' ? 'fundShare' : 'shares',
    //   align: 'right',
    //   render: (text) => moneyFormat({ num: text, decimal: 0 }),
    //   sorter: (a, b) => a.shares - b.shares,
    // },

    {
      title: '类型',
      dataIndex: type === '1' ? 'fundType' : 'fundInvestType',
    },
    {
      title: '投资经理',
      dataIndex: type === '1' ? 'fundManager' : 'fundManagerName',
      render: (text) => text || '--',
    },
    ...(detailInfo?.activeTab === TAG
      ? [
          {
            title: '标签',
            dataIndex: 'tag',
            render: (text) => <span>{text}</span>,
          },
          {
            title: '操作',
            render: (_text, record) => (
              <div>
                <Button onClick={() => handleAddTag(record)} type="link">
                  新增标签
                </Button>
                <Button
                  onClick={() => handleDeleteTag(record)}
                  danger
                  type="link"
                >
                  删除标签
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  const handleJump = (record) => {
    history.push(getRealPath('/APP/assetOverview/product'), {
      code: record.fundCode,
      name: record.fundName,
    });
  };

  const updateOutProductData = async (current) => {
    setColunms([
      ...baseColumns,
      {
        title: '管理人',
        dataIndex: 'fundManageMentComp',
        render: (text) => text || '--',
      },
    ]);
    setTableLoading(true);
    const fundCodeOrName = form.getFieldValue('fundCodeOrName');
    setCurrent(current);
    const res = await invokeAPIIndex({
      serviceId: 'DD_API_OUTSIDE_FUND_INFO',
      data: {
        fundCodeOrName,
        pageSize,
        page: current,
        fundType: detailInfo.key === '-1' ? '' : detailInfo.key,
      },
    });
    setTableData(res?.data?.resultList || []);
    setTotal(res?.data?.totalRecord || 0);
    setCurrent(current);
    setTableLoading(false);
  };

  const updateData = async (current) => {
    const values = form.getFieldsValue();
    setColunms([...baseColumns]);
    setTableLoading(true);
    const data = {
      businDate: moment(date).format('YYYYMMDD') || '',
      groupType: [detailInfo.key, detailInfo.parentKey].includes('-1')
        ? 'FUND'
        : detailInfo?.title === '模拟组合'
        ? 'SIMULATE'
        : 'FUND',
      ...values,
    };
    if (detailInfo?.activeTab === PRODUCT) {
      if (['产品组合', '模拟组合'].includes(detailInfo?.title)) {
        data.faFundType = null;
      } else {
        data.faFundType = detailInfo.key;
      }
    } else if (detailInfo?.activeTab === MANAGER) {
      data.fundManager = detailInfo.key;
    } else if (detailInfo?.activeTab === TAG) {
      data.tag = detailInfo.key;
    }
    const res = await invokeAPIIndex({
      serviceId: 'DD_API_MUTUAL_FUND_INFO',
      data,
    });
    setTableData(res?.records || []);
    setTotal(res?.records?.length || 0);
    setCurrent(current);
    setTableLoading(false);
  };

  const updateFun = (current) =>
    type === '1' ? updateOutProductData(current) : updateData(current);

  const onPageChange = (current) => {
    if (type === '1') {
      updateOutProductData(current);
    } else {
      setCurrent(current);
    }
  };
  useEffect(() => {
    if (detailInfo) {
      updateFun(1);
    }
  }, [detailInfo]);

  useEffect(() => {
    type === '1' ? updateOutProductData(current) : updateData(current);
  }, [unit]);

  useEffect(() => {
    invokeAPIIndex({
      serviceId: 'DD_API_QUERY_FUND_TAG',
      data: {},
    }).then((res) => {
      setHistoryTags(res?.records || []);
    });
  }, []);

  const onCancel = () => {
    setVisible(false);
  };

  const handleAddTag = (record) => {
    setVisible(true);
    setSelectedRow(record);
    setDialogType('add');
  };

  const handleDeleteTag = (record) => {
    setDialogType('delete');
    setVisible(true);
    setSelectedRow(record);
  };

  const handleOk = () => {
    tagForm.validateFields().then((values) => {
      setConfirmLoading(true);
      invokeAPIIndex({
        serviceId: 'DD_API_OPERATION_FUND_TAG',
        data: {
          operation: dialogType === 'add' ? 'ADD' : 'DELETE',
          fundCode: selectedRow.fundCode,
          tag: dialogType === 'add' ? values.tag : values.deleteTag?.join(','),
        },
      })
        .then((res) => {
          if (res?.code > 0) {
            message.success('操作成功');
            setVisible(false);
            tagForm.resetFields();
            updateFun(1);
          }
        })
        .finally(() => {
          setConfirmLoading(false);
        });
    });
  };
  return (
    <div style={{ background: 'var(--background-color)', padding: 8, height }}>
      <Row justify="space-between">
        <span className="important-title">
          产品列表
          <DetailIcon type="totalProductList" />
        </span>

        <Row>
          <Form
            form={form}
            onValuesChange={() => {
              updateFun(1);
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
                            updateFun(1);
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
          onPageChange={onPageChange}
          total={total}
          height={height - 60}
        />
      </div>
      <CustomModal
        title={dialogType === 'add' ? '新增标签' : '删除标签'}
        width={'50vw'}
        visible={visible}
        confirmLoading={confirmLoading}
        onCancel={onCancel}
        onOk={handleOk}
      >
        <CustomForm
          form={tagForm}
          labelCol={{ flex: '80px' }}
          config={[
            {
              visible: dialogType === 'add',
              span: 24,
              label: '标签名称',
              name: 'tag',
              type: 'input',
              options: {
                rules: [{ required: true, message: '请输入标签名称' }],
              },
            },
            {
              visible: dialogType === 'add',
              label: '历史标签',
              custom: (
                <div>
                  {historyTags.map((item) => (
                    <span
                      style={{
                        border: '1px solid var(--border-color-base)',
                        padding: '4px 8px',
                        borderRadius: 4,
                        background: 'var(--background-color-base)',
                        marginLeft: 4,
                      }}
                      key={item.tag}
                    >
                      {item.tag}
                    </span>
                  ))}
                </div>
              ),
            },
            {
              label: '删除标签',
              visible: dialogType === 'delete',
              type: 'select',
              span: 24,
              name: 'deleteTag',
              options: {
                rules: [{ required: true, message: '请选择标签' }],
              },
              props: {
                mode: 'multiple',
                options: selectedRow?.tag?.split(',')?.map((item) => ({
                  label: item,
                  value: item,
                })),
              },
            },
          ]}
        />
      </CustomModal>
    </div>
  );
};

export default ProductTable;
