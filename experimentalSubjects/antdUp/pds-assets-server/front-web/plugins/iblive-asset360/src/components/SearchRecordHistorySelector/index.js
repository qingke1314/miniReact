/*
 * @Author: wenyiqian
 * @Date: 2025-01-21 14:01:57
 * @LastEditors: wenyiqian
 * @LastEditTime: 2025-01-21 14:01:57
 * @Description: desc
 */
import { Select } from 'antd-v5';
import { debounce } from 'lodash';
import { forwardRef, useImperativeHandle, useState } from 'react';
import styles from './index.less';

export default forwardRef(
  (
    {
      localStorageKey,
      value,
      rootOptiions,
      optionMainKey = 'value', // option的唯一标识
      selectConfig = {},
      onChangeValue,
      onSearch,
    },
    ref,
  ) => {
    const { className, ...config } = selectConfig;
    const [searchValue, setSearchValue] = useState(); // 搜索内容

    const getLocalStorageSearchRecords = () => {
      return JSON.parse(localStorage.getItem(localStorageKey) || '[]');
    };

    const setLocalStorageSearchRecord = (option) => {
      if (!option) return;
      const localHistory = getLocalStorageSearchRecords();
      const existingIndex = localHistory.findIndex(
        (item) => item[optionMainKey] === option[optionMainKey],
      );
      if (existingIndex !== -1) {
        localHistory.unshift(localHistory.splice(existingIndex, 1)[0]);
      } else {
        // 将新项放在数组最前
        localHistory.unshift(option);
      }
      if (localHistory?.length > 10) {
        // 只记最近10项
        localHistory.pop();
      }
      localStorage.setItem(localStorageKey, JSON.stringify(localHistory));
    };

    const options = searchValue ? rootOptiions : getLocalStorageSearchRecords();

    const changeValue = (value, option) => {
      setSearchValue();
      setLocalStorageSearchRecord(option);
      onChangeValue && onChangeValue(value, option);
    };

    const handleSearch = (value) => {
      setSearchValue(value);
      onSearch && onSearch(value);
    };

    useImperativeHandle(ref, () => ({
      setLocalStorageSearchRecord,
      getLocalStorageSearchRecords,
    }));

    return (
      <Select
        placeholder="请选择"
        className={`${styles.record_history_selector} ${className}`}
        allowClear
        {...config}
        showSearch
        value={value}
        options={options}
        onBlur={() => setSearchValue()}
        onSearch={debounce(handleSearch, 100)}
        onChange={changeValue}
      />
    );
  },
);
