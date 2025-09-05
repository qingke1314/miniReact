// packages/react-dom/index.js

import { TEXT_ELEMENT } from "../shared";
import { reconciler } from "../react-reconciler";

const isEvent = (key) => key.startsWith("on");
const isProperty = (key) => key !== "children" && !isEvent(key);

/**
 * 更新真实 DOM 属性
 */
function updateDom(dom, prevProps, nextProps) {
  // 移除旧事件
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || prevProps[key] !== nextProps[key])
    .forEach((key) => {
      const eventType = key.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[key]);
    });

  // 移除旧属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter((key) => !(key in nextProps))
    .forEach((key) => {
      dom[key] = "";
    });

  // 设置新属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter((key) => prevProps[key] !== nextProps[key])
    .forEach((key) => {
      dom[key] = nextProps[key];
    });

  // 添加新事件
  Object.keys(nextProps)
    .filter(isEvent)
    .filter((key) => prevProps[key] !== nextProps[key])
    .forEach((key) => {
      const eventType = key.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[key]);
    });
}

/**
 * 根据 fiber 创建真实 DOM
 */
function createDom(fiber) {
  const dom =
    fiber.type === TEXT_ELEMENT
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);
  return dom;
}

/**
 * 暴露给外部的 render 方法
 */
function render(element, container) {
  reconciler.createRoot(element, container);
}

const ReactDOM = {
  render,
};

// 将平台相关的实现注入到 Reconciler 中
reconciler.inject({
  createDom,
  updateDom
});

export default ReactDOM;