import { reconciler } from '../react-reconciler';
import { createElement } from './jsx-runtime'; // 从新的 jsx-runtime 导入

// 直接从 reconciler 导出 Hooks
export const useState = reconciler.useState;
export const useEffect = reconciler.useEffect;
export const useMemo = reconciler.useMemo;
export const useCallback = reconciler.useCallback;
export const useRef = reconciler.useRef;
export const memo = reconciler.memo;

// 导出 React 主对象
const React = {
  createElement,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  memo,
};

export default React;