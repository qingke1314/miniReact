/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2025-02-18 17:14:04
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2025-02-19 09:39:07
 * @Description:
 */
import { Button, Col, Form, Input, message, Row } from 'antd-v5';
import { CustomTableWithYScroll, desensitization } from 'iblive-base';
import { useEffect, useState } from 'react';
import { findAllFund } from '../../../../../../apis/positionFund';
import { batchImportProduct } from '../../../../../../apis/positionFundGroup';
import CustomButtonGroup from '../../../../../../components/CustomButtonGroup';
import CustomModal from '../../../../../../components/CustomModal';

export default ({ visible, groupId, fundTypeObj, onCancel, callback }) => {
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState();
  const [current, setCurrent] = useState(1);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      title: '产品代码',
      dataIndex: 'fundCode',
      render: (text) => desensitization(text),
    },
    {
      title: '产品名称',
      dataIndex: 'fundFn',
      render: (text) => desensitization(text),
    },
    {
      title: '产品简称',
      dataIndex: 'fundName',
      render: (text) => desensitization(text),
    },
    {
      title: '产品类型',
      dataIndex: 'fundType',
      render: (text) => fundTypeObj?.[text] ?? text,
    },
    {
      title: '投资类型',
      dataIndex: 'fundInvestType',
    },
    {
      title: '成立日期',
      dataIndex: 'openDate',
    },
  ];

  const onChangePage = ({ current }) => {
    setCurrent(current);
  };

  const onConfirm = async (setLoading) => {
    setLoading(true);
    const res = await batchImportProduct({
      groupId,
      fundCodeList: selectedRowKeys,
    });
    if (res?.code === 1) {
      callback();
      onCancel();
      message.success(res?.note || '导入成功');
    }
    setLoading(false);
  };

  const afterClose = () => {
    form.resetFields();
  };

  const getData = async () => {
    setLoading(true);
    setCurrent(1);
    setSelectedRowKeys();
    const res = await findAllFund();
    setData(res?.records);
    setLoading(false);
  };

  const onSearch = () => {
    const { fundCode, fundName } = form.getFieldsValue();
    setData((pre) =>
      (pre || []).filter(
        (item) =>
          (fundCode ? item.fundCode.includes(fundCode) : true) &&
          (fundName ? item.fundName.includes(fundName) : true),
      ),
    );
  };

  useEffect(() => {
    if (visible) {
      getData();
    }
  }, [visible]);
  return (
    <CustomModal
      title="批量导入"
      footer={
        <CustomButtonGroup
          onConfirm={onConfirm}
          onCancel={onCancel}
          confirmLabel="导入"
          confirmConfig={{
            disabled: !selectedRowKeys?.length,
          }}
        />
      }
      visible={visible}
      onCancel={onCancel}
      afterClose={afterClose}
      size="big"
    >
      <Form form={form}>
        <Row gutter={8} className="m-b-8">
          <Col>
            <Form.Item
              name="fundCode"
              label="产品代码"
              style={{ marginBottom: 0 }}
            >
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              name="fundName"
              label="产品简称"
              style={{ marginBottom: 0 }}
            >
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col>
            <Button type="primary" loading={loading} onClick={onSearch}>
              查询
            </Button>
          </Col>
        </Row>
      </Form>
      <CustomTableWithYScroll
        height={300}
        dataSource={data}
        columns={columns}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        pageSize={10}
        current={current}
        total={data?.length}
        onChange={onChangePage}
        rowKey="fundCode"
      />
    </CustomModal>
  );
};
