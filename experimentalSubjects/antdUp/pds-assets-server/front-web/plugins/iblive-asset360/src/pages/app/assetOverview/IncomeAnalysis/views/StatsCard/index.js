import styles from './index.less'; // 引入样式文件

/**
 * StatsCard 组件
 * @param {object} props
 * @param {string} props.title - 卡片大标题 (例如: "最大涨幅")
 * @param {'profit' | 'loss'} props.type - 类型，决定数值的正负号和颜色
 * @param {number} props.mainValue - 主要数值 (百分比)=
 * @param {string} props.daysTitle - 天数标题 (例如: "增长天数")
 * @param {number} props.days - 天数值
 * @param {string} props.dateRange - 日期范围字符串
 */
const StatsCard = ({ title, type, mainValue, daysTitle, days, dateRange }) => {
  // 根据类型确定颜色和背景色
  const isProfit = type === 'profit';
  const mainColor = isProfit ? '#d9534f' : '#428bca'; // 红涨蓝跌
  const backgroundColor = isProfit ? '#fef6f6' : '#f6f9fe';

  // 格式化数值，自动添加正负号和百分号
  const formatMainValue = (value) => {
    const sign = isProfit ? '+' : '';
    return `${sign}${value?.toFixed(2)}%`;
  };

  return (
    <div
      className={styles['stats-card']}
      style={{
        marginTop: 20,
        backgroundColor,
        color: isProfit ? '#d9534f' : '#428bca',
      }}
    >
      {/* 上半部分 */}
      <div className={styles['stats-card-section']} style={{ width: '60%' }}>
        <p className={styles['title']}>{title}</p>
        <p className={styles['main-value']} style={{ color: mainColor }}>
          {formatMainValue(mainValue)}
        </p>
        {/*<p className={styles['secondary-value']}>*/}
        {/*  {formatSecondaryValue(secondaryValue)}*/}
        {/*</p>*/}
      </div>
      {/* 下半部分 */}
      <div className={styles['stats-card-section']} style={{ flex: 1 }}>
        <p className={styles['days-title']}>{daysTitle}</p>
        <p className={styles['days']}>{days}</p>
      </div>
      <p className={styles['date-range']}>{dateRange}</p>
    </div>
  );
};

export default StatsCard;
