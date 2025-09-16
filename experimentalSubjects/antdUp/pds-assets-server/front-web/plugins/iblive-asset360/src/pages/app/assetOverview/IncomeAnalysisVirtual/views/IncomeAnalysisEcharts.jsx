// import { useModel } from 'umi';
import { executeApi } from '@asset360/apis/appCommon';
import { useSize } from 'ahooks';
import { Empty, Radio, Spin } from 'antd';
import { TreemapChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { UniversalTransition } from 'echarts/features';
import { SVGRenderer } from 'echarts/renderers';
import { CustomTableWithYScroll, moneyFormat } from 'iblive-base';
import { useEffect, useRef, useState } from 'react';
import { selectType } from '../const';
import styles from './index.module.less';

echarts.use([
  TooltipComponent,
  GridComponent,
  TreemapChart,
  SVGRenderer,
  UniversalTransition,
]);
const IncomeAnalysisEcharts = ({
  productCode,
  activeDateRange,
  activeSelect,
  moreValues,
  calendarValue,
  selectedStock,
  setSelectedStock,
}) => {
  const [loading, _setLoading] = useState(false);
  const wrapperSize = useSize(wrapperRef);
  const chartRef = useRef(null);
  const wrapperRef = useRef(null);
  const [type, setType] = useState('1');
  const [tableDataSource, setTableDataSource] = useState([]);
  const [stockData, setStockData] = useState([]);
  useEffect(() => {
    if (!productCode || !activeDateRange?.length) return;
    const startDate = calendarValue.clone().startOf(selectType.get());
    const endDate = calendarValue.clone().endOf(selectType.get());
    executeApi({
      serviceId: 'DD_API_FUND_STOCK_INCOME_STAT',
      data: {
        fundCode: productCode,
        startDate: startDate.format('YYYYMMDD'),
        endDate: endDate.format('YYYYMMDD'),
        astUnitId: activeSelect?.astUnitId
          ? Number(activeSelect?.astUnitId)
          : null,
        combiCode: activeSelect?.combiCode || null,
        ...moreValues,
      },
    }).then((res) => {
      if (res?.code > 0) {
        const table = (res?.records || [])
          .filter((e) => e.secName)
          .map((e) => ({
            ...e,
            name: e.secName,
            value: Math.abs(e.income ? e.income / 10000 : 0),
            win: e.income > 0,
            rate: e.incomeRatio?.toFixed(2) || 0,
            itemStyle: {
              color: e.income > 0 ? '#fcecec' : '#d4f4ec',
            },
          }));
        setStockData(table);
        setTableDataSource(table);
      }
    });
  }, [
    productCode,
    activeSelect?.astUnitId,
    activeSelect?.combiCode,
    moreValues,
    calendarValue,
  ]);

  /**
   * 树矩阵初始配置
   */
  useEffect(() => {
    if (type !== '1' || stockData.length === 0) return;
    const chart = echarts.init(wrapperRef.current);
    const option = {
      tooltip: {
        formatter: (params) =>
          `${params.data.name}  ${params.data.win ? '+' : '-'}${
            params.data.rate + '% ' || ''
          }${params.data.value}`,
      },
      series: [
        {
          breadcrumb: {
            show: false,
          },
          top: 16, // 上边距
          right: '5%', // 右边距
          bottom: '30px',
          left: '5%', // 左边距
          itemStyle: {
            // borderColor: 'transparent', // 'rgba(0,0,0,0.2)',
            // backgroundColor: '#5fa75f',
          },
          label: {
            position: 'insideTopLeft',
            formatter: function (params) {
              let arr = [
                '{name|' + params.name + '}',
                '{hr|}',
                params.data.win
                  ? '{budgetWin| ' +
                    '+' +
                    echarts.format.addCommas(params.value) +
                    '}'
                  : '{budgetLose| ' +
                    '-' +
                    echarts.format.addCommas(params.value) +
                    '}',
                params.data.win
                  ? '{budgetWin| ' +
                    '+' +
                    echarts.format.addCommas(params.data.rate) +
                    '%' +
                    '}'
                  : '{budgetLose| ' +
                    '-' +
                    echarts.format.addCommas(params.data.rate) +
                    '%' +
                    '}',
              ];
              return arr.join('\n');
            },
            rich: {
              budgetWin: {
                fontSize: 18,
                lineHeight: 22,
                color: '#ff2723',
              },
              budgetLose: {
                fontSize: 18,
                lineHeight: 22,
                color: '#20d08c',
              },
              name: {
                fontSize: 14,
                color: '#333',
              },
              hr: {
                width: '100%',
                borderColor: 'rgba(255,255,255,0.2)',
                borderWidth: 0.5,
                height: 0,
                lineHeight: 10,
              },
            },
          },
          // roam: false,
          name: '个股拆解',
          type: 'treemap',
          visibleMin: 300,
          data: [
            {
              name: '股票',
              id: 'product1-stock',
              children: stockData,
            },
          ],
          leafDepth: 3,
          levels: [
            {
              itemStyle: {
                borderColor: '#777',
                borderWidth: 0,
                gapWidth: 1,
              },
            },
            {
              // upperLabel: {
              //   show: true,
              //   padding: 6,
              //   height: 26,
              //   formatter: (params) => {
              //     return params.data.win
              //       ? params.data.name +
              //           `{patchRedColor|  +${params.data.rate}% +${params.data.value}}`
              //       : params.data.name +
              //           `{patchGreenColor|  -${params.data.rate}% -${params.data.value}}`;
              //   },
              //   rich: {
              //     patchRedColor: {
              //       color: '#ff2723',
              //       fontSize: 14,
              //       //textBorderColor: '#ff2723',
              //       textBorderWidth: 1,
              //     },
              //     patchGreenColor: {
              //       color: '#20d08c',
              //       fontSize: 14,
              //       //textBorderColor: '#20d08c',
              //       textBorderWidth: 1,
              //     },
              //   },
              // },
              itemStyle: {
                // borderColor: '#e5e5e5',
                // borderWidth: 5,
                // gapWidth: 1,
              },
            },
            {
              itemStyle: {
                borderWidth: 2,
                borderColor: 'white',
                gapWidth: 2,
              },
            },
          ],
        },
      ],
    };
    chart.setOption(option);
    const handleClick = (params) => {
      // 如果没有children，说明是叶子节点（股票）
      if (!params.data?.children && params.data) {
        const stockData = params.data;
        setSelectedStock(
          tableDataSource.find((e) => e.interCode === stockData.interCode),
        );
      }
    };

    chart.on('click', handleClick);

    chartRef.current = chart;
    return () => {
      chart.off('click', handleClick);
      chartRef.current.dispose();
    };
  }, [type, stockData]);
  useEffect(() => {
    setSelectedStock(null);
  }, [tableDataSource]);
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resize();
    }
    // if (chartRef2.current) {
    //   chartRef2.current.resize();
    // }
  }, [wrapperSize]); //wrapperSize2
  const moneyRender = (text) => {
    return (
      <div>
        {moneyFormat({
          num: text,
          needColor: true,
          decimal: 2,
        })}
      </div>
    );
  };
  const numberRender = (text) => {
    return (
      <div>
        {moneyFormat({
          num: text,
        })}
      </div>
    );
  };
  const stockColumns = [
    {
      title: '证券内码',
      dataIndex: 'interCode',
    },
    {
      title: '持有天数',
      dataIndex: 'holdDays',
      align: 'right',
    },
    {
      title: '市值',
      dataIndex: 'marketValue',
      align: 'right',
      render: numberRender,
    },
    {
      title: '持有收益',
      dataIndex: 'income',
      align: 'right',
      render: moneyRender,
    },
    {
      title: '累计收益',
      dataIndex: 'incomeSum',
      align: 'right',
      render: moneyRender,
    },
    {
      title: '交易费用',
      dataIndex: 'fee',
      align: 'right',
      render: moneyRender,
    },
  ];
  return (
    <div className={styles.incomeAnalysisEcharts}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div className="important-title">个股拆解</div>
        <Radio.Group
          options={[
            { label: '矩阵图', value: '1' },
            { label: '表格', value: '2' },
          ]}
          onChange={(e) => setType(e.target.value)}
          value={type}
          optionType="button"
          buttonStyle="solid"
        ></Radio.Group>
      </div>
      {type === '1' && (
        <>
          {stockData.length > 0 ? (
            <>
              {/* <div className={styles.echartsTitle}>资产收益构成（万元）</div>
        <div className={styles.echartsSubTitle}>2012/08/01 - 2012/09/30</div> */}
              <Spin active spinning={loading}>
                <div
                  style={{
                    width: '100%',
                    height: 420,
                    display: 'inline-block',
                  }}
                  ref={wrapperRef}
                />
              </Spin>
            </>
          ) : (
            <div
              style={{
                width: '100%',
                height: 420,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Empty description="暂无数据" />
            </div>
          )}
          {selectedStock && (
            <CustomTableWithYScroll
              style={{ marginTop: 8 }}
              columns={stockColumns}
              dataSource={[selectedStock]}
              rowKey="id"
            />
          )}
        </>
      )}
      {type === '2' && (
        <CustomTableWithYScroll
          style={{ marginTop: 8 }}
          columns={stockColumns}
          height={320}
          dataSource={tableDataSource}
          rowKey="id"
          onRow={(record) => {
            return {
              onClick: () => setSelectedStock(record),
            };
          }}
          rowClassName={(record) => {
            return record?.interCode === selectedStock?.interCode
              ? styles.selected_row
              : '';
          }}
        />
      )}
      {/* {type === '3' && (
        <StockInfo
          setSelectedStock={setSelectedStock}
          stockData={tableDataSource}
        />
      )} */}
    </div>
  );
};
export default IncomeAnalysisEcharts;
