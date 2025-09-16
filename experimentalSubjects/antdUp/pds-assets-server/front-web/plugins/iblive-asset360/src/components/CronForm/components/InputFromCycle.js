import { InputNumber, Space } from 'antd';
import React from 'react';

function InputFromCycle({
  unit = '秒',
  min = 0,
  max = 59,
  disabled,
  value = [],
  onChange,
}) {
  const [from, to] = value;
  const onChangeFrom = (v) => onChange && onChange([v, to]);
  const onChangeTo = (v) => onChange && onChange([from, v]);
  const inputNumberConfig = { min, max, style: { width: 100 } };

  return (
    <React.Fragment>
      <Space>
        从
        <InputNumber
          disabled={disabled}
          value={from}
          onChange={onChangeFrom}
          {...inputNumberConfig}
        />
        -
        <InputNumber
          disabled={disabled}
          value={to}
          onChange={onChangeTo}
          {...inputNumberConfig}
        />
        <span>
          {unit}，每{unit}执行一次
        </span>
      </Space>
    </React.Fragment>
  );
}

export default InputFromCycle;
