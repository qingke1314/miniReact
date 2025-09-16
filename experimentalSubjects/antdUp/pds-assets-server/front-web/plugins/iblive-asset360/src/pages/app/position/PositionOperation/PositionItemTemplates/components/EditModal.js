/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-14 12:54:31
 * @LastEditTime: 2024-09-03 09:39:01
 * @LastEditors: chenzongjun chenzongjun@apexsoft.com.cn
 */

import { addTemplate, instAddTemplate } from '@asset360/apis/positionTemplate';
import CustomButtonGroup from '@asset360/components/CustomButtonGroup';
import CustomModal from '@asset360/components/CustomModal';
import { Col, Form, Input, message, Row, Select } from 'antd';

export default ({ callback, visible, onCancel }) => {
  const [form] = Form.useForm();

  return (
    <CustomModal
      title={'新增模板'}
      width="35vw"
      footer={
        <CustomButtonGroup
          onConfirm={() => {
            form.validateFields().then(async (values) => {
              const { name, type } = values;
              const fun = type == 'TRADE' ? addTemplate : instAddTemplate;
              const res = await fun({
                name,
              });
              if (res?.code === 1) {
                message.success(`新增成功`);
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
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
        <Row gutter={8}>
          <Col span={14}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: '模板名称不能为空' }]}
              label={'模板名称'}
            >
              <Input allowClear />
            </Form.Item>
          </Col>

          <Col span={10}>
            <Form.Item name="type" label={'模板类型'} initialValue={'TRADE'}>
              <Select
                options={[
                  {
                    label: '交易维度',
                    value: 'TRADE',
                  },
                  {
                    label: '估值维度',
                    value: 'GZ',
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </CustomModal>
  );
};
