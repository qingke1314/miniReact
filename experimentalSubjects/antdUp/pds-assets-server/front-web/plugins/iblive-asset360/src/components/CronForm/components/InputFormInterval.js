import { InputNumber } from 'antd';
import React from 'react';

function InputFromInterval({
  unit = '秒',
  min = 0,
  max = 59,
  disabled,
  value = [],
  onChange,
}) {
  const [from, interval] = value;
  const onChangeFrom = (v) => onChange && onChange([v, interval]);
  const onChangeInterval = (v) => onChange && onChange([from, v]);
  const inputNumberConfig = { min, max, style: { width: 100 } };

  return (
    <React.Fragment>
      从&nbsp;&nbsp;
      <InputNumber
        disabled={disabled}
        value={from}
        onChange={onChangeFrom}
        {...inputNumberConfig}
      />
      <span>&nbsp;&nbsp;{unit}开始，每&nbsp;&nbsp;</span>
      <InputNumber
        disabled={disabled}
        value={interval}
        onChange={onChangeInterval}
        {...inputNumberConfig}
      />
      <span>&nbsp;&nbsp;{unit}执行一次</span>
    </React.Fragment>
  );
}

export default InputFromInterval;
