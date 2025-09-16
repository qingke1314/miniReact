/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-11 09:43:05
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2025-02-06 17:04:19
 * @FilePath: \invest-index-server-front\src\pages\monitor\CashPosition\views\ConfigTabs.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { executeApi } from '@asset360/apis/appCommon';
import { Tabs } from 'antd';
import {
  CustomTabs,
  getFormatDate,
  isSafeCalculation,
  moneyFormat,
} from 'iblive-base';
import { useEffect, useRef, useState } from 'react';
import {
  depositStateTransform,
  lendingDirectionhuigouTransform,
  lendingDirectionTransform,
  restrictedTypeTransform,
  sameStyleList,
} from '../const';
import styles from '../index.less';
// import ClearanceRecord from './ClearanceRecord';
import HistoryAnalysis from './HistoryAnalysis';
import IndexAnalysis from './IndexAnalysis';
// import NavigationInfo from './NavigationInfo';
import ReceivableHandleModal from './ReceivableHandleModal';
import RightDetailCard from './RightDetailCard';
import RTAnalysis from './RTAnalysis';
import NavigationInfo from './NavigationInfo';

export default function RightContent({
  height,
  selectTreeKey,
  date,
  productCode,
  refrshFlag,
}) {
  const [activedTab, setActivedTab] = useState('1');
  const [combinationList, setCombinationList] = useState();
  const [combination, setCombination] = useState(); // 组合选中，联动
  const [unit, setUnit] = useState(1); // 单位选择联动
  const [showReceivableHandle, setShowReceivableHandle] = useState(false);
  const [rightCardVisible, setRightCardVisible] = useState(false);
  const [receivableTableRecord, setReceivableTableRecord] = useState('');
  const [tableSecCode, setTableSecCode] = useState('');
  const tabledataRef = useRef();
  const [selectedRows, setSelectedRows] = useState();

  const handleReceivable = (record) => {
    setReceivableTableRecord(record);
    setShowReceivableHandle(true);
  };

  const handleSorter = (a, b, field) => {
    return a?.[field] - b?.[field];
  };

  const numberContrastRender = (text) => {
    return (
      <span>
        {text > 0 ? (
          <CaretUpOutlined style={{ color: '#ef5350', paddingRight: 2 }} />
        ) : text < 0 ? (
          <CaretDownOutlined style={{ color: '#20d08c', paddingRight: 2 }} />
        ) : (
          ''
        )}
        {moneyFormat({
          num: text,
          decimal: 0,
        })}
      </span>
    );
  };

  //name存在代表该行数据为分类行
  const columnsObj = {
    gupiao: [
      {
        dataIndex: 'index',
        title: '序号',
        width: 70,
        fixed: 'left',
        render: (test, record, index) => (record?.name ? null : index + 1),
      },
      {
        title: '证券内码',
        dataIndex: 'interCode',
        fixed: 'left',
        onCell: (record) => ({
          colSpan: record?.name ? 2 : 1,
        }),
        render: (text, record) =>
          record?.name ? (
            <span className={styles.table_order_title}>{`${record.name}（${
              record?.num || 0
            }） 市值：${moneyFormat({
              num: isSafeCalculation(record?.marketValue)
                ? record?.marketValue / unit
                : null,
            })}${'  '}资产占比：${moneyFormat({
              num: (record?.netValueRatio || 0) * 100,
              decimal: 3,
              unit: '%',
            })}`}</span>
          ) : (
            text
          ),
      },
      {
        title: '名称',
        dataIndex: 'secName',
        fixed: 'left',
        onCell: (record) => ({
          colSpan: record?.name ? 0 : 1,
        }),
      },
      {
        title: '市值',
        dataIndex: 'marketValue',
        width: 180,
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'marketValue'),
        render: (text, record) =>
          record?.name
            ? ''
            : moneyFormat({
                num: isSafeCalculation(text) ? text / unit : null,
              }),
      },
      {
        title: '资产占净比',
        dataIndex: 'netValueRatio',
        align: 'right',
        defaultSortOrder: 'descend',
        sorter: (a, b) => handleSorter(a, b, 'netValueRatio'),
        render: (text, record) =>
          record?.name
            ? ''
            : moneyFormat({ num: text * 100, decimal: 3, unit: '%' }),
      },
      {
        title: '持仓数量',
        dataIndex: 'currentQty',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'currentQty'),
        render: (text, record) =>
          record?.name ? '' : moneyFormat({ num: text, decimal: 0 }),
      },
      {
        title: '可用数量',
        dataIndex: 'usableAmount',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'usableAmount'),
        render: (text, record) =>
          record?.name ? '' : moneyFormat({ num: text, decimal: 0 }),
      },
      {
        title: '持仓成本',
        width: 180,
        dataIndex: 'cost',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'cost'),
        render: (text, record) =>
          record?.name ? (
            ''
          ) : (
            <span
              className={
                text > record.price ? 'rise' : text < record.price ? 'drop' : ''
              }
            >
              {moneyFormat({
                num: isSafeCalculation(text) ? text / unit : null,
                decimal: 2,
              })}
            </span>
          ),
      },
      {
        title: '平均成本',
        dataIndex: 'averageCost',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'averageCost'),
        render: (text, record) =>
          record?.name ? (
            ''
          ) : (
            <span
              className={
                text > record.price ? 'rise' : text < record.price ? 'drop' : ''
              }
            >
              {moneyFormat({
                num: isSafeCalculation(text) ? text / unit : null,
                decimal: 2,
              })}
            </span>
          ),
      },
      {
        title: '加权平均成本',
        dataIndex: 'weightedAverageCost',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'weightedAverageCost'),
        render: (text, record) =>
          record?.name ? (
            ''
          ) : (
            <span
              className={
                text > record.price ? 'rise' : text < record.price ? 'drop' : ''
              }
            >
              {moneyFormat({
                num: isSafeCalculation(text) ? text / unit : null,
                decimal: 2,
              })}
            </span>
          ),
      },
      {
        title: '最新价',
        dataIndex: 'price',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'price'),
        render: (text, record) =>
          record?.name ? '' : moneyFormat({ num: text }),
      },
      {
        title: '持有盈亏',
        width: 180,
        dataIndex: 'holdPhase',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'holdPhase'),
        render: (text, record) =>
          record?.name
            ? ''
            : moneyFormat({
                num: isSafeCalculation(text) ? text / unit : null,
                decimal: 2,
                needColor: true,
                sign: text > 0 ? '+' : '',
              }),
      },
      {
        title: '本日涨跌',
        dataIndex: 'todayPhase',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'todayPhase'),
        render: (text, record) =>
          record?.name
            ? ''
            : moneyFormat({
                needColor: true,
                num: text * 100,
                unit: '%',
                decimal: 2,
                sign: text > 0 ? '+' : '',
              }),
      },
      {
        title: '本日盈亏',
        dataIndex: 'todayPhaseValue',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'todayPhaseValue'),
        render: (text, record) =>
          record?.name
            ? ''
            : moneyFormat({
                needColor: true,
                num: isSafeCalculation(text) ? text / unit : null,
                decimal: 2,
                sign: text > 0 ? '+' : '',
              }),
      },
      {
        title: '差价收入',
        dataIndex: 'differentialIncome',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'differentialIncome'),
        render: (text, record) =>
          record?.name
            ? ''
            : moneyFormat({
                needColor: true,
                num: isSafeCalculation(text) ? text / unit : null,
                decimal: 2,
                sign: text > 0 ? '+' : '',
              }),
      },
      {
        title: '累计实现收益',
        dataIndex: 'cumulativeIncome',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'cumulativeIncome'),
        render: (text, record) =>
          record?.name
            ? ''
            : moneyFormat({
                needColor: true,
                num: isSafeCalculation(text) ? text / unit : null,
                decimal: 2,
                sign: text > 0 ? '+' : '',
              }),
      },
      {
        title: '本月涨跌',
        dataIndex: 'monthlyPhase',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'monthlyPhase'),
        render: (text, record) =>
          record?.name
            ? ''
            : moneyFormat({
                needColor: true,
                num: text * 100,
                unit: '%',
                decimal: 2,
                sign: text > 0 ? '+' : '',
              }),
      },
      {
        title: 'PE',
        dataIndex: 'peRatioTtm',
      },
      {
        title: 'PB',
        dataIndex: 'pbRatio',
      },
      {
        title: '盘子',
        dataIndex: 'marketAmount',
      },
      {
        title: '最近建仓日期',
        dataIndex: 'openPositionDate',
      },
      {
        title: '较上月持仓',
        dataIndex: 'overLastMonthQty',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'overLastMonthQty'),
        render: (text, record) =>
          record?.name ? '' : numberContrastRender(text),
      },
      {
        title: '受限类型',
        dataIndex: 'restrictedType',
        render: (text, record) =>
          record?.name ? '' : restrictedTypeTransform(text),
      },
      {
        title: '折扣率',
        dataIndex: 'discountRatio',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'discountRatio'),
        render: (text, record) =>
          record?.name
            ? ''
            : moneyFormat({
                num: text * 100,
                unit: '%',
                decimal: 2,
              }),
      },
      {
        title: '资产估值',
        dataIndex: 'assetAppraisement',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'assetAppraisement'),
        render: (text, record) =>
          record?.name
            ? ''
            : moneyFormat({
                num: isSafeCalculation(text) ? text / unit : null,
                decimal: 2,
              }),
      },
      {
        title: '资产单元',
        dataIndex: 'astUnitName',
      },
      {
        title: '投资组合',
        dataIndex: 'combiName',
      },
    ],
    //   .map((item, index) =>
    //   item.dataIndex === 'index' || item.onCell
    //     ? item
    //     : {
    //         ...item,
    //         onCell: (record) => ({
    //           colSpan: index <= 10 && record?.name ? 0 : 1,
    //         }),
    //       },
    // ),
    zhaiquan: [
      {
        dataIndex: 'index',
        title: '序号',
        width: 70,
        fixed: 'left',
        render: (test, record, index) => (record?.name ? '' : index + 1),
      },
      {
        title: '证券内码',
        dataIndex: 'interCode',
        fixed: 'left',
        render: (text, record) =>
          record?.name ? (
            <span className={styles.table_order_title}>{`${record.name}（${
              record?.num || 0
            }） 市值：${moneyFormat({
              num: isSafeCalculation(record?.marketValue)
                ? record?.marketValue / unit
                : null,
            })}${'  '}资产占比：${moneyFormat({
              num: (record?.netValueRatio || 0) * 100,
              decimal: 3,
              unit: '%',
            })}`}</span>
          ) : (
            text
          ),
      },
      {
        title: '名称',
        dataIndex: 'secName',
        fixed: 'left',
      },
      {
        title: '市值',
        width: 180,
        dataIndex: 'marketValue',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'marketValue'),
        render: (text, record) =>
          record?.name
            ? ''
            : moneyFormat({
                num: isSafeCalculation(text) ? text / unit : null,
              }),
      },
      {
        title: '资产占净比',
        dataIndex: 'netValueRatio',
        align: 'right',
        defaultSortOrder: 'descend',
        sorter: (a, b) => handleSorter(a, b, 'netValueRatio'),
        render: (text, record) =>
          record?.name
            ? ''
            : moneyFormat({ num: text * 100, decimal: 3, unit: '%' }),
      },
      {
        title: '持仓数量',
        dataIndex: 'currentQty',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'currentQty'),
        render: (text, record) =>
          record?.name ? '' : moneyFormat({ num: text, decimal: 0 }),
      },
      {
        title: '可用数量',
        dataIndex: 'availableQty',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'availableQty'),
        render: (text, record) =>
          record?.name ? '' : moneyFormat({ num: text, decimal: 0 }),
      },
      {
        title: '持仓成本',
        width: 180,
        dataIndex: 'cost',
        align: 'right',
        render: (text, record) =>
          record?.name ? (
            ''
          ) : (
            <span
              className={
                text > record.price ? 'rise' : text < record.price ? 'drop' : ''
              }
            >
              {moneyFormat({
                num: isSafeCalculation(text) ? text / unit : null,
                decimal: 2,
              })}
            </span>
          ),
        sorter: (a, b) => handleSorter(a, b, 'cost'),
      },
      {
        title: '加权平均成本',
        dataIndex: 'weightedAverageCost',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'weightedAverageCost'),
        render: (text, record) =>
          record?.name ? (
            ''
          ) : (
            <span
              className={
                text > record.price ? 'rise' : text < record.price ? 'drop' : ''
              }
            >
              {moneyFormat({
                num: isSafeCalculation(text) ? text / unit : null,
                decimal: 2,
              })}
            </span>
          ),
      },
      {
        title: '最新价',
        dataIndex: 'price',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'price'),
        render: (text, record) =>
          record?.name ? '' : moneyFormat({ num: text }),
      },
      {
        title: '持有盈亏',
        width: 180,
        dataIndex: 'cumulativeIncome',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'cumulativeIncome'),
        render: (text, record) =>
          record?.name
            ? ''
            : moneyFormat({
                num: isSafeCalculation(text) ? text / unit : null,
                decimal: 2,
                needColor: true,
                sign: text > 0 ? '+' : '',
              }),
      },
      {
        title: '本日盈亏',
        dataIndex: 'todayEarnings',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'todayEarnings'),
        render: (text, record) =>
          record?.name
            ? ''
            : moneyFormat({
                num: isSafeCalculation(text) ? text / unit : null,
                decimal: 2,
                needColor: true,
                sign: text > 0 ? '+' : '',
              }),
      },
      {
        title: '差价收入',
        dataIndex: 'spreadIncome',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'spreadIncome'),
        render: (text, record) =>
          record?.name
            ? ''
            : moneyFormat({
                needColor: true,
                num: isSafeCalculation(text) ? text / unit : null,
                decimal: 2,
                sign: text > 0 ? '+' : '',
              }),
      },
      {
        title: '累计实现收益',
        dataIndex: 'accumulateProfitLocal',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'accumulateProfitLocal'),
        render: (text, record) =>
          record?.name
            ? ''
            : moneyFormat({
                needColor: true,
                num: isSafeCalculation(text) ? text / unit : null,
                decimal: 2,
                sign: text > 0 ? '+' : '',
              }),
      },
      {
        title: '较上月持仓',
        dataIndex: 'overLastMonthQty',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'overLastMonthQty'),
        render: (text, record) =>
          record?.name ? '' : numberContrastRender(text),
      },
      {
        title: '外部评级',
        dataIndex: 'outerAppraise',
      },
      {
        title: '内部评级',
        dataIndex: 'insideAppraise',
      },
      {
        title: '债券到期期限',
        dataIndex: 'existLimite',
      },
      {
        title: '久期',
        dataIndex: 'maturity',
      },
      {
        title: '受限类型',
        dataIndex: 'restrictedType',
        render: (text, record) =>
          record?.name ? '' : restrictedTypeTransform(text),
      },
      {
        title: '估值方法',
        dataIndex: 'gzMethod',
      },
      {
        title: '摊余成本',
        dataIndex: 'amortizedCost',
        render: (text, record) =>
          record?.name ? '' : moneyFormat({ num: text, decimal: 2 }),
      },
      {
        title: '溢折价余额',
        dataIndex: 'excessDiscountAmt',
        render: (text, record) =>
          record?.name ? '' : moneyFormat({ num: text, decimal: 2 }),
      },
      {
        title: '应收利息',
        dataIndex: 'interesAccrued',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'interesAccrued'),
        render: (text, record) =>
          record?.name ? '' : moneyFormat({ num: text, decimal: 2 }),
      },
      {
        title: '资产单元',
        dataIndex: 'astUnitName',
      },
      {
        title: '投资组合',
        dataIndex: 'combiName',
      },
    ],
    jijinlicai: [
      {
        dataIndex: 'index',
        title: '序号',
        width: 70,
        fixed: 'left',
        render: (test, record, index) => index + 1,
      },
      {
        title: '证券内码',
        dataIndex: 'interCode',
        fixed: 'left',
      },
      {
        title: '名称',
        dataIndex: 'secName',
        fixed: 'left',
      },
      {
        title: '市值',
        width: 180,
        dataIndex: 'marketValue',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'marketValue'),
        render: (text) =>
          moneyFormat({
            num: isSafeCalculation(text) ? text / unit : null,
          }),
      },
      {
        title: '资产占净比',
        dataIndex: 'netValueRatio',
        align: 'right',
        defaultSortOrder: 'descend',
        sorter: (a, b) => handleSorter(a, b, 'netValueRatio'),
        render: (text) =>
          moneyFormat({ num: text * 100, decimal: 3, unit: '%' }),
      },
      {
        title: '持仓数量',
        dataIndex: 'currentQty',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'currentQty'),
        render: (text) => moneyFormat({ num: text, decimal: 0 }),
      },
      {
        title: '可用数量',
        dataIndex: 'availableQty',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'availableQty'),
        render: (text) => moneyFormat({ num: text, decimal: 0 }),
      },
      {
        title: '持仓成本',
        width: 180,
        dataIndex: 'cost',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'cost'),
        render: (text, record) => (
          <span
            className={
              text > record.price ? 'rise' : text < record.price ? 'drop' : ''
            }
          >
            {moneyFormat({
              num: isSafeCalculation(text) ? text / unit : null,
              decimal: 2,
            })}
          </span>
        ),
      },
      {
        title: '加权平均成本',
        dataIndex: 'weightedAverageCost',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'weightedAverageCost'),
        render: (text, record) => (
          <span
            className={
              text > record.price ? 'rise' : text < record.price ? 'drop' : ''
            }
          >
            {moneyFormat({
              num: isSafeCalculation(text) ? text / unit : null,
              decimal: 2,
            })}
          </span>
        ),
      },
      {
        title: '最新净值',
        dataIndex: 'ydayNetValue',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'ydayNetValue'),
        render: (text) => moneyFormat({ num: text }),
      },
      {
        title: '持有盈亏',
        width: 180,
        dataIndex: 'holdPhase',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'holdPhase'),
        render: (text) =>
          moneyFormat({
            needColor: true,
            num: isSafeCalculation(text) ? text / unit : null,
            decimal: 2,
            sign: text > 0 ? '+' : '',
          }),
      },
      {
        title: '本日涨跌',
        dataIndex: 'todayPhase',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'todayPhase'),
        render: (text) =>
          moneyFormat({
            needColor: true,
            num: text * 100,
            unit: '%',
            decimal: 2,
            sign: text > 0 ? '+' : '',
          }),
      },
      {
        title: '本日盈亏',
        dataIndex: 'todayPhaseValue',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'todayPhaseValue'),
        render: (text) =>
          moneyFormat({
            needColor: true,
            num: isSafeCalculation(text) ? text / unit : null,
            decimal: 2,
            sign: text > 0 ? '+' : '',
          }),
      },
      {
        title: '差价收入',
        dataIndex: 'differentialIncome',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'differentialIncome'),
        render: (text) =>
          moneyFormat({
            needColor: true,
            num: isSafeCalculation(text) ? text / unit : null,
            decimal: 2,
            sign: text > 0 ? '+' : '',
          }),
      },
      {
        title: '累计实现收益',
        dataIndex: 'cumulativeIncome',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'cumulativeIncome'),
        render: (text) =>
          moneyFormat({
            needColor: true,
            num: isSafeCalculation(text) ? text / unit : null,
            decimal: 2,
            sign: text > 0 ? '+' : '',
          }),
      },
      {
        title: '本月盈亏',
        dataIndex: 'monthlyPhaseValue',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'monthlyPhaseValue'),
        render: (text) =>
          moneyFormat({
            needColor: true,
            num: text,
            decimal: 2,
            sign: text > 0 ? '+' : '',
          }),
      },
      {
        title: '本月涨跌',
        dataIndex: 'monthlyPhase',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'monthlyPhase'),
        render: (text) =>
          moneyFormat({
            needColor: true,
            num: text * 100,
            unit: '%',
            decimal: 2,
            sign: text > 0 ? '+' : '',
          }),
      },
      {
        title: '较上月持仓',
        dataIndex: 'overLastMonthQty',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'overLastMonthQty'),
        render: (text) => numberContrastRender(text),
      },
      {
        title: '资产单元',
        dataIndex: 'astUnitName',
      },
      {
        title: '投资组合',
        dataIndex: 'combiName',
      },
    ],
    huigou: [
      {
        dataIndex: 'index',
        title: '序号',
        width: 70,
        fixed: 'left',
        render: (test, record, index) => index + 1,
      },
      {
        title: '证券内码',
        dataIndex: 'interCode',
        fixed: 'left',
      },
      {
        title: '名称',
        dataIndex: 'secName',
        fixed: 'left',
      },
      {
        title: '借贷方向',
        dataIndex: 'lendingDirection',
        render: (text) => lendingDirectionhuigouTransform(text),
      },
      {
        title: '可用数量',
        dataIndex: 'availableQty',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'availableQty'),
        render: (text) => moneyFormat({ num: text, decimal: 0 }),
      },

      {
        title: '持仓成本',
        width: 180,
        dataIndex: 'cost',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'cost'),
        render: (text, record) => (
          <span
            className={
              text > record.price ? 'rise' : text < record.price ? 'drop' : ''
            }
          >
            {moneyFormat({
              num: isSafeCalculation(text) ? text / unit : null,
              decimal: 2,
            })}
          </span>
        ),
      },
      {
        title: '持仓数量',
        dataIndex: 'currentQty',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'currentQty'),
        render: (text) => moneyFormat({ num: text, decimal: 0 }),
      },
      {
        title: '较昨日持仓',
        dataIndex: 'overYesterdayQty',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'overYesterdayQty'),
        render: (text) => numberContrastRender(text),
      },
      {
        title: '较上月持仓',
        dataIndex: 'overLastMonthQty',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'overLastMonthQty'),
        render: (text) => numberContrastRender(text),
      },
      {
        title: '较去年持仓',
        dataIndex: 'overLastYearQty',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'overLastYearQty'),
        render: (text) => numberContrastRender(text),
      },
      {
        title: '到期收益',
        dataIndex: 'repoInterest',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'repoInterest'),
        render: (text) => moneyFormat({ num: text, decimal: 2 }),
      },
      {
        title: '累计计提利息',
        dataIndex: 'nowInterest',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'nowInterest'),
        render: (text) =>
          moneyFormat({
            num: isSafeCalculation(text) ? text / unit : null,
            decimal: 2,
          }),
      },
      {
        title: '币种',
        dataIndex: 'crrcNo',
      },
      {
        title: '资产单元',
        dataIndex: 'astUnitName',
      },
      {
        title: '投资组合',
        dataIndex: 'combiName',
      },
      {
        title: '资产占净比',
        dataIndex: 'netValueRatio',
        align: 'right',
        defaultSortOrder: 'descend',
        sorter: (a, b) => handleSorter(a, b, 'netValueRatio'),
        render: (text) =>
          moneyFormat({ num: text * 100, decimal: 3, unit: '%' }),
      },
      {
        title: '回购日期',
        dataIndex: 'repoDate',

        render: (text) => getFormatDate(text),
      },
      {
        title: '购回日期',
        dataIndex: 'liquiRepoDate',

        render: (text) => getFormatDate(text),
      },
      {
        title: '利率',
        dataIndex: 'matchPrice',
        align: 'right',
        sorter: (a, b) => a.matchPrice - b.matchPrice,

        render: (text) =>
          moneyFormat({ num: text * 100, decimal: 2, unit: '%' }),
      },
      {
        title: '回购天数',
        dataIndex: 'repoDays',
      },
    ],
    qihuo: [
      {
        dataIndex: 'index',
        title: '序号',
        width: 70,
        fixed: 'left',
        render: (test, record, index) => index + 1,
      },
      {
        title: '证券内码',
        dataIndex: 'interCode',
        fixed: 'left',
      },
      {
        title: '名称',
        dataIndex: 'secName',
        fixed: 'left',
      },
      {
        title: '借贷方向',
        dataIndex: 'lendingDirection',
        render: (text) => lendingDirectionTransform(text),
      },
      {
        title: '市值',
        width: 180,
        dataIndex: 'marketValue',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'marketValue'),
        render: (text) =>
          moneyFormat({
            num: isSafeCalculation(text) ? text / unit : null,
          }),
      },
      {
        title: '资产占净比',
        dataIndex: 'netValueRatio',
        align: 'right',
        defaultSortOrder: 'descend',
        sorter: (a, b) => handleSorter(a, b, 'netValueRatio'),
        render: (text) =>
          moneyFormat({ num: text * 100, decimal: 3, unit: '%' }),
      },
      {
        title: '当前价格',
        dataIndex: 'lastPrice',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'lastPrice'),
        render: (text) => moneyFormat({ num: text }),
      },
      {
        title: '持仓成本',
        width: 180,
        dataIndex: 'cost',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'cost'),
        render: (text, record) => (
          <span
            className={
              text > record.price ? 'rise' : text < record.price ? 'drop' : ''
            }
          >
            {moneyFormat({
              num: isSafeCalculation(text) ? text / unit : null,
              decimal: 2,
            })}
          </span>
        ),
      },
      {
        title: '加权平均成本',
        dataIndex: 'wgtCost',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'wgtCost'),
        render: (text, record) => (
          <span
            className={
              text > record.price ? 'rise' : text < record.price ? 'drop' : ''
            }
          >
            {moneyFormat({
              num: isSafeCalculation(text) ? text / unit : null,
              decimal: 2,
            })}
          </span>
        ),
      },
      {
        title: '持仓数量',
        dataIndex: 'currentQty',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'currentQty'),
        render: (text) => moneyFormat({ num: text, decimal: 0 }),
      },
      {
        title: '较昨日持仓',
        dataIndex: 'overYesterdayQty',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'overYesterdayQty'),
        render: (text) => numberContrastRender(text),
      },
      {
        title: '较上月持仓',
        dataIndex: 'overLastMonthQty',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'overLastMonthQty'),
        render: (text) => numberContrastRender(text),
      },
      {
        title: '较去年持仓',
        dataIndex: 'overLastYearQty',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'overLastYearQty'),
        render: (text) => numberContrastRender(text),
      },
      {
        title: '差价收入',
        dataIndex: 'spreadIncome',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'spreadIncome'),
        render: (text) => moneyFormat({ num: text }),
      },
      {
        title: '估值增值',
        dataIndex: 'valAdded',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'valAdded'),
        render: (text) => moneyFormat({ num: text }),
      },
      {
        title: '累计实现收益',
        dataIndex: 'accumulateProfit',
        align: 'right',
        sorter: (a, b) => handleSorter(a, b, 'accumulateProfit'),
        render: (text) =>
          moneyFormat({
            needColor: true,
            num: isSafeCalculation(text) ? text / unit : null,
            decimal: 2,
            sign: text > 0 ? '+' : '',
          }),
      },
      {
        title: '持有盈亏',
        dataIndex: 'todayEarnings',
        align: 'right',
        width: 180,
        sorter: (a, b) => handleSorter(a, b, 'todayEarnings'),
        render: (text) =>
          moneyFormat({
            needColor: true,
            num: isSafeCalculation(text) ? text / unit : null,
            decimal: 2,
            sign: text > 0 ? '+' : '',
          }),
      },
      {
        title: '币种',
        dataIndex: 'crrcNo',
      },
      {
        title: '资产单元',
        dataIndex: 'astUnitName',
      },
      {
        title: '投资组合',
        dataIndex: 'combiName',
      },
    ],
    cunkuan: [
      {
        dataIndex: 'index',
        title: '序号',
        width: 70,
        fixed: 'left',
        render: (test, record, index) => index + 1,
      },
      {
        title: '证券内码',
        dataIndex: 'interCode',
        fixed: 'left',
      },
      {
        title: '名称',
        dataIndex: 'secName',
        fixed: 'left',
      },
      {
        title: '存单编号',
        dataIndex: 'confirmNo',
      },
      {
        title: '存入日期',
        dataIndex: 'depositDate',
        render: (text) => getFormatDate(text),
      },
      {
        title: '存款账号',
        dataIndex: 'accountNo',
      },
      {
        title: '存单金额',
        dataIndex: 'receiptBalance',
        align: 'right',
        sorter: (a, b) => a.receiptBalance - b.receiptBalance,
        render: (text) =>
          moneyFormat({ num: isSafeCalculation(text) ? text / unit : null }),
      },
      {
        title: '利率',
        dataIndex: 'receiptRate',
        align: 'right',

        sorter: (a, b) => a.receiptRate - b.receiptRate,
        render: (text) =>
          moneyFormat({ num: text * 100, decimal: 2, unit: '%' }),
      },
      {
        title: '存款期限',
        dataIndex: 'limitTime',
        align: 'right',

        sorter: (a, b) => a.limitTime - b.limitTime,
      },
      {
        title: '起息日',
        dataIndex: 'beginDate',

        render: (text) => getFormatDate(text),
      },
      {
        title: '到期日',
        dataIndex: 'endDate',

        render: (text) => getFormatDate(text),
      },
      {
        title: '存单状态',
        dataIndex: 'receiptStatus',

        render: (text) => depositStateTransform(text),
      },
      {
        title: '存单类型',
        dataIndex: 'secTypeName',
      },
      {
        title: '通知天数',
        dataIndex: 'notifyDays',

        align: 'right',
        sorter: (a, b) => a.notifyDays - b.notifyDays,
      },
      {
        title: '应收利息',
        dataIndex: 'intrDue',
        align: 'right',

        sorter: (a, b) => a.intrDue - b.intrDue,
        render: (text) => moneyFormat({ num: text }),
      },
      {
        title: '币种',
        dataIndex: 'currencyNo',
      },
      {
        title: '资产单元',
        dataIndex: 'astUnitName',
      },
      {
        title: '投资组合',
        dataIndex: 'combiName',
      },
      {
        title: '累计计提利息',
        dataIndex: 'receivableInterest',

        align: 'right',
        sorter: (a, b) => a.receivableInterest - b.receivableInterest,
        render: (text) =>
          moneyFormat({
            num: isSafeCalculation(text) ? text / unit : null,
            decimal: 2,
          }),
      },
      {
        title: '计息天数',
        dataIndex: 'dayTypeName',
      },
      {
        title: '支取交收日期',
        dataIndex: 'paySettleDate',

        render: (text) => getFormatDate(text),
      },
      {
        title: '通知天数',
        dataIndex: 'notifyDays',
      },
      {
        title: '资产占净比',
        dataIndex: 'netValueRatio',
        align: 'right',
        defaultSortOrder: 'descend',

        sorter: (a, b) => handleSorter(a, b, 'netValueRatio'),
        render: (text) =>
          moneyFormat({ num: text * 100, decimal: 3, unit: '%' }),
      },
    ],
    xianjin: [
      {
        dataIndex: 'index',
        title: '序号',
        width: 70,
        fixed: 'left',
        render: (test, record, index) => index + 1,
      },
      {
        title: '资产单元号',
        dataIndex: 'astUnitId',
      },
      {
        title: '币种',
        dataIndex: 'crrcNo',
      },
      {
        title: '期初余额(本币)',
        dataIndex: 'beginLocalAmt',
        align: 'right',
        render: (text) => moneyFormat({ num: text, decimal: 2 }),
      },
      {
        title: '资金余额(本币)',
        dataIndex: 'localAmt',
        align: 'right',
        render: (text) => moneyFormat({ num: text, decimal: 2 }),
      },
      {
        title: '可用资金(本币)',
        dataIndex: 'localAvailable',
        align: 'right',
        render: (text) => moneyFormat({ num: text, decimal: 2 }),
      },
      {
        title: '期货保证金',
        dataIndex: 'futuresDeposit',
        align: 'right',
        render: (text) => moneyFormat({ num: text, decimal: 2 }),
      },
      {
        title: '期货最低准准备金',
        dataIndex: 'futuresMinDeposit',
        align: 'right',
        render: (text) => moneyFormat({ num: text, decimal: 2 }),
      },
      {
        title: '港股风险资金',
        dataIndex: 'hkRiskDeposit',
        align: 'right',
        render: (text) => moneyFormat({ num: text, decimal: 2 }),
      },
      {
        title: '结算备付金',
        dataIndex: 'settlePrepareDeposit',
        align: 'right',
        render: (text) => moneyFormat({ num: text, decimal: 2 }),
      },
      {
        title: '最低备付金',
        dataIndex: 'prepareMinDeposit',
        align: 'right',
        render: (text) => moneyFormat({ num: text, decimal: 2 }),
      },
      {
        title: '结算保证金',
        dataIndex: 'settleDeposit',
        align: 'right',
        render: (text) => moneyFormat({ num: text, decimal: 2 }),
      },
      {
        title: '期货保证金账户余额',
        dataIndex: 'futuresAmt',
        align: 'right',
        render: (text) => moneyFormat({ num: text, decimal: 2 }),
      },
      {
        title: '黄金保证金',
        dataIndex: 'goldDeposit',
        align: 'right',
        render: (text) => moneyFormat({ num: text, decimal: 2 }),
      },
      {
        title: '期权保证金',
        dataIndex: 'optionsDeposit',
        align: 'right',
        render: (text) => moneyFormat({ num: text, decimal: 2 }),
      },
      {
        title: '存出保证金',
        dataIndex: 'saveOutDeposit',
        align: 'right',
        render: (text) => moneyFormat({ num: text, decimal: 2 }),
      },
    ],
    yingshou: [
      {
        dataIndex: 'index',
        title: '序号',
        width: 70,
        fixed: 'left',
        render: (test, record, index) => index + 1,
      },
      {
        title: '业务日期',
        dataIndex: 'businDate',
        render: (text) => getFormatDate(text),
      },
      {
        title: '款项名称',
        dataIndex: 'itemName',
      },
      {
        title: '当日计提',
        dataIndex: 'amount',
        render: (text) => moneyFormat({ num: text, decimal: 2 }),
        align: 'right',
      },
      {
        title: '累计计提',
        dataIndex: 'totalAmount',
        align: 'right',
        render: (text, record) => (
          <a onClick={() => handleReceivable(record)}>
            {moneyFormat({ num: text })}
          </a>
        ),
      },
      {
        title: '累计天数',
        dataIndex: 'totalDays',
        align: 'right',
      },
      {
        title: '上次结算时间',
        dataIndex: 'lastSettleDate',
        render: (text) => getFormatDate(text),
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
      },
    ],
  };

  // 获取组合list
  const getCombinationList = async () => {
    const res = await executeApi({
      serviceId: 'DD_API_MUTUAL_COMBI_INFO',
      data: {
        fundCode: productCode,
      },
    });
    setCombinationList(
      (res?.records || []).map((item) => ({
        label: item.combiName,
        value: item.combiCode,
      })),
    );
  };

  useEffect(() => {
    if (productCode) {
      getCombinationList();
    }
  }, [productCode]);

  //该菜单下默认选中实时持仓
  useEffect(() => {
    if (
      activedTab !== '1' &&
      ['cunkuan', 'xianjin', 'yingshou', 'yingfu'].includes(selectTreeKey)
    ) {
      setActivedTab('1');
      setRightCardVisible(false);
    }
  }, [selectTreeKey]);

  return (
    <div className="m-l-8 m-r-8">
      {!['yingshou', 'yingfu', 'xianjin'].includes(selectTreeKey) && (
        <NavigationInfo
          productCode={productCode}
          selectTreeKey={selectTreeKey}
          date={date}
        />
      )}
      <div style={{ display: 'flex' }}>
        <div
          className={styles.configs_right_content}
          style={{
            '--height': `${
              ['yingshou', 'yingfu'].includes(selectTreeKey) ? height : height
            }px`,
            width: rightCardVisible ? 'calc(100% - 590px)' : undefined,
          }}
        >
          <div
            className="blank-card-asset"
            style={{
              height: ['yingshou', 'yingfu'].includes(selectTreeKey)
                ? height
                : height,
              padding: '4px 8px',
            }}
          >
            <CustomTabs
              destroyInactiveTabPane
              activeKey={activedTab}
              onChange={(tab) => {
                setActivedTab(tab);
                setRightCardVisible(false);
              }}
            >
              <Tabs.TabPane tab="实时持仓" key="1">
                <RTAnalysis
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  selectTreeKey={selectTreeKey}
                  productCode={productCode}
                  height={height}
                  refrshFlag={refrshFlag}
                  combinationList={combinationList}
                  combination={combination}
                  setCombination={setCombination}
                  rightCardVisible={rightCardVisible}
                  sameStyleList={sameStyleList}
                  columnsObj={columnsObj}
                  unit={unit}
                  setUnit={setUnit}
                  setTableSecCode={setTableSecCode}
                  setRightCardVisible={setRightCardVisible}
                  date={date}
                  tabledataRef={tabledataRef}
                  activedTab={activedTab}
                />
              </Tabs.TabPane>
              {[
                'gupiao',
                'zhaiquan',
                'jijinlicai',
                'huigou',
                'qihuo',
                'qiquan',
                'qita',
                'cunkuan',
              ].includes(selectTreeKey) && (
                <Tabs.TabPane tab="指令持仓" key="2">
                  <IndexAnalysis
                    selectTreeKey={selectTreeKey}
                    productCode={productCode}
                    height={height}
                    refrshFlag={refrshFlag}
                    combinationList={combinationList}
                    combination={combination}
                    setCombination={setCombination}
                  />
                </Tabs.TabPane>
              )}

              {sameStyleList.includes(selectTreeKey) && (
                <>
                  <Tabs.TabPane tab="历史持仓" key="3">
                    <HistoryAnalysis
                      height={height}
                      selectTreeKey={selectTreeKey}
                      productCode={productCode}
                      columnsObj={columnsObj}
                      refrshFlag={refrshFlag}
                      unit={unit}
                      setUnit={setUnit}
                      combinationList={combinationList}
                      combination={combination}
                      setCombination={setCombination}
                    />
                  </Tabs.TabPane>
                  {/* <Tabs.TabPane tab="已清仓" key="4">
                    <ClearanceRecord
                      selectTreeKey={selectTreeKey}
                      productCode={productCode}
                      height={height}
                      refrshFlag={refrshFlag}
                      combinationList={combinationList}
                      combination={combination}
                      setCombination={setCombination}
                    />
                  </Tabs.TabPane> */}
                </>
              )}
            </CustomTabs>
          </div>
          {/* 应收应付明细 */}
          <ReceivableHandleModal
            visible={showReceivableHandle}
            onCancel={() => setShowReceivableHandle(false)}
            receivableTableRecord={receivableTableRecord}
            selectTreeKey={selectTreeKey}
          />
        </div>
        <RightDetailCard
          visible={rightCardVisible}
          height={height}
          setRightCardVisible={setRightCardVisible}
          selectTreeKey={selectTreeKey}
          tableSecCode={tableSecCode}
          productCode={productCode}
          refrshFlag={refrshFlag}
        />
      </div>
    </div>
  );
}
