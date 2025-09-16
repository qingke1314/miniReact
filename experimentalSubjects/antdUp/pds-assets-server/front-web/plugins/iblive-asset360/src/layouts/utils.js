/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2022-12-05 16:36:08
 * @LastEditors: wenyiqian
 * @LastEditTime: 2025-02-10 15:21:45
 * @Description:
 */
import {
  AlertOutlined,
  AppstoreOutlined,
  CloudSyncOutlined,
  CodeSandboxOutlined,
  DeploymentUnitOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  FundProjectionScreenOutlined,
  FundViewOutlined,
  GlobalOutlined,
  GoldOutlined,
  PicCenterOutlined,
  ReadOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const getIcon = (iconName) => {
  switch (iconName) {
    case '合规项管理':
      return <FolderOpenOutlined />;
    case '公共基础数据':
      return <FileTextOutlined />;
    case '行情面板':
      return <FundProjectionScreenOutlined />;
    case '行情查询':
      return <FundViewOutlined />;
    case '指标开发':
      return <CodeSandboxOutlined />;
    case '指标运营':
      return <GlobalOutlined />;
    case '运营监控':
      return <GoldOutlined />;
    case '运维监控':
      return <AlertOutlined />;
    case '因子测试':
      return <CloudSyncOutlined />;
    case '用户管理':
      return <UserOutlined />;
    case '角色管理':
      return <TeamOutlined />;
    // case '操作审计':
    //   return <PicCenterOutlined />;
    case '菜单权限':
      return <AppstoreOutlined />;
    case '指标配置':
      return <DeploymentUnitOutlined />;
    case '指标对象':
      return <ReadOutlined />;
    case '报表管理':
      return <FileExcelOutlined />;
    default:
      return null;
  }
};

export const getMenuList = (routes = [], authMap) => {
  const menuList = [];
  routes.forEach((item) => {
    if ((item.name ?? false) && authMap?.[item.path]) {
      const children =
        item.routes?.length > 0 ? getMenuList(item.routes, authMap) : undefined;
      menuList.push({
        ...item,
        key: item.path,
        label: item.name,
        icon: getIcon(item.name),
        children,
        routes: children,
      });
    }
  });
  return menuList;
};
export const getInitialPath = (menuList) => {
  if (menuList?.[0]?.routes?.length > 0) {
    return getInitialPath(menuList?.[0]?.routes);
  }
  return menuList?.[0]?.path;
};
export const getImg = (icon) => (
  <img src={icon} style={{ height: 20, width: 20 }} />
);
