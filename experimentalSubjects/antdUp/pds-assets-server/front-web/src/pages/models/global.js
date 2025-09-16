/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2022-10-08 15:42:50
 * @LastEditTime: 2025-02-17 18:39:35
 * @LastEditors: wenyiqian
 */

import { useToggle } from 'ahooks';
import { useState } from 'react';

export default () => {
  // 面板类型
  const [panelMode, setPanelMode] = useState('APP');
  // 指标中心指标集选择
  const [app, setApp] = useState();
  // 主题
  const [theme, { toggle: toggleTheme }] = useToggle('dark', 'light');

  // 切换主题
  const initTheme = () => {
    document.body.setAttribute('theme-type', theme);
  };

  const changeTheme = () => {
    document.body.setAttribute(
      'theme-type',
      theme === 'light' ? 'dark' : 'light',
    );
    toggleTheme();
  };

  return {
    panelMode,
    setPanelMode,

    app,
    setApp,

    theme,
    toggleTheme,
    initTheme,
    changeTheme,
  };
};
