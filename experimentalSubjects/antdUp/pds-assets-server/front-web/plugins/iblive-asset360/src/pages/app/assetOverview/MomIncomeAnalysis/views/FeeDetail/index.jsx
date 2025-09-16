import { memo, useState, useEffect } from 'react';
import { executeApi } from '@asset360/apis/appCommon';
import styles from './index.module.less';
import Chart from './Chart.jsx';

const IncomeFlow = ({
  productCode,
  activeDateRange,
  activeSelect,
  moreValues,
  smallAssetData,
}) => {
  // const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    if (!productCode || !activeDateRange?.length) return;
    // setLoading(true);
    executeApi({
      serviceId: 'DD_API_FUND_TRADE_FEE_STAT',
      data: {
        fundCode: productCode,
        startDate: activeDateRange?.[0]?.format('YYYYMMDD'),
        endDate: activeDateRange?.[1]?.format('YYYYMMDD'),
        astUnitId: activeSelect?.astUnitId
          ? Number(activeSelect?.astUnitId)
          : null,
      },
    }).then((res) => {
      setTableData(
        (res?.records || []).map((e) => ({
          name: e.name,
          value: e.fee,
        })),
      );
    });
    // .finally(() => {
    //   setLoading(false);
    // });
  }, [
    activeDateRange,
    productCode,
    activeSelect?.astUnitId,
    activeSelect?.combiCode,
    moreValues,
  ]);
  return (
    <div className={styles.container}>
      <div className="important-title">费用详情</div>
      <div className={styles.flex}>
        {<Chart dataSource={tableData} smallAssetData={smallAssetData} />}
      </div>
    </div>
  );
};

export default memo(IncomeFlow);
