/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-11-26 14:59:26
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-14 18:53:12
 * @Description:
 */
import { findAllForTreeWithAuth } from '@asset360/apis/standardPosition';
import RecordSequenceSelector from '@asset360/components/RecordSequenceSelector';
import { Divider, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAstUnitId, setFundCode } from '../../store/standardPositionSlice';
import styles from './index.less';

const localStorageKey = 'position_fund_record';
const init_ast_unit = {
  objectCode: -1,
  objectName: '全部',
};
export default function ProductSelector({ initFundCode, initAstUnitId }) {
  const dispatch = useDispatch();
  const { fundCode, astUnitId } = useSelector(
    (state) => state.asset360StandardPosition,
  );
  const [fundList, setProductList] = useState();
  const [astUnitObj, setAstUnitObj] = useState();
  const assetUnitList = astUnitObj?.[fundCode] || [init_ast_unit];

  const getProductByAuth = async () => {
    const res = await findAllForTreeWithAuth();
    const obj = {};
    const list = (res?.records || []).map((item) => {
      obj[item.objectCode] = [init_ast_unit, ...(item.childrenObjects || [])];
      return {
        objectCode: item.objectCode,
        objectName: `${item.objectCode}-${item.objectName}`,
      };
    });
    setProductList(list);
    setAstUnitObj(obj);
  };

  useEffect(() => {
    getProductByAuth();
    dispatch(setAstUnitId(initAstUnitId ?? -1));
  }, []);
  return (
    <Space className={styles.pruduct_selector} align="center">
      产品：
      <RecordSequenceSelector
        initValue={initFundCode}
        localStorageKey={localStorageKey}
        rootOptiions={fundList}
        optionMainKey="objectCode"
        value={fundCode}
        placeholder="请选择产品"
        optionFilterProp="objectName"
        fieldNames={{
          value: 'objectCode',
          label: 'objectName',
        }}
        style={{ minWidth: 200 }}
        bordered={false}
        className={styles.pruduct}
        dropdownStyle={{ minWidth: 'fit-content' }}
        onChange={dispatch(setFundCode)}
        onSelect={() => dispatch(setAstUnitId(-1))}
      />
      <Divider type="vertical" className={styles.divider} />
      资产单元：
      <Select
        localStorageKey={localStorageKey}
        placeholder="请选择资产单元"
        value={astUnitId}
        onChange={(value) => dispatch(setAstUnitId(value))}
        fieldNames={{
          value: 'objectCode',
          label: 'objectName',
        }}
        options={assetUnitList}
        className={styles.astunit}
        dropdownStyle={{ minWidth: 'fit-content' }}
        bordered={false}
      />
    </Space>
  );
}
