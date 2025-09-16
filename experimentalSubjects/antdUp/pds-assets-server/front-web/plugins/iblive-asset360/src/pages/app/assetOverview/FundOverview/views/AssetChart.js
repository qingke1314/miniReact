import { executeApi } from '@asset360/apis/appCommon';
import CustomCard from '@asset360/components/CustomCard';
import { useSize } from 'ahooks';
import { Radio, Skeleton } from 'antd-v5';
import { BarChart, LineChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { moneyFormat } from 'iblive-base';
import moment from 'moment/moment';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

export default function AssetChart({ productCode }) {
  const wrapperRef = useRef();
  const wrapperSize = useSize(wrapperRef);
  const chartRef = useRef();
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState(1); // 3-近1周每日，6-当天每小时
  const [info, setInfo] = useState();
  const { theme } = useModel('global');
  // 1. 定义更新图表颜色的函数
  function updateChartTheme(chart) {
    const textColor = getComputedStyle(document.body)
      .getPropertyValue('--text-color')
      .trim();
    chart.setOption({
      textStyle: {
        color: textColor,
      },
      legend: {
        textStyle: { color: textColor },
      },
      axisLabel: {
        color: textColor,
      },
    });
  }

  useEffect(() => {
    if (chartRef.current) updateChartTheme(chartRef.current);
  }, [theme, chartRef]);

  const getInfo = async () => {
    const res = await executeApi({
      serviceId: 'DD_API_FUND_ASSET_HISTORY',
      data: {
        fundCode: productCode,
        unit,
      },
    });
    const time = [];
    const fundValueList = [];
    const stockList = [];
    const bondList = [];
    const cashList = [];
    const otherList = [];
    // const stockRatioList = [];
    // const cashRatioList = [];
    // const bondRatioList = [];
    // const otherRatioList = [];
    (res?.records || []).forEach((item) => {
      const {
        businDate: date,
        // bondAssetRatio: bondRatio,
        // depositRatio: cashRatio,
        netAsset: fundValue,
        // otherAssetRatio: otherRatio,
        // stockAssetRatio: stockRatio,
        bondAsset,
        deposit,
        otherAsset,
        stockAsset,
      } = item;
      if (unit !== 6) time.push(moment(date, 'YYYYMMDD').format('MM月'));
      fundValueList.push(fundValue / 100000000);
      stockList.push(stockAsset / 100000000);
      bondList.push(bondAsset / 100000000);
      cashList.push(deposit / 100000000);
      otherList.push(otherAsset / 100000000);
    });
    if (unit === 6) {
      new Array(17).fill(0).forEach((item, index) => {
        time.push(moment('08:00', 'HH:mm').add(index, 'hours').format('HH:mm'));
      });
    }
    setLoading(false);
    setInfo({
      time,
      fundValueList,
      stockList,
      cashList,
      bondList,
      otherList,
    });
  };

  useEffect(() => {
    if (productCode) {
      setLoading(true);
      getInfo();
    }
  }, [productCode, unit]);

  useEffect(() => {
    const chart = echarts.init(wrapperRef.current);
    const textColor = getComputedStyle(document.body)
      .getPropertyValue('--text-color')
      .trim();
    const option = {
      grid: {
        right: '80px',
        bottom: '30px',
      },
      textStyle: {
        color: textColor,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      legend: {
        textStyle: {
          color: textColor,
        },
        data: ['股票资产', '债券资产', '现金资产', '其他资产'],
      },
      axisLabel: {
        color: textColor,
      },
      xAxis: [
        {
          type: 'category',
          axisPointer: {
            type: 'shadow',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '资产规模（亿）',
          axisPointer: { show: false },
          splitLine: { show: false },
          axisLabel: {
            formatter: (value) => moneyFormat({ num: value }),
          },
        },
        // {
        //   type: 'value',
        //   name: '占净值比（%）',
        //   axisLabel: {
        //     formatter: (value) => moneyFormat({ num: value * 100, unit: '%' }),
        //   },
        //   axisPointer: { show: false },
        // },
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
      chartRef.current.setOption({
        xAxis: [
          {
            type: 'category',
            axisPointer: {
              type: 'shadow',
            },
            data: info?.time || [],
          },
        ],
        series: [
          // {
          //   name: '净资产',
          //   type: 'line',
          //   itemStyle: {
          //     color: 'orange',
          //   },
          //   tooltip: {
          //     valueFormatter: function (value) {
          //       return moneyFormat({ num: value, unit: '亿' });
          //     },
          //   },
          //   data: info?.fundValueList || [],
          // },
          {
            name: '股票资产',
            type: 'bar',
            stack: 'total', // 关键点：相同的 stack 值
            // yAxisIndex: 1,
            itemStyle: {
              color: '#4081FF',
            },
            tooltip: {
              valueFormatter: function (value) {
                return moneyFormat({ num: value, unit: '亿' });
              },
            },
            data: info?.stockList || [],
          },
          {
            name: '债券资产',
            type: 'bar',
            stack: 'total', // 关键点：相同的 stack 值
            // yAxisIndex: 1,
            itemStyle: {
              color: '#7B81F1',
            },
            tooltip: {
              valueFormatter: function (value) {
                return moneyFormat({ num: value, unit: '亿' });
              },
            },
            data: info?.bondList || [],
          },
          {
            name: '现金资产',
            type: 'bar',
            stack: 'total', // 关键点：相同的 stack 值
            // yAxisIndex: 1,
            itemStyle: {
              color: '#B6CEFF',
            },
            tooltip: {
              valueFormatter: function (value) {
                return moneyFormat({ num: value, unit: '亿' });
              },
            },
            data: info?.cashList || [],
          },
          {
            name: '其他资产',
            type: 'bar',
            stack: 'total', // 关键点：相同的 stack 值
            //  yAxisIndex: 1,
            itemStyle: {
              color: '#F0BE36',
            },
            tooltip: {
              valueFormatter: function (value) {
                return moneyFormat({ num: value, unit: '亿' });
              },
            },
            data: info?.otherList || [],
          },
        ],
      });
    }
  }, [info]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resize();
    }
  }, [wrapperSize]);
  return (
    <CustomCard>
      <div className="important-title">
        大类资产占比
        <Radio.Group
          style={{ marginLeft: 'auto' }}
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        >
          {/* <Radio.Button value={6}>当日</Radio.Button> */}
          <Radio.Button value={1}>近一年</Radio.Button>
        </Radio.Group>
      </div>
      <Skeleton active loading={loading}>
        <div style={{ width: '100%', height: 280 }} ref={wrapperRef} />
      </Skeleton>
    </CustomCard>
  );
}
AssetChart.displayName = 'AssetChart';
