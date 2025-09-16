/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-09-30 14:46:53
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-11-22 10:52:06
 * @Description:
 */
import { moneyFormat } from 'iblive-base';
import { useSize } from 'ahooks';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';

echarts.use([
  TooltipComponent,
  GridComponent,
  LineChart,
  BarChart,
  CanvasRenderer,
  UniversalTransition,
]);

const timeData = [];
new Array(120).fill(0).forEach((item, index) => {
  timeData.push(moment('09:30', 'HH:mm').add(index, 'minutes').format('HH:mm'));
});
timeData.push('11:30/13:00');
new Array(120).fill(0).forEach((item, index) => {
  timeData.push(moment('13:01', 'HH:mm').add(index, 'minutes').format('HH:mm'));
});

export default ({ quoDetail }) => {
  const [charData, setCharData] = useState({});
  const containerRef = useRef();
  const chartRef = useRef();
  const containerSize = useSize(containerRef);

  const option = {
    animation: false,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      textStyle: {
        color: '#000',
      },
      position: function (pos, params, el, elRect, size) {
        const obj = {
          top: 10,
        };
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
        return obj;
      },
      formatter: function (param) {
        const { dataIndex } = param[0];
        return [
          '<b>' + timeData[dataIndex] + '</b>' + '<br/>',
          '价格: ' +
            moneyFormat({ num: charData.priceData[dataIndex] }) +
            '<br/>',
          '涨跌幅: ' +
            moneyFormat({ num: charData.changeRate[dataIndex] }) +
            '%' +
            '<br/>',
          '成交量: ' +
            moneyFormat({
              num: charData.dealData[dataIndex].value,
              decimal: 0,
              unit: '手',
            }) +
            '<br/>',
        ].join('');
      },
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: 'all',
        },
      ],
      label: {
        backgroundColor: '#777',
      },
    },
    grid: [
      {
        left: '10%',
        right: '8%',
        height: '70%',
        top: '10%',
      },
      {
        left: '10%',
        right: '8%',
        top: '90%',
        height: '6%',
      },
    ],
    xAxis: [
      {
        type: 'category',
        data: timeData,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        axisTick: {
          show: false,
        },
        axisLabel: {
          showMaxLabel: true,
          showMinLabel: true,
          interval: 59,
        },

        axisPointer: {
          z: 100,
        },
      },
      {
        type: 'category',
        gridIndex: 1,
        data: timeData,
        boundaryGap: false,
        axisLine: { onZero: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        axisPointer: {
          label: {
            formatter: (params) =>
              `成交量：${moneyFormat({
                num: params.seriesData[0]?.value,
                decimal: 0,
              })}`,
          },
        },
      },
    ],
    yAxis: [
      {
        scale: true,
        splitArea: {
          show: false,
        },
        axisLabel: {
          formatter: (value) => moneyFormat({ num: value, decimal: 2 }),
        },
        axisPointer: {
          label: {
            formatter: (params) => {
              return moneyFormat({
                num: params.value,
                decimal: 2,
              });
            },
          },
        },
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisPointer: { show: false },
        min: 'dataMin',
        max: 'dataMax',
      },
    ],
    series: [
      {
        name: '最新价',
        type: 'line',
        showSymbol: false,
        data: charData.priceData,
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: '成交量',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        itemStyle: {
          color: '#4E9FF7',
        },
        emphasis: {
          itemStyle: {
            color: '#4E9FF7',
          },
        },
        data: charData.dealData,
      },
    ],
  };

  useEffect(() => {
    if (quoDetail) {
      let priceData = [];
      let changeRate = [];
      let dealData = [];
      quoDetail.forEach((item) => {
        if (item.quoTime !== '1300') {
          priceData.push(item.lastPrice);
          changeRate.push(item.increaseRatio);
          dealData.push({
            value: item.dealQty / 100,
          });
        }
      });
      setCharData({
        priceData: priceData,
        changeRate: changeRate,
        dealData: dealData,
      });
    }
  }, [quoDetail]);

  useEffect(() => {
    const chart = echarts.init(containerRef.current);
    charData && chart.setOption(option);
    chartRef.current = chart;
    return () => {
      chartRef.current.dispose();
    };
  }, [charData]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resize();
    }
  }, [containerSize]);

  return <div style={{ width: '100%', height: 340 }} ref={containerRef} />;
};
