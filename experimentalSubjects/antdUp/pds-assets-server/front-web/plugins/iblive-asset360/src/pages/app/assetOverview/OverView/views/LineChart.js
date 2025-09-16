/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2023-06-12 10:54:32
 * @LastEditTime: 2024-11-14 13:34:22
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 */
import { invokeAPIIndex } from '@asset360/apis/api';
import { useSize } from 'ahooks';
import { BarChart, LineChart } from 'echarts/charts';
import {
  GraphicComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout } from 'echarts/features';
import 'echarts/lib/component/grid';
import { CanvasRenderer } from 'echarts/renderers';
import { moneyFormat } from 'iblive-base';
import moment from 'moment';
import { useEffect, useRef } from 'react';

echarts.use([
  TitleComponent,
  GraphicComponent,
  TooltipComponent,
  LegendComponent,
  LineChart,
  BarChart,
  CanvasRenderer,
  LabelLayout,
]);

const RequestCount = () => {
  const chartRef = useRef();
  const containerRef = useRef();
  const containerSize = useSize(containerRef);

  const getData = async () => {
    const res = await invokeAPIIndex({
      serviceId: 'DD_API_COMPANY_ASEET_STAT',
    });
    const xData = (res?.records || []).map((item) =>
      moment(item.date, 'YYYYMM').format('YYYY-MM'),
    );
    const yData = (res?.records || []).map(
      (item) => item.totalAmount / 100000000,
    );
    chartRef.current.setOption({
      xAxis: [
        {
          type: 'category',
          axisLabel: {
            textStyle: {
              color: '#777',
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#EDEDED',
              type: 'solid',
            },
          },
          data: xData,
        },
      ],
      series: [
        {
          type: 'line',
          symbol: 'none',
          data: yData,
          color: '#FF7B2C',
          stack: 'all',
          markLine: {
            silent: true, // 鼠标移动到标记线上无操作
            symbol: ['none', 'none'],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  color: '#ffffff',
                },
                lineStyle: {
                  color: '#000000',
                  type: 'solid',
                  width: 1,
                },
              },
            },
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(255, 123, 44,0.8)',
              },
              {
                offset: 1,
                color: 'rgba(255, 123, 44,0)',
              },
            ]),
          },
        },
      ],
    });
  };

  const option = {
    title: {
      left: 'center',
      textStyle: {
        fontSize: 10,
      },
    },
    legend: {
      right: '0%',
      show: false,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      valueFormatter: function (value) {
        return moneyFormat({ num: value, decimal: 3 });
      },
    },
    xAxis: [
      {
        type: 'category',
        axisLabel: {
          textStyle: {
            color: '#A5A7AF',
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#EDEDED',
            type: 'solid',
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          //x轴文字的配置
          show: true,
          textStyle: {
            color: '#A5A7AF',
          },
          formatter: (value) => moneyFormat({ num: value, decimal: 0 }),
        },
        splitLine: {
          lineStyle: {
            color: '#EDEDED',
            type: 'dashed', //设置背景网格线为虚线
            // type: "solid", //设置背景网格线为实线
          },
        },
        scale: true,
      },
    ],
    grid: {
      left: '2%',
      right: '4%',
      bottom: '2%',
      top: '12%',
      containLabel: true,
    },
  };

  useEffect(() => {
    const dom = containerRef.current;
    const chart = echarts.init(dom);
    chart.setOption(option);
    chartRef.current = chart;

    getData();
    return () => {
      chartRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    chartRef.current && chartRef.current.resize();
  }, [containerSize]);

  return <div ref={containerRef} style={{ height: '100px', width: '400px' }} />;
};

export default RequestCount;
