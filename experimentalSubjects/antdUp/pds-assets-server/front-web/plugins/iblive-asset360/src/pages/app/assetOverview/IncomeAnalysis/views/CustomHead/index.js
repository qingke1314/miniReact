import ProductRecordHistorySelector from '@asset360/components/ProductRecordHistorySelector';
import { CustomSearchRecordHistorySelector } from 'iblive-base';
import { useMemo, useState } from 'react';
import styles from './index.less';

const CustomHead = ({
  setFirst = false,
  productCode,
  setProductCode,
  assetData = [],
  onChangeSecond,
  onChangeFirst,
  initValue,
}) => {
  const [astUnitId, setAstUnitId] = useState('');
  const [combiCode, setCombiCode] = useState('');
  const combinationList = useMemo(() => {
    return assetData.find((e) => e.astUnitId === astUnitId)?.combiList || [];
  }, [astUnitId, assetData]);
  return (
    <div className={styles.customHead}>
      <ProductRecordHistorySelector
        initValue={initValue}
        setFirst={setFirst}
        productCode={productCode}
        setProductCode={(v) => {
          setAstUnitId(undefined);
          setCombiCode(undefined);
          setProductCode(v);
        }}
      />
      <CustomSearchRecordHistorySelector
        value={astUnitId}
        onChange={(v) => {
          setCombiCode(undefined);
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
      <CustomSearchRecordHistorySelector
        value={combiCode}
        onChange={(v) => {
          setCombiCode(v);
          onChangeSecond(astUnitId, v);
        }}
        rootOptiions={combinationList}
        localStorageKey="income-analysis-combiCode"
        optionMainKey="combiCode"
        selectConfig={{
          style: {
            minWidth: '160px',
          },
          fieldNames: {
            value: 'combiCode',
            label: 'combiName',
          },
          bordered: false,
          placeholder: '选择资产组合',
          filterOption: (inputValue, option) =>
            (option.combiCode || '').includes(inputValue) ||
            (option.combiName || '').includes(inputValue),
        }}
      />
    </div>
  );
};
export default CustomHead;
