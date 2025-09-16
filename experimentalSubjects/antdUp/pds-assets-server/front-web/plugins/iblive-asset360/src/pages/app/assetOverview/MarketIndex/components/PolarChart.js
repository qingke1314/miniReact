/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-12-30 09:55:26
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-14 11:14:29
 * @Description:
 */
import { moneyFormat, generateColor } from 'iblive-base';
import { useSize } from 'ahooks';
import { Col, Row, Space } from 'antd-v5';
import { BarChart } from 'echarts/charts';
import {
  LegendComponent,
  PolarComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useEffect, useRef } from 'react';
import styles from '../index.less';

echarts.use([
  PolarComponent,
  TooltipComponent,
  BarChart,
  CanvasRenderer,
  LegendComponent,
]);

const colors = generateColor(30);

export default ({ data, typeList }) => {
  const containerRef = useRef();
  const containerSize = useSize(containerRef);
  const chartRef = useRef();

  useEffect(() => {
    const dom = containerRef.current;
    const chart = echarts.init(dom);
    chart.setOption({
      color: colors,
      polar: {
        radius: [0, '80%'],
      },
      angleAxis: {
        max: 100,
        startAngle: 90,
        axisTick: {
          show: true,
          lineStyle: {
            color: '#f0f0f0',
          },
        },
        axisLabel: {
          formatter: (value) => value + '%',
        },
      },
      radiusAxis: {
        type: 'category',
        data: typeList,
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: false,
        },
      },
      label: {
        show: false,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        valueFormatter: (value) => moneyFormat({ num: value, unit: '%' }),
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
            type: 'bar',
            data,
            coordinateSystem: 'polar',
            colorBy: 'data',
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
      <Row gutter={16} justify="center">
        {(typeList || []).map((name, index) => (
          <Col key={name}>
            <Space align="center" size={4}>
              <span
                className={styles.legend_sign}
                style={{ '--color': colors[index] }}
              />
              {name}
            </Space>
          </Col>
        ))}
      </Row>
      <div ref={containerRef} className={styles.pie_chart} />
    </>
  );
};
