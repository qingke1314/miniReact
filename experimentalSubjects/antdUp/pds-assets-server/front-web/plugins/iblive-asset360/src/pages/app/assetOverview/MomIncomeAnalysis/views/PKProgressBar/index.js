// PKProgressBar.jsx
import { Progress } from 'antd';
import React from 'react';
import styles from './index.less'; // 引入新的CSS文件

const PKProgressBar = ({ leftValue, rightValue, height = '24px' }) => {
  // 防止总值为0导致除法错误
  const total = leftValue + rightValue === 0 ? 1 : leftValue + rightValue;
  const leftPercent = (leftValue / total) * 100;
  const rightPercent = (rightValue / total) * 100;

  return (
    // 父容器现在是定位的基准
    <div className={styles['pk-progress-bar-container']} style={{ height }}>
      {/* 左侧进度条 */}
      <div
        className={styles['pk-progress-bar'] + ' ' + styles['left-progress']}
        style={{ width: `${leftPercent}%` }}
      >
        <Progress
          percent={100} // 进度条始终充满其容器
          strokeColor={'var(--green-color)'}
          showInfo={false}
          trailColor="transparent"
        />
      </div>

      {/* 右侧进度条 */}
      <div
        className={styles['pk-progress-bar'] + ' ' + styles['right-progress']}
        style={{ width: `${rightPercent}%` }}
      >
        <Progress
          percent={100} // 进度条始终充满其容器
          strokeColor={'var(--red-color)'}
          showInfo={false}
          trailColor="transparent"
          strokeWidth={30}
        />
      </div>

      {/* 覆盖在最上层的标签层 */}
      {/* <div className={styles['pk-progress-labels']}>
        <span className={styles['label-left']}>{leftValue}</span>
        <span className={styles['label-right']}>{rightValue}</span>
      </div> */}
    </div>
  );
};

export default PKProgressBar;
