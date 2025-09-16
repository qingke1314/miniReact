/*
 * @Author: wenyiqian
 * @Date: 2025-01-20 16:31:03
 * @LastEditors: wenyiqian
 * @LastEditTime: 2025-01-20 16:31:03
 * @Description: desc
 */
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

// 测试插件用页面
export default ({ children }) => {
  return <ConfigProvider locale={zhCN}>{children}</ConfigProvider>;
};
