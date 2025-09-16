import { DoubleRightOutlined } from '@ant-design/icons';
import { useSize } from 'ahooks';
import { BarChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { findTopAndBottomStocks } from '../const';
import styles from './index.module.less';
import SecDrawer from './SecDrwaer';
import { moneyFormat } from 'iblive-base';

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
]);

const SecIncomeChart = ({ sector }) => {
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef();
  const chartRef = useRef();
  const wrapperSize = useSize(wrapperRef);
  const filteredStockData = useMemo(() => {
    return findTopAndBottomStocks(sector || [], 5);
  }, [sector]);
  useEffect(() => {
    const option = {
      yAxis: [
        {
          type: 'category',
          data: filteredStockData.map((item) => item.name) || [],
          axisTick: {
            show: false,
          },
        },
      ],
      series: [
        {
          data: filteredStockData.map((item) => {
            return {
              value: item.lengthValue || 0,
              realValue: ((item.value || 0) / 10000).toFixed(2),
            };
          }),
        },
      ],
    };
    chartRef.current?.setOption(option);
  }, [filteredStockData]);

  useEffect(() => {
    const chart = echarts.init(wrapperRef.current);
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        triggerEvent: true,
        formatter: (params) => {
          const data = params[0].data; // 获取第一个系列的数据
          const category = params[0].name;
          // 返回自定义的 HTML 字符串
          return `${category}: <strong>${moneyFormat({
            num: data.realValue,
          })}万元</strong>`;
        },
      },
      color: ['#fcecec', '#d4f4ec'],
      grid: {
        top: '20px',
        left: '10px',
        right: '40px',
        bottom: '10px',
        containLabel: true,
      },
      yAxis: [
        {
          type: 'category',
          data: [
            '煤炭',
            '有色金属',
            '化工',
            '机械设备',
            '电子',
            '家用电器',
            '食品饮料',
            '医药生物',
            '公用事业',
            '交通运输',
          ],
          axisTick: {
            show: false,
          },
          axisPointer: {
            show: true,
            label: {
              show: true,
              formatter: function (params) {
                return params.value;
              },
            },
          },
          axisLabel: {
            width: 70, // 设置标签的最大宽度
            overflow: 'truncate', // 超出部分截断
            ellipsis: '...', // 使用省略号
            // formatter: function (value) {
            //   return '{a|' + value + '}';
            // },
            // rich: {
            //   a: {
            //     width: 70,
            //     overflow: 'truncate',
            //     ellipsis: '...',
            //   },
            // },
            // tooltip: {
            //   show: true,
            // },
          },
        },
      ],
      xAxis: [
        {
          axisLabel: {
            show: false,
          },
          type: 'value',
          name: '万元',
          nameLocation: 'end',
          nameTextStyle: {
            padding: [0, 0, 0, -20],
          },
        },
      ],
      series: [
        {
          type: 'bar',
          label: {
            show: true,
            barMaxWidth: 40, // 新增：设置柱状图最大宽度为 40px
            position: 'inside',
            formatter: (params) => {
              // params.data 就是我们构造的 { value, realValue } 对象
              return moneyFormat({
                num: params.data.realValue,
              });
            },
          },
          itemStyle: {
            color: (params) => {
              return params.value > 0 ? '#ff2723' : '#20d08c';
            },
          },
          data: [
            '-324.42',
            '-244.00',
            '-210.00',
            '-200.00',
            '-103.45',
            '105.40',
            '302.00',
            '320.00',
            '341.00',
            '320.00',
          ],
        },
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
      chartRef.current.resize();
    }
  }, [wrapperSize]);

  const handleCheckMore = () => {
    setVisible(true);
  };
  return (
    <div style={{ marginTop: 8 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div className="important-title">按行业</div>
        <div onClick={handleCheckMore} className={styles.more}>
          更多
          <DoubleRightOutlined />
        </div>
      </div>
      <div
        style={{
          width: '100%',
          height: 320,
          display: 'inline-block',
        }}
        ref={wrapperRef}
      />
      <SecDrawer
        visible={visible}
        onClose={() => setVisible(false)}
        stockData={findTopAndBottomStocks(sector || [], 15)}
      />
    </div>
  );
};

export default memo(SecIncomeChart);
