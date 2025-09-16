import { useSize } from 'ahooks';
import { GraphChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useEffect, useRef } from 'react';
import { formatNumberWithUnit } from '../../const';

echarts.use([TitleComponent, TooltipComponent, GraphChart, CanvasRenderer]);

const StockDetail = () => {
  const wrapperRef = useRef();
  const wrapperSize = useSize(wrapperRef);
  const chartRef = useRef(null);
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        if (params.dataType === 'node') {
          return `${params.name}:<br/>${formatNumberWithUnit(params.value)}`;
        }
        return '';
      },
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#ddd',
      borderWidth: 1,
      textStyle: { color: '#333' },
    },
    series: [
      {
        type: 'graph',
        layout: 'none',
        symbolSize: [100, 60],
        symbol: 'rect',
        roam: false,
        label: {
          show: true,
          formatter: (params) => {
            return `{title|${params.name}}\n{value|${params.value}}`;
          },
          rich: {
            title: {
              color: '#fff',
              fontSize: 14,
              lineHeight: 20,
            },
            value: {
              color: '#fff',
              fontSize: 14,
              fontWeight: 'bold',
              lineHeight: 20,
            },
          },
        },
        itemStyle: {
          borderColor: '#cccccc',
          borderWidth: 2,
          borderRadius: 8,
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowBlur: 8,
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
        edgeSymbol: ['none', 'arrow'],
        edgeSymbolSize: [4, 10],
        lineStyle: {
          color: '#aaa',
          width: 2,
        },
        emphasis: {
          focus: 'adjacency',
          label: {
            color: '#fff',
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2,
          },
          lineStyle: {
            width: 3,
          },
        },
        data: [
          {
            name: '期初资产',
            value: '100000',
            x: 200,
            y: 20,
            itemStyle: {
              color: '#ff2723',
            },
            //label: { rich: { value: { color: '#52c41a' } } },
          },
          {
            name: '净流入',
            value: '10000',
            x: 50,
            y: 150,
            itemStyle: {
              color: '#ff2723',
            },
            //label: { rich: { value: { color: '#52c41a' } } },
          },
          {
            name: '账户收益',
            value: '-5200',
            x: 350,
            y: 150,
            itemStyle: {
              color: '#20d08c',
            },
            //label: { rich: { value: { color: '#ff4d4f' } } },
          },
          {
            name: '期末资产',
            value: '104800',
            x: 200,
            y: 280,
            itemStyle: {
              color: '#ff2723',
            },
            //label: { rich: { value: { color: '#52c41a' } } },
          },
        ],
        links: [
          { source: '期初资产', target: '期末资产' },
          { source: '净流入', target: '期末资产' },
          { source: '账户收益', target: '期末资产' },
        ],
      },
    ],
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
      chartRef.current.resize();
    }
  }, [wrapperSize]);
  return (
    <div>
      <div>
        <div className="important-title">我的资产</div>
      </div>
      <div
        style={{
          width: '100%',
          height: 360,
          display: 'inline-block',
        }}
        ref={wrapperRef}
      ></div>
    </div>
  );
};

export default StockDetail;
