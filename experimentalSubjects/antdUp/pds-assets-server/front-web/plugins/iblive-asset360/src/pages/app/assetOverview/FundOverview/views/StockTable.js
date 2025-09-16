import { executeApi } from '@asset360/apis/appCommon';
import moment from 'moment';
import { useEffect, useState, useRef } from 'react';
import { Spin } from 'antd';
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
import { useMemo } from 'react';

echarts.use([
  GraphicComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);

// 保留优化: 提供一个预定义的调色盘，避免颜色重复
const colorPalette = [
  '#5470C6',
  '#91CC75',
  '#FAC858',
  '#EE6666',
  '#73C0DE',
  '#3BA272',
  '#FC8452',
  '#9A60B4',
  '#EA7CCC',
  '#FFD700',
  '#8A2BE2',
  '#00FFFF',
  '#7FFF00',
  '#D2691E',
  '#FF7F50',
  '#6A5ACD',
  '#00FA9A',
  '#FF69B4',
];

const StockTable = ({ productCode }) => {
  const [data, setData] = useState([]);
  const assetTotal = useRef(0);
  const marketValueTotal = useRef(0);
  const [loading, setLoading] = useState(false);
  const chartRef = useRef(null);
  const container = useRef(null);
  const containerSize = useSize(container);

  useEffect(() => {
    const chart = echarts.init(container.current);
    chartRef.current = chart;
    return () => {
      chartRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resize();
    }
  }, [containerSize]);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    const option = {
      // 保留优化: 应用预定义的调色盘
      color: colorPalette,
      tooltip: {
        trigger: 'item',
        formatter: ({ name, value, data: seriesData }) => {
          return `<span style="font-weight: bold; font-size: 15px;">${name}</span><br/>公允价值(元): ${Number(
            value,
          ).toLocaleString()}<br/>占比(%): ${seriesData.ratio}%`;
        },
      },
      // 要求2: 恢复您喜欢的原有图例样式
      legend: {
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 10,
        textStyle: {
          fontSize: 12,
        },
      },
      series: [
        {
          type: 'pie',
          // 要求4: 使用传统实心饼图，并调整半径和中心点以适应布局
          radius: '60%',
          center: ['50%', '45%'], // 将饼图向上移动，为底部的图例留出空间

          // 核心优化: 开启标签防重叠功能，依然非常重要
          avoidLabelOverlap: true,

          data: data.map((e) => ({
            name: e.indName,
            value: e.marketValue || 0,
            ratio: (
              ((e.marketValue || 0) / marketValueTotal.current) *
              100
            ).toFixed(4),
          })),
          label: {
            show: true,
            minAngle: 5, // 小于5度的扇形不显示标签
          },
          labelLine: {
            show: true,
            minAngle: 5, // 小于5度的扇形不显示标签线
          },
        },
      ],
    };

    chartRef.current.setOption(option, true);
  }, [data]);

  const getData = async () => {
    setLoading(true);
    try {
      const res2 = await executeApi({
        serviceId: 'DD_API_MUTUAL_FUND_ASSET_ITEM',
        data: {
          fundCode: productCode,
          businDate: moment().format('YYYYMMDD'),
        },
      });
      // 总资产是在ref里存的，跟随data刷新，所以data要在总资产之后调
      assetTotal.current = res2?.data?.stockAsset || 0;
      const res = await executeApi({
        serviceId: 'DD_API_FUND_STOCK_INDUSTRIES_ASSET',
        data: {
          fundCode: productCode,
          businDate: moment().format('YYYYMMDD'),
        },
      });
      marketValueTotal.current = (res?.records || []).reduce(
        (pre, cur) => pre + (cur.marketValue || 0),
        0,
      );
      setData(res?.records ?? []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productCode) {
      getData();
    }
  }, [productCode]);

  const topData = useMemo(() => {
    const countFn = (data, topN) => {
      return data.slice(0, topN).reduce((pre, cur) => pre + cur.marketValue, 0);
    };
    const cloneData = [...data];
    const sortData = cloneData
      .filter((e) => e.marketValue)
      .sort((a, b) => b.marketValue - a.marketValue);
    const top1 = {
      label: 'TOP1 集中度',
      value: marketValueTotal.current
        ? countFn(sortData, 1) / marketValueTotal.current
        : '--',
    };
    const top3 = {
      label: 'TOP3 集中度',
      value: marketValueTotal.current
        ? countFn(sortData, 3) / marketValueTotal.current
        : '--',
    };
    const top5 = {
      label: 'TOP5 集中度',
      value: marketValueTotal.current
        ? countFn(sortData, 5) / marketValueTotal.current
        : '--',
    };
    return [top1, top3, top5];
  }, [data]);
  return (
    <div className="blank-card-asset">
      <Spin style={{ height: '100%' }} spinning={loading}>
        <div className="important-title m-b-8">股票行业配置</div>
        {/* 要求1: 恢复70%图表 + 30%占位区的布局 */}
        <div style={{ display: 'flex' }}>
          <div style={{ height: 380, width: '100%' }} ref={container} />
          <div
            style={{ position: 'absolute', right: 40, top: 20, fontSize: 15 }}
          >
            <div className="important-title">行业集中度</div>
            <div style={{ marginTop: 8 }}>
              {topData.map((item) => (
                <div style={{ marginTop: 4 }} key={item.label}>
                  <span style={{ fontWeight: 'bold' }}>{item.label}：</span>
                  <span style={{ color: 'var(--orange-color)' }}>
                    {((item.value || 0) * 100).toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Spin>
      {/* OverviewTable... */}
    </div>
  );
};

export default StockTable;
