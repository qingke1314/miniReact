/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-11-13 10:02:04
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2025-02-05 09:45:51
 * @Description:
 */
import { executeApi } from '@asset360/apis/appCommon';
import { Select } from 'antd';
import { debounce } from 'lodash';
import moment from 'moment';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './index.less';

const INIT_LOCAL_STORAGE_KEY = 'app_product_history'; // 默认历史记录保存位置，多页面共享

const Prod = (
  {
    localStorageKey = INIT_LOCAL_STORAGE_KEY,
    productCode,
    setProductCode,
    selectConfig = {},
  },
  ref,
) => {
  const { className, ...config } = selectConfig;
  const [searchValue, setSearchValue] = useState(); // 搜索内容
  const [productList, setProductList] = useState(); // 全部产品列表
  const dispatch = useDispatch();

  const getLocalStorageSearchRecords = () => {
    return JSON.parse(localStorage.getItem(localStorageKey) || '[]');
  };

  const setLocalStorageSearchRecord = (option) => {
    const productCode = option?.value;
    if (!productCode) return;
    const localHistory = getLocalStorageSearchRecords();
    const existingIndex = localHistory.findIndex(
      (item) => item.value === option.value,
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

  const productOptions = searchValue
    ? productList
    : getLocalStorageSearchRecords();

  const getProductList = async () => {
    const res = await executeApi({
      serviceId: 'DD_API_MUTUAL_FUND_INFO',
      data: {
        faFundType: null,
        businDate: moment().format('YYYYMMDD'),
      },
    });
    setProductList(
      (res?.records || []).map((item) => ({
        value: item.fundCode,
        label: `${item.fundCode}-${item.fundName}`,
      })),
    );
  };

  const changeProductCode = (option) => {
    setSearchValue();
    setLocalStorageSearchRecord(option);
    setProductCode && dispatch(setProductCode(option?.value));
  };

  useImperativeHandle(ref, () => ({
    setLocalStorageSearchRecord,
    getLocalStorageSearchRecords,
  }));

  useEffect(() => {
    getProductList();
  }, []);

  return (
    <Select
      placeholder="请选择产品"
      className={`${styles.product_select} ${className}`}
      bordered={false}
      showSearch
      allowClear
      {...config}
      optionFilterProp="label"
      value={productCode}
      options={productOptions}
      onBlur={() => setSearchValue()}
      onSearch={debounce((value) => setSearchValue(value), 100)}
      onChange={(value, option) => changeProductCode(option)}
    />
  );
};
export default forwardRef(Prod);
