/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2023-06-21 15:47:25
 * @LastEditors: wenyiqian
 * @LastEditTime: 2025-03-17 17:32:06
 * @Description: 系统模块切换组件
 */
import { DesktopOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd-v5';
import { configUtils, getUserInfo } from 'iblive-base';
import { useMemo } from 'react';
import { history, useLocation, useModel } from 'umi';
import styles from './components.less';

const PanelModeSwitcher = () => {
  const { panelMode, setPanelMode } = useModel('global');
  const location = useLocation();
  const { authMap } = getUserInfo() || {};

  const menuItems = useMemo(() => {
    const PANEL_LIST = configUtils.getPanelList();
    return PANEL_LIST.slice(0, PANEL_LIST.length - 1).filter(
      (item) => authMap[item.key],
    );
  }, [configUtils]);

  const onSelect = ({ key }) => {
    if (location.pathname.indexOf(key) !== -1) {
      history.push(location.pathname);
    } else {
      history.push(key);
    }
    setPanelMode(key);
  };
  return (
    <Dropdown
      overlay={
        <Menu onClick={onSelect} activeKey={panelMode} items={menuItems} />
      }
    >
      <DesktopOutlined className={styles.header_icon} title="切换面板" />
    </Dropdown>
  );
};

export default PanelModeSwitcher;
