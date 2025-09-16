import { useSize } from 'ahooks';
import { BarChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { memo, useEffect, useRef } from 'react';

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
  useEffect(() => {
    const option = {
      yAxis: [
        {
          type: 'category',
          data: info?.mktValue?.map((item) => item.name) || [],
          axisTick: {
            show: false,
          },
        },
      ],
      series: [
        {
          data: info?.mktValue?.map((item) => item.value),
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
        right: '10px',
        bottom: '10px',
        containLabel: true,
      },
      yAxis: [
        {
          type: 'category',
          data: [
            '50亿以下',
            '50亿-100亿',
            '100亿-300亿',
            '300亿-500亿',
            '500亿-1000亿',
            '1000亿以上',
          ],
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
          data: [
            '-244.00',
            '-210.00',
            '-200.00',
            '302.00',
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
  return (
    <div style={{ marginTop: 8 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div className="important-title">按盘子</div>
        {/* <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}
          >
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
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: 20,
                height: 10,
                backgroundColor: '#20d08c',
                marginRight: 8,
                borderRadius: 4,
              }}
            />
            <div>亏损</div>
          </div>
        </div> */}
      </div>
      <div
        style={{
          width: '100%',
          height: 320,
          display: 'inline-block',
        }}
        ref={wrapperRef}
      />
    </div>
  );
};

export default memo(SecIncomeChart);
