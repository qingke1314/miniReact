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
import { moneyFormat } from 'iblive-base';

echarts.use([
  GraphicComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);

const getOption = (data) => ({
  tooltip: {
    trigger: 'item',
    formatter: (params) => {
      const { name, value, percent } = params;
      const formattedValue = moneyFormat({ num: value });
      return `${name} : <br />${formattedValue} (${percent}%)`;
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

const BigTypePieChart = ({
  height = '220px',
  productCode,
  setSmallAssetData = () => {},
}) => {
  const assetChartRef = useRef();
  const assetDataContainer = useRef();
  const assetDataContainerSize = useSize(assetDataContainer);
  const [loading, setLoading] = useState(false);
  const [assetData, setAssetData] = useState([]);
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
      serviceId: 'DD_API_FUND_AST_UNIT_ASSET',
      data: post,
    })
      .then((assetData) => {
        const smallAsset = (assetData?.records || []).map((e) => ({
          name: e.astUnitName,
          value: e.netAsset,
        }));
        setAssetData(smallAsset);
        // 25.09.10 费用详情那边需要对应的费用规模占比，需要这块数据，接口用时较久，直接复用
        setSmallAssetData(smallAsset);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productCode]);

  useEffect(() => {
    const assetChart = echarts.init(assetDataContainer.current);
    assetChart.setOption(getOption([]));
    assetChartRef.current = assetChart;
    return () => {
      assetChartRef.current.dispose();
    };
  }, []);
  useEffect(() => {
    if (assetChartRef.current) {
      assetChartRef.current.setOption(getOption(assetData));
    }
  }, [assetData]);
  useEffect(() => {
    if (assetChartRef.current) {
      assetChartRef.current.resize();
    }
  }, [assetDataContainerSize]);
  return (
    <div
      style={{
        border: '1px solid var(--border-color-base)',
        padding: 8,
        marginTop: 8,
      }}
    >
      <Spin active spinning={loading}>
        <div className="important-title">小M占比</div>
        <div style={{ height }} ref={assetDataContainer} />
      </Spin>
    </div>
  );
};

export default memo(BigTypePieChart);
