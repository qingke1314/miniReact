/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2023-07-27 13:43:12
 * @LastEditors: wenyiqian
 * @LastEditTime: 2025-02-18 10:41:11
 * @Description: 应用管理Layout
 */
import { Outlet } from '@umijs/max';
import { CustomLayout } from 'iblive-base';
import { useModel } from 'umi';
import zhCN from 'antd-v5/lib/locale/zh_CN';
import { ConfigProvider, theme as antdTheme } from 'antd-v5';
import ThemeVarSet from './ThemeVarSet';

export default () => {
  const { theme } = useModel('global');
  const { defaultAlgorithm, darkAlgorithm } = antdTheme;
  const themeConfig = theme === 'dark' ? darkAlgorithm : defaultAlgorithm;
  return (
    <ConfigProvider
      prefixCls={ANTD_PREFIX_CLS}
      locale={zhCN}
      componentSize="small"
      theme={{
        algorithm: themeConfig,
        token: {
          colorPrimary: 'rgb(173, 121, 124)',
          fontFamily: `'myFont', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
        },
      }}
    >
      <ThemeVarSet />
      <CustomLayout
        padding={'8px'} //首页边距小
      >
        <Outlet />
      </CustomLayout>
    </ConfigProvider>
  );
};
