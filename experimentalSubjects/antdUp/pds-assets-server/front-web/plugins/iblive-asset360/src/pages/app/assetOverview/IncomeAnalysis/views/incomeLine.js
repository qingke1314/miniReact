import { executeApi } from '@asset360/apis/appCommon';
import { useSize } from 'ahooks';
import { Spin } from 'antd';
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
import moment from 'moment';
import { memo, useEffect, useRef, useState } from 'react';
// import IncomeAnalysisEcharts from './IncomeAnalysisEcharts';

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

const EarningsChart = ({
  productCode,
  activeDateRange,
  activeSelect,
  moreValues,
}) => {
  const wrapperRef = useRef();
  const wrapperSize = useSize(wrapperRef);
  const chartRef = useRef();
  const fundNameRef = useRef();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState();

  useEffect(() => {
    if (!productCode || !activeDateRange?.length) return;
    setLoading(true);
    executeApi({
      timeout: 60000,
      serviceId: 'DD_API_FUND_AST_UNIT_COMBI_INCOME_EVERYDAY',
      data: {
        fundCode: productCode,
        startDate: activeDateRange?.[0]?.format('YYYYMMDD'),
        endDate: activeDateRange?.[1]?.format('YYYYMMDD'),
        astUnitId: activeSelect?.astUnitId
          ? Number(activeSelect?.astUnitId)
          : null,
        combiCode: activeSelect?.combiCode || null,
        ...moreValues,
      },
    })
      .then((res) => {
        const time = res?.records?.map((item) =>
          moment(item.businDate).format('YYYY/MM/DD'),
        );
        const data = res?.records?.map((item) => item.income);
        const sum = res?.records?.map((item) => item.incomeSum);
        setInfo({
          time,
          data,
          sum,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    activeDateRange,
    productCode,
    activeSelect?.astUnitId,
    activeSelect?.combiCode,
    moreValues,
  ]);

  useEffect(() => {
    const chart = echarts.init(wrapperRef.current);
    const option = {
      grid: {
        top: '30px',
        right: '30px',
        bottom: '30px',
        left: '70px',
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
        bottom: 0,
        type: 'scroll',
      },
      xAxis: [
        {
          type: 'category',
          axisPointer: {
            type: 'shadow',
          },
          data: [],
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '',
          axisPointer: { show: false },
          axisLabel: {
            formatter: (value) =>
              moneyFormat({ num: value / 10000, decimal: 0, unit: '万' }),
          },
        },
      ],
    };
    chart.setOption(option);
    chart.on('legendselectchanged', (params) => {
      if (params.name == fundNameRef.current) {
        // 产品本身的折线图不可取消显示
        chart.dispatchAction({
          type: 'legendSelect',
          name: params.name,
          selected: true,
        });
      }
    });
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

  useEffect(() => {
    if (chartRef.current) {
      // 找出最大值和最小值及其索引
      let maxValue = -Infinity;
      let minValue = Infinity;
      let maxIndex = -1;
      let minIndex = -1;
      const data = info?.data || [];
      data.forEach((value, index) => {
        if (value > maxValue) {
          maxValue = value;
          maxIndex = index;
        }
        if (value < minValue) {
          minValue = value;
          minIndex = index;
        }
      });
      // 准备标记点数据
      const markPoints = [];
      if (maxIndex !== -1) {
        markPoints.push({
          name: '最大值',
          type: 'max',
          valueDim: 'y',
          symbol: 'circle',
          symbolSize: 10,
          label: {
            show: true,
            position: 'top',
            formatter: (params) => {
              return moneyFormat({ num: params.value / 10000, unit: '万' });
            },
            fontSize: 12,
            color: '#00AEFF',
            backgroundColor: 'rgba(255,255,255,0.8)',
            padding: [4, 8],
            borderRadius: 4,
          },
          itemStyle: {
            color: '#00AEFF',
          },
        });
      }
      if (minIndex !== -1) {
        markPoints.push({
          name: '最小值',
          type: 'min',
          valueDim: 'y',
          symbol: 'circle',
          symbolSize: 10,
          label: {
            show: true,
            position: 'bottom',
            formatter: (params) => {
              return moneyFormat({ num: params.value / 10000, unit: '万' });
            },
            fontSize: 12,
            color: '#00AEFF',
            backgroundColor: 'rgba(255,255,255,0.8)',
            padding: [4, 8],
            borderRadius: 4,
          },
          itemStyle: {
            color: '#00AEFF',
          },
        });
      }
      chartRef.current.setOption({
        legend: {
          show: false,
        },
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
          {
            name: '收益',
            type: 'line',
            showSymbol: false,
            itemStyle: {
              color: '#00AEFF',
            },
            tooltip: {
              valueFormatter: function (value) {
                return moneyFormat({ num: value / 10000, unit: '万' });
              },
            },
            data: info?.sum || [],
            markPoint: {
              data: markPoints,
            },
          },
          // {
          //   name: info?.other1Info?.name,
          //   type: 'line',
          //   showSymbol: false,
          //   itemStyle: {
          //     color: '#4ED2B9',
          //   },
          //   tooltip: {
          //     valueFormatter: function (value) {
          //       return moneyFormat({ num: value * 100, unit: '%' });
          //     },
          //   },
          //   data: info?.other1Info?.data || [],
          // },
          // {
          //   name: info?.other2Info?.name,
          //   type: 'line',
          //   showSymbol: false,
          //   itemStyle: {
          //     color: '#FBBF47',
          //   },
          //   tooltip: {
          //     valueFormatter: function (value) {
          //       return moneyFormat({ num: value * 100, unit: '%' });
          //     },
          //   },
          //   data: info?.other2Info?.data || [],
          // },
          // {
          //   name: info?.other3Info?.name,
          //   type: 'line',
          //   showSymbol: false,
          //   itemStyle: {
          //     color: '#8B85ED',
          //   },
          //   tooltip: {
          //     valueFormatter: function (value) {
          //       return moneyFormat({ num: value * 100, unit: '%' });
          //     },
          //   },
          //   data: info?.other3Info?.data || [],
          // },
        ],
      });
    }
  }, [info]);

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: 'var(--background-color)',
        padding: '0 0 0 8px',
        marginBottom: 8,
        borderRadius: 4,
      }}
    >
      <div className="important-title">累计盈亏</div>
      <div style={{ display: 'none' }}>{info?.formual || ''}</div>
      <Spin active spinning={loading}>
        <div
          style={{
            width: '100%',
            height: 240,
            display: 'inline-block',
          }}
          ref={wrapperRef}
        />
        {/* <div style={{ display: 'inline-block', width: 600 }}>
          <OverviewTable
            pagination={false}
            showTotal={false}
            columns={columns}
            dataSource={tableData}
          />
        </div> */}
      </Spin>
      {/* <IncomeAnalysisEcharts /> */}
    </div>
  );
};

export default memo(EarningsChart);
