/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-12 16:28:06
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 * @LastEditTime: 2024-09-11 11:07:37
 * @FilePath: \invest-index-server-front\src\pages\monitor\CashPosition\views\CashForecast\EditModal.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { LockCashInfo } from '@asset360/apis/position';
import CustomButtonGroup from '@asset360/components/CustomButtonGroup';
import CustomModal from '@asset360/components/CustomModal';
import { Col, DatePicker, Form, Input, message, Row } from 'antd-v5';
import { securityUtils } from 'iblive-base';
import moment from 'moment';
import { useEffect } from 'react';

export default ({
  formData,
  visible,
  onCancel,
  paramsForList,
  date,
  updateTable,
  updateTree,
}) => {
  const { encrypt } = securityUtils;
  const [form] = Form.useForm();
  const { modalType } = formData || {};

  const afterClose = () => form.resetFields();

  const onConfirm = () => {
    form.validateFields().then(async (values) => {
      if (values) {
        const { headObjectCode, objectCode, parentObjectCode } = paramsForList;
        const param = {
          ...values,
          positionId: formData?.positionId,
          businDate: moment(date).format('yyyyMMDD'),
          lockedExpire: values?.lockedExpire
            ? moment(values?.lockedExpire).format('yyyy-MM-DD HH:mm:ss')
            : undefined,
          fundCode:
            headObjectCode === 'fund_code' ? objectCode : parentObjectCode,
          astUnitId:
            headObjectCode === 'ast_unit_code' ? objectCode : undefined,
          password: encrypt(values.password),
          indexType: 'FINANCE',
        };
        const res = await LockCashInfo({
          ...param,
        });
        if (res?.code === 1) {
          message.success('保存成功');
          onCancel();
          updateTable();
          updateTree();
        }
      }
    });
  };

  const disabledDate = (current) => {
    return current && current < moment().startOf('day');
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        ...formData,
        lockedExpire: formData?.lockedExpire
          ? moment(formData?.lockedExpire)
          : moment().endOf('day'),
      });
    }
  }, [visible]);

  return (
    <CustomModal
      title={'编辑'}
      visible={visible}
      width={700}
      onCancel={onCancel}
      afterClose={afterClose}
      footer={<CustomButtonGroup onConfirm={onConfirm} onCancel={onCancel} />}
    >
      <Form form={form}>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="name"
              label={'项目'}
              rules={[{ required: true, message: '项目不能为空' }]}
            >
              <Input disabled />
            </Form.Item>
          </Col>
          {modalType == 't0Amount' ? (
            <Col span={12}>
              <Form.Item
                name="t0Amount"
                label={'T0余额'}
                rules={[{ required: true, message: 'T0余额不能为空' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          ) : modalType == 't1Amount' ? (
            <Col span={12}>
              <Form.Item
                name="t1Amount"
                label={'T1余额'}
                rules={[{ required: true, message: 'T1余额不能为空' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          ) : modalType == 't2Amount' ? (
            <Col span={12}>
              <Form.Item
                name="t2Amount"
                label={'T2余额'}
                rules={[{ required: true, message: 'T2余额不能为空' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          ) : modalType == 't3Amount' ? (
            <Col span={12}>
              <Form.Item
                name="t3Amount"
                label={'T3余额'}
                rules={[{ required: true, message: 'T3余额不能为空' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          ) : null}

          {moment(date).isSame(moment().startOf('day'), 'd') && (
            <Col span={12}>
              <Form.Item
                name="lockedExpire"
                label={'锁定有效期'}
                // initialValue={moment().endOf('day')}
                rules={[{ required: true, message: '锁定有效期不能为空' }]}
              >
                <DatePicker
                  showNow={false}
                  disabledDate={disabledDate}
                  // disabledTime={disabledDateTime}
                  allowClear={false}
                  showTime
                />
              </Form.Item>
            </Col>
          )}

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
