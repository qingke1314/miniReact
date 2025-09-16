/*
 * @Author: wenyiqian
 * @Date: 2025-01-08 15:48:12
 * @LastEditors: wenyiqian
 * @LastEditTime: 2025-02-18 10:22:14
 * @Description: 测试页面路由
 */

export default [
  {
    path: '/',
    isExact: true,
    component: '@/layouts/index',
    routes: [
      {
        path: '/test',
        routes: [],
      },
    ],
  },
  { path: '/login', component: '@/pages/Login' },
  { path: '/logout', component: '@/pages/Logout' },
];
