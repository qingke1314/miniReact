/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-12-17 09:45:15
 * @LastEditors: wenyiqian
 * @LastEditTime: 2025-02-10 15:55:44
 * @Description:
 */
import { editPwd, editUserInfo, queryUserUnit } from '@asset360/apis/user';
import CustomButtonGroup from '@asset360/components/CustomButtonGroup';
import CustomModal from '@asset360/components/CustomModal';
import { Form, Input, message } from 'antd-v5';
import {
  checkUserPassword,
  getUserInfo,
  securityUtils,
  setUserInfo,
} from 'iblive-base';
import { useEffect } from 'react';
const { encrypt } = securityUtils;

export default function E({ visible, isChangePassword = false, onCancel }) {
  const [form] = Form.useForm();
  const afterClose = () => {
    form.resetFields();
  };
  const onConfirm = (setLoading) => {
    form.validateFields().then(async (values) => {
      setLoading(true);
      const { userAcc } = getUserInfo();
      if (isChangePassword) {
        const { oldPwd, newPwd } = values;
        const res = await editPwd({
          oldPwd: encrypt(oldPwd),
          newPwd: encrypt(newPwd),
          userAcc,
        });
        if (res?.code === 1) {
          message.success('用户密码修改成功');
          onCancel();
        }
      } else {
        const res = await editUserInfo({
          ...values,
          userAcc,
        });
        if (res?.code === 1) {
          message.success('信息修改成功');
          const preUserInfo = getUserInfo();
          setUserInfo({
            ...preUserInfo,
            ...values,
          });
          onCancel();
        }
      }
      setLoading(false);
    });
  };

  const getInitInfo = async () => {
    const { userAcc } = getUserInfo();
    const res = await queryUserUnit(userAcc);
    form.setFieldsValue(res?.data);
  };

  useEffect(() => {
    if (visible && !isChangePassword) {
      getInitInfo();
    }
  }, [visible]);

  return (
    <CustomModal
      title={isChangePassword ? '修改密码' : '修改信息'}
      visible={visible}
      footer={<CustomButtonGroup onCancel={onCancel} onConfirm={onConfirm} />}
      afterClose={afterClose}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ flex: '6em' }} labelAlign="right">
        {isChangePassword ? (
          <>
            <Form.Item
              label="旧密码"
              name="oldPwd"
              rules={[{ required: true, message: '旧密码不能为空' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="新密码"
              name="newPwd"
              rules={[
                { required: true, message: '新密码不能为空' },
                ...(UMI_ENV === 'xday'
                  ? [
                      () => ({
                        validator(_, value) {
                          const isPass = checkUserPassword(value);
                          if (isPass) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              '密码需要同时包含大小写字母、数字、特殊符号，且长度大于6位',
                            ),
                          );
                        },
                      }),
                    ]
                  : []),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="确认密码"
              name="confirmPwd"
              rules={[
                { required: true, message: '请再次确认新密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (getFieldValue('newPwd') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('确认密码和新密码不一致');
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item
              label="用户名称"
              name="userName"
              rules={[{ required: true, message: '用户名称不能为空' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="手机号"
              name="tel"
              rules={[
                {
                  pattern: /^1[3-9]\d{9}$/,
                  message: '手机号格式不正确',
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>
            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                {
                  type: 'email',
                  message: '邮箱格式不正确',
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>
          </>
        )}
      </Form>
    </CustomModal>
  );
}
