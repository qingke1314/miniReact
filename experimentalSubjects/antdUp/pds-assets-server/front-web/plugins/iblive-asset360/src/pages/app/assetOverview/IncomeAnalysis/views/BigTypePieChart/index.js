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
import { colorList } from '@asset360/utils/utils';

echarts.use([
  GraphicComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);

const getLabel = (value) => {
  switch (value) {
    case 'GP':
      return '股票';
    case 'ZQ':
      return '债券';
    case 'JJ':
      return '基金';
    case 'HG':
      return '回购';
    case 'QH':
      return '期货';
    case 'QT':
      return '其他';
    case 'CK':
      return '存款';
    default:
      return '';
  }
};

const BigTypePieChart = ({ height = '200px', bigTypeList = [] }) => {
  const chartRef = useRef();
  const container = useRef();
  const containerSize = useSize(container);
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const { name, value, percent } = params;
        const numericValue = parseFloat(value);
        const formattedValue = numericValue.toLocaleString('en-US');
        return `${name} : ${formattedValue} (${percent}%)`;
      },
    },
    color: colorList,
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
        data: bigTypeList.map((e) => ({
          name: getLabel(e.assetType),
          value: e.income?.toFixed(2) || 0,
          ratio:
            e.income / bigTypeList.reduce((pre, cur) => pre + cur.income, 0),
        })),

        radius: '70%',
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
  }, [bigTypeList]);
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resize();
    }
  }, [containerSize]);

  return (
    <div
      style={{
        border: '1px solid var(--border-color-base)',
        padding: 8,
        marginTop: 8,
      }}
    >
      <div className="important-title">资产配置</div>
      <div style={{ height }} ref={container} />
    </div>
  );
};

export default BigTypePieChart;
