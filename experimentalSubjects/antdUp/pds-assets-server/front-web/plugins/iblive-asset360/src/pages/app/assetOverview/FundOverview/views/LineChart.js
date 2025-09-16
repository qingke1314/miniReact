/*
 * @Description: 基金净值分时图表组件 - 使用 ECharts 展示基金净值的实时变化趋势
 * @Features:
 *   - 支持分时数据展示（09:00-24:00）
 *   - 渐变色填充区域图
 *   - 自适应容器大小
 *   - 格式化数值显示
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2023-06-12 10:54:32
 * @LastEditTime: 2024-11-11 17:24:31
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 */
// React hooks 和工具库
import { useSize } from 'ahooks'; // 监听容器尺寸变化
import { BarChart, LineChart } from 'echarts/charts'; // ECharts 图表类型
import {
  GraphicComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'; // ECharts 组件
import * as echarts from 'echarts/core'; // ECharts 核心
import { LabelLayout } from 'echarts/features'; // ECharts 标签布局
import 'echarts/lib/component/grid'; // ECharts 网格组件
import { CanvasRenderer } from 'echarts/renderers'; // ECharts 渲染器
import { moneyFormat } from 'iblive-base'; // 金额格式化工具
import moment from 'moment'; // 时间处理库
import { useEffect, useRef } from 'react'; // React hooks

// 注册 ECharts 组件
echarts.use([
  TitleComponent, // 标题组件
  GraphicComponent, // 图形组件
  TooltipComponent, // 提示框组件
  LegendComponent, // 图例组件
  LineChart, // 折线图
  BarChart, // 柱状图
  CanvasRenderer, // Canvas 渲染器
  LabelLayout, // 标签布局
]);

// 生成时间轴数据（09:00-16:00，每5分钟一个时间点）
const timeData = [];
// 改为生成15小时，五分钟间隔，180个时间点
new Array((60 * 7) / 5).fill(0).forEach((item, index) => {
  timeData.push(
    moment('09:00', 'HH:mm')
      .add(index * 5, 'minutes')
      .format('HH:mm'),
  );
});
// 添加结束时间点
timeData.push('16:00');

/**
 * 净值分时图组件
 * @param {Object} props - 组件属性
 * @param {Array} props.data - 净值数据数组，每个元素包含 unitNet 字段
 * @returns {JSX.Element} 图表组件
 */
const RequestCount = ({ data = [] }) => {
  const chartRef = useRef(); // 图表实例引用
  const containerRef = useRef(); // 容器DOM引用
  const containerSize = useSize(containerRef); // 监听容器尺寸变化

  /**
   * 获取 ECharts 配置选项
   * @returns {Object} ECharts 配置对象
   */
  const getOption = () => ({
    title: {
      left: 'center', // 标题居中
      text: '净值分时图', // 标题文本
      textStyle: {
        fontSize: 10, // 标题字体大小
      },
    },
    legend: {
      right: '0%', // 图例位置
      show: false, // 隐藏图例
    },
    tooltip: {
      trigger: 'axis', // 坐标轴触发
      axisPointer: {
        type: 'shadow', // 阴影指示器
      },
      // 数值格式化函数，保留3位小数
      valueFormatter: function (value) {
        return moneyFormat({ num: value, decimal: 4 });
      },
    },

    xAxis: [
      {
        type: 'category', // 类目轴
        gridIndex: 0, // 网格索引
        axisTick: {
          show: false, // 隐藏刻度线
        },
        axisLabel: {
          customValues: ['09:00', '16:00'], // 自定义显示的标签值
          textStyle: {
            color: '#777', // 标签文字颜色
          },
        },
        axisLine: {
          show: true, // 显示坐标轴线
          lineStyle: {
            color: '#EDEDED', // 轴线颜色
            type: 'solid', // 实线
          },
          onZero: false, // 不在零刻度线上
        },
        data: timeData, // 时间轴数据
      },
    ],
    yAxis: [
      {
        type: 'value', // 数值轴
        axisLabel: {
          show: true, // 显示轴标签
          textStyle: {
            color: '#A5A7AF', // 标签文字颜色
          },
          // 格式化 Y 轴数值，保留2位小数
          formatter: (value) => moneyFormat({ num: value, decimal: 4 }),
        },
        splitLine: {
          lineStyle: {
            color: '#EDEDED', // 分割线颜色
            type: 'dashed', // 虚线样式
          },
        },
        scale: true, // 脱离零值比例
      },
    ],
    grid: {
      left: '2%', // 左边距
      right: '4%', // 右边距
      bottom: '2%', // 下边距
      top: '12%', // 上边距
      containLabel: true, // 包含坐标轴标签
    },
  });

  // 初始化图表
  useEffect(() => {
    const dom = containerRef.current;
    const chart = echarts.init(dom); // 创建图表实例
    chart.setOption(getOption()); // 设置图表配置
    chartRef.current = chart; // 保存图表实例引用

    // 组件卸载时销毁图表实例
    return () => {
      chartRef.current.dispose();
    };
  }, []);

  // 数据变化时更新图表
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.setOption({
        series: [
          {
            type: 'line', // 折线图类型
            symbol: 'none', // 不显示数据点标记
            data: data?.map((item) => item?.unitNet), // 提取净值数据
            color: '#FF7B2C', // 线条颜色
            stack: 'all', // 堆叠标识
            markLine: {
              silent: true, // 标记线不响应鼠标事件
              symbol: ['none', 'none'], // 标记线两端不显示符号
              itemStyle: {
                normal: {
                  label: {
                    show: true, // 显示标记线标签
                    color: '#ffffff', // 标签文字颜色
                  },
                  lineStyle: {
                    color: '#000000', // 标记线颜色
                    type: 'solid', // 实线
                    width: 1, // 线宽
                  },
                },
              },
            },
            // 区域填充样式 - 渐变色
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0, // 渐变起始位置
                  color: 'rgba(255, 123, 44,0.8)', // 起始颜色（不透明度0.8）
                },
                {
                  offset: 1, // 渐变结束位置
                  color: 'rgba(255, 123, 44,0)', // 结束颜色（完全透明）
                },
              ]),
            },
          },
        ],
      });
    }
  }, [data]);

  // 容器尺寸变化时重新调整图表大小
  useEffect(() => {
    chartRef.current && chartRef.current.resize();
  }, [containerSize]);

  // 渲染图表容器
  return <div ref={containerRef} style={{ height: '100px', width: '100%' }} />;
};

export default RequestCount;
