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
import { memo, useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import SecDrawer from './SecDrwaer/index';

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
]);

const SecIncomeChart = ({ info }) => {
  const wrapperRef = useRef();
  const chartRef = useRef();
  const wrapperSize = useSize(wrapperRef);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const option = {
      yAxis: [
        {
          type: 'category',
          data: info?.concept?.map((item) => item.name) || [],
          axisTick: {
            show: false,
          },
        },
      ],
      series: [
        {
          data: info?.concept?.map((item) => item.value),
        },
      ],
    };
    chartRef.current?.setOption(option);
  }, [info]);

  useEffect(() => {
    const chart = echarts.init(wrapperRef.current);
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      color: ['#ff2723', '#20d08c'],
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
          ],
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
          data: [
            '-333.45',
            '-244.00',
            '-210.00',
            '-124.40',
            '-50.41',
            '80.50',
            '105.40',
            '320.00',
            '341.00',
            '450.00',
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
        <div className="important-title">按概念</div>
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
        type="gainian"
        visible={visible}
        onClose={() => setVisible(false)}
      />
    </div>
  );
};

export default memo(SecIncomeChart);
