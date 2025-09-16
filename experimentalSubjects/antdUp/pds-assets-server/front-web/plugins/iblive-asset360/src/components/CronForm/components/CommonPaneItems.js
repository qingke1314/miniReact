import { Radio, Space } from 'antd';
import { useEffect, useState } from 'react';
import InputFormInterval from './InputFormInterval';
import InputFromCycle from './InputFromCycle';
import MultipleInput from './MultipleInput';

// 秒、时、分、月共享
const timeRangeReg = /^([1-5]?[0-9])-([1-5]?[0-9])$/;
const monthRangeReg = /^([0-9]|1?[0-2])-([0-9]|1?[0-2])$/;
const timeIntervalReg = /^([1-5]?[0-9])\/([1-5]?[0-9])$/;
const monthIntervalReg = /^([0-9]|1?[0-2])\/([0-9]|1?[0-2])$/;
const timeDetailReg = /^([1-5]?[0-9])(,([1-5]?[0-9]))*$/;
const monthDetailReg = /^([0-9]|1?[0-2])(,([0-9]|1?[0-2]))*$/;

export default ({
  unit,
  min,
  max,
  multipleSelectLabel,
  options,
  onChange,
  canNone,
  // activeKey,
  defaultCron,
}) => {
  const [type, setType] = useState(0);
  const [range, setRange] = useState([min, min]);
  const [increment, setIncrement] = useState([min, min]);
  const [specific, setSpecific] = useState([]);
  const onRadioChange = (e) => {
    let value;
    setType(e.target.value);
    switch (e.target.value) {
      case 0:
        // 每次
        value = '*';
        break;
      case 1:
        // 间隔
        value = `${range[0]}-${range[1]}`;
        break;
      case 2:
        // 从xx开始，间隔
        value = `${increment[0]}/${increment[1]}`;
        break;
      case 3:
        // 指定
        value = specific.join(',') || '*';
        break;
      case 4:
        // 任意
        value = '?';
        break;
      default:
        break;
    }
    if (onChange) onChange(value);
  };

  // radio具体选项内容调整
  useEffect(() => {
    let value;
    switch (type) {
      case 0:
        // 每次
        value = '*';
        break;
      case 1:
        // 间隔
        value = `${range[0]}-${range[1]}`;
        break;
      case 2:
        // 从xx开始，间隔
        value = `${increment[0]}/${increment[1]}`;
        break;
      case 3:
        // 指定
        value = specific.join(',') || '*';
        break;
      case 4:
        // 任意
        value = '?';
        break;
      default:
        break;
    }
    if (onChange) onChange(value);
  }, [increment, specific, range]);

  useEffect(() => {
    if (defaultCron === '*') {
      // 每次
      setType(0);
    } else if (
      unit === '月'
        ? monthRangeReg.test(defaultCron)
        : timeRangeReg.test(defaultCron)
    ) {
      // 间隔
      setType(1);
      setRange([defaultCron.split('-')[0], defaultCron.split('-')[1]]);
    } else if (
      unit === '月'
        ? monthIntervalReg.test(defaultCron)
        : timeIntervalReg.test(defaultCron)
    ) {
      // 从xx开始，间隔
      setType(2);
      setIncrement([defaultCron.split('/')[0], defaultCron.split('/')[1]]);
    } else if (
      unit === '月'
        ? monthDetailReg.test(defaultCron)
        : timeDetailReg.test(defaultCron)
    ) {
      // 指定
      setType(3);
      setSpecific(defaultCron === '*' ? [] : defaultCron.split(','));
    } else {
      setType(undefined);
    }
  }, [defaultCron, unit]);

  return (
    <Radio.Group value={type} onChange={onRadioChange}>
      <Space direction="vertical" size="middle">
        <Radio value={0}>每一{unit}</Radio>
        <Radio value={1}>
          <InputFromCycle
            unit={unit}
            min={min}
            max={max}
            disabled={type !== 1}
            value={range}
            onChange={(e) => {
              setRange(e);
              if (onChange) onChange(e);
            }}
          />
        </Radio>
        <Radio value={2}>
          <InputFormInterval
            unit={unit}
            min={min}
            max={max}
            disabled={type !== 2}
            value={increment}
            onChange={(e) => {
              setIncrement(e);
              if (onChange) onChange(e);
            }}
          />
        </Radio>
        <Radio value={3}>
          <MultipleInput
            options={options}
            disabled={type !== 3}
            value={specific}
            onChange={(e) => {
              setSpecific(e);
              if (onChange) onChange(e);
            }}
            label={multipleSelectLabel}
          />
        </Radio>
        {canNone && <Radio value={4}>不指定</Radio>}
      </Space>
    </Radio.Group>
  );
};
