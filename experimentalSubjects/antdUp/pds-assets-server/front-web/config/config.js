/*
 * @Author: wenyiqian
 * @Date: 2025-01-08 14:11:47
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-06 17:35:24
 * @Description: desc
 */
import path from 'path';
import { defineConfig } from 'umi';
// @ts-ignore
import proxy from './proxy';
import routes from './routes';
import theme from './theme';

export default defineConfig({
  fastRefresh: true,
  mfsu: false,
  model: {},
  antd: {},
  proxy: proxy.dev,
  define: {
    UMI_ENV: 'all',
    NEED_WATERMARK: false, // 是否需要水印
    DESENSITIZE: true, // 数据脱敏操作
    INTERFACE_PREFIX: '/proxy',
    ANTD_PREFIX_CLS: 'privateAntd', // antd 设置统一样式前缀
    MOCK_PATHS: [
      //mock可用地址，没有端口接口，可以自己造JSON,测试不会侵入业务代码
      //"/ficp/user/login"
    ],
  },
  title: 'IBLive',
  history: { type: 'hash' },
  alias: {
    '@public': path.resolve(__dirname, '..', 'public'),
    '@asset360': path.resolve(__dirname, '../plugins/iblive-asset360/src'),
  },
  // 防止引入react-dnd报错
  chainWebpack(config) {
    config.module
      .rule('media')
      .test(/\.(mp3|4)$/)
      .use('file-loader')
      .loader(require.resolve('file-loader'));
    config.module
      .rule('mjs-rule')
      .test(/.m?js/)
      .resolve.set('fullySpecified', false);
  },
  routes,
  theme,
  jsMinifier: 'terser',
  lessLoader: {
    modifyVars: {
      '@ant-prefix': 'privateAntd',
      ...theme,
    },
  },
});
