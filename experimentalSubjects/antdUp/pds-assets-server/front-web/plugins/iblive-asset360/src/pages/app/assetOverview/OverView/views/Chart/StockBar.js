import { useSize } from 'ahooks';
import { BarChart, LineChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { useEffect, useMemo, useRef } from 'react';
import { colorList as color } from '@asset360/utils/utils';

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  BarChart,
  CanvasRenderer,
  UniversalTransition,
  LineChart,
]);

const SecIncomeChart = ({ stockData }) => {
  const wrapperRef = useRef();
  const chartRef = useRef();
  const wrapperSize = useSize(wrapperRef);
  const chartLength = useMemo(() => {
    return stockData?.[0]?.fundInvestTypeStat?.length || 7;
  }, [stockData]);
  useEffect(() => {
    if (chartRef.current && stockData) {
      const option = {
        legend: {},
        color,
        grid: {
          bottom: 20,
          right: 0,
          left: 70,
        },
        tooltip: {
          trigger: 'axis',
        },
        yAxis: [
          {
            type: 'value',
            name: '万元',
            nameLocation: 'end',
          },
        ],
        xAxis: [
          {
            type: 'category',
            data: stockData.map((item) => item.date) || [],
          },
        ],
        series: [
          {
            type: 'line',
            name: '总资产规模',
            color: 'blue',
            label: {
              show: false,
              formatter: '{c}',
              position: 'inside',
            },
            data:
              stockData.map((item) => {
                return ((item.totalAmount || 0) / 10000).toFixed(2);
              }) || [],
          },
        ].concat(
          new Array(chartLength).fill(0).map((_, i) => ({
            type: 'bar',
            stack: 'Ad',
            name: stockData[0]?.fundInvestTypeStat?.[i]?.name,
            data:
              stockData.map((item) => {
                return (
                  (item.fundInvestTypeStat?.[i]?.totalAmount || 0) / 10000
                ).toFixed(2);
              }) || [],
          })),
        ),
      };
      chartRef.current?.setOption(option);
    }
  }, [stockData]);

  useEffect(() => {
    const chart = echarts.init(wrapperRef.current);
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
  return (
    <div style={{ marginTop: -8 }}>
      <div className="important-title">资产规模趋势</div>
      <div
        style={{
          width: '100%',
          height: 240,
          display: 'inline-block',
        }}
        ref={wrapperRef}
      />
    </div>
  );
};

export default SecIncomeChart;
