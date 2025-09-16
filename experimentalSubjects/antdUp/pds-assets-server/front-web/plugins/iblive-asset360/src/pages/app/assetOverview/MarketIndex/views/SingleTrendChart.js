/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-12-26 16:47:23
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-12-30 15:13:50
 * @Description:
 */

import { moneyFormat, generateColor } from 'iblive-base';
import { CaretUpOutlined } from '@ant-design/icons';
import { useSize } from 'ahooks';
import { Col, Row, Space } from 'antd-v5';
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
import { isNumber } from 'lodash';
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

const BLANK_SPAN_STR =
  '<span style="display:inline-block;margin-right:4px;width:10px;height:10px;"></span>';

export default ({ xData, data, indexName }) => {
  const info = (data?.[0] || []).slice(-1)[0];
  const containerRef = useRef();
  const containerSize = useSize(containerRef);
  const chartRef = useRef();

  useEffect(() => {
    const dom = containerRef.current;
    const chart = echarts.init(dom);
    chart.setOption({
      color: generateColor(30),
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
          formatter: (value) => moneyFormat({ num: value }),
        },
        scale: true,
      },
    });
    chartRef.current = chart;
    return () => {
      chartRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.setOption({
        tooltip: {
          trigger: 'axis',
          formatter: (param) => {
            const { dataIndex, marker, axisValue } = param[0];
            const info = data?.[0]?.[dataIndex] || {};
            return [
              '<b>' + indexName + '</b>',
              moment(axisValue, 'YYYYMMDD').format('YYYY-MM-DD'),
              BLANK_SPAN_STR +
                '开：' +
                moneyFormat({ num: info.tdayOpenPrice }),
              BLANK_SPAN_STR + '高：' + moneyFormat({ num: info.highestPrice }),
              BLANK_SPAN_STR + '低：' + moneyFormat({ num: info.lowestPrice }),
              marker + '收：' + moneyFormat({ num: info.lastPrice }),
              BLANK_SPAN_STR +
                '涨跌：' +
                moneyFormat({ num: info.daiilChange }) +
                '（' +
                moneyFormat({
                  num: isNumber(info.daiilChangePercent)
                    ? info.daiilChangePercent * 100
                    : null,
                  unit: '%',
                }) +
                '）',
              BLANK_SPAN_STR +
                '成交量：' +
                moneyFormat({
                  num: isNumber(info?.dealQty) ? info?.dealQty / 10000 : null,
                  unit: '（万手）',
                }),
              BLANK_SPAN_STR +
                '成交额：' +
                moneyFormat({
                  num: isNumber(info?.dealAmt)
                    ? info?.dealAmt / 100000000
                    : null,
                  unit: '（亿元）',
                }),
            ].join('<br/>');
          },
        },
        xAxis: {
          type: 'category',
          data: xData,
        },
        series: [
          {
            data: (data?.[0] || []).map((item) => parseFloat(item.lastPrice)),
            type: 'line',
            showSymbol: false,
          },
        ],
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
          <Space
            size={4}
            className={
              info?.daiilChange > 0
                ? styles.rise
                : info?.daiilChange < 0
                ? styles.down
                : undefined
            }
          >
            <span className={styles.last_price}>
              {moneyFormat({ num: info?.lastPrice })}
            </span>
            {info?.lastPrice && (
              <CaretUpOutlined className={styles.direction_icon} />
            )}
            {moneyFormat({ num: info?.daiilChange })}
            {moneyFormat({
              num: isNumber(info?.daiilChangePercent)
                ? info?.daiilChangePercent * 100
                : null,
              unit: '%',
            })}
          </Space>
        </Col>
        <Col>
          昨收：
          <span className="important-text">
            {moneyFormat({ num: info?.ydayClosedPrice })}
          </span>
        </Col>
        <Col>
          今开：
          <span className="important-text">
            {moneyFormat({ num: info?.tdayOpenPrice })}
          </span>
        </Col>
        <Col>
          成交量：
          <span className="important-text">
            {moneyFormat({
              num: isNumber(info?.dealQty) ? info?.dealQty / 10000 : null,
            })}
          </span>
          万手
        </Col>
        <Col>
          成交额：
          <span className="important-text">
            {moneyFormat({
              num: isNumber(info?.dealAmt) ? info?.dealAmt / 100000000 : null,
            })}
          </span>
          亿元
        </Col>
      </Row>
      <div ref={containerRef} className={styles.chart_wrapper} />
    </div>
  );
};
