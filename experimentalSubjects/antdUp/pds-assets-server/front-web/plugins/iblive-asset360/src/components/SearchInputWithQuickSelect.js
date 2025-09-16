/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-11-14 13:54:20
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-11-14 14:41:22
 * @Description:
 */
import { Dropdown, Input, Menu } from 'antd-v5';
import { forwardRef, useImperativeHandle } from 'react';

export default forwardRef(
  (
    {
      localStorageKey,
      filterValue,
      setFilterValue,
      onSearch,
      inputConfig = {},
    },
    ref,
  ) => {
    const getLocalStorageSearchRecords = () => {
      return JSON.parse(localStorage.getItem(localStorageKey) || '[]');
    };
    const setLocalStorageSearchRecord = (value) => {
      if (!value) return;
      // 记录近十条搜索历史
      let localHistory = getLocalStorageSearchRecords();
      localHistory.unshift(value);
      localHistory = Array.from(new Set(localHistory));
      if (localHistory.length > 10) {
        localHistory.pop();
      }
      localStorage.setItem(localStorageKey, JSON.stringify(localHistory));
    };

    const handleSearch = (value) => {
      setLocalStorageSearchRecord(value);
      setFilterValue && setFilterValue(value);
      onSearch && onSearch(value);
    };
    const searchValueRecords =
      getLocalStorageSearchRecords(localStorageKey) || [];

    useImperativeHandle(ref, () => ({
      setLocalStorageSearchRecord,
      getLocalStorageSearchRecords,
    }));
    return (
      <>
        <Dropdown
          trigger={['click']}
          overlay={
            <Menu>
              {searchValueRecords.map((item) => (
                <Menu.Item key={item} onClick={() => handleSearch(item)}>
                  {item}
                </Menu.Item>
              ))}
            </Menu>
          }
          overlayStyle={{
            display:
              searchValueRecords.length === 0 || filterValue
                ? 'none'
                : undefined,
          }}
        >
          <Input.Search
            onChange={(e) => {
              setFilterValue && setFilterValue(e.target.value);
            }}
            value={filterValue}
            allowClear={true}
            onSearch={handleSearch}
            {...inputConfig}
          />
        </Dropdown>
      </>
    );
  },
);
