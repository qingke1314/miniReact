/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-10-28 16:39:12
 * @LastEditors: chenzongjun chenzongjun@apexsoft.com.cn
 * @LastEditTime: 2024-11-04 14:15:19
 * @Description:
 */
import { moneyFormat } from 'iblive-base';
import { Space } from 'antd-v5';
import styles from '../index.less';

export default ({
  title,
  currentValue,
  quarterRadio,
  monthRadio,
  yearRadio,
}) => {
  return (
    <div className={styles.statistical_information}>
      <span className="default-text">{title}</span>
      <Space className="large-important-text">
        {moneyFormat({ num: currentValue })}
        <span className="default-text">亿</span>
      </Space>
      <Space size={16} className="small-text">
        <Space>
          本月
          {moneyFormat({
            num: monthRadio * 100,
            unit: '%',
            needColor: true,
            sign: monthRadio > 0 ? '+' : '',
          })}
        </Space>
        <Space>
          本季度
          {moneyFormat({
            num: quarterRadio * 100,
            unit: '%',
            needColor: true,
            sign: quarterRadio > 0 ? '+' : '',
          })}
        </Space>
        <Space>
          本年
          {moneyFormat({
            num: yearRadio * 100,
            unit: '%',
            needColor: true,
            sign: yearRadio > 0 ? '+' : '',
          })}
        </Space>
      </Space>
    </div>
  );
};
