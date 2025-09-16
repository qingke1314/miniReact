/*
 * @Author: wenyiqian
 * @Date: 2025-01-08 15:31:50
 * @LastEditors: wenyiqian
 * @LastEditTime: 2025-02-18 09:42:47
 * @Description: desc
 */
import { message, Spin } from 'antd-v5';
import { setUserInfo, getRealPath } from 'iblive-base';
// import { Routes } from 'iblive-oms';
import useMount from 'react-use/esm/useMount';
import { history } from 'umi';
import { Routes } from '../../../plugins/iblive-asset360/src/index';
import { login } from '../../apis/user';

const extractPaths = (routes) => {
  const paths = {};

  const dfs = (routes) => {
    routes.forEach((route) => {
      if (route.path) {
        paths[route.path] = true;
      }
      if (route.routes) {
        dfs(route.routes);
      }
    });
  };

  dfs(routes);
  return paths;
};

const Login = () => {
  useMount(async () => {
    try {
      const res = await login({ userAcc: 'admin', password: 'apexsoft@123' });
      if (res?.code === 1) {
        const { auths: rootAuthList, ...others } = res?.data || {};
        // 获取用户菜单权限
        setUserInfo({
          ...others,
          authMap: extractPaths(Routes),
        });
        history.push(getRealPath('/APP/assetOverview/overview'));
      }
    } catch (error) {
      message.error(error.message);
    }
  });

  return <Spin spinning />;
};

export default Login;
