/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-11-11 16:14:32
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-11-12 09:17:23
 * @Description:
 */
import { Steps } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';

function hasVerticalScrollbar(element) {
  return element.scrollHeight > element.clientHeight;
}

const CustomAnchor = ({
  items = [], // [{id: 和外部对应，title: xxx}] 位置排序需要和对应dom元素排序一致,且id不能重复
  targetOffset = 10, // child内容较矮,需要一个比最小偏移量保证anchor显示和跳转正常
  size = 'defaule', // small title纵向显示，default title横向显示
  getContainer, // 指定滚动的容器 containerRef，和锚点组件要同时出现和卸载
}) => {
  const [currentAnchorIndex, setCurrentAnchorIndex] = useState(0);

  const handleClick = (domId, index) => {
    const parentElement = getContainer();
    // 不存在纵向滚动轴不做变化
    if (!hasVerticalScrollbar(parentElement)) return;
    const anchorElement = document.querySelector(`#${domId}`);
    if (!anchorElement) return;
    anchorElement.scrollIntoView();
    setTimeout(() => {
      // 识别位置可能会因为尺寸问题导致不是指定的,特殊情况直接设置
      setCurrentAnchorIndex(index);
    }, 10);
  };

  const getCurrentAnchor = () => {
    const parentElement = getContainer();
    if (!hasVerticalScrollbar(parentElement)) return;

    const parentHeight = parentElement.offsetHeight;
    const parentTop = parentElement.offsetTop;
    const scrollPosition = parentElement.scrollTop;
    const maxScrollTop = parentElement.scrollHeight - parentHeight;

    let index = 0;

    // 如果滚动到底部，直接设置为最后一个
    if (scrollPosition >= maxScrollTop - 10) {
      index = items.length - 1;
    } else {
      for (let i = 0; i < items.length; i++) {
        const childId = items[i].id;
        const childElement = document.getElementById(childId);
        if (!childElement) continue;

        const childTop = childElement.offsetTop;
        const childHeight = childElement.offsetHeight;

        if (
          scrollPosition >= targetOffset &&
          scrollPosition + parentHeight >=
            childTop - parentTop + 0.5 * childHeight + targetOffset
        ) {
          index = i;
        }
        // 移除break，让所有元素都能被检测
      }
    }

    setCurrentAnchorIndex(index);
  };

  useEffect(() => {
    const container = getContainer();
    if (container) {
      container.addEventListener('scroll', getCurrentAnchor);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', getCurrentAnchor);
      }
    };
  }, []);

  useEffect(() => {
    getCurrentAnchor(); // 设置初始化anchor位置
  }, [items]);
  return (
    <>
      <Steps
        className={`${styles.anchor_steps} ${
          size === 'small' ? styles.anchor_steps_small : ''
        }`}
        progressDot
        direction="vertical"
        size="small"
        current={currentAnchorIndex}
      >
        {items.map((item, index) => (
          <Steps.Step
            className={`${styles.anchor_steps_item} ${
              size === 'small' ? styles.anchor_steps_item_vertical : ''
            }`}
            title={item.title}
            key={item.id}
            onClick={() => handleClick(item.id, index)}
          />
        ))}
      </Steps>
    </>
  );
};

export default CustomAnchor;
