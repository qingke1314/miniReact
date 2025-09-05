import { TEXT_ELEMENT } from "../shared";
import { reconciler } from "../react-reconciler";

/**
 * 生成 text vDom
 */
function createTextElement(text) {
  return {
    type: TEXT_ELEMENT,
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

/**
 * 自实现 createElement（jsx 转译后的 js 对象）
 */
export function createElement(type, config, ...children) {
  const props = { ...config };
  // 单独设置key，用于优化diff算法
  const key = props.key;
  props.children = children
    .flat()
    .filter((child) => child != null && typeof child !== "boolean")
    .map((child) => (typeof child === "object" ? child : createTextElement(child)));

  return {
    type,
    props,
    key,
  };
}

export function useState(initialValue) {
  return reconciler.useState(initialValue);
}

export function useEffect(callback, deps) {
  return reconciler.useEffect(callback, deps);
}

export function useMemo(createFn, deps) {
  return reconciler.useMemo(createFn, deps);
}

export function useCallback(callback, deps) {
  return reconciler.useCallback(callback, deps);
}

export function useRef(initValue) {
  return reconciler.useRef(initValue);
}

export function memo(Component) {
  return reconciler.memo(Component);
}

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