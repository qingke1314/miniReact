/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2023-02-22 09:11:35
 * @LastEditTime: 2024-10-09 00:24:40
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 */
import { moneyFormat } from 'iblive-base';
import { executeApi } from '@asset360/apis/appCommon';
import { useSize } from 'ahooks';
import { useState } from 'react';
import { PieChart } from 'echarts/charts';
import { LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { useEffect, useRef } from 'react';
import CustomCard from '@asset360/components/CustomCard';

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);

const SecAnalysis = ({ productCode }) => {
  const chartRef = useRef();
  const container = useRef();
  const containerSize = useSize(container);
  const [chartData, setChartData] = useState({});
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.setOption({
        title: [
          {
            text: '债券评级',
            left: '14%',
            top: '0',
            textAlign: 'center',
            textStyle: {
              fontSize: 14,
              fontWeight: '600',
              color: '#333',
            },
          },
          {
            text: '债券期限',
            left: '50%',
            top: '0%',
            textAlign: 'center',
            textStyle: {
              fontSize: 14,
              fontWeight: '600',
              color: '#333',
            },
          },
          {
            text: '债券品种',
            left: '84%',
            top: '0%',
            textAlign: 'center',
            textStyle: {
              fontSize: 14,
              fontWeight: '600',
              color: '#333',
            },
          },
        ],
        tooltip: {
          trigger: 'item',
          borderColor: '#4081FF',
          borderWidth: 1,
          textStyle: {
            fontSize: 13,
            lineHeight: 20,
          },
          formatter: (params) => {
            const { name, value, data } = params;
            const netValueRatio = data.netValueRatio || 0;
            return `<div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 6px; color: #4081FF;">${name}</div>
              <div style="margin-bottom: 4px;">资产金额: <span style="color: #7B81F1; font-weight: 500;">${moneyFormat(
                { num: value, decimal: 2 },
              )}</span></div>
              <div>占比: <span style="color: #F0BE36; font-weight: 500;">${(
                netValueRatio * 100
              ).toFixed(2)}%</span></div>
            </div>`;
          },
        },
        legend: [
          {
            orient: 'horizontal',
            bottom: '10px',
            left: '5%',
            width: '25%',
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
              fontSize: 11,
              color: '#666',
            },
            itemGap: 8,
            data: (chartData.appraise || []).map((e) => e.itemName),
          },
          {
            orient: 'horizontal',
            bottom: '10px',
            left: '37.5%',
            width: '25%',
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
              fontSize: 11,
              color: '#666',
            },
            itemGap: 8,
            data: (chartData.existLimit || []).map((e) => e.itemName),
          },
          {
            orient: 'horizontal',
            bottom: '10px',
            left: '70%',
            width: '25%',
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
              fontSize: 11,
              color: '#666',
            },
            itemGap: 8,
            data: (chartData.secType || []).map((e) => e.itemName),
          },
        ],
        series: [
          {
            name: '债券评级',
            type: 'pie',
            radius: ['30%', '55%'],
            center: ['15%', '45%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 0,
              borderWidth: 0,
            },
            color: [
              '#4081FF',
              '#7B81F1',
              '#B6CEFF',
              '#F0BE36',
              '#FF6B6B',
              '#4ECDC4',
              '#45B7D1',
              '#96CEB4',
              '#FFEAA7',
              '#DDA0DD',
            ],
            label: {
              show: true,
              position: 'outside',
              fontSize: 12,
              fontWeight: '500',
              color: '#333',
              lineHeight: 16,
              formatter: (params) => {
                const { name, data } = params;
                const netValueRatio = data.netValueRatio || 0;
                return `{name|${name}}\n{ratio|${(netValueRatio * 100).toFixed(
                  2,
                )}%}`;
              },
              rich: {
                name: {
                  fontSize: 12,
                  fontWeight: '600',
                  color: '#333',
                  lineHeight: 18,
                },
                ratio: {
                  fontSize: 11,
                  color: '#666',
                  fontWeight: '400',
                  lineHeight: 16,
                },
              },
            },
            labelLine: {
              show: true,
              length: 15,
              length2: 8,
              lineStyle: {
                color: '#ccc',
                width: 1,
              },
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 13,
                fontWeight: 'bold',
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.3)',
              },
            },

            data: (chartData.appraise || []).map((e) => ({
              netValueRatio: e.asset / chartData.appraiseTotal,
              value: e.asset,
              name: e.itemName,
            })),
          },
          {
            name: '债券期限',
            type: 'pie',
            radius: ['30%', '55%'],
            center: ['50%', '45%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 0,
              borderWidth: 0,
            },
            color: [
              '#FF6B6B',
              '#FFEAA7',
              '#DDA0DD',
              '#4081FF',
              '#7B81F1',
              '#B6CEFF',
              '#F0BE36',
              '#4ECDC4',
              '#45B7D1',
              '#96CEB4',
            ],
            label: {
              show: true,
              position: 'outside',
              fontSize: 12,
              fontWeight: '500',
              color: '#333',
              lineHeight: 16,
              formatter: (params) => {
                const { name, data } = params;
                const netValueRatio = data.netValueRatio || 0;
                return `{name|${name}}\n{ratio|${(netValueRatio * 100).toFixed(
                  2,
                )}%}`;
              },
              rich: {
                name: {
                  fontSize: 12,
                  fontWeight: '600',
                  color: '#333',
                  lineHeight: 18,
                },
                ratio: {
                  fontSize: 11,
                  color: '#666',
                  fontWeight: '400',
                  lineHeight: 16,
                },
              },
            },
            labelLine: {
              show: true,
              length: 15,
              length2: 8,
              lineStyle: {
                color: '#ccc',
                width: 1,
              },
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 13,
                fontWeight: 'bold',
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.3)',
              },
            },

            data: (chartData.existLimit || []).map((e) => ({
              netValueRatio: e.asset / chartData.existLimitTotal,
              value: e.asset,
              name: e.itemName,
            })),
          },
          {
            name: '债券品种',
            type: 'pie',
            radius: ['30%', '55%'],
            center: ['85%', '45%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 0,
              borderWidth: 0,
            },
            color: [
              '#4ECDC4',
              '#45B7D1',
              '#4081FF',
              '#7B81F1',
              '#96CEB4',
              '#FFEAA7',
              '#DDA0DD',
              '#FF6B6B',
              '#B6CEFF',
              '#F0BE36',
            ],
            label: {
              show: true,
              position: 'outside',
              fontSize: 12,
              fontWeight: '500',
              color: '#333',
              lineHeight: 16,
              formatter: (params) => {
                const { name, data } = params;
                const netValueRatio = data.netValueRatio || 0;
                return `{name|${name}}\n{ratio|${(netValueRatio * 100).toFixed(
                  2,
                )}%}`;
              },
              rich: {
                name: {
                  fontSize: 12,
                  fontWeight: '600',
                  color: '#333',
                  lineHeight: 18,
                },
                ratio: {
                  fontSize: 11,
                  color: '#666',
                  fontWeight: '400',
                  lineHeight: 16,
                },
              },
            },
            labelLine: {
              show: true,
              length: 15,
              length2: 8,
              lineStyle: {
                color: '#ccc',
                width: 1,
              },
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 13,
                fontWeight: 'bold',
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.3)',
              },
            },
            data: (chartData.secType || []).map((e) => ({
              netValueRatio: e.asset / chartData.secTypeTotal,
              value: e.asset,
              name: e.itemName,
            })),
          },
        ],
      });
    }
  }, [chartData]);
  useEffect(() => {
    const chart = echarts.init(container.current);
    chartRef.current = chart;
    return () => {
      chartRef.current.dispose();
    };
  }, []);
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resize();
    }
  }, [containerSize]);
  useEffect(() => {
    executeApi({
      serviceId: 'DD_API_FUND_BOND_CATEGORY_STAT',
      data: {
        fundCode: productCode,
      },
    }).then((res) => {
      const appraiseTotal = (res.data?.appraise || []).reduce((pre, cur) => {
        return pre + (cur.asset || 0);
      }, 0);
      const existLimitTotal = (res.data?.existLimit || []).reduce(
        (pre, cur) => {
          return pre + (cur.asset || 0);
        },
        0,
      );
      const secTypeTotal = (res.data?.secType || []).reduce((pre, cur) => {
        return pre + (cur.asset || 0);
      }, 0);
      setChartData({
        ...res.data,
        appraiseTotal,
        existLimitTotal,
        secTypeTotal,
      });
    });
  }, [productCode]);
  return (
    <div>
      <CustomCard>
        <div className="important-title">债券资产分布</div>
        <div style={{ height: '360px', paddingTop: '20px' }} ref={container} />
      </CustomCard>
    </div>
  );
};

export default SecAnalysis;
