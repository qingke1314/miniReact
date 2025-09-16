import { useSize } from 'ahooks';
import { Empty } from 'antd-v5';
import { BarChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { memo, useEffect, useMemo, useRef } from 'react';
import { findTopAndBottomStocks } from '../const';
import { moneyFormat } from 'iblive-base';

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
]);

const SecIncomeChart = ({ stockData = [] }) => {
  const wrapperRef = useRef();
  const chartRef = useRef();
  const wrapperSize = useSize(wrapperRef);

  const filteredStockData = useMemo(() => {
    return findTopAndBottomStocks(stockData, 5);
  }, [stockData]);

  useEffect(() => {
    if (!wrapperRef.current) {
      return;
    }
    const chart = echarts.init(wrapperRef.current);
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params) => {
          const data = params[0].data; // 获取第一个系列的数据
          const category = params[0].name;
          // 返回自定义的 HTML 字符串
          return `${category}: <strong>${data.realValue}万元</strong>`;
        },
      },
      color: ['#fcecec', '#d4f4ec'],
      grid: {
        top: '20px',
        left: '10px',
        right: '40px',
        bottom: '10px',
        containLabel: true,
        height: 'auto',
      },
      yAxis: [
        {
          type: 'category',
          data: filteredStockData.map((item) => item.name),
          axisTick: {
            show: false,
          },
          axisPointer: {
            show: true,
            label: {
              show: true,
              formatter: function (params) {
                return params.value;
              },
            },
          },
          axisLabel: {
            width: 70, // 设置标签的最大宽度
            overflow: 'truncate', // 超出部分截断
            ellipsis: '...', // 使用省略号
          },
        },
      ],
      xAxis: [
        {
          axisLabel: {
            show: false,
          },
          type: 'value',
          name: '万元',
          nameLocation: 'end',
          nameTextStyle: {
            padding: [0, 0, 0, -20],
          },
        },
      ],
      series: [
        {
          type: 'bar',
          barMaxWidth: 40, // 新增：设置柱状图最大宽度为 40px
          label: {
            show: true,
            position: 'inside',
            formatter: (params) => {
              // params.data 就是我们构造的 { value, realValue } 对象
              return moneyFormat({ num: params.data.realValue });
            },
          },
          itemStyle: {
            color: (params) => {
              return params.value > 0 ? '#ff2723' : '#20d08c';
            },
          },
          data: filteredStockData.map((item) => {
            return {
              value: item.lengthValue || 0,
              realValue: ((item.value || 0) / 10000).toFixed(2),
            };
          }),
        },
      ],
    };
    chart.setOption(option);
    chartRef.current = chart;
    return () => {
      chartRef.current.dispose();
    };
  }, [filteredStockData]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resize();
    }
  }, [wrapperSize]);

  return (
    <div style={{ marginTop: 8 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div className="important-title">收益贡献</div>
      </div>
      {stockData?.length ? (
        <div
          style={{
            width: '100%',
            height: `${Math.max(filteredStockData.length * 40, 200)}px`,
            display: 'inline-block',
          }}
          ref={wrapperRef}
        />
      ) : (
        <Empty
          style={{
            width: '100%',
            height: 320,
            paddingTop: 70,
            display: 'inline-block',
          }}
        />
      )}
    </div>
  );
};

export default memo(SecIncomeChart);
