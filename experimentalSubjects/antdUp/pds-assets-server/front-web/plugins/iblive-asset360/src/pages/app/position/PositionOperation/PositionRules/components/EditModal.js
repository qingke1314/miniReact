/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-14 12:54:31
 * @LastEditTime: 2024-08-30 15:23:25
 * @LastEditors: chenzongjun chenzongjun@apexsoft.com.cn
 */

import { addTemplate, instAddTemplate } from '@asset360/apis/positionTemplate';
import CustomButtonGroup from '@asset360/components/CustomButtonGroup';
import CustomModal from '@asset360/components/CustomModal';
import { Col, Form, Input, message, Row } from 'antd-v5';

export default ({ visible, onCancel, info, activeKey }) => {
  const [form] = Form.useForm();

  return (
    <CustomModal
      title={'保存至模板'}
      width="45vw"
      footer={
        <CustomButtonGroup
          onConfirm={() => {
            form.validateFields().then(async (values) => {
              const { fundCode, ruleConfigList, astUnitId } = info;
              const object = {
                refList: [
                  {
                    fundCode,
                    astUnitId,
                  },
                ],
                ruleConfigList,
                ...values,
              };
              const fun = activeKey == 'TRADE' ? addTemplate : instAddTemplate;
              const res = await fun(object);
              if (res?.code === 1) {
                message.success('已保存至模板');
                onCancel();
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
      <Form form={form} wrapperCol={{ span: 16 }} labelCol={{ span: 6 }}>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: '模板名称不能为空' }]}
              label={'模板名称'}
            >
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="remarks" label={'备注'}>
              <Input allowClear />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </CustomModal>
  );
};
