import { executeApi } from '@asset360/apis/appCommon';
import { useSize } from 'ahooks';
import { Spin } from 'antd-v5';
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

const EarningsChart = ({ productCode, activeDateRange }) => {
  const wrapperRef = useRef();
  const wrapperSize = useSize(wrapperRef);
  const chartRef = useRef();
  const fundNameRef = useRef();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState();
  useEffect(() => {
    setLoading(true);
    executeApi({
      serviceId: 'DD_API_FUND_ACCUMULATED_EARNINGS_ASSET',
      data: {
        fundCode: productCode,
        startDate: activeDateRange?.[0]?.format('YYYYMMDD'),
        endDate: activeDateRange?.[1]?.format('YYYYMMDD'),
      },
    })
      .then((res) => {
        if (res?.code > 0 && res?.records?.length) {
          const time = res.records[0].dataList.map((e) =>
            moment(e.businDate).format('YYYY/MM/DD'),
          );
          const PERFORMANCE_BENCHMARK = res.records.find(
            (e) => e.code === 'PERFORMANCE_BENCHMARK',
          );
          const formual = PERFORMANCE_BENCHMARK?.formual;
          const TOTAL_ASSET = res.records.find((e) => e.code === 'TOTAL_ASSET');
          const UNIT_NET = res.records.find((e) => e.code === 'UNIT_NET');
          const TOTAL_UNIT_NET = res.records.find(
            (e) => e.code === 'TOTAL_UNIT_NET',
          );
          setInfo({
            time,
            formual,
            PERFORMANCE_BENCHMARK,
            TOTAL_ASSET,
            UNIT_NET,
            TOTAL_UNIT_NET,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeDateRange, productCode]);

  useEffect(() => {
    const chart = echarts.init(wrapperRef.current);
    const option = {
      grid: {
        top: '30px',
        right: '60px',
        bottom: '50px',
        left: '50px',
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
          axisTick: {
            show: false,
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
            formatter: (value) => moneyFormat({ num: value, unit: '%' }),
          },
        },
        {
          type: 'value',
          name: '产品规模(亿元)',
          position: 'right',
          axisPointer: { show: false },
          axisLabel: {
            formatter: (value) =>
              `${moneyFormat({
                num: value / 100000000,
              })}`,
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
      const legend = {};
      //图例3 4 5 默认关闭
      // if (info) {
      //   legend[info.other1Info.name] = false;
      //   legend[info.other2Info.name] = false;
      //   legend[info.other3Info.name] = false;
      // }
      chartRef.current.setOption({
        legend: {
          selected: legend,
        },
        xAxis: [
          {
            type: 'category',
            data: info?.time || [],
            axisPointer: {
              type: 'shadow',
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: info?.UNIT_NET?.name,
            type: 'line',
            showSymbol: false,
            tooltip: {
              valueFormatter: function (value) {
                return moneyFormat({ num: value, unit: '%' });
              },
            },
            data: info?.UNIT_NET?.dataList?.map((e) => e.ratio),
            legendHoverLink: false,
          },
          {
            name: info?.TOTAL_UNIT_NET?.name,
            type: 'line',
            showSymbol: false,
            tooltip: {
              valueFormatter: function (value) {
                return moneyFormat({ num: value, unit: '%' });
              },
            },
            data: info?.TOTAL_UNIT_NET?.dataList?.map((e) => e.ratio),
          },
          {
            name: info?.PERFORMANCE_BENCHMARK?.name,
            type: 'line',
            showSymbol: false,
            tooltip: {
              valueFormatter: function (value) {
                return moneyFormat({ num: value, unit: '%' });
              },
            },
            data: info?.PERFORMANCE_BENCHMARK?.dataList?.map((e) => e.ratio),
          },
          {
            name: info?.TOTAL_ASSET?.name,
            type: 'line',
            yAxisIndex: 1, // 关联到右侧Y轴
            showSymbol: false,
            itemStyle: {
              color: 'rgba(252, 14, 133)',
            },
            areaStyle: {
              // color: 'rgba(252, 157, 14, 0.5)',
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(252, 14, 133, 0.5)',
                },
                {
                  offset: 1,
                  color: 'rgba(252, 14, 133, 0.1)',
                },
              ]),
            },
            tooltip: {
              valueFormatter: function (value) {
                return `${moneyFormat({
                  num: value / 100000000,
                })}亿元`;
              },
            },
            data: info?.TOTAL_ASSET?.dataList?.map((e) => e.value),
          },
        ],
      });
    }
  }, [info]);

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: 'var(--background-color)',
        borderRadius: 4,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="important-title">业绩比较基准</div>
        <div>{info?.formual || ''}</div>
      </div>
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
