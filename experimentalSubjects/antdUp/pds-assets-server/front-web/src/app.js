/*
 * @Author: wenyiqian
 * @Date: 2025-01-08 14:36:51
 * @LastEditors: wenyiqian
 * @LastEditTime: 2025-04-25 10:17:22
 * @Description: desc
 */
import { configUtils, getUserInfo } from 'iblive-base';
import React from 'react';
import { history } from 'umi';
import { getConfigWithEnv } from '../config/envConfig';

export const onRouteChange = ({ location }) => {
  const userInfo = getUserInfo();
  // 判断登录情况
  if (
    location.pathname !== '/login' &&
    !userInfo &&
    location.pathname !== '/test'
  ) {
    return history.push('/login');
  } else if (location.pathname === '/login' && userInfo) {
    return history.push(userInfo.initialPath || '/404');
  }
};

const generateRoutes = (preRoutes, parentId = 999) => {
  const { lazy, Suspense, createElement } = React;

  return preRoutes.map((preRoute, index) => {
    const returnRoute = {
      ...preRoute,
      path: preRoute.path,
      name: preRoute.name,
      parentId,
      key: preRoute.key,
      subMenuType: preRoute.subMenuType,
      id: parentId * 10 + index,
    };
    if (preRoute.routes?.length > 0) {
      const returnChildren = generateRoutes(
        preRoute.routes,
        parentId * 10 + index,
      );
      returnRoute.routes = returnChildren;
      returnRoute.children = returnChildren;
    }

    if (preRoute.component && typeof preRoute.component === 'function') {
      // 1. 为主组件创建懒加载版本
      const LazyComponent = lazy(preRoute.component);

      // 2. 将主组件作为初始的“children”
      let elementTree = createElement(LazyComponent);

      // 3. 如果有 wrappers，则用它们来包裹主组件
      if (
        preRoute.wrappers &&
        Array.isArray(preRoute.wrappers) &&
        preRoute.wrappers.length > 0
      ) {
        elementTree = preRoute.wrappers.reduceRight(
          (children, wrapperImporter) => {
            return createElement(wrapperImporter, null, children);
          },
          elementTree, // 初始值为懒加载的主组件
        );
      }

      // 4. 最后，用一个 Suspense 组件包裹整个组件树
      returnRoute.element = createElement(
        Suspense,
        { fallback: createElement('div', null, '加载中...') },
        elementTree,
      );
    } else if (preRoute.component) {
      // 修正 #1：從 component 引用建立 JSX element
      let elementToRender = preRoute.component;

      // 修正 #2：使用正確的變數 preRoute
      if (
        preRoute.wrappers &&
        Array.isArray(preRoute.wrappers) &&
        preRoute.wrappers.length > 0
      ) {
        // 使用 reduceRight 從內向外包裹组件
        elementToRender = preRoute.wrappers.reduceRight(
          (children, WrapperComponent) => {
            return React.cloneElement(WrapperComponent, {}, children);
          },
          elementToRender,
        );
      }
      returnRoute.element = elementToRender;
    }
    return returnRoute;
  });
};

export const patchClientRoutes = ({ routes }) => {
  const { Routes } = require('../plugins/iblive-asset360/src/index');

  let newRoutes = [];

  if (Routes && Routes.length > 0) {
    newRoutes = generateRoutes(Routes);
  }

  routes[0]?.children[0].children.push(...newRoutes);
  configUtils.setConfig({
    routes: newRoutes,
    PANEL_LIST: newRoutes.map((item) => ({
      label: item.name,
      key: item.path,
      icon: item.icon,
    })),
    envConfig: getConfigWithEnv(),
  });
};
