/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-12-30 09:55:26
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-12-30 15:12:49
 * @Description:
 */
import { moneyFormat,generateColor } from 'iblive-base';
import { useSize } from 'ahooks';
import { PieChart } from 'echarts/charts';
import { LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { useEffect, useRef } from 'react';
import styles from '../index.less';

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);

export default ({ data }) => {
  const containerRef = useRef();
  const containerSize = useSize(containerRef);
  const chartRef = useRef();

  useEffect(() => {
    const dom = containerRef.current;
    const chart = echarts.init(dom);
    chart.setOption({
      color: generateColor(30),
      tooltip: {
        trigger: 'item',
        valueFormatter: (value) =>
          moneyFormat({
            num: value * 100,
            unit: '%',
          }),
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      label: {
        formatter: (param) => {
          return `${param.name}：${moneyFormat({
            num: param.percent,
            unit: '%',
          })}`;
        },
      },
    });
    chartRef.current = chart;
    return () => {
      chartRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.setOption({
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.1)',
              },
            },
          },
        ],
      });
    }
  }, [data]);

  useEffect(() => {
    chartRef.current && chartRef.current.resize();
  }, [containerSize]);

  return (
    <>
      <div ref={containerRef} className={styles.pie_chart} />
    </>
  );
};
