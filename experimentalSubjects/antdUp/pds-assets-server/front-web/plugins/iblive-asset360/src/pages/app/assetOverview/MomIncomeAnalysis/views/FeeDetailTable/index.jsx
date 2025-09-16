import { memo, useState, useEffect, useMemo } from 'react';
import { CustomTableWithYScroll } from 'iblive-base';
import { executeApi } from '@asset360/apis/appCommon';
import { columnWithAll, column } from './const';
import styles from './index.module.less';

const IncomeFlow = ({
  productCode,
  activeDateRange,
  activeSelect,
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
        ? 'DD_API_FUND_CASH_FEE_STAT'
        : 'DD_API_FUND_CASH_FEE_DETAILS',
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
  if (isChooseAll) return null;
  return (
    <div className={styles.container}>
      <div className="important-title">费用详情</div>
      <CustomTableWithYScroll
        loading={loading}
        style={{ marginTop: 12 }}
        dataSource={tableData}
        height={360}
        columns={isChooseAll ? columnWithAll : column}
      />
    </div>
  );
};

export default memo(IncomeFlow);
