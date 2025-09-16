import { executeApi } from '@asset360/apis/appCommon';
import OverviewTable from '@asset360/components/OverviewTable';
import { useSize } from 'ahooks';
import { Radio, Row, Spin } from 'antd';
import { BarChart, LineChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { moneyFormat, useGetRequestCancelOperation } from 'iblive-base';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import styles from '../index.less';
const options = [
  { label: '近1月', value: 'ONE_MONTH' },
  { label: '近3月', value: 'THREE_MONTH' },
  { label: '近6月', value: 'SIX_MONTH' },
  { label: '近1年', value: 'ONE_YEAR' },
  { label: '近3年', value: 'THREE_YEAR' },
  { label: '近5年', value: 'FIVE_YEAR' },
];

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

export default ({ productCode }) => {
  const wrapperRef = useRef();
  const wrapperSize = useSize(wrapperRef);
  const [rangeType, setRangeType] = useState(options[0].value);
  const chartRef = useRef();
  const fundNameRef = useRef();

  const {
    getRequestCancelSignal,
    breakRequest,
  } = useGetRequestCancelOperation();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState();
  const [columns, setColumns] = useState([]);
  const [tableData, setTableData] = useState([]);

  const getInfo = async () => {
    setLoading(true);
    breakRequest();
    const signal = getRequestCancelSignal();
    const res = await executeApi(
      {
        serviceId: 'APEX_FUND_TOTAL_EARNINGS_ASSET_API',
        data: {
          fundCode: productCode,
          dateType: rangeType,
        },
      },
      { signal },
    );
    const time = [];
    const echartData = res?.records || [];
    const fundInfo = { ...echartData?.[0], data: [] } || {}; //当前产品
    const standardInfo = { ...echartData?.[1], data: [] } || {}; //业绩比较基准
    const other1Info = { ...echartData?.[2], data: [] } || {};
    const other2Info = { ...echartData?.[3], data: [] } || {};
    const other3Info = { ...echartData?.[4], data: [] } || {};
    const formual = standardInfo?.formual; //公式
    fundNameRef.current = fundInfo.name;
    fundInfo?.dataList?.forEach((item) => {
      fundInfo.data.push(item.ratio);
    });
    standardInfo?.dataList?.forEach((item) => {
      time.push(moment(item.businDate).format('YYYY/MM/DD'));
      standardInfo.data.push(item.ratio);
    });
    other1Info?.dataList?.forEach((item) => {
      other1Info.data.push(item.ratio);
    });
    other2Info?.dataList?.forEach((item) => {
      other2Info.data.push(item.ratio);
    });
    other3Info?.dataList?.forEach((item) => {
      other3Info.data.push(item.ratio);
    });
    setLoading(false);
    setInfo({
      time,
      formual,
      fundInfo,
      standardInfo,
      other1Info,
      other2Info,
      other3Info,
    });
  };

  const getTableInfo = async () => {
    const res = await executeApi({
      serviceId: 'APEX_FUND_TOTAL_EARNINGS_TABLE_ASSET_API',
      data: {
        fundCode: productCode,
      },
    });
    if (res?.code === 1) {
      const tableHeader = [];
      res?.data?.header.forEach((item) => {
        tableHeader.push({
          title: item?.name,
          align: 'right',
          dataIndex: item?.code,
          render: (text) =>
            item.code === 'item'
              ? text
              : moneyFormat({
                  num: text ? text * 100 : text,
                  decimal: 2,
                  unit: '%',
                  needColor: true,
                }),
        });
      });
      setColumns(tableHeader);
      setTableData(res?.data?.eventData);
    }
  };

  useEffect(() => {
    const chart = echarts.init(wrapperRef.current);
    const option = {
      grid: {
        right: '30px',
        bottom: '50px',
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
            formatter: (value) => moneyFormat({ num: value * 100, unit: '%' }),
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
      if (info) {
        legend[info.other1Info.name] = false;
        legend[info.other2Info.name] = false;
        legend[info.other3Info.name] = false;
      }
      chartRef.current.setOption({
        legend: {
          selected: legend,
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
            name: info?.fundInfo?.name,
            // legend: { selectedMode: false },
            type: 'line',
            showSymbol: false,
            itemStyle: {
              color: '#FF4683',
            },
            tooltip: {
              valueFormatter: function (value) {
                return moneyFormat({ num: value * 100, unit: '%' });
              },
            },
            data: info?.fundInfo?.data || [],
            legendHoverLink: false,
          },
          {
            name: info?.standardInfo?.name,
            type: 'line',
            showSymbol: false,
            itemStyle: {
              color: '#00AEFF',
            },
            tooltip: {
              valueFormatter: function (value) {
                return moneyFormat({ num: value * 100, unit: '%' });
              },
            },
            data: info?.standardInfo?.data || [],
          },
          {
            name: info?.other1Info?.name,
            type: 'line',
            showSymbol: false,
            itemStyle: {
              color: '#4ED2B9',
            },
            tooltip: {
              valueFormatter: function (value) {
                return moneyFormat({ num: value * 100, unit: '%' });
              },
            },
            data: info?.other1Info?.data || [],
          },
          {
            name: info?.other2Info?.name,
            type: 'line',
            showSymbol: false,
            itemStyle: {
              color: '#FBBF47',
            },
            tooltip: {
              valueFormatter: function (value) {
                return moneyFormat({ num: value * 100, unit: '%' });
              },
            },
            data: info?.other2Info?.data || [],
          },
          {
            name: info?.other3Info?.name,
            type: 'line',
            showSymbol: false,
            itemStyle: {
              color: '#8B85ED',
            },
            tooltip: {
              valueFormatter: function (value) {
                return moneyFormat({ num: value * 100, unit: '%' });
              },
            },
            data: info?.other3Info?.data || [],
          },
        ],
      });
    }
  }, [info]);

  useEffect(() => {
    if (productCode) {
      getTableInfo();
      getInfo();
    }
  }, [productCode, rangeType]);

  return (
    <>
      <div className="important-title" style={{ position: 'absolute' }}>
        累计收益率走势
      </div>
      <Row justify="end">
        <Radio.Group
          options={options}
          onChange={(e) => setRangeType(e.target.value)}
          value={rangeType}
          optionType="button"
          buttonStyle="solid"
          className={styles.range_List}
        />
      </Row>

      <div>{info?.formual || ''}</div>
      <Spin active spinning={loading}>
        <div
          style={{
            width: 'calc(100% - 600px)',
            height: 350,
            display: 'inline-block',
          }}
          ref={wrapperRef}
        />
        <div style={{ display: 'inline-block', width: 600 }}>
          <OverviewTable
            pagination={false}
            showTotal={false}
            columns={columns}
            dataSource={tableData}
          />
        </div>
      </Spin>
    </>
  );
};
