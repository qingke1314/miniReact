const alias = require('@rollup/plugin-alias');
const url = require('@rollup/plugin-url');
import copy from 'rollup-plugin-copy';
const path = require('path');

export default {
  esm: 'rollup',
  // // cjs: 'babel',
  cssModules: {
    generateScopedName: 'asset360_[name]_[local]_[hash:base64:5]',
  },

  lessInRollupMode: {
    modifyVars: {
      '@heading-1-size': '24px', // h1
      '@heading-2-size': '22px', // h2
      '@heading-3-size': '20px', // h3
      '@heading-4-size': '18px', // h4
      '@heading-5-size': '16px', // h5
      '@ant-main-prefix-cls': 'privateAntd',
      '@primary-color': '#1890ff', // 全局主色
      '@success-color': '#20d08c', // 成功色
      '@warning-color': '#FFA500', // 警告色
      '@error-color': '#ff2723', // 错误色
      '@highlight-color': '#ff2723', // 高亮色
      '@normal-color': '#d9d9d9', // 默认色
      '@font-size-base': '14px',
      '@font-size-lg': '16px',
      '@font-size-sm': '12px',
      '@border-color-base': 'var(--border-color-base)', // 边框色
      '@border-color-split': 'rgba(255,255,255,0.3)', // 分割线颜色
      '@box-shadow-base': 'var(--box-shadow-base)', // 基础阴影
      '@background-color-base': 'var(--background-color-base)', // 背景色
      '@background-color-light': 'var(--selected-row-color)',
      '@asset360/component-background': 'var(--component-background)', //Base background color for most components
      '@text-color': 'var(--text-color)', // 主文本色
      '@border-radius-base': '4px', // 圆角弧度
      '@body-background': 'var(--content-background)',
      '@heading-color': 'var(--default-text-color)',
      '@item-hover-bg': 'var(--navigation-menu-selected-background-color)',
    },
    javascriptEnabled: true,
  },
  extraRollupPlugins: [
    copy({
      targets: [{ src: 'src/common/routes.js', dest: 'dist' }],
      verbose: true,
    }),
    url({
      limit: 10 * 1024, // <5MB
      emitFiles: true,
      destDir: 'dist/assets',
    }),
    alias({
      entries: [
        { find: '@asset360', replacement: path.resolve(__dirname, 'src') },
      ],
    }),
  ],
};
