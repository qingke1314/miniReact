import { memo, useState, useEffect, useMemo } from 'react';
import { CustomTableWithYScroll } from 'iblive-base';
import { executeApi } from '@asset360/apis/appCommon';
import { columnWithAll, column } from './const';
import styles from './index.module.less';
import Stock from './Stock';

const IncomeFlow = ({
  productCode,
  activeDateRange,
  activeSelect = {},
  moreValues,
}) => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  /**
   * 根据是否选中全部资产单元展示不同面板
   */
  const isChooseAll = useMemo(() => {
    return !activeSelect.astUnitId;
  }, [activeSelect.astUnitId]);
  useEffect(() => {
    if (!productCode || !activeDateRange?.length) return;
    setLoading(true);
    executeApi({
      serviceId: isChooseAll
        ? 'DD_API_FUND_TASS_STAT'
        : 'DD_API_FUND_TASS_DETAIL',
      data: {
        fundCode: productCode,
        startDate: activeDateRange?.[0]?.format('YYYYMMDD'),
        endDate: activeDateRange?.[1]?.format('YYYYMMDD'),
        astUnitId: activeSelect?.astUnitId
          ? Number(activeSelect?.astUnitId)
          : null,
      },
    })
      .then((res) => {
        setTableData(isChooseAll ? res?.records : res?.data?.resultList || []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    activeDateRange,
    productCode,
    activeSelect?.astUnitId,
    activeSelect?.combiCode,
    moreValues,
  ]);
  return (
    <div style={{ width: '100%' }}>
      <div className="important-title">出入金</div>
      <div className={styles.flex}>
        <CustomTableWithYScroll
          loading={loading}
          style={{ marginTop: 12, width: isChooseAll ? '40%' : '100%' }}
          dataSource={tableData}
          height={360}
          columns={isChooseAll ? columnWithAll : column}
        />
        {isChooseAll && <Stock stockData={tableData} />}
      </div>
    </div>
  );
};

export default memo(IncomeFlow);
