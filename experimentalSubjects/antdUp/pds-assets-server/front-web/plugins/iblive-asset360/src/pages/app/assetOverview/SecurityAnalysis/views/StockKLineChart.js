/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-09-30 14:46:53
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 * @LastEditTime: 2024-12-11 15:02:03
 * @Description:
 */
import { useSize } from 'ahooks';
import * as echarts from 'echarts';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { moneyFormat } from 'iblive-base';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';

const upColor = '#ec0000';
const upBorderColor = '#8A0000';
const downColor = '#00da3c';
const downBorderColor = '#008F28';
echarts.use([
  TooltipComponent,
  GridComponent,
  LineChart,
  BarChart,
  CanvasRenderer,
  UniversalTransition,
]);

const SELL_OBJECT = {
  GPJY_SELL: ' 卖出',
  GPJY_BUY: ' 买入',
};

export default ({ info }) => {
  const [charData, setCharData] = useState({});
  const containerKRef = useRef();
  const chartRef = useRef();
  const containerSize = useSize(containerKRef);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      formatter: function (params) {
        let rk, ma5, ma10, ma20;
        params.forEach((item, index) => {
          if (index == 0) {
            rk = item.data;
          }
          if (item.seriesName === 'MA5') ma5 = item.data;
          if (item.seriesName === 'MA10') ma10 = item.data;
          if (item.seriesName === 'MA20') ma20 = item.data;
        });
        return (
          params?.[0]?.name +
          '<br>' +
          (rk?.[1] ? '开盘:' + rk[1] + '<br>' : '') +
          (rk?.[2] ? '收盘:' + rk[2] + '<br>' : '') +
          (rk?.[3] ? '最低:' + rk[3] + '<br>' : '') +
          (rk?.[4] ? '最高:' + rk[4] + '<br>' : '') +
          (ma5 ? 'MA5: ' + ma5 + '<br>' : '') +
          (ma10 ? 'MA10: ' + ma10 + '<br>' : '') +
          (ma20 ? 'MA20: ' + ma20 + '<br>' : '')
        );
      },
    },
    legend: {
      data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30'],
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
    },
    xAxis: {
      type: 'category',
      data: charData?.time,
      boundaryGap: false,
      axisLine: { onZero: false },
      splitLine: { show: false },
      min: 'dataMin',
      max: 'dataMax',
    },
    yAxis: {
      scale: true,
      splitArea: {
        show: false,
      },
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
        top: '90%',
        start: 0,
        end: 100,
      },
    ],
    series: [
      {
        name: '日K',
        type: 'candlestick',
        data: charData?.dayKData,
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: upBorderColor,
          borderColor0: downBorderColor,
        },
        markPoint: {
          label: {
            formatter: function () {
              return '';
            },
          },
          data: charData?.tradeInfo,
          //关闭高亮才能触发tooltip
          emphasis: {
            disabled: true,
          },
          tooltip: {
            trigger: 'item',
            formatter: function (param) {
              const data = param.data;
              let renderText = param.name + '<br>';
              data.amount.forEach((item, index) => {
                renderText =
                  renderText +
                  data.fundCode[index] +
                  '产品' +
                  ' 以' +
                  moneyFormat({ num: data.avgAmount[index], decimal: 2 }) +
                  ' * ' +
                  data.qty[index] +
                  SELL_OBJECT[data.etruDire[index]] +
                  '<br>';
              });
              return renderText;
            },
          },
        },
      },
      {
        name: 'MA5',
        type: 'line',
        data: charData?.m5Data,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: 'MA10',
        type: 'line',
        data: charData?.m10Data,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: 'MA20',
        type: 'line',
        data: charData?.m20Data,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          opacity: 0.5,
        },
      },
    ],
  };

  useEffect(() => {
    if (info) {
      let time = [];
      let dayKData = [];
      let m5Data = [];
      let m10Data = [];
      let m20Data = [];
      let tradeInfo = [];
      info.forEach((item) => {
        const itemTime = moment(item.businDate.toString()).format('YYYY/MM/DD');
        time.push(itemTime);
        dayKData.push([item.open, item.close, item.lowest, item.highest]);
        m5Data.push(item.ma5AvgPrice);
        m10Data.push(item.ma10AvgPrice);
        m20Data.push(item.ma20AvgPrice);
        if (item?.tradeInfo) {
          let coord = [];
          let fundCode = [];
          let amount = [];
          let etruDire = [];
          let qty = [];
          let avgAmount = [];
          coord = [itemTime, item.highest];
          item.tradeInfo.forEach((item2) => {
            fundCode.push(item2.fundCode);
            amount.push(item2.amount);
            etruDire.push(item2.etruDire);
            qty.push(item2.qty);
            avgAmount.push(item2.avgAmount);
          });
          tradeInfo.push({
            coord,
            fundCode,
            amount,
            etruDire,
            qty,
            avgAmount,
          });
        }
      });
      setCharData({
        time: time,
        dayKData: dayKData,
        m5Data: m5Data,
        m10Data: m10Data,
        m20Data: m20Data,
        tradeInfo: tradeInfo,
      });
    }
  }, [info]);

  useEffect(() => {
    const chart = echarts.init(containerKRef.current);
    charData && chart.setOption(option);
    chartRef.current = chart;
    return () => {
      chartRef.current.dispose();
    };
  }, [charData]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resize();
    }
  }, [containerSize]);

  return <div style={{ width: '100%', height: 340 }} ref={containerKRef} />;
};
