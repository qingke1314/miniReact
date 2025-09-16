/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-08-19 10:19:31
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 * @LastEditTime: 2024-11-12 10:01:36
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\AssetInventory\views\ClearanceRecord.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { executeApi } from '@asset360/apis/appCommon';
import OverviewTable from '@asset360/components/VirtualTable';
import { Col, Radio, Row, Select, Space } from 'antd';
import { moneyFormat } from 'iblive-base';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';

export default function IndexAnalysis({
  selectTreeKey,
  productCode,
  height,
  combinationList,
  combination,
  setCombination,
}) {
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [dataType, setDataType] = useState('TOTAL');
  const tabledataListRef = useRef();
  const { astUnitId } = useSelector((state) => state.asset360AssetLayout);
  //指令持仓合并逻辑为特别情况 合并数据是已经相加后的
  const handleSorter = (a, b, field) => {
    //看做整体排序
    if (
      [
        'holdQtyBeg',
        'netValueRatioBeg',
        'holdQtyAf',
        'netValueRatioAf',
      ].includes(field)
    ) {
      const aList = (tabledataListRef.current || []).filter(
        (item) => item.interCode === a.interCode,
      );
      const bList = (tabledataListRef.current || []).filter(
        (item) => item.interCode === b.interCode,
      );
      return aList[0][field] - bList[0][field];
    } else {
      //相加后看作整体排序
      let aSum;
      aSum = (tabledataListRef.current || [])
        .filter((item) => item.interCode === a.interCode)
        .reduce((sum, obj) => (aSum = sum + obj[field]), 0);
      let bSum;
      bSum = (tabledataListRef.current || [])
        .filter((item) => item.interCode === b.interCode)
        .reduce((sum, obj) => (bSum = sum + obj[field]), 0);
      return aSum - bSum;
    }
  };

  const columns = [
    {
      dataIndex: 'index',
      title: '序号',
      fixed: 'left',
      width: 60,
      render: (test, record, index) => index + 1,
    },
    {
      title: '名称',
      dataIndex: 'secName',
      onCell: (record) => ({
        rowSpan: record?.rowSpan ? record.rowSpan : 0,
      }),
    },
    {
      title: '证券内码',
      dataIndex: 'interCode',
      width: 100,
      onCell: (record) => ({
        rowSpan: record?.rowSpan ? record.rowSpan : 0,
      }),
    },
    {
      title: '交易方向',
      dataIndex: 'etruDireName',
    },
    {
      title: '指令数量',
      dataIndex: 'instQty',
      sorter: (a, b) => handleSorter(a, b, 'instQty'),
      align: 'right',
      render: (text) =>
        moneyFormat({
          num: text,
          decimal: 0,
        }),
    },
    {
      title: '指令价格',
      dataIndex: 'instPrice',
      sorter: (a, b) => handleSorter(a, b, 'instPrice'),
      align: 'right',
      onlyDetailShow: true,
      render: (text) =>
        moneyFormat({
          num: text,
          decimal: 2,
        }),
    },
    {
      title: '指令状态',
      dataIndex: 'instStatusName',
    },
    {
      title: '指令起始时间',
      dataIndex: 'beginTime',
      width: 170,
    },
    {
      title: '指令序号',
      dataIndex: 'instNo',
      onlyDetailShow: true,
    },
    {
      title: '已成交数量',
      dataIndex: 'todayDealQty',
      sorter: (a, b) => handleSorter(a, b, 'todayDealQty'),
      align: 'right',
      render: (text) =>
        moneyFormat({
          num: text,
          decimal: 0,
        }),
    },
    {
      title: '指令前持仓',
      dataIndex: 'holdQtyBeg',
      align: 'right',
      sorter: (a, b) => handleSorter(a, b, 'holdQtyBeg'),
      onCell: (record) => ({
        rowSpan: record?.rowSpan ? record.rowSpan : 0,
      }),
      render: (text) =>
        moneyFormat({
          num: text,
          decimal: 0,
        }),
    },
    {
      title: '指令前占净比',
      width: 110,
      dataIndex: 'netValueRatioBeg',
      align: 'right',
      sorter: (a, b) => handleSorter(a, b, 'netValueRatioBeg'),
      onCell: (record) => ({
        rowSpan: record?.rowSpan ? record.rowSpan : 0,
      }),
      render: (text) => moneyFormat({ num: text * 100, decimal: 3, unit: '%' }),
    },
    {
      title: '指令后持仓',
      dataIndex: 'holdQtyAf',
      align: 'right',
      sorter: (a, b) => handleSorter(a, b, 'holdQtyAf'),
      onCell: (record) => ({
        rowSpan: record?.rowSpan ? record.rowSpan : 0,
      }),
      render: (text) =>
        moneyFormat({
          num: text,
          decimal: 0,
        }),
    },
    {
      title: '指令后占净比',
      width: 110,
      dataIndex: 'netValueRatioAf',
      onCell: (record) => ({
        rowSpan: record?.rowSpan ? record.rowSpan : 0,
      }),
      align: 'right',
      sorter: (a, b) => handleSorter(a, b, 'netValueRatioAf'),
      render: (text) => moneyFormat({ num: text * 100, decimal: 3, unit: '%' }),
    },
  ];

  //合并表格单元格
  const formatTableData = (tableData) => {
    //按secName提取分类后根据数组length赋值rowSpan,再重新组合成数组
    const tableObj = {};
    let finalTableData = [];
    //去重提取key
    const arrayKeys = Array.from(
      new Set(tableData?.map((item) => item.secName)),
    );
    tableData?.forEach((item) => {
      if (!tableObj[item.secName]) tableObj[item.secName] = [];
      tableObj[item.secName].push(item);
    });
    arrayKeys.forEach((item) => {
      tableObj[item][0].rowSpan = tableObj[item].length;
      finalTableData = [...finalTableData, ...tableObj[item]];
    });
    return finalTableData;
  };

  const handleTableUpdate = async () => {
    setTableLoading(true);
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
      default:
        break;
    }
    const res = await executeApi({
      serviceId: 'DD_API_MUTUAL_FUND_INST_TRD_INFO',
      data: {
        fundCode: productCode,
        dataType: dataType,
        astUnitId,
        combiCode: combination ?? undefined,
        assetType,
      },
    });
    const data = formatTableData(res?.records) || [];

    setTableData(data);
    setTableLoading(false);
    tabledataListRef.current = data;
  };

  useEffect(() => {
    if (productCode) {
      handleTableUpdate();
    }
  }, [selectTreeKey, productCode, combination, dataType, astUnitId]);

  return (
    <div style={{ padding: '0 8px' }}>
      <Row justify="start" gutter={8}>
        <Col>
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
        </Col>
        <Col>
          <Space align="center">
            <Radio.Group
              value={dataType}
              style={{ marginTop: 4 }}
              onChange={(e) => {
                setDataType(e.target.value);
              }}
            >
              <Radio value={'TOTAL'}>指令汇总</Radio>
              <Radio value={'DETAILS'}>指令明细</Radio>
            </Radio.Group>
          </Space>
        </Col>
      </Row>

      <OverviewTable
        virtualWidth={'1200px'}
        height={`calc(${height}px - 170px )`}
        loading={tableLoading}
        columns={
          dataType === 'TOTAL'
            ? columns.filter((item) => !item.onlyDetailShow)
            : columns
        }
        dataSource={tableData}
        pagination={false} // 该页面表格不要分页
      />
    </div>
  );
}
