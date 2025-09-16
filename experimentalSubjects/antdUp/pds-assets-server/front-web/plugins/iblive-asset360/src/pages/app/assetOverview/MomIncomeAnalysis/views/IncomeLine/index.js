import { executeApi } from '@asset360/apis/appCommon';
import { useSize } from 'ahooks';
import { Spin } from 'antd';
import { BarChart, LineChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { moneyFormat } from 'iblive-base';
import moment from 'moment';
import { memo, useEffect, useRef, useState } from 'react';
// import IncomeAnalysisEcharts from './IncomeAnalysisEcharts';
import DetailIcon from '@asset360/components/DetailIcon';
echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

const EarningsChart = ({ productCode, activeDateRange, activeSelect }) => {
  const wrapperRef = useRef();
  const wrapperSize = useSize(wrapperRef);
  const chartRef = useRef();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState([]);
  useEffect(() => {
    if (!productCode || !activeDateRange?.length) return;
    setLoading(true);
    executeApi({
      serviceId: 'DD_API_FUND_STOCK_TURNOVER_RATE',
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
        setInfo(
          (res?.records || []).map((e) => {
            return {
              name: e.name,
              data: (e.dataList || []).map((o) =>
                moneyFormat({
                  num: o?.turnoverRate || 0,
                  decimal: 4,
                }),
              ),
              time: (e.dataList || []).map((o) =>
                moment(String(o?.businDate)).format('YYYY/MM/DD'),
              ),
            };
          }),
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeDateRange, productCode, activeSelect?.astUnitId]);

  useEffect(() => {
    const chart = echarts.init(wrapperRef.current);
    const option = {
      xAxis: [
        {
          type: 'category',
          axisPointer: {
            type: 'shadow',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
    };
    chart.setOption(option);
    chartRef.current = chart;
    return () => {
      chartRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resize();
    }
  }, [wrapperSize]);
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.setOption(
        {
          grid: {
            top: '30px',
            right: '30px',
            bottom: '50px',
            left: '90px',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999',
              },
            },
          },
          legend: {
            bottom: 0,
            type: 'scroll',
          },
          xAxis: [
            {
              type: 'category',
              axisPointer: {
                type: 'shadow',
              },
              data: info?.[0]?.time || [],
            },
          ],
          yAxis: [
            {
              type: 'value',
            },
          ],
          series: [
            ...info.map((e) => ({
              name: e.name,
              type: 'line',
              showSymbol: false,
              lineStyle: {
                width: 1, // 增加线条宽度
              },
              tooltip: {
                valueFormatter: function (value) {
                  return moneyFormat({ num: value * 100, unit: '%' });
                },
              },
              data: e?.data || [],
            })),
          ],
        },
        true,
      );
    }
  }, [info]);

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: 'var(--background-color)',
        padding: '0 0 0 8px',
        marginBottom: 8,
        borderRadius: 4,
      }}
    >
      <div className="important-title">
        产品换手率
        <DetailIcon marginLeft={2} marginRight={2} type="momTurnoverRate" />
      </div>
      <div style={{ display: 'none' }}>{info?.formual || ''}</div>
      <Spin active spinning={loading}>
        <div
          style={{
            width: '100%',
            height: 240,
            display: 'inline-block',
          }}
          ref={wrapperRef}
        />
      </Spin>
    </div>
  );
};

export default memo(EarningsChart);
