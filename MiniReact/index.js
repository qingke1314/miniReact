import React from "./packages/react";
import ReactDOM from "./packages/react-dom";

// 导出 MiniReact 对象，包含所有 API
export const MiniReact = {
  createElement: React.createElement, // 从 React 对象中获取 createElement
  render: ReactDOM.render, // 渲染函数
  useState: React.useState, // 状态管理 Hook
  useMemo: React.useMemo, // 记忆化值 Hook
  useCallback: React.useCallback, // 记忆化回调 Hook
  useEffect: React.useEffect, // 副作用 Hook
  useRef: React.useRef, // 引用 Hook
  memo: React.memo, // 记忆化组件 Hook
};

// 单独导出各个 API
export const createElement = React.createElement;
export const useState = React.useState;
export const useMemo = React.useMemo;
export const useCallback = React.useCallback;
export const useEffect = React.useEffect;
export const useRef = React.useRef;
export const memo = React.memo;

export default MiniReact;
