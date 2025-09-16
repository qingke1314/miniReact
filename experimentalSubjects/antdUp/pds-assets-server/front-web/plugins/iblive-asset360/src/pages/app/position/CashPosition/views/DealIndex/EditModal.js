import { LockCashInfo } from '@asset360/apis/position';
import CustomButtonGroup from '@asset360/components/CustomButtonGroup';
import CustomModal from '@asset360/components/CustomModal';
import { Col, DatePicker, Form, Input, message, Row } from 'antd';
import { securityUtils } from 'iblive-base';
import moment from 'moment';
import { useEffect } from 'react';

export default ({
  visible,
  onCancel,
  updateData,
  info,
  paramsForList,
  date,
}) => {
  const { encrypt } = securityUtils;
  const [form] = Form.useForm();

  const afterClose = () => form.resetFields();

  const onConfirm = () => {
    form.validateFields().then(async (values) => {
      const { headObjectCode, objectCode, parentObjectCode } = paramsForList;
      const object = {
        ...values,
        lockedExpire: moment(values.lockedExpire).format('YYYY-MM-DD HH:mm:ss'),
        password: encrypt(values.password),
        fundCode:
          headObjectCode === 'fund_code' ? objectCode : parentObjectCode,
        businDate: moment(date).format('YYYYMMDD'),
        positionId: info.positionId,
      };
      const res = await LockCashInfo(object);
      if (res?.code > 0) {
        message.success('保存成功');
        onCancel();
        updateData();
      }
    });
  };

  useEffect(() => {
    if (visible) {
      const lockedExpire = info?.lockedExpire
        ? moment(info?.lockedExpire)
        : moment().endOf('day');
      form.setFieldsValue({ ...info, lockedExpire });
    }
  }, [visible]);

  const disabledDate = (current) => {
    return current && current < moment().startOf('day');
  };

  return (
    <CustomModal
      title={'编辑'}
      visible={visible}
      width={700}
      onCancel={onCancel}
      afterClose={afterClose}
      destroyOnClose
      footer={<CustomButtonGroup onConfirm={onConfirm} onCancel={onCancel} />}
    >
      <Form form={form}>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item name="name" label={'项目'}>
              <Input readOnly bordered={false} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="t0Amount"
              label={'金额'}
              rules={[{ required: true, message: '金额不能为空' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="lockedExpire"
              label={'锁定有效期'}
              rules={[{ required: true, message: '锁定有效期不能为空' }]}
            >
              <DatePicker
                showNow={false}
                disabledDate={disabledDate}
                allowClear={false}
                showTime
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="password"
              label="锁定密码"
              rules={[{ required: true, message: '锁定密码不能为空' }]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </CustomModal>
  );
};
