/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2023-02-22 09:11:35
 * @LastEditTime: 2024-10-09 00:24:40
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 */
import { moneyFormat } from 'iblive-base';
import { useSize } from 'ahooks';
import { PieChart } from 'echarts/charts';
import { LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { useEffect, useRef } from 'react';

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);

export default ({ height = '200px' }) => {
  const chartRef = useRef();
  const container = useRef();
  const containerSize = useSize(container);
  const option = {
    tooltip: {
      trigger: 'item',
      valueFormatter: (value) => moneyFormat({ num: value }) + '亿元',
    },
    series: [
      {
        name: '资产',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 0,
          borderWidth: 0,
        },
        color: ['#4081FF', '#7B81F1', '#B6CEFF', '#F0BE36'],
        label: {
          show: false,
          position: 'center',
        },
        // emphasis: {
        //   label: {
        //     show: true,
        //     fontSize: 40,
        //     fontWeight: 'bold'
        //   }
        // },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: '股票' },
          { value: 735, name: '债券' },
          { value: 580, name: '基金' },
          { value: 484, name: '其他' },
        ],
      },
    ],
  };
  useEffect(() => {
    const chart = echarts.init(container.current);
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
  }, [containerSize]);

  return <div style={{ width: '120px', height: '120px' }} ref={container} />;
};
