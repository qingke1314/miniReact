import { executeApi } from '@asset360/apis/appCommon';
import { Col, Row } from 'antd-v5';
import { moneyFormat } from 'iblive-base';
import React, { useEffect, useState } from 'react';
import { selectType } from '../../const';
import styles from './index.module.less';

const mockData = [
  {
    label: '持有盈亏',
    value: '1000000',
    type: 'money',
    code: 'income',
  },
  {
    label: '差价收入',
    value: '1000000',
    type: 'money',
    code: 'gapIncome',
  },
  {
    label: '红利收益',
    value: '1000000',
    type: 'money',
    code: 'bonusIncome',
  },
  {
    label: '清仓收益',
    value: '1000000',
    type: 'money',
    code: 'clearIncome',
  },
  {
    label: '交易次数',
    value: 100,
    code: 'tradeNumb',
  },
  {
    label: '正收益次数',
    value: 46,
    code: 'positiveIncomeTradeNumb',
  },
  {
    label: '平均持仓天数',
    code: 'AvgHoldDays',
    value: 66,
  },
  {
    label: '盈利金额',
    value: 454214,
    type: 'profitAmount',
  },
  {
    label: '亏损金额',
    value: -65642,
    type: 'lossAmount',
  },
];
const OperateInfo = ({
  style,
  productCode,
  calendarValue,
  selectedStock,
  activeSelect,
  moreValues,
}) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!productCode || !selectedStock?.interCode || !calendarValue) return;
    const startDate = calendarValue.clone().startOf(selectType.get());
    const endDate = calendarValue.clone().endOf(selectType.get());
    executeApi({
      serviceId: 'DD_API_FUND_STOCK_OPERATION_ANALYSIS',
      data: {
        fundCode: productCode,
        startDate: startDate.format('YYYYMMDD'),
        endDate: endDate.format('YYYYMMDD'),
        astUnitId: activeSelect?.astUnitId
          ? Number(activeSelect?.astUnitId)
          : null,
        combiCode: activeSelect?.combiCode || null,
        interCode: selectedStock?.interCode,
        ...moreValues,
      },
    }).then((res) => {
      setData(
        mockData.map((e) => {
          return {
            ...e,
            value: res?.data?.[e.code] || 0,
          };
        }),
      );
    });
  }, [
    calendarValue,
    selectedStock,
    productCode,
    activeSelect?.astUnitId,
    activeSelect?.combiCode,
    moreValues,
  ]);
  return (
    <div style={style}>
      <div className="important-title">操作分析</div>
      {selectedStock && (
        <Row style={{ marginTop: 12 }} gutter={[12, 12]}>
          {data.map((item) => (
            <Col span={12} key={item.label}>
              <div className={styles.item}>
                <div className={styles.label}>{item.label}</div>
                <div className={styles.value}>
                  {item.type === 'money'
                    ? moneyFormat({
                        num: item.value,
                        decimal: 2,
                        needColor: true,
                      })
                    : item.value}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
      {!selectedStock && <div>请先选择股票</div>}
    </div>
  );
};

export default OperateInfo;
