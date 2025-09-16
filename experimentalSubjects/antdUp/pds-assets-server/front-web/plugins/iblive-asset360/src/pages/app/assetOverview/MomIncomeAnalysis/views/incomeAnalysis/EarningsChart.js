import { executeApi } from '@asset360/apis/appCommon';
import { useSize } from 'ahooks';
import { Spin } from 'antd-v5';
import { BarChart, LineChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { moneyFormat } from 'iblive-base';
import moment from 'moment';
import { memo, useEffect, useRef, useState } from 'react';

// 注册ECharts所需的组件
echarts.use([
  TooltipComponent, // 提示框组件
  GridComponent, // 网格组件
  LegendComponent, // 图例组件
  BarChart, // 柱状图
  LineChart, // 折线图
  CanvasRenderer, // Canvas渲染器
  UniversalTransition, // 通用过渡动画
]);

/**
 * 收益分析图表组件
 * @param {string} productCode - 产品代码
 * @param {Array} activeDateRange - 激活的日期范围 [开始日期, 结束日期]
 * @param {Function} setStats - 设置统计数据的回调函数
 * @param {Object} activeSelect - 当前选中的资产单元信息
 */
const EarningsChart = ({
  productCode,
  activeDateRange,
  setStats,
  activeSelect,
}) => {
  // DOM引用和状态管理
  const wrapperRef = useRef(); // 图表容器引用
  const wrapperSize = useSize(wrapperRef); // 监听容器尺寸变化
  const chartRef = useRef(); // ECharts实例引用
  const fundNameRef = useRef(); // 基金名称引用，用于图例控制
  const [loading, setLoading] = useState(false); // 加载状态
  const [info, setInfo] = useState(); // 图表数据
  /**
   * 获取图表数据
   * 当日期范围、产品代码或选中的资产单元发生变化时触发
   */
  useEffect(() => {
    if (!activeDateRange) {
      return;
    }

    setLoading(true);
    executeApi({
      serviceId: 'DD_API_FUND_AST_UNIT_ASSET_STAT',
      data: {
        fundCode: productCode,
        startDate: activeDateRange?.[0]?.format('YYYYMMDD'),
        endDate: activeDateRange?.[1]?.format('YYYYMMDD'),
        astUnitId: activeSelect?.astUnitId
          ? Number(activeSelect?.astUnitId)
          : null,
      },
    })
      .then((res) => {
        if (res?.code > 0 && res?.records?.length) {
          // 处理时间轴数据
          const time = res.records[0].dataList.map((e) =>
            moment(String(e.businDate)).format('YYYY/MM/DD'),
          );

          // 提取业绩比较基准数据
          const PERFORMANCE_BENCHMARK = res.records.find(
            (e) => e.code === 'PERFORMANCE_BENCHMARK',
          );
          const formual = PERFORMANCE_BENCHMARK?.formual;

          // 提取资产单元净资产数据（可能有多个）
          const AST_UNIT_NET_ASSET =
            res.records.filter((e) => e.code === 'AST_UNIT_NET_ASSET') || [];

          // 提取基金净资产数据
          const FUND_NET_ASSET = res.records.find(
            (e) => e.code === 'FUND_NET_ASSET',
          );

          // 设置图表数据
          setInfo({
            time,
            formual,
            PERFORMANCE_BENCHMARK,
            AST_UNIT_NET_ASSET,
            FUND_NET_ASSET,
          });
          // 向父组件传递统计数据
          setStats(res?.records.filter((e) => e.level === 'MASTER'));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeDateRange, productCode, activeSelect]);

  /**
   * 初始化ECharts实例
   * 只在组件挂载时执行一次
   */
  useEffect(() => {
    const chart = echarts.init(wrapperRef.current);

    // 初始化图表配置
    const option = {
      xAxis: [
        {
          type: 'category',
          axisPointer: {
            type: 'shadow', // 阴影指示器
          },
          axisTick: {
            show: false, // 隐藏刻度线
          },
          data: [], // 初始为空数据
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '', // 左侧Y轴（百分比）
          axisPointer: { show: false },
          axisLabel: {
            formatter: (value) => moneyFormat({ num: value, unit: '%' }),
          },
        },
        {
          type: 'value',
          name: '产品规模(亿元)', // 右侧Y轴（金额）
          position: 'right',
          axisPointer: { show: false },
          axisLabel: {
            formatter: (value) =>
              `${moneyFormat({
                num: value / 100000000, // 转换为亿元
              })}`,
          },
        },
      ],
    };

    chart.setOption(option);

    // 监听图例选择事件，确保产品本身的折线图不可取消显示
    chart.on('legendselectchanged', (params) => {
      if (params.name == fundNameRef.current) {
        chart.dispatchAction({
          type: 'legendSelect',
          name: params.name,
          selected: true, // 强制保持选中状态
        });
      }
    });

    chartRef.current = chart;

    // 组件卸载时销毁图表实例
    return () => {
      chartRef.current.dispose();
    };
  }, []);

  /**
   * 响应容器尺寸变化，重新调整图表大小
   */
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resize();
    }
  }, [wrapperSize]);

  /**
   * 更新图表数据和配置
   * 当图表数据发生变化时触发
   */
  useEffect(() => {
    if (chartRef.current) {
      const legend = {}; // 图例选择状态配置

      chartRef.current.setOption(
        {
          color: [
            'rgba(247, 138, 73, 1)', // 橙色部分 (18)
            'rgb(75, 171, 206)', // 青绿色部分 (25)
            'rgba(123, 97, 255, 1)', // 紫色部分 (10)
            'rgba(54, 126, 249, 1)', // 蓝色部分 (27)
            'rgba(193, 121, 255, 1)', // 淡紫色部分 (15)
          ],
          // 图表
          // 网格配置
          grid: {
            top: '50px', // 顶部留白，为图例预留空间
            right: '60px', // 右侧留白，为右Y轴标签预留空间
            bottom: '30px', // 底部留白
            left: '50px', // 左侧留白，为左Y轴标签预留空间
          },
          // 提示框配置
          tooltip: {
            trigger: 'axis', // 坐标轴触发
            axisPointer: {
              type: 'cross', // 十字准星指示器
              crossStyle: {
                color: '#999',
              },
            },
          },
          // 图例配置
          legend: {
            selected: legend,
          },
          // X轴配置
          xAxis: [
            {
              type: 'category',
              data: info?.time || [], // 时间轴数据
              axisPointer: {
                type: 'shadow',
              },
              axisTick: {
                show: false,
              },
            },
          ],
          // Y轴配置（双Y轴）
          yAxis: [
            {
              type: 'value',
              name: '', // 左侧Y轴：百分比
              axisPointer: { show: false },
              axisLabel: {
                formatter: (value) => moneyFormat({ num: value, unit: '%' }),
              },
            },
            {
              type: 'value',
              name: '产品规模(亿元)', // 右侧Y轴：金额
              position: 'right',
              axisPointer: { show: false },
              axisLabel: {
                formatter: (value) =>
                  `${moneyFormat({
                    num: value / 100000000, // 转换为亿元单位
                  })}`,
              },
            },
          ],
          // 系列数据配置
          series: [
            // 资产单元净资产折线图（可能有多条）
            ...(info?.AST_UNIT_NET_ASSET || []).map((e) => ({
              name: e.name,
              type: 'line',
              showSymbol: false, // 不显示数据点
              yAxisIndex: 1, // 关联到右侧Y轴（金额轴）
              areaStyle: {}, // 面积图样式
              tooltip: {
                valueFormatter: function (value) {
                  return `${moneyFormat({
                    num: value / 100000000,
                  })}亿元`;
                },
              },
              data: e.dataList?.map((e) => e.value),
              legendHoverLink: false, // 禁用图例悬停联动
            })),
            // 业绩比较基准折线图
            {
              name: info?.PERFORMANCE_BENCHMARK?.name,
              type: 'line',
              showSymbol: false,
              // itemStyle: {
              //   color: '#00AEFF', // 蓝色
              // },
              tooltip: {
                valueFormatter: function (value) {
                  return moneyFormat({ num: value, unit: '%' });
                },
              },
              data: info?.PERFORMANCE_BENCHMARK?.dataList?.map((e) => e.ratio),
            },
            // 基金净资产折线图（带渐变填充）
            {
              name: info?.FUND_NET_ASSET?.name,
              type: 'line',
              yAxisIndex: 1, // 关联到右侧Y轴（金额轴）
              showSymbol: false,
              itemStyle: {
                color: 'rgba(252, 14, 133)',
              },
              areaStyle: {
                // color: 'rgba(252, 157, 14, 0.5)',
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(252, 14, 133, 0.5)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(252, 14, 133, 0.1)',
                  },
                ]),
              },
              tooltip: {
                valueFormatter: function (value) {
                  return `${moneyFormat({
                    num: value / 100000000,
                  })}亿元`;
                },
              },
              data: info?.FUND_NET_ASSET?.dataList?.map((e) => e.value),
            },
          ],
        },
        true, // 完全替换配置，不合并（解决旧数据残留问题）
      );
    }
  }, [info]);

  // 组件渲染
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: 'var(--background-color)',
        borderRadius: 4,
      }}
    >
      {/* 业绩比较基准公式显示 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>{info?.formual || ''}</div>
      </div>

      {/* 图表容器，带加载状态 */}
      <Spin active spinning={loading}>
        <div
          style={{
            width: '100%',
            height: 270, // 固定高度
            display: 'inline-block',
          }}
          ref={wrapperRef} // 图表容器引用
        />
      </Spin>
    </div>
  );
};

export default memo(EarningsChart);
