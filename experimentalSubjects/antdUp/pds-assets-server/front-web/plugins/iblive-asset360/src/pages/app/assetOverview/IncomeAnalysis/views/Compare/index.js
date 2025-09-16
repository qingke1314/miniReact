import FinancialPKBar from './Item';
import { executeApi } from '@asset360/apis/appCommon';
import { useEffect, useState } from 'react';
import { selectType } from '../../const';
import { moneyFormat } from 'iblive-base';
import DetailIcon from '@asset360/components/DetailIcon';

const Compare = ({
  productCode,
  activeDateRange,
  activeSelect,
  moreValues,
}) => {
  const [data, setData] = useState({});
  useEffect(() => {
    if (!productCode || !activeDateRange?.length) return;
    executeApi({
      serviceId: 'DD_API_FUND_STOCK_ASSET_INCOME_STAT',
      data: {
        calendarType: selectType.get(),
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
      setData(res?.data || {});
    });
  }, [
    activeDateRange,
    productCode,
    activeSelect?.astUnitId,
    activeSelect?.combiCode,
    moreValues,
  ]);
  const {
    totalProfit,
    totalLoss,
    profitDays,
    lossDays,
    singleMaxProfit,
    singleMaxLoss,
    singleMaxProfitSec,
    singleMaxLossSec,
    maxDayProfit,
    maxDayLoss,
    maxDayProfitDate,
    maxDayLossDate,
  } = data;
  return (
    <div>
      <div className="important-title">
        盈亏统计
        <DetailIcon marginLeft={2} marginRight={2} type="incomeCompare" />
      </div>
      <FinancialPKBar
        data={{
          profitLabel: '总盈利',
          lossLabel: '总亏损',
          profitDaysLabel: '盈利天数',
          lossDaysLabel: '亏损天数',
          profitValue: moneyFormat({ num: totalProfit || 0 }),
          lossValue: moneyFormat({ num: totalLoss || 0 }),
          profitDays: profitDays || 0,
          lossDays: lossDays || 0,
          profitRatio:
            ((totalProfit || 0) / (totalProfit + Math.abs(totalLoss))) * 100 +
            '%',
          lossRatio:
            ((totalLoss || 0) / (totalProfit + Math.abs(totalLoss))) * 100 +
            '%',
        }}
      />
      <FinancialPKBar
        data={{
          profitLabel: '最大单笔盈利',
          lossLabel: '最大单笔亏损',
          profitDaysLabel: singleMaxProfitSec,
          lossDaysLabel: singleMaxLossSec,
          profitValue: moneyFormat({ num: singleMaxProfit || 0 }),
          lossValue: moneyFormat({ num: singleMaxLoss || 0 }),
          profitDays: '',
          lossDays: '',
          profitRatio:
            ((singleMaxProfit || 0) /
              (singleMaxProfit + Math.abs(singleMaxLoss))) *
              100 +
            '%',
          lossRatio:
            ((singleMaxLoss || 0) /
              (singleMaxProfit + Math.abs(singleMaxLoss))) *
              100 +
            '%',
        }}
      />
      <FinancialPKBar
        data={{
          profitLabel: '最大日盈利',
          lossLabel: '最大日亏损',
          profitDaysLabel: maxDayProfitDate,
          lossDaysLabel: maxDayLossDate,
          profitDays: '',
          lossDays: '',
          profitValue: moneyFormat({ num: maxDayProfit || 0 }),
          lossValue: moneyFormat({ num: maxDayLoss || 0 }),
          profitRatio:
            ((maxDayProfit || 0) / (maxDayProfit + Math.abs(maxDayLoss))) *
              100 +
            '%',
          lossRatio:
            ((maxDayLoss || 0) / (maxDayProfit + Math.abs(maxDayLoss))) * 100 +
            '%',
        }}
      />
    </div>
  );
};

export default Compare;
