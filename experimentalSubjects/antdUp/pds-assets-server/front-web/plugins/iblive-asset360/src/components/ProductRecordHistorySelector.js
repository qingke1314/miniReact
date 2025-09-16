/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-11-13 10:02:04
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-14 11:07:09
 * @Description:
 */
import { executeApi } from '@asset360/apis/appCommon';
import RecordSequenceSelector from '@asset360/components/RecordSequenceSelector';
import moment from 'moment';
import { useEffect, useState } from 'react';
import styles from './index.less';

const INIT_LOCAL_STORAGE_KEY = 'app_product_record'; // 默认历史记录保存位置，多页面共享

export default function ProductRecordHistorySelector({
  localStorageKey = INIT_LOCAL_STORAGE_KEY,
  className,
  productCode,
  setProductCode,
  initValue,
  setFirst,
  ...config
}) {
  const [productList, setProductList] = useState(); // 全部产品列表

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
    if (setFirst) setProductCode(res?.records?.[0]?.fundCode);
  };

  useEffect(() => {
    getProductList();
  }, []);

  return (
    <>
      <RecordSequenceSelector
        placeholder="请选择产品"
        className={`${styles.product_select} ${className}`}
        bordered={false}
        showSearch
        allowClear
        rootOptiions={productList}
        localStorageKey={localStorageKey}
        value={productCode}
        initValue={initValue}
        onChange={setProductCode}
        {...config}
      />
    </>
  );
}
