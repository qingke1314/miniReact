import { useSize } from 'ahooks';
import { PieChart } from 'echarts/charts';
import {
  GraphicComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { useEffect, useRef } from 'react';
import { colorList as color } from '@asset360/utils/utils';
import { Empty } from 'antd-v5';

echarts.use([
  GraphicComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);

const BigTypePieChart = ({ dataSource = [], smallAssetData = [] }) => {
  const chartRef = useRef();
  const container = useRef();
  const containerSize = useSize(container);
  const option = {
    color,
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const { name, value, percent } = params;

        // const smallItem = smallAssetData.find((e) => e.name === name);
        // const smallRatio =
        //   (smallItem?.value ? value / smallItem?.value : 0) * 100;
        const numericValue = parseFloat(value);
        const formattedValue = numericValue.toLocaleString('en-US');
        return `${name} : <br />
        ${formattedValue} (${percent}%) <br />
        `; // 费用占净资产比: ${smallRatio.toFixed(4)}%
      },
    },
    legend: {
      //left: 'bottom',
      itemWidth: 10, // 设置图例标记的图形宽度
      itemHeight: 10, // 设置图例标记的图形高度
      itemGap: 10, // 设置图例项之间的间隔
      textStyle: {
        fontSize: 12, // 统一设置图例文字的样式
      },
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
    },
    series: [
      {
        type: 'pie',
        data: dataSource,
        radius: '65%',
        center: ['50%', '45%'],
        label: {
          show: false,
          position: 'center',
        },
        //avoidLabelOverlap: false,
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
      chartRef.current.setOption(option);
    }
  }, [dataSource, smallAssetData]);
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resize();
    }
  }, [containerSize]);
  return (
    <>
      <div
        style={{
          width: '100%',
          height: 230,
          display: dataSource.length ? 'inline-block' : 'none',
        }}
        ref={container}
      />
      {dataSource.length ? null : (
        <Empty
          style={{
            width: '100%',
          }}
        />
      )}
    </>
  );
};

export default BigTypePieChart;
