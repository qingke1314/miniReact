/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2025-01-17 16:52:17
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-26 11:03:23
 * @Description:
 */
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';

export default function RecordSequenceSelector({
  localStorageKey,
  value,
  rootOptiions,
  optionMainKey = 'value', // option的唯一标识
  className,
  initValue,
  onChange,
  ...config
}) {
  const [options, setOptions] = useState();
  const getLocalStorageSearchRecords = () => {
    return JSON.parse(localStorage.getItem(localStorageKey) || '{}');
  };

  const setLocalStorageSearchRecord = (record = {}) => {
    localStorage.setItem(localStorageKey, JSON.stringify(record));
    sortOptions(record);
  };

  const sortOptions = (sortObj = {}) => {
    const options = [...(rootOptiions || [])];
    options.sort((a, b) => {
      const aIndex = sortObj[a[optionMainKey]] ?? Infinity;
      const bIndex = sortObj[b[optionMainKey]] ?? Infinity;
      return aIndex - bIndex;
    });
    setOptions(options);
  };

  const changeValue = (value) => {
    if (!value) return;
    const oldRecord = getLocalStorageSearchRecords();
    const oldIndex = oldRecord[value];
    const newRecord = Object.keys(oldRecord).reduce(
      (obj, key) => {
        if (key !== value) {
          if (oldIndex !== undefined && oldRecord[key] > oldIndex) {
            obj[key] = oldRecord[key];
          } else {
            obj[key] = oldRecord[key] + 1;
          }
        }
        return obj;
      },
      { [value]: 0 },
    );
    setLocalStorageSearchRecord(newRecord);
    if (onChange && value) {
      onChange(value);
    }
  };

  const initFun = () => {
    const record = getLocalStorageSearchRecords();
    const filteredEntries = Object.entries(record).sort(
      ([, valueA], [, valueB]) => valueA - valueB,
    );
    if (initValue) {
      changeValue(initValue);
    } else if (filteredEntries[0]?.[0] !== undefined && onChange) {
      onChange(filteredEntries[0]?.[0]);
    } else if (rootOptiions?.[0]) {
      changeValue(rootOptiions[0]?.[optionMainKey]);
    }
    sortOptions(record);
  };

  useEffect(() => {
    initFun();
  }, [rootOptiions]);

  const handleFilter = (inputValue, option) => {
    const searchValue = inputValue.toLowerCase();
    const itemLabel = String(option.label || '').toLowerCase();
    const itemValue = String(option.value || '').toLowerCase();
    return itemLabel.includes(searchValue) || itemValue.includes(searchValue);
  };

  return (
    <Select
      placeholder="请选择"
      className={`${styles.record_history_selector} ${className}`}
      allowClear
      showSearch
      filterOption={handleFilter}
      value={value}
      options={options}
      onChange={changeValue}
      {...config}
    />
  );
}
