/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2025-02-18 15:38:34
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2025-02-19 09:48:34
 * @Description:
 */
import { Form, Input, message } from 'antd-v5';
import { useEffect } from 'react';
import {
  saveFundGroup,
  updateFundGroup,
} from '../../../../../../apis/positionFundGroup';
import CustomButtonGroup from '../../../../../../components/CustomButtonGroup';
import CustomModal from '../../../../../../components/CustomModal';

export default ({ visible, info, onCancel, updateTree }) => {
  const title = `${info?.id ? '编辑' : '新增'}产品组`;
  const [form] = Form.useForm();
  const onAfterClose = () => {
    form.resetFields();
  };

  const onConfirm = (setLoading) => {
    form.validateFields().then(async (values) => {
      setLoading(true);
      const fun = info?.id ? updateFundGroup : saveFundGroup;
      const res = await fun({
        code: info?.id ? info?.code : values.code,
        parentCode: info?.parentCode,
        name: values.name,
        id: info?.id,
      });
      if (res?.code === 1) {
        message.success(res?.note || `${title}成功`);
        updateTree();
        onCancel();
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(info);
    }
  }, [visible]);
  return (
    <CustomModal
      title={title}
      footer={<CustomButtonGroup onConfirm={onConfirm} onCancel={onCancel} />}
      visible={visible}
      onCancel={onCancel}
      afterClose={onAfterClose}
    >
      <Form form={form}>
        <Form.Item
          label={'编码'}
          name="code"
          rules={[{ required: true, message: '编码不能为空' }]}
        >
          <Input disabled={info?.id !== undefined} />
        </Form.Item>
        <Form.Item
          label={'名称'}
          name="name"
          rules={[{ required: true, message: '名称不能为空' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </CustomModal>
  );
};
