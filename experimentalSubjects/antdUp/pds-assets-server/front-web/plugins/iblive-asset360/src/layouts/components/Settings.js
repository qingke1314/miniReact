/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2023-07-27 09:55:11
 * @LastEditors: wenyiqian
 * @LastEditTime: 2025-02-10 15:15:30
 * @Description: 系统管理头部icon
 */
import { getUserInfo } from 'iblive-base';
import { SettingOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import { history, useLocation } from 'umi';
import styles from './components.less';

export default () => {
  const { pathname } = useLocation();
  const onPathChange = () => {
    if (pathname.includes('/SYSTEM/')) {
      // 已经在系统配置模板不做重复跳转
      return;
    }
    history.push('/SYSTEM');
  };
  const hasSystemAuth = useMemo(() => {
    const { authMap } = getUserInfo() || {};
    return authMap?.['/SYSTEM'];
  }, []);

  return (
    <>
      {hasSystemAuth && (
        <SettingOutlined
          onClick={onPathChange}
          className={styles.header_icon}
          title="系统管理"
        />
      )}
    </>
  );
};
