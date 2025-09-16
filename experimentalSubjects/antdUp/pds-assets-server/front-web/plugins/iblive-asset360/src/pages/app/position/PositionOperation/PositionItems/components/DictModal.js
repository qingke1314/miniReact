/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-14 12:54:31
 * @LastEditTime: 2024-10-30 14:41:17
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 */

import { savePositionDict } from '@asset360/apis/positionDict';
import CustomButtonGroup from '@asset360/components/CustomButtonGroup';
import CustomModal from '@asset360/components/CustomModal';
import { Col, Form, Input, message, Row, Select, TreeSelect } from 'antd';
export default ({ visible, onCancel, callback, types }) => {
  const [form] = Form.useForm();

  return (
    <CustomModal
      title={'新增字典项'}
      width="45vw"
      footer={
        <CustomButtonGroup
          onConfirm={() => {
            form.validateFields().then(async (values) => {
              const res = await savePositionDict({
                ...values,
              });
              if (res?.code > 0) {
                message.success('新增成功');
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
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
      >
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="code"
              rules={[{ required: true, message: '字典代码不能为空' }]}
              label={'字典代码'}
            >
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: '字典名称不能为空' }]}
              label={'字典名称'}
            >
              <Input allowClear />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="status" label="状态" initialValue={1}>
              <Select
                options={[
                  {
                    label: '有效',
                    value: 1,
                  },
                  {
                    label: '无效',
                    value: 0,
                  },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="parentId"
              rules={[{ required: true, message: '业务类别不能为空' }]}
              label={'业务类别'}
            >
              <TreeSelect
                treeData={types}
                showSearch
                filterTreeNode={(inputValue, node) =>
                  node.title?.indexOf(inputValue) > -1
                }
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="remarks"
              label="备注"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 20 }}
            >
              <Input allowClear />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </CustomModal>
  );
};
