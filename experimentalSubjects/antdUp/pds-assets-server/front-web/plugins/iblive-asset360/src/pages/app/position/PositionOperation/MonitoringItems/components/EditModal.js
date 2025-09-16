/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-14 12:54:31
 * @LastEditTime: 2024-12-16 14:53:43
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 */

import {
  saveMonitorRuleItem,
  updateMonitorRuleItem,
} from '@asset360/apis/monitorRule';
import CronForm from '@asset360/components/CronForm';
import CustomButtonGroup from '@asset360/components/CustomButtonGroup';
import CustomModal from '@asset360/components/CustomModal';
import { Col, Form, Input, InputNumber, message, Radio, Row } from 'antd-v5';
import { useEffect, useState } from 'react';

export default ({ callback, visible, onCancel, info = {} }) => {
  const [form] = Form.useForm();

  const [executeCron, setexecuteCron] = useState('');
  const changeCron = (cron, closeModal) => {
    setexecuteCron(cron);
    form.setFields([{ name: 'executeCron', value: cron }]);
    return closeModal && closeModal();
  };

  useEffect(() => {
    if (visible) {
      if (info.id) {
        form.setFieldsValue({ ...info });
        setexecuteCron(info?.executeCron);
      }
    }
  }, [visible]);

  return (
    <CustomModal
      title={info.id ? '编辑监控项' : '新增监控项'}
      width="55vw"
      footer={
        <CustomButtonGroup
          onConfirm={() => {
            form.validateFields().then(async (values) => {
              const func = info.id
                ? updateMonitorRuleItem
                : saveMonitorRuleItem;
              const object = {
                id: info.id,
                ...values,
              };
              const res = await func(object);
              if (res?.code === 1) {
                message.success(`${info.id ? '更新' : '新增'}成功`);
                onCancel();
                callback();
              }
            });
          }}
          onCancel={onCancel}
        />
      }
      visible={visible}
      onCancel={onCancel}
      maskClosable={false}
      afterClose={() => {
        form.resetFields();
      }}
      destroyOnClose
    >
      <Form
        form={form}
        style={{ alignItems: 'center' }}
        labelAlign="right"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
      >
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: '监控项名称不能为空' }]}
              label={'监控项名称'}
            >
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="indexCode"
              rules={[{ required: true, message: '监控项代码不能为空' }]}
              label={'监控项代码'}
            >
              <Input allowClear />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="sequence" label="代码项顺序" initialValue={0}>
              <InputNumber allowClear min={0} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="status"
              label="状态"
              initialValue={1}
              rules={[{ required: true, message: '状态不能为空' }]}
            >
              <Radio.Group buttonStyle="solid">
                <Radio value={1}>有效</Radio>
                <Radio value={0}>无效</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col span={10}>
            <Form.Item
              name="executeCron"
              label="调度cron"
              wrapperCol={{ span: 14 }}
              labelCol={{ span: 10 }}
            >
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col span={2} style={{ padding: '0px 8px' }}>
            <CronForm onOk={changeCron} value={executeCron} title="配置" />
          </Col>
        </Row>
      </Form>
    </CustomModal>
  );
};
