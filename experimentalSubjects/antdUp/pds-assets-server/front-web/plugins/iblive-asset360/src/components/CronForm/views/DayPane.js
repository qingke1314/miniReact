import { InputNumber, Radio, Select, Space } from 'antd-v5';
import { useEffect, useState } from 'react';
import DaySelect from '../components/DaySelect';
import InputFormInterval from '../components/InputFormInterval';
import InputFromCycle from '../components/InputFromCycle';
import MultipleInput from '../components/MultipleInput';
import { dateAry, dayAry } from '../const';

const rangeReg = /^([0-9]|1?[0-2])-([0-9]|1?[0-2])$/;
const intervalReg = /^([0-9]|1?[0-2])\/([0-9]|1?[0-2])$/;
const detailReg = /^([0-9]|1?[0-2])(,([0-9]|1?[0-2]))*$/;
const dayRangeReg = /^[1-7]-[1-7]$/;
const dayDetailReg = /^[1-7](,[1-7])*$/;
const dayIntervalReg = /^[1-5]#[1-7]*$/;
const dayLastReg = /^[1-7]L$/;

export default ({ onChange, defaultCron, activeKey }) => {
  const [type, setType] = useState(0);
  const [dateRange, setDateRange] = useState([1, 1]);
  const [dayRange, setDayRange] = useState([1, 1]);
  const [dateIncrement, setDateIncrement] = useState([1, 1]);
  const [dayIncrement, setDayIncrement] = useState([1, 1]);
  const [dateSpecific, setDateSpecific] = useState([]);
  const [daySpecific, setDaySpecific] = useState([]);
  const [lastDay, setLastDay] = useState(1);

  const onRadioChange = (e) => {
    let value;
    setType(e.target.value);
    switch (e.target.value) {
      case 0:
        // 每次
        value = ['*', '?'];
        break;
      case 1:
        // 几号-几号
        value = [`${dateRange[0]}-${dateRange[1]}`, '?'];
        break;
      case 2:
        // 从星期几-星期几
        value = ['?', `${dayRange[0]}-${dayRange[1]}`];
        break;
      case 3:
        // 从几天开始几天一次
        value = [`${dateIncrement[0]}/${dateIncrement[1]}`, '?'];
        break;
      case 4:
        // 本月第几周，星期几执行
        value = ['?', `${dayIncrement[1]}#${dayIncrement[0]}`];
        break;
      case 5:
        // 指定星期几
        value = ['?', daySpecific.join(',') || '*'];
        break;
      case 6:
        // 指定几号
        value = [dateSpecific.join(',') || '*', '?'];
        break;
      case 7:
        // 本月最后一天
        value = ['L', '?'];
        break;
      case 8:
        // 本月最后一个工作日
        value = ['LW', '?'];
        break;
      case 9:
        // 本月最后一个星期几
        value = ['?', `${lastDay}L`];
        break;
      default:
        break;
    }
    if (onChange) onChange('date', value);
  };

  useEffect(() => {
    let value;
    switch (type) {
      case 0:
        // 每次
        value = ['*', '?'];
        break;
      case 1:
        // 几号-几号
        value = [`${dateRange[0]}-${dateRange[1]}`, '?'];
        break;
      case 2:
        // 从星期几-星期几
        value = ['?', `${dayRange[0]}-${dayRange[1]}`];
        break;
      case 3:
        // 从几天开始几天一次
        value = [`${dateIncrement[0]}/${dateIncrement[1]}`, '?'];
        break;
      case 4:
        // 本月第几周，星期几执行
        value = ['?', `${dayIncrement[1]}#${dayIncrement[0]}`];
        break;
      case 5:
        // 指定星期几
        value = ['?', daySpecific.join(',') || '*'];
        break;
      case 6:
        // 指定几号
        value = [dateSpecific.join(',') || '*', '?'];
        break;
      case 7:
        // 本月最后一天
        value = ['L', '?'];
        break;
      case 8:
        // 本月最后一个工作日
        value = ['LW', '?'];
        break;
      case 9:
        // 本月最后一个星期几
        value = ['?', `${lastDay}L`];
        break;
      default:
        break;
    }
    if (onChange) onChange('date', value);
  }, [
    dateRange,
    dayRange,
    dateIncrement,
    dayIncrement,
    dateSpecific,
    daySpecific,
    lastDay,
  ]);

  useEffect(() => {
    if (defaultCron.join(',') === '*,?') {
      // 每天
      setType(0);
    } else if (rangeReg.test(defaultCron[0]) && defaultCron[1] === '?') {
      // 范围
      setType(1);
      const range = defaultCron[0].split('-');
      setDateRange([parseInt(range[0], 10), parseInt(range[1], 10)]);
    } else if (defaultCron[0] === '?' && dayRangeReg.test(defaultCron[1])) {
      setType(2);
      const range = defaultCron[1].split('-');
      setDayRange([parseInt(range[0], 10), parseInt(range[1], 10)]);
    } else if (intervalReg.test(defaultCron[0]) && defaultCron[1] === '?') {
      setType(3);
      const range = defaultCron[0].split('/');
      setDateIncrement([parseInt(range[0], 10), parseInt(range[1], 10)]);
    } else if (defaultCron[0] === '?' && dayIntervalReg.test(defaultCron[1])) {
      setType(4);
      const range = defaultCron[1].split('#');
      setDayIncrement([parseInt(range[0], 10), parseInt(range[1], 10)]);
    } else if (defaultCron[0] === '?' && dayDetailReg.test(defaultCron[1])) {
      setType(5);
      setDaySpecific(
        defaultCron[1].split(',').map((item) => parseInt(item, 10)),
      );
    } else if (detailReg.test(defaultCron[0]) && defaultCron[1] === '?') {
      setType(6);
      setDateSpecific(
        defaultCron[0].split(',').map((item) => parseInt(item, 10)),
      );
    } else if (defaultCron[0] === 'L' && defaultCron[1] === '?') {
      setType(7);
    } else if (defaultCron[0] === 'LW' && defaultCron[1] === '?') {
      setType(8);
    } else if (defaultCron[0] === '?' && dayLastReg.test(defaultCron[1])) {
      setType(9);
      setLastDay(parseInt(defaultCron[1][0], 10));
    } else {
      setType(undefined);
    }
  }, [defaultCron]);

  return (
    <Radio.Group value={type} onChange={onRadioChange}>
      <Space direction="vertical" size="middle">
        <Radio value={0}>每一天</Radio>
        <Radio value={1}>
          <InputFromCycle
            unit="天"
            min={1}
            max={31}
            disabled={type !== 1}
            value={dateRange}
            onChange={setDateRange}
          />
        </Radio>
        <Radio value={2}>
          <Space>
            从
            <DaySelect
              value={dayRange[0]}
              onChange={(val) => setDayRange([val, dayRange[1]])}
              disabled={type !== 2}
            />
            -
            <DaySelect
              value={dayRange[1]}
              onChange={(val) => setDayRange([dayRange[0], val])}
              disabled={type !== 2}
            />
          </Space>
        </Radio>
        <Radio value={3}>
          <InputFormInterval
            unit="天"
            min={1}
            max={31}
            disabled={type !== 3}
            value={dateIncrement}
            onChange={setDateIncrement}
          />
        </Radio>
        <Radio value={4}>
          <Space>
            本月第
            <InputNumber
              min={1}
              max={5}
              value={dayIncrement[0]}
              onChange={(val) => setDayIncrement([val, dayIncrement[1]])}
              disabled={type !== 4}
            />
            周，
            <DaySelect
              value={dayIncrement[1]}
              onChange={(val) => setDayIncrement([dayIncrement[0], val])}
              disabled={type !== 4}
            />
            执行一次
          </Space>
        </Radio>
        <div>
          <Radio value={5}>
            <label>具体星期几（可多选）</label>
          </Radio>
          <Select
            showSearch
            mode="multiple"
            allowClear
            disabled={type !== 5}
            value={daySpecific}
            onChange={setDaySpecific}
            style={{ width: '200px', marginLeft: -16 }}
          >
            {dayAry.map((item, index) => (
              <Select.Option key={item} value={index + 1}>
                星期{item}
              </Select.Option>
            ))}
          </Select>
        </div>

        <Radio value={6}>
          <MultipleInput
            options={dateAry}
            disabled={type !== 6}
            value={dateSpecific}
            onChange={setDateSpecific}
            label="具体天数（可多选）"
          />
        </Radio>
        <Radio value={7}>
          <Space>本月最后一天</Space>
        </Radio>
        <Radio value={8}>
          <Space>本月最后一个工作日</Space>
        </Radio>
        <Radio value={9}>
          <Space>
            本月最后一个
            <DaySelect
              value={lastDay}
              onChange={setLastDay}
              disabled={type !== 9}
            />
          </Space>
        </Radio>
      </Space>
    </Radio.Group>
  );
};
