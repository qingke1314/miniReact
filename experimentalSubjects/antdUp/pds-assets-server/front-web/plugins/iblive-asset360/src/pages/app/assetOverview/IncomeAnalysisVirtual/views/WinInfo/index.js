import { executeApi } from '@asset360/apis/appCommon';
import { CustomTableWithYScroll, moneyFormat } from 'iblive-base';
import React, { useEffect, useState } from 'react';
import styles from './index.less';

const moneyRender = (text) => (
  <div style={{ height: 32, lineHeight: '32px' }}>
    {moneyFormat({
      num: (text || 0) / 10000,
      decimal: 2,
      needColor: true,
    })}
  </div>
);
const OperateInfo = ({
  style,
  productCode,
  activeDateRange,
  activeSelect,
  moreValues,
}) => {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState();
  useEffect(() => {
    if (!productCode || !activeDateRange?.length) return;
    setLoading(true);
    executeApi({
      timeout: 60000,
      serviceId: 'DD_API_FUND_STOCK_INCOME_STAGE',
      data: {
        fundCode: productCode,
        startDate: activeDateRange?.[0]?.format('YYYYMMDD'),
        endDate: activeDateRange?.[1]?.format('YYYYMMDD'),
        astUnitId: activeSelect?.astUnitId
          ? Number(activeSelect?.astUnitId)
          : null,
        combiCode: activeSelect?.combiCode || null,
        ...moreValues,
      },
    })
      .then((res) => {
        setInfo(res?.records || []);
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
    <div className={styles.container} style={style}>
      <div className="important-title">阶段盈亏</div>
      <CustomTableWithYScroll
        loading={loading}
        style={{ marginTop: 12 }}
        dataSource={info}
        height={360}
        columns={[
          {
            title: '时间',
            dataIndex: 'dateItem',
          },
          {
            title: '盈利(万元)',
            dataIndex: 'netIncome',
            render: moneyRender,
            align: 'right',
          },
          {
            title: '亏损(万元)',
            dataIndex: 'netLoss',
            render: moneyRender,
            align: 'right',
          },
          {
            title: '总盈亏(万元)',
            dataIndex: 'income',
            render: moneyRender,
            align: 'right',
          },
        ]}
      />
    </div>
  );
};

export default OperateInfo;
