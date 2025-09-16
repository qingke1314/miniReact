import { Select } from 'antd-v5';
import styles from './index.less';
export default ({ options, text, ...config }) => {
  return (
    <Select
      options={options}
      className={styles.position_select}
      allowClear
      placeholder={text}
      {...config}
    />
  );
};
