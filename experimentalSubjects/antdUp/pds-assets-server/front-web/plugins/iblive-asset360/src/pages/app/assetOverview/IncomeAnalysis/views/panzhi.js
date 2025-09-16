import { useSize } from 'ahooks';
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

const SecIncomeChart = ({ info }) => {
  const wrapperRef = useRef();
  const chartRef = useRef();
  const wrapperSize = useSize(wrapperRef);
  const barData = useMemo(() => {
    if (!info?.mktValue) return [];
    return findTopAndBottomStocks(info?.mktValue);
  }, [info]);
  useEffect(() => {
    const option = {
      yAxis: [
        {
          type: 'category',
          data: barData?.map((item) => item.name) || [],
          axisTick: {
            show: false,
          },
        },
      ],
      series: [
        {
          data: barData?.map((item) => {
            return {
              value: item.lengthValue || 0,
              realValue: ((item.value || 0) / 10000).toFixed(2),
            };
          }),
        },
      ],
    };
    chartRef.current?.setOption(option);
  }, [barData]);

  useEffect(() => {
    const chart = echarts.init(wrapperRef.current);
    const option = {
      tooltip: {
        formatter: (params) => {
          const data = params[0].data; // 获取第一个系列的数据
          const category = params[0].name;
          // 返回自定义的 HTML 字符串
          return `${category}: <strong>${moneyFormat({
            num: data.realValue,
          })}万元</strong>`;
        },
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      color: ['#ff2723', '#20d08c'],
      grid: {
        top: '20px',
        left: '10px',
        right: '10px',
        bottom: '10px',
        containLabel: true,
      },
      yAxis: [
        {
          axisLabel: {
            width: 70, // 设置标签的最大宽度
            overflow: 'truncate', // 超出部分截断
            ellipsis: '...', // 使用省略号
          },
          type: 'category',
          data: [
            '50亿以下',
            '50亿-100亿',
            '100亿-300亿',
            '300亿-500亿',
            '500亿-1000亿',
            '1000亿以上',
          ],
          axisTick: {
            show: false,
          },
        },
      ],
      xAxis: [
        {
          axisLabel: {
            show: false,
          },
          type: 'value',
        },
      ],
      series: [
        {
          type: 'bar',
          barMaxWidth: 40, // 新增：设置柱状图最大宽度为 40px
          label: {
            formatter: (params) => {
              // params.data 就是我们构造的 { value, realValue } 对象
              return moneyFormat({
                num: params.data.realValue,
              });
            },
            show: true,
            // formatter: '{c}',
            position: 'inside',
          },
          itemStyle: {
            color: (params) => {
              return params.value > 0 ? '#ff2723' : '#20d08c';
            },
          },
          data: [
            '-244.00',
            '-210.00',
            '-200.00',
            '302.00',
            '320.00',
            '341.00',
            '450.00',
          ],
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
  return (
    <div style={{ marginTop: 8 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div className="important-title">按盘子</div>
        {/* <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}
          >
            <div
              style={{
                width: 20,
                height: 10,
                backgroundColor: '#ff2723',
                marginRight: 8,
                borderRadius: 4,
              }}
            />
            <div>盈利</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: 20,
                height: 10,
                backgroundColor: '#20d08c',
                marginRight: 8,
                borderRadius: 4,
              }}
            />
            <div>亏损</div>
          </div>
        </div> */}
      </div>
      <div
        style={{
          width: '100%',
          height: 320,
          display: 'inline-block',
        }}
        ref={wrapperRef}
      />
    </div>
  );
};

export default memo(SecIncomeChart);
