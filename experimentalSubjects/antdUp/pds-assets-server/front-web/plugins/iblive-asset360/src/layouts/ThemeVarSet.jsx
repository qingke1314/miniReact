// src/components/ThemeVariableSyncer.js
import { theme } from 'antd-v5';
import { useModel } from 'umi';
import { useEffect } from 'react';

const { useToken } = theme;

// 定义你需要同步的 antd token 和你想要的 CSS 变量名的映射
const tokenToCssVarMap = {
  // key 是你的 CSS 变量名 (不带 --)
  // value 是 antd token 的 key
  'primary-color': 'colorPrimary',
  'border-color-base': 'colorBorder',
  'text-color': 'colorText',
  'component-background': 'colorBgContainer',
  'font-size-base': (token) => `${token.fontSize}px`, // 有些需要单位
  'border-radius-base': (token) => `${token.borderRadius}px`,
  'important-text-color': 'colorPrimary',
  'background-color': 'colorBgContainer',
  'background-color-light': 'colorBgElevated',
  'primary-1': 'colorPrimaryBg',
  'primary-2': 'colorPrimaryBgHover',
  'primary-3': 'colorPrimaryBorder',
  'primary-4': 'colorPrimaryBorderHover',
  'primary-5': 'colorPrimaryHover',
  'primary-6': 'colorPrimary',
  'primary-7': 'colorPrimaryActive',
  'primary-8': 'colorPrimaryTextHover',
  'primary-9': 'colorPrimaryText',
  'primary-10': 'colorPrimaryTextActive',
};

const ThemeVariableSyncer = () => {
  const { token } = useToken();
  const { theme } = useModel('global');
  useEffect(() => {
    const root = document.documentElement;

    Object.entries(tokenToCssVarMap).forEach(([cssVar, tokenKey]) => {
      const value =
        typeof tokenKey === 'function' ? tokenKey(token) : token[tokenKey];

      if (value) {
        root.style.setProperty(`--${cssVar}`, value);
      }
    });

    root.style.setProperty(
      '--sider-selected-color',
      theme === 'light' ? 'white' : token.colorPrimary,
    );
  }, [token, theme]);

  // 这个组件不渲染任何 UI
  return null;
};

export default ThemeVariableSyncer;
