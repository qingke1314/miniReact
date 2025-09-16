import ProductRecordHistorySelector from '@asset360/components/ProductRecordHistorySelector';
import { memo, useState } from 'react';
import styles from './index.less';
import { CustomSearchRecordHistorySelector } from 'iblive-base';

/**
 * todo: 联动资产单元列表
 */
const CustomHead = ({
  setFirst = false,
  productCode,
  setProductCode,
  initValue,
  assetData,
  onChangeFirst,
}) => {
  const [astUnitId, setAstUnitId] = useState('');
  return (
    <div className={styles.customHead}>
      <ProductRecordHistorySelector
        setFirst={setFirst}
        productCode={productCode}
        allowClear={false}
        initValue={initValue}
        setProductCode={(v) => {
          setProductCode(v);
        }}
      />
      <CustomSearchRecordHistorySelector
        value={astUnitId}
        onChange={(v) => {
          setAstUnitId(v);
          onChangeFirst(v);
        }}
        rootOptiions={assetData}
        optionMainKey="astUnitId"
        localStorageKey="income-analysis-astUnitId"
        selectConfig={{
          style: {
            minWidth: '160px',
          },
          fieldNames: {
            value: 'astUnitId',
            label: 'astUnitName',
          },
          bordered: false,
          placeholder: '选择资产单元',
          filterOption: (inputValue, option) =>
            (option.astUnitId || '').includes(inputValue) ||
            (option.astUnitName || '').includes(inputValue),
        }}
      />
    </div>
  );
};
export default memo(CustomHead);
