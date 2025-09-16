/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2023-12-19 13:55:12
 * @LastEditTime: 2024-06-28 09:50:29
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 */

import { getUserInfo } from 'iblive-base';
import { SearchOutlined } from '@ant-design/icons';
import { Select, Space } from 'antd-v5';
import { flattenDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { history, useAppData } from 'umi';
import styles from './components.less';

export default ({ panelMode, addTab }) => {
  const { authMap } = getUserInfo() || {};
  const { clientRoutes } = useAppData();
  const [menuList, setMenuList] = useState([]);

  function flattenArray(arr) {
    return flattenDeep(
      arr.map((item) => {
        if (item.children) {
          return [item, ...flattenArray(item.children)];
        }
        return item;
      }),
    );
  }
  const getList = async () => {
    const panelModeMenus = flattenArray(clientRoutes).filter((route) => {
      const nodePanelMode = (route?.path || '').split('/')[1];
      return nodePanelMode === panelMode && route.name;
    });
    const parentPathIdMap = new Map(
      [...new Set(panelModeMenus.map((item) => item.parentId))].map((id) => [
        id,
        true,
      ]),
    );
    const leafMenus = panelModeMenus.filter(
      (route) => !parentPathIdMap.get(route.id) && authMap[route.path],
    );
    setMenuList(leafMenus);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <Space className={styles.menu_selector}>
      <Select
        value={null}
        onSelect={(e, option) => {
          if (addTab) {
            addTab(e, option);
          }
          history.push(e);
        }}
        showSearch
        bordered={false}
        optionFilterProp="label"
        optionLabelProp="label"
        className={styles.selector}
        suffixIcon={<SearchOutlined className={styles.icon} />}
        placeholder="菜单搜索"
      >
        {menuList.map((item) => (
          <Select.Option value={item.path} key={item.path} label={item.name}>
            <div title={item.path}>
              <div>{item.name}</div>
              <div className={styles.menu_selector_item_path}>{item.path}</div>
            </div>
          </Select.Option>
        ))}
      </Select>
    </Space>
  );
};
