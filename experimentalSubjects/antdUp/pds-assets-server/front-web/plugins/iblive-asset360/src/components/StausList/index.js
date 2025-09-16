import { Badge, Space } from 'antd-v5';
import { isNil } from 'lodash';
import styles from './index.less';

export const StatusItem = ({ checked, onChange, ...props }) => {
  return (
    <Badge
      className={
        checked
          ? `${styles.check_box} ${styles.check_box_selected}`
          : styles.check_box
      }
      onClick={() => onChange(!checked)}
      style={{ whiteSpace: 'nowrap' }}
      {...props}
    />
  );
};
const StatusGroup = ({ value, onChange, options = [], instCount }) => {
  return (
    <Space size={5} style={{ flexWrap: 'wrap' }}>
      <StatusItem
        color={'var(--text-color)'}
        text={'全部' + (!isNil(instCount?.total) ? ': ' + instCount.total : '')}
        checked={
          _.xor(
            value,
            options?.map((item) => item.value),
          ).length === 0
        }
        onChange={(val) => {
          if (val) onChange(options.map((item) => item.value));
          else onChange([]);
        }}
      />
      {options.map((item) => (
        <StatusItem
          key={item.value}
          color={item.color}
          text={`${item.label}${
            instCount ? ': ' + (instCount[item.value] ?? 0) : ''
          }`}
          checked={value?.findIndex((val) => val === item.value) !== -1}
          onChange={() => {
            onChange(_.xor(value, [item.value]));
          }}
        />
      ))}
    </Space>
  );
};

export default StatusGroup;
