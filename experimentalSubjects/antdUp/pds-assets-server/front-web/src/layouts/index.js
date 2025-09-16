/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2023-07-27 09:25:33
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-25 09:49:54
 * @Description:
 */
import { Button, ConfigProvider } from 'antd-v5';
import zhCN from 'antd-v5/lib/locale/zh_CN';
import 'moment/locale/zh-cn';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Outlet, useModel } from 'umi';
import { store } from '../../plugins/iblive-asset360/src/store';
import styles from './index.less';

ConfigProvider.config({
  prefixCls: ANTD_PREFIX_CLS,
});

export default ({}) => {
  const { theme, changeTheme } = useModel('global');
  useEffect(() => {
    document.body.setAttribute('theme-type', theme);
  }, [theme]);

  return (
    <ConfigProvider
      prefixCls={ANTD_PREFIX_CLS}
      locale={zhCN}
      componentSize="small"
    >
      <Provider store={store}>
        <div className={styles.fixed_widgets}>
          <Button onClick={changeTheme}>改变主题</Button>
        </div>
        <div
          style={{
            height: '100vh',
          }}
        >
          <Outlet />
        </div>
      </Provider>
    </ConfigProvider>
  );
};
