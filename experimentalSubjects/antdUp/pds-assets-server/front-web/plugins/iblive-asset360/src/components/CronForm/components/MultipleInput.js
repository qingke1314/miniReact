import { Select } from 'antd';

export default ({
  disabled,
  options = [],
  value,
  onChange,
  label = '指定（可多选）',
}) => {
  return (
    <>
      <label>{label}</label>
      <Select
        onClick={(e) => e.preventDefault()}
        style={{ width: '200px' }}
        showSearch
        mode="multiple"
        allowClear
        disabled={disabled}
        value={value}
        onChange={(val) => onChange && onChange(val)}
      >
        {options.map((value) => (
          <Select.Option key={value} value={value}>
            {value}
          </Select.Option>
        ))}
      </Select>
    </>
  );
};
