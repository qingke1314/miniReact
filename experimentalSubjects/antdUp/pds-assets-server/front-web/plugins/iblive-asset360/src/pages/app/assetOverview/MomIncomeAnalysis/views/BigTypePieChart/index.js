import { useSize } from 'ahooks';
import { PieChart } from 'echarts/charts';
import {
  GraphicComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import { Spin } from 'antd-v5';
import * as echarts from 'echarts/core';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { memo, useEffect, useRef, useState } from 'react';
import { executeApi } from '@asset360/apis/appCommon';
import { colorList as color } from '@asset360/utils/utils';

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
    case 'stockAsset':
      return '股票';
    case 'bondAsset':
      return '债券';
    case 'fundAsset':
      return 'ETF';
    case 'futuresAsset':
      return '期货';
    case 'optionsAsset':
      return '期权';
    case 'cashAsset':
      return '现金';
    default:
      return '';
  }
};

const getOption = (data) => ({
  tooltip: {
    trigger: 'item',
    formatter: (params) => {
      const { name, value, percent } = params;
      const numericValue = parseFloat(value);
      const formattedValue = numericValue.toLocaleString('en-US');
      return `${name} : ${formattedValue} (${percent}%)`;
    },
  },
  legend: {
    //left: 'bottom',
    itemWidth: 10, // 设置图例标记的图形宽度
    itemHeight: 10, // 设置图例标记的图形高度
    itemGap: 5, // 设置图例项之间的间隔
    textStyle: {
      fontSize: 12, // 统一设置图例文字的样式
    },
    orient: 'horizontal',
    left: 'center',
    bottom: 0,
  },
  series: [
    {
      color,
      type: 'pie',
      data,
      radius: '70%',
      center: ['50%', '45%'],
      label: {
        show: false,
        position: 'center',
      },
    },
  ],
});

const BigTypePieChart = ({ height = '220px', productCode }) => {
  const chartRef = useRef();
  const container = useRef();
  const containerSize = useSize(container);
  const [loading, setLoading] = useState(false);
  const [bigTypeList, setBigTypeList] = useState([]);
  /**
   * 获取资产大类配置和资产单元配置
   */
  useEffect(() => {
    if (!productCode) return;
    setLoading(true);
    const post = {
      fundCode: productCode,
    };
    executeApi({
      serviceId: 'DD_API_COMBI_ASSET_DETAILS',
      data: post,
    })
      .then((assetTypeData) => {
        const bigTypeList = Object.keys(assetTypeData?.data || {})
          ?.map((e) => {
            const label = getLabel(e);
            if (!label) return null;
            return {
              name: label,
              value: assetTypeData?.data?.[e],
            };
          })
          .filter(Boolean);
        setBigTypeList(bigTypeList);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productCode]);

  useEffect(() => {
    const chart = echarts.init(container.current);
    chart.setOption(getOption([]));
    chartRef.current = chart;
    return () => {
      chartRef.current.dispose();
    };
  }, []);
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.setOption(getOption(bigTypeList));
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
      <Spin active spinning={loading}>
        <div className="important-title">资产配置</div>
        <div style={{ height }} ref={container} />
      </Spin>
    </div>
  );
};

export default memo(BigTypePieChart);
