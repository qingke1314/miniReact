/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-10-10 09:06:19
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-10-29 10:08:52
 * @Description:
 */
import { useSize } from 'ahooks';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { moneyFormat } from 'iblive-base';
import { useEffect, useRef } from 'react';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
]);

export default ({ title, data }) => {
  const wrapperRef = useRef();
  const wrapperSize = useSize(wrapperRef);
  const chartRef = useRef();
  const option = {
    grid: {
      right: '3%',
      left: '80px',
      bottom: '10%',
    },
    title: {
      text: title,
      left: 'center',
      textStyle: {
        fontSize: 14,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      valueFormatter: (value) => moneyFormat({ num: value, unit: '%' }),
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      name: '占净值比（%）',
      type: 'value',
      axisLabel: {
        formatter: (value) => moneyFormat({ num: value, unit: '%' }),
      },
    },
  };

  useEffect(() => {
    if (chartRef.current) {
      const xData = (data || []).map((item) => item.date);
      const yData = (data || []).map((item) => (item.netAssetRatio || 0) * 100);
      chartRef.current.setOption({
        xAxis: {
          type: 'category',
          data: xData,
        },
        series: [
          {
            symbol: 'none',
            name: title,
            data: yData,
            type: 'line',
            color: '#186DF5',
            showBackground: true,
          },
        ],
      });
    }
  }, [data]);

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
      chartRef.current.resize();
    }
  }, [wrapperSize]);

  return <div style={{ width: '100%', height: 200 }} ref={wrapperRef} />;
};
