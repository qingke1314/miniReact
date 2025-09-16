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

echarts.use([
  GraphicComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);

const BigTypePieChart = ({ height = '260px', pieData = [] }) => {
  const chartRef = useRef();
  const container = useRef();
  const containerSize = useSize(container);
  const getLabel = (value) => {
    const all = pieData.reduce((pre, cur) => pre + cur.totalAmount, 0);
    const money = pieData.find((e) => e.name === value)?.totalAmount;
    return `${value} ${((money / all) * 100).toFixed(2)}%`;
  };
  const option = {
    color,
    tooltip: {
      trigger: 'item',
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
      formatter: (name) => getLabel(name),
    },
    series: [
      {
        type: 'pie',
        data: pieData.map((e) => ({
          name: e.name,
          value: e.totalAmount,
        })),

        radius: ['50%', '70%'],
        center: ['50%', '38%'],
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
  }, [pieData]);
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resize();
    }
  }, [containerSize]);

  return (
    <div style={{ marginTop: -8 }}>
      <div className="important-title">产品分布</div>
      <div style={{ height }} ref={container} />
    </div>
  );
};

export default BigTypePieChart;
