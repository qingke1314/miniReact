// FinancialPKBar.jsx
import React from 'react';
import styles from './index.less'; // 引入样式文件

// 定义组件接收的数据结构，方便类型提示和理解
const mockData = {
  profitLabel: '总盈利',
  lossLabel: '总亏损',
  profitDaysLabel: '盈利天数',
  lossDaysLabel: '亏损天数',
  profitValue: 389284.8,
  lossValue: -379372.5, // 注意是负数
  profitDays: 103,
  lossDays: 98,
  profitRatio: 5,
  lossRatio: 5,
};

const FinancialPKBar = ({ data = mockData }) => {
  const {
    profitLabel = '总盈利',
    lossLabel = '总亏损',
    profitDaysLabel = '盈利天数',
    lossDaysLabel = '亏损天数',
    profitValue,
    lossValue,
    profitDays,
    lossDays,
    profitRatio,
    lossRatio,
  } = data;

  // 计算进度条的百分比
  const totalRatio = profitRatio + lossRatio;
  // 防止 totalRatio 为 0
  const profitPercent = totalRatio > 0 ? (profitRatio / totalRatio) * 100 : 50;
  const lossPercent = totalRatio > 0 ? (lossRatio / totalRatio) * 100 : 50;

  return (
    <div className={styles['financial-pk-bar']}>
      {/* 顶部信息 */}
      <div className={styles['pk-bar-top']}>
        <div className={styles['pk-bar-info']}>
          <span className={styles['title']}>{profitLabel}</span>
          <div className={styles['pk-bar-value'] + ' ' + styles['profit-text']}>
            {profitValue}
          </div>
        </div>
        {/* <div className={styles['pk-bar-ratio']}>
          <span className={styles['ratio-profit']}>{profitRatio}</span>
          <span className={styles['ratio-colon']}>: </span>
          <span className={styles['ratio-loss']}>{lossRatio}</span>
        </div> */}
        <div className={styles['pk-bar-info']}>
          <span className={styles['right-title']}>{lossLabel}</span>
          <div className={styles['pk-bar-value'] + ' ' + styles['loss-text']}>
            {lossValue}
          </div>
        </div>
      </div>

      {/* 中间进度条 */}
      <div className={styles['pk-bar-progress-container']}>
        <div
          className={styles['pk-bar-progress'] + ' ' + styles['profit-side']}
          style={{ width: `${profitPercent}%` }}
        ></div>
        <div
          className={styles['pk-bar-progress'] + ' ' + styles['loss-side']}
          style={{ width: `${lossPercent}%` }}
        ></div>
      </div>

      {/* 底部金额 */}
      <div className={styles['pk-bar-bottom']}>
        <span
          className={styles['subtitle']}
        >{`${profitDaysLabel} ${profitDays}`}</span>
        <span
          className={styles['subtitle']}
        >{`${lossDaysLabel} ${lossDays}`}</span>
      </div>
    </div>
  );
};

export default FinancialPKBar;
