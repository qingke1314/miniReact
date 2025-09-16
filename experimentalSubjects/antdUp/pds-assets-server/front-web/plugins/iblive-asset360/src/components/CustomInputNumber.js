/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2025-01-15 14:13:44
 * @LastEditors: wenyiqian
 * @LastEditTime: 2025-03-11 09:48:59
 * @Description:
 */
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { InputNumber } from 'antd';
import { useState } from 'react';
import styles from './index.less';

const CustomInputNumber = ({
  controls = false,
  wrapperClassName,
  ...config
}) => {
  const [value, setValue] = useState(0);

  function floorToPrecision(value) {
    const precision = config?.step ?? 1;
    return Math.floor(value / precision) * precision;
  }
  const increment = () => {
    const newValue =
      floorToPrecision(config?.value ?? value) + (config?.step ?? 1);
    setValue(newValue);
    config?.onChange?.(newValue);
  };

  const decrement = () => {
    const newValue =
      floorToPrecision(config?.value ?? value) - (config?.step ?? 1);
    setValue(newValue);
    config?.onChange?.(newValue);
  };
  return (
    <div className={`${styles.custom_input_wrapper} ${wrapperClassName}`}>
      <InputNumber
        value={value}
        onChange={setValue}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={(value) => value.replace(/(,*)/g, '')}
        className={styles.custom_input_number}
        {...config}
        controls={false}
        {...(controls
          ? {
              addonBefore: <MinusOutlined onClick={decrement} />,
              addonAfter: <PlusOutlined onClick={increment} />,
            }
          : {})}
      />
      {controls &&
        config?.addonAfter &&
        (typeof config.addonAfter === 'string' ? (
          <span style={{ marginLeft: 10, marginRight: 2 }}>
            {config?.addonAfter}
          </span>
        ) : (
          config.addonAfter
        ))}
    </div>
  );
};

export default CustomInputNumber;
