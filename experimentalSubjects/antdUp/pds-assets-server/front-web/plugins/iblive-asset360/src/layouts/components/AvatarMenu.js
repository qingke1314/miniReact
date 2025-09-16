/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2023-12-14 10:20:09
 * @LastEditTime: 2025-02-10 15:53:37
 * @LastEditors: wenyiqian
 */
import {
  EditOutlined,
  KeyOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { loginOut } from '@asset360/apis/user';
import { Avatar, Dropdown, Menu, Space } from 'antd';
import { clearUserInfo, getUserInfo } from 'iblive-base';
import { useState } from 'react';
import { history, useModel } from 'umi';
import styles from './components.less';
import EditUserModal from './EditUserModal';

const AvatarMenu = () => {
  const { setApp } = useModel('global');
  const [showEditor, setShowEditor] = useState({ visible: false });
  const [loading, setLoading] = useState(false);
  const userName = getUserInfo()?.userName;
  const userAcc = getUserInfo()?.userAcc;

  const onLoginOut = async () => {
    setLoading(true);
    const res = await loginOut(userAcc);
    if (res?.code === 1) {
      clearUserInfo();
      setApp();
      history.push('/login');
    }
    setLoading(false);
  };

  const openEditor = (isChangePassword = false) => {
    setShowEditor({ visible: true, isChangePassword });
  };
  const closeEditor = () => {
    setShowEditor({ visible: false });
  };

  return (
    <>
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item
              onClick={() => openEditor(false)}
              loading={loading}
              icon={<EditOutlined />}
            >
              修改信息
            </Menu.Item>
            <Menu.Item
              onClick={() => openEditor(true)}
              loading={loading}
              icon={<KeyOutlined />}
            >
              修改密码
            </Menu.Item>
            <Menu.Item
              onClick={onLoginOut}
              loading={loading}
              icon={<LogoutOutlined />}
            >
              退出登录
            </Menu.Item>
          </Menu>
        }
      >
        <Space style={{ height: '100%' }}>
          <Avatar icon={<UserOutlined />} />
          <h5 className={styles.user_name}>{userName}</h5>
        </Space>
      </Dropdown>
      <EditUserModal {...showEditor} onCancel={closeEditor} />
    </>
  );
};

export default AvatarMenu;
