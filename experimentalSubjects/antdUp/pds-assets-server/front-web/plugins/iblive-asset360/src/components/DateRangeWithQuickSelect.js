/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-11-13 15:07:32
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-12-27 15:23:26
 * @Description:
 */
import { DatePicker, Radio, Space } from 'antd-v5';
import moment from 'moment';
import { useEffect, useState } from 'react';

const initQuickOptions = [
  {
    value: '7_day',
    label: '近1周',
  },
  {
    value: '15_day',
    label: '近15天',
  },
  {
    value: '1_month',
    label: '近1月',
  },
  {
    value: '3_month',
    label: '近3月',
  },
];

export default ({
  quickOptions = initQuickOptions,
  extraRadioOptions,
  onDateRangeChange,
}) => {
  const [dateRange, setDateRange] = useState();
  const [quickRange, setQuickRange] = useState();
  const rangeChange = (dates) => {
    setDateRange(dates);
    onDateRangeChange && onDateRangeChange(dates);
  };
  const quickRangeChange = (value) => {
    setQuickRange(value);
    if (value === 'custom') {
      return;
    }
    // 特殊操作,直接把选项value传给外部的响应方法
    if ((extraRadioOptions || []).find((item) => item.value === value)) {
      onDateRangeChange(value);
      return;
    }
    const [num, unit] = value.split('_');
    const dateRange = [moment().subtract(num, unit), moment()];
    rangeChange(dateRange);
  };

  useEffect(() => {
    // 初始化默认选中快速选择的第一项
    quickRangeChange(quickOptions[0]?.value);
  }, []);

  return (
    <Space align="center">
      <Radio.Group
        value={quickRange}
        onChange={(e) => quickRangeChange(e.target.value)}
        buttonStyle="solid"
      >
        {[...(quickOptions || []), ...(extraRadioOptions || [])].map((item) => (
          <Radio.Button key={item.value} value={item.value}>
            {item.label}
          </Radio.Button>
        ))}
        <Radio.Button value="custom">自定义</Radio.Button>
      </Radio.Group>
      {quickRange === 'custom' && (
        <DatePicker.RangePicker value={dateRange} onChange={rangeChange} />
      )}
    </Space>
  );
};
