import CustomDrawer from '@asset360/components/CustomDrawer';
import { useSize } from 'ahooks';
import { BarChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useEffect, useMemo, useRef } from 'react';
import styles from './index.module.less';

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
]);

const SecDrawer = ({
  onClose = () => {},
  visible = false,
  type = 'hangye',
  stockData = [],
}) => {
  const wrapperRef = useRef();
  const wrapperSize = useSize(wrapperRef);
  const chartRef = useRef();
  const typeInfo = useMemo(() => {
    if (type === 'hangye') {
      return {
        title: '按行业',
        yData: stockData.map((item) => item.name),
        xData: stockData.map((item) => item.value),
      };
    } else if (type === 'gainian') {
      return {
        title: '按概念',
        yData: [
          '两会',
          '新能源',
          '新三板',
          '节能环保',
          '重组',
          '一带一路',
          '海南自贸港',
          '国企改革',
          '军民融合',
          '雄安新区',
          'AI',
          '半导体',
          '机器人',
          '芯片',
          '5G',
          '人工智能',
          '新能源汽车',
          '光伏',
          '储能',
          '太空探索',
        ],
        xData: [
          '-750.00',
          '-550.00',
          '-450.00',
          '-320.00',
          '-284.00',
          '-210.00',
          '-110.00',
          '-80.40',
          '-50.00',
          '-20.00',
          '-10.00',
          '7.00',
          '10.00',
          '30.00',

          '30.00',
          '50.00',
          '80.00',
          '100.00',
          '120.00',
          '150.00',
          '200.00',

          '241.00',
          '350.00',
          '450.00',
          '550.00',

          '1550.00',
        ],
      };
    } else if (type === 'gupiao') {
      return {
        title: '按股票',
        yData: stockData.map((item) => item.name),
        xData: stockData.map((item) => ((item.value || 0) / 10000).toFixed(2)),
      };
    }
  }, [type, stockData]);
  useEffect(() => {
    if (!visible) return;
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
        right: '10px',
        bottom: '10px',
        containLabel: true,
      },
      yAxis: [
        {
          type: 'category',
          data: typeInfo.yData,
          axisTick: {
            show: false,
          },
        },
      ],
      xAxis: [
        {
          type: 'value',
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
          data: typeInfo.xData,
        },
      ],
    };
    chart.setOption(option);
    chartRef.current = chart;
    return () => {
      chartRef.current.dispose();
    };
  }, [visible, typeInfo]);
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resize();
    }
  }, [wrapperSize]);
  return (
    <CustomDrawer
      placement="right"
      onClose={onClose}
      closable={false}
      visible={!!visible}
      width={'600px'}
      height={'100%'}
      maskClosable={true}
      className={styles.plate_content}
      bodyStyle={{ padding: '5px 10px 5px 10px' }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ width: '50%' }} className="important-title">
            {typeInfo.title}
          </div>
          {/* <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: 20,
                height: 10,
                backgroundColor: '#ff2723',
                marginRight: 8,
                borderRadius: 4,
              }}
            />
            <div>盈利</div>
            <div
              style={{
                width: 20,
                height: 10,
                backgroundColor: '#20d08c',
                margin: '0 8px',
                borderRadius: 4,
              }}
            />
            <div>亏损</div>
          </div> */}
        </div>
        <div
          style={{
            width: '100%',
            height: 'calc(100vh - 40px)',
            display: 'inline-block',
          }}
          ref={wrapperRef}
        />
      </div>
    </CustomDrawer>
  );
};

export default SecDrawer;
