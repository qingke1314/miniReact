
import { moneyFormat, generateColor } from 'iblive-base';
import { useSize } from 'ahooks';
import { Col, Row, Tag } from 'antd';
import { LineChart } from 'echarts/charts';
import {
  DataZoomComponent,
  GridComponent,
  MarkAreaComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import moment from 'moment';
import { useEffect, useRef } from 'react';
import styles from '../index.less';

echarts.use([
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  MarkAreaComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

const CustomTag = ({ title, onClose, closable = true.valueOf, ...config }) => (
  <Tag className={styles.tag} closable={closable} onClose={onClose} {...config}>
    {title || '--'}
  </Tag>
);

const INIT_OPTION = {
  grid: {
    bottom: 80,
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 100,
    },
    {
      show: true,
      type: 'slider',
      start: 0,
      end: 100,
    },
  ],
  xAxis: {
    type: 'category',
    axisLine: { onZero: false },
    axisLabel: {
      formatter: (value) => moment(value, 'YYYYMMDD').format('YYYY-MM-DD'),
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: (value) => moneyFormat({ num: value, unit: '%' }),
    },
    scale: true,
  },
};
export default ({
  xData,
  data,
  marketNameObj,
  controlGroup,
  selectedMarket,
  removeControlGroup,
  resetControlGroup,
}) => {
  const containerRef = useRef();
  const containerSize = useSize(containerRef);
  const chartRef = useRef();
  const interCodeList = [selectedMarket, ...(controlGroup || [])];

  useEffect(() => {
    const dom = containerRef.current;
    const chart = echarts.init(dom);
    chart.setOption(INIT_OPTION);
    chartRef.current = chart;
    return () => {
      chartRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.clear();
      chartRef.current.setOption({
        ...INIT_OPTION,
        color: generateColor(30),
        tooltip: (data || []).map((item) => ({
          trigger: 'axis',
          formatter: (param) => {
            const arry = [
              moment(param[0]?.axisValue, 'YYYYMMDD').format('YYYY-MM-DD'),
            ];
            param.forEach((paramItem) => {
              const { dataIndex, marker, seriesName } = paramItem;
              arry.push(
                marker +
                  seriesName +
                  '&nbsp;&nbsp;' +
                  moneyFormat({ num: item[dataIndex]?.lastPrice }),
              );
            });
            return arry.join('<br/>');
          },
        })),
        xAxis: {
          data: xData,
          type: 'category',
          axisLine: { onZero: false },
          axisLabel: {
            formatter: (value) =>
              moment(value, 'YYYYMMDD').format('YYYY-MM-DD'),
          },
        },
        series: (data || []).map((item, index) => ({
          name: marketNameObj?.[interCodeList[index]],
          data: item.map((item) => parseFloat(item.yield) * 100),
          type: 'line',
          showSymbol: false,
        })),
      });
    }
  }, [data]);

  useEffect(() => {
    chartRef.current && chartRef.current.resize();
  }, [containerSize]);
  return (
    <div className={styles.chart_model}>
      <Row align="middle" gutter={16}>
        <Col>
          <CustomTag title={marketNameObj?.[selectedMarket]} closable={false} />
        </Col>
        {(controlGroup || []).map((interCode) => (
          <CustomTag
            title={marketNameObj?.[interCode]}
            key={interCode}
            onClose={() => removeControlGroup(interCode)}
          />
        ))}
        <Col>
          <CustomTag
            title="重置"
            closable={false}
            onClick={resetControlGroup}
          />
        </Col>
      </Row>
      <div ref={containerRef} className={styles.chart_wrapper} />
    </div>
  );
};
