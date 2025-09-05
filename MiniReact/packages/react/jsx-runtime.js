import { TEXT_ELEMENT } from '../shared';

function createTextElement(text) {
  return {
    type: TEXT_ELEMENT,
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

export function createElement(type, config, ...children) {
  const props = { ...config };
  const key = props.key;

  // 过滤掉 null, undefined, boolean 类型的 children
  const childElements = children
    .flat()
    .filter(child => child != null && typeof child !== 'boolean')
    .map(child => (typeof child === 'object' ? child : createTextElement(child)));

  props.children = childElements;

  return {
    type,
    props,
    key,
  };
}

// 这是 Babel 自动运行时会调用的函数
export function jsx(type, config) {
  const { key, ...props } = config;
  const children = props.children || [];

  // 确保 children 总是数组
  const childrenArray = Array.isArray(children) ? children : [children];

  props.children = childrenArray
    .flat()
    .filter((child) => child != null && typeof child !== "boolean")
    .map((child) => (typeof child === "object" ? child : createTextElement(child)));

  return {
    type,
    props,
    key,
  };
}

// jsxs 是一个优化，用于处理有多个静态子元素的节点，
// 目前我们可以让它直接等于 jsx
export const jsxs = jsx;