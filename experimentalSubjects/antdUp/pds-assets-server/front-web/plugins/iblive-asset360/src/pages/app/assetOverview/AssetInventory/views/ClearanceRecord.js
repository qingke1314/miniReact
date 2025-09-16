/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-08-19 10:19:31
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2025-02-05 09:02:34
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\AssetInventory\views\ClearanceRecord.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { executeApi } from '@asset360/apis/appCommon';
import OverviewTable from '@asset360/components/OverviewTable';
import { Select, Space } from 'antd-v5';
import { getFormatDate, moneyFormat } from 'iblive-base';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function ClearanceRecord({
  selectTreeKey,
  productCode,
  height,
  combinationList,
  combination,
  setCombination,
}) {
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const { astUnitId } = useSelector((state) => state.asset360AssetLayout);
  const columns = [
    {
      dataIndex: 'index',
      title: '序号',
      fixed: 'left',
      width: 60,
      render: (test, record, index) => index + 1,
    },
    {
      title: '证券名称',
      dataIndex: 'secName',
    },
    {
      title: '证券内码',
      dataIndex: 'interCode',
    },
    {
      title: '建仓日期',
      dataIndex: 'establishDate',
      render: (text) => getFormatDate(text),
    },
    {
      title: '清仓日期',
      dataIndex: 'clearDate',
      render: (text) => getFormatDate(text),
    },
    {
      title: '实现盈亏',
      dataIndex: 'accumulateProfit',
      align: 'right',
      sorter: (a, b) => a.accumulateProfit - b.accumulateProfit,
      render: (text) =>
        moneyFormat({
          needColor: true,
          num: text,
          decimal: 2,
          sign: text > 0 ? '+' : '',
        }),
    },
    {
      title: '盈亏比例',
      dataIndex: 'profitRatio',
      align: 'right',
      sorter: (a, b) => a.profitRatio - b.profitRatio,
      render: (text) =>
        moneyFormat({
          num: text * 100,
          decimal: 2,
          unit: '%',
          sign: text > 0 ? '+' : '',
          needColor: true,
        }),
    },
    {
      title: '同期大盘',
      dataIndex: 'szPriceChangeRatio',
      align: 'right',
      sorter: (a, b) => a.szPriceChangeRatio - b.szPriceChangeRatio,
      render: (text) => moneyFormat({ num: text * 100, decimal: 2, unit: '%' }),
    },
    {
      title: '清仓均价',
      dataIndex: 'avgPrice',
      align: 'right',
      sorter: (a, b) => a.avgPrice - b.avgPrice,
      render: (text) => moneyFormat({ num: text, decimal: 2 }),
    },
    {
      title: '现价',
      dataIndex: 'lastPrice',
      align: 'right',
      sorter: (a, b) => a.lastPrice - b.lastPrice,
      render: (text) => moneyFormat({ num: text, decimal: 2 }),
    },
    {
      title: '清仓后距今',
      dataIndex: 'clearanceToNowPriceLimit',
      align: 'right',
      sorter: (a, b) => a.clearanceToNowPriceLimit - b.clearanceToNowPriceLimit,
      render: (text) =>
        moneyFormat({
          needColor: true,
          num: text * 100,
          unit: '%',
          decimal: 2,
          sign: text > 0 ? '+' : '',
        }),
    },
  ];

  const handleTableUpdate = async () => {
    setTableLoading(true);
    const serviceId = 'DD_API_FUND_SEC_CLEARANCE';
    let assetType;
    switch (selectTreeKey) {
      case 'gupiao':
        assetType = 'GP';
        break;
      case 'zhaiquan':
        assetType = 'ZQ';
        break;
      case 'jijinlicai':
        assetType = 'JJ';
        break;
      case 'huigou':
        assetType = 'HG';
        break;
      case 'qihuo':
        assetType = 'QH';
        break;
      case 'qiquan':
        assetType = 'QQ';
        break;
      case 'qita':
        assetType = 'QT';
        break;
      case 'cunkuan':
        assetType = 'CK';
        break;
      case 'xianjin':
        assetType = 'XJ';
        break;
      default:
        break;
    }
    const res = await executeApi({
      serviceId,
      data: {
        assetType,
        fundCode: productCode,
        astUnitId,
        combiCode: combination ?? undefined,
      },
    });
    const data = res?.records || [];
    setTableData(data);
    setTableLoading(false);
  };

  useEffect(() => {
    if (productCode) {
      handleTableUpdate();
    }
  }, [selectTreeKey, productCode, combination, astUnitId]);

  return (
    <div style={{ padding: '0 8px' }}>
      <Space align="center" className="m-b-8">
        <span style={{ color: 'var(--important-text-color)' }}>组合:</span>
        <Select
          style={{ minWidth: 200 }}
          options={combinationList}
          allowClear
          value={combination}
          onChange={setCombination}
        />
      </Space>
      <OverviewTable
        height={`calc(${height}px - 185px)`}
        loading={tableLoading}
        columns={columns}
        dataSource={tableData}
      />
    </div>
  );
}
