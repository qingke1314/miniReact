import { DoubleRightOutlined } from '@ant-design/icons';
import { useSize } from 'ahooks';
import { Empty } from 'antd';
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

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
]);

const SecIncomeChart = ({ stockData = [] }) => {
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef();
  const chartRef = useRef();
  const wrapperSize = useSize(wrapperRef);

  const filteredStockData = useMemo(() => {
    return findTopAndBottomStocks(stockData, 5);
  }, [stockData]);

  useEffect(() => {
    if (!wrapperRef.current) {
      return;
    }
    const chart = echarts.init(wrapperRef.current);
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
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
          data: filteredStockData.map((item) => item.name),
          axisTick: {
            show: false,
          },
        },
      ],
      xAxis: [
        {
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
            formatter: '{c}',
            position: 'inside',
          },
          itemStyle: {
            color: (params) => {
              return params.value > 0 ? '#ff2723' : '#20d08c';
            },
          },
          data: filteredStockData.map((item) =>
            ((item.value || 0) / 10000).toFixed(2),
          ),
        },
      ],
    };
    chart.setOption(option);
    chartRef.current = chart;
    return () => {
      chartRef.current.dispose();
    };
  }, [filteredStockData]);

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
        <div className="important-title">按股票</div>
        <div onClick={handleCheckMore} className={styles.more}>
          更多
          <DoubleRightOutlined />
        </div>
      </div>
      {stockData?.length ? (
        <div
          style={{
            width: '100%',
            height: 320,
            display: 'inline-block',
          }}
          ref={wrapperRef}
        />
      ) : (
        <Empty
          style={{
            width: '100%',
            height: 320,
            paddingTop: 70,
            display: 'inline-block',
          }}
        />
      )}
      <SecDrawer
        type="gupiao"
        visible={visible}
        stockData={findTopAndBottomStocks(stockData, 15)}
        onClose={() => setVisible(false)}
      />
    </div>
  );
};

export default memo(SecIncomeChart);
