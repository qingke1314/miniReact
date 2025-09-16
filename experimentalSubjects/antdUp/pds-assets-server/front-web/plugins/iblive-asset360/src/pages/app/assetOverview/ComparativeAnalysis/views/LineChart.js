/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-10-10 09:06:19
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-11-21 14:11:05
 * @Description:
 */
import { useSize } from 'ahooks';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import moment from 'moment';
import { useEffect, useRef } from 'react';

echarts.use([
  TooltipComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
  LegendComponent,
]);

const color = [
  '#00AEFF',
  '#4ED2B9',
  '#FBBF47',
  '#8B85ED',
  '#33A0DC',
  '#76D7C0',
  '#F89B39',
  '#665FD1',
  '#B3E5D5',
  '#FFCC66',
];

export default ({ data, productList, formatY }) => {
  const wrapperRef = useRef();
  const wrapperSize = useSize(wrapperRef);
  const chartRef = useRef();
  const option = {
    grid: {
      right: '3%',
      left: '80px',
    },
    legend: {
      bottom: 0,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      valueFormatter: (value) => (formatY ? formatY(value) : value),
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value) => (formatY ? formatY(value) : value),
      },
    },
  };

  useEffect(() => {
    const chart = echarts.init(wrapperRef.current);
    chart.setOption(option);
    chartRef.current = chart;
    return () => {
      chartRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.setOption({
        xAxis: {
          type: 'category',
          data: (data || []).map((item) =>
            moment(item.date, 'YYYY/MM/DD').format('YYYY-MM-DD'),
          ),
        },
        series: (productList || []).map((item, index) => {
          const { fundName, fundCode } = item;
          return {
            showSymbol: false,
            name: fundName,
            data: (data || []).map((item) => item[fundCode]),
            type: 'line',
            color: color[index],
            showBackground: true,
          };
        }),
      });
    }
  }, [data]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resize();
    }
  }, [wrapperSize]);

  return <div style={{ width: '100%', height: 300 }} ref={wrapperRef} />;
};
