/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-10-11 09:53:25
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2025-01-22 13:57:49
 * @Description:
 */
import {
  getRedeemConfigInfo,
  queryAllChannel,
  queryAllSource,
  updateRedeemConfig,
} from '@asset360/apis/positionDelivery';
import CustomButtonGroup from '@asset360/components/CustomButtonGroup';
import CustomModal from '@asset360/components/CustomModal';
import { Col, Form, InputNumber, message, Row, Select } from 'antd';
import { CustomTableWithYScroll, randomWord } from 'iblive-base';
import { useEffect, useRef, useState } from 'react';

export default ({ visible, fundCode, fundName, onCancel }) => {
  const tableRef = useRef();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [editableKeys, setEditableKeys] = useState();
  const [form] = Form.useForm();
  const [sourceList, setSourceList] = useState();
  const [channelTypeList, setChannelTypeList] = useState();
  const columns = [
    {
      title: '渠道类型',
      dataIndex: 'channelType',
      formItemProps: {
        rules: [{ required: true, message: '参数值不能为空' }],
      },
      renderFormItem: (row) => {
        return (
          <Select
            options={channelTypeList}
            style={{ minWidth: 100 }}
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            onChange={(channelType, option) => {
              const {
                fhSettleDay,
                hdsgfSettleDay,
                sgkSettleDay,
                shfSettleDay,
                shkSettleDay,
                zcfSettleDay,
                zckSettleDay,
                zrkSettleDay,
              } = option;
              tableRef.current.setRowData(row.index, {
                channelType,
                fhSettleDay,
                hdsgfSettleDay,
                sgkSettleDay,
                shfSettleDay,
                shkSettleDay,
                zcfSettleDay,
                zckSettleDay,
                zrkSettleDay,
              });
            }}
          />
        );
      },
      render: (text) =>
        (channelTypeList || []).find((item) => item.id === text)?.name,
    },
    {
      title: '申购款结转日期',
      dataIndex: 'sgkSettleDay',
      formItemProps: {
        rules: [{ required: true, message: '日期不能为空' }],
      },
      renderFormItem: () => <InputNumber min={0} precision={0} prefix="T +" />,
      render: (text) => 'T + ' + text,
      align: 'right',
    },
    {
      title: '赎回款结转日期',
      dataIndex: 'shkSettleDay',
      formItemProps: {
        rules: [{ required: true, message: '日期不能为空' }],
      },
      renderFormItem: () => <InputNumber min={0} precision={0} prefix="T +" />,
      render: (text) => 'T + ' + text,
      align: 'right',
    },
    {
      title: '赎回费结转日期',
      dataIndex: 'shfSettleDay',
      formItemProps: {
        rules: [{ required: true, message: '日期不能为空' }],
      },
      renderFormItem: () => <InputNumber min={0} precision={0} prefix="T +" />,
      render: (text) => 'T + ' + text,
      align: 'right',
    },
    {
      title: '转入款结转日期',
      dataIndex: 'zrkSettleDay',
      formItemProps: {
        rules: [{ required: true, message: '日期不能为空' }],
      },
      renderFormItem: () => <InputNumber min={0} precision={0} prefix="T +" />,
      render: (text) => 'T + ' + text,
      align: 'right',
    },
    {
      title: '转出款结转日期',
      dataIndex: 'zckSettleDay',
      formItemProps: {
        rules: [{ required: true, message: '日期不能为空' }],
      },
      renderFormItem: () => <InputNumber min={0} precision={0} prefix="T +" />,
      render: (text) => 'T + ' + text,
      align: 'right',
    },
    {
      title: '转出费结转日期',
      dataIndex: 'zcfSettleDay',
      formItemProps: {
        rules: [{ required: true, message: '日期不能为空' }],
      },
      renderFormItem: () => <InputNumber min={0} precision={0} prefix="T +" />,
      render: (text) => 'T + ' + text,
      align: 'right',
    },
    {
      title: '后端申购费结转日期',
      dataIndex: 'hdsgfSettleDay',
      formItemProps: {
        rules: [{ required: true, message: '日期不能为空' }],
      },
      renderFormItem: () => <InputNumber min={0} precision={0} prefix="T +" />,
      render: (text) => 'T + ' + text,
      align: 'right',
    },
    {
      title: '分红结转日期',
      dataIndex: 'fhSettleDay',
      formItemProps: {
        rules: [{ required: true, message: '日期不能为空' }],
      },
      renderFormItem: () => <InputNumber min={0} precision={0} prefix="T +" />,
      render: (text) => 'T + ' + text,
      align: 'right',
    },
    {
      title: '操作',
      valueType: 'option',
      render: () => {
        return null;
      },
    },
  ];

  const getSourceList = async () => {
    const res = await queryAllSource();
    setSourceList(res?.records);
  };

  const getChannelTypeList = async () => {
    const res = await queryAllChannel();
    setChannelTypeList(res?.records || []);
  };

  const onSourceChange = (_, option) => {
    form.setFields([
      {
        name: 'sourceType',
        value: option.sourceType,
      },
    ]);
  };

  const initData = async () => {
    form.resetFields();
    tableRef.current.resetFields();
    setData();
    if (!fundCode) return;
    setLoading(true);
    const res = await getRedeemConfigInfo(fundCode);
    form.setFields([
      {
        name: 'sourceCode',
        value: res?.data?.sourceCode,
      },
      {
        name: 'sourceType',
        value: res?.data?.sourceType,
      },
    ]);
    const editableKeys = [];
    setData(
      (res?.data?.settleDayConfigList || []).map((item) => {
        const key = randomWord();
        editableKeys.push(key);
        return {
          ...item,
          key,
        };
      }),
    );
    setEditableKeys(editableKeys);
    setLoading(false);
  };

  const onConfirm = (setLoading) => {
    form.validateFields().then(({ sourceCode }) => {
      tableRef.current.validateFields().then(async (values) => {
        setLoading(true);
        const sourceName = (sourceList || []).find(
          (item) => item.sourceCode === sourceCode,
        )?.sourceName;
        const params = {
          fundCode,
          fundName,
          sourceCode,
          sourceName,
          settleDayConfigList: Object.values(values || {}).map(
            (item, index) => {
              const { id } = data[index];
              const {
                channelType,
                fhSettleDay,
                hdsgfSettleDay,
                sgkSettleDay,
                shfSettleDay,
                shkSettleDay,
                zcfSettleDay,
                zckSettleDay,
                zrkSettleDay,
              } = item;
              const { code: channelCode, name: channelName } =
                (channelTypeList || []).find(
                  (item) => item.id === channelType,
                ) || {};
              return {
                channelCode,
                channelName,
                channelType,
                id,
                fhSettleDay,
                hdsgfSettleDay,
                sgkSettleDay,
                shfSettleDay,
                shkSettleDay,
                zcfSettleDay,
                zckSettleDay,
                zrkSettleDay,
              };
            },
          ),
        };
        const res = await updateRedeemConfig(params);
        setLoading(false);
        if (res?.code === 1) {
          message.success('保存成功');
          onCancel();
        }
      });
    });
  };

  useEffect(() => {
    if (visible) {
      initData();
      getSourceList();
      getChannelTypeList();
    }
  }, [visible]);
  return (
    <CustomModal
      title="申赎管理"
      visible={visible}
      onCancel={onCancel}
      size="big"
      footer={<CustomButtonGroup onCancel={onCancel} onConfirm={onConfirm} />}
    >
      <Form form={form}>
        <Row gutter={8} className="m-b-8" align="middle">
          <Col>
            <Form.Item label="数据来源" name="sourceCode" style={{ margin: 0 }}>
              <Select
                style={{ minWidth: 200 }}
                onChange={onSourceChange}
                options={sourceList}
                fieldNames={{
                  value: 'sourceCode',
                  label: 'sourceName',
                }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label="取数方式" name="sourceType" style={{ margin: 0 }}>
              <Select
                style={{ minWidth: 100 }}
                open={false}
                disabled
                suffixIcon={<></>}
                options={[
                  { label: '文件', value: 'FILE' },
                  { label: '数据库', value: 'DB' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              noStyle
              shouldUpdate={(pre, cur) => pre.sourceCode !== cur.sourceCode}
            >
              {({ getFieldValue }) => {
                const sourceCode = getFieldValue('sourceCode');
                const description = (sourceList || []).find(
                  (item) => item.sourceCode === sourceCode,
                )?.description;
                return description ? (
                  <span className="remarks">({description})</span>
                ) : null;
              }}
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <CustomTableWithYScroll
        height={350}
        pagination={false}
        columns={columns}
        loading={loading}
        value={data}
        isEditable
        rowKey="key"
        recordCreatorProps={{
          newRecordType: 'dataSource',
          record: () => ({ key: randomWord() }),
        }}
        onChange={setData}
        editable={{
          type: 'multiple',
          editableKeys,
          onChange: setEditableKeys,
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.delete];
          },
        }}
        editableFormRef={tableRef}
      />
    </CustomModal>
  );
};
