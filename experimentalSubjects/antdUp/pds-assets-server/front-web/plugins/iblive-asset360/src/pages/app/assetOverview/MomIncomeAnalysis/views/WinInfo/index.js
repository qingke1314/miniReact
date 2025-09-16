import { executeApi } from '@asset360/apis/appCommon';
import { CustomTableWithYScroll, moneyFormat } from 'iblive-base';
import React, { memo, useEffect, useState } from 'react';
import styles from './index.less';
import DetailIcon from '@asset360/components/DetailIcon';

const moneyRender = (text) => (
  <div style={{ height: 32, lineHeight: '32px' }}>
    {moneyFormat({
      num: (text || 0) / 10000,
      decimal: 2,
      needColor: true,
    })}
  </div>
);
const OperateInfo = ({ style, productCode, activeSelect }) => {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState();
  useEffect(() => {
    if (!productCode) return;
    setLoading(true);
    executeApi({
      serviceId: 'DD_API_FUND_STOCK_INCOME_STAGE',
      timeout: 60000,
      data: {
        fundCode: productCode,
        // 阶段收益已经确定时间维度了，顶部切换时间范围这边不用重刷
        // startDate: activeDateRange?.[0]?.format('YYYYMMDD'),
        // endDate: activeDateRange?.[1]?.format('YYYYMMDD'),
        astUnitId: activeSelect?.astUnitId
          ? Number(activeSelect?.astUnitId)
          : null,
        combiCode: activeSelect?.combiCode || null,
      },
    })
      .then((res) => {
        setInfo(res?.records || []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productCode, activeSelect?.astUnitId, activeSelect?.combiCode]);
  return (
    <div className={styles.container} style={style}>
      <div className="important-title">
        阶段收益(万元)
        <DetailIcon type="momOperate" />
      </div>
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
            title: '差价收入',
            dataIndex: 'tradeIncome',
            render: moneyRender,
            align: 'right',
          },
          {
            title: '利息收入',
            dataIndex: 'interestIncome',
            render: moneyRender,
            align: 'right',
          },
          {
            title: '红利收入',
            dataIndex: 'equityincome',
            render: moneyRender,
            align: 'right',
          },
          {
            title: '公允价变动',
            dataIndex: 'floatIncome',
            render: moneyRender,
            align: 'right',
          },
          {
            title: '已实现收益',
            dataIndex: 'cumulativeIncome',
            render: moneyRender,
            align: 'right',
          },
          // {
          //   title: '盈利',
          //   dataIndex: 'netIncome',
          //   render: moneyRender,
          //   align: 'right',
          // },
          // {
          //   title: '亏损',
          //   dataIndex: 'netLoss',
          //   render: moneyRender,
          //   align: 'right',
          // },
          {
            title: '总收益',
            dataIndex: 'income',
            render: moneyRender,
            align: 'right',
          },
        ]}
      />
    </div>
  );
};

export default memo(OperateInfo);
