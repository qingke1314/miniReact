import { Select } from 'antd-v5';
import { dayAry } from '../const';

export default ({ value, onChange, disabled }) => {
  return (
    <>
      <Select
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{ width: '100px' }}
        onClick={(e) => e.preventDefault()}
      >
        {dayAry.map((item, index) => (
          <Select.Option key={item} value={index + 1}>
            星期{item}
          </Select.Option>
        ))}
      </Select>
    </>
  );
};
