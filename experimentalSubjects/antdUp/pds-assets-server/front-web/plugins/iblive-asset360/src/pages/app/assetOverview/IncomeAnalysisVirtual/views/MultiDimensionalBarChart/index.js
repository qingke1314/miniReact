import { executeApi } from '@asset360/apis/appCommon';
import { Col, Row } from 'antd-v5';
import React, { useEffect, useState } from 'react';
import Panzhi from '../panzhi';
import SecIncomeChart from '../SecIncomeChart';
import StockBar from '../stockBar';

const MultiDimensionalBarChart = ({
  productCode,
  activeDateRange,
  activeSelect,
  moreValues,
}) => {
  const [info, setInfo] = useState({});
  useEffect(() => {
    if (!productCode || !activeDateRange?.length) return;
    executeApi({
      serviceId: 'DD_API_FUND_STOCK_INCOME_CLASSIFYING_STAT',
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
    }).then((res) => {
      setInfo(res?.data || {});
    });
  }, [
    activeDateRange,
    productCode,
    activeSelect?.astUnitId,
    activeSelect?.combiCode,
    moreValues,
  ]);
  return (
    <Row style={{ width: '100%' }} gutter={[12, 12]}>
      <Col span={8}>
        <SecIncomeChart sector={info?.sector || []} />
      </Col>
      <Col
        style={{
          borderLeft: '1px solid var(--border-color-base)',
          borderRight: '1px solid var(--border-color-base)',
        }}
        span={8}
      >
        <StockBar stockData={info?.stock || []} />
      </Col>
      <Col span={8}>
        <Panzhi info={info} />
      </Col>
    </Row>
  );
};

export default MultiDimensionalBarChart;
