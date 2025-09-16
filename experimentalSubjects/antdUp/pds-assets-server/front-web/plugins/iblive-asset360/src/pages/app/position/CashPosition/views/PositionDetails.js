/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-11 09:43:05
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-26 09:30:38
 * @FilePath: \invest-index-server-front\src\pages\monitor\CashPosition\views\ConfigTabs.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { getPositionDetailByType } from '@asset360/apis/position';
import { Tabs } from 'antd-v5';
import { desensitization, moneyFormat, useGetHeight } from 'iblive-base';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import NumberCel from '../../components/NumberCel';
import PositionTable from '../../components/PositionTable';
import styles from '../index.less';

const tabArray = [
  { assetName: '股票资产', assetType: 'getStockAssetHoldDetail' },
  { assetName: '债券资产', assetType: 'getBondHoldDetail' },
  { assetName: '基金资产', assetType: 'getFundAssetHoldDetail' },
  // { assetName: '现金资产', assetType: 'getFundDepositHoldDetail' },
  { assetName: '回购资产', assetType: 'getFundRepoHoldDetail' },
  { assetName: '权证资产', assetType: 'getFundWarrantsHoldDetail' },
  { assetName: '期货资产', assetType: 'getFundFuturesHoldDetail' },
];
const pageSize = 12;
export default ({ headerRender, paramsForList, date }) => {
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState();
  const [type, setType] = useState('getStockAssetHoldDetail');
  const tableWrapperRef = useRef();
  const tableWrapperHeight = useGetHeight(tableWrapperRef.current, 300);
  const tableHeight = tableWrapperHeight - 145;

  const columns = [
    {
      title: '产品代码',
      dataIndex: 'fundCode',
      render: (text) => desensitization(text),
    },
    {
      title: '资产单元',
      dataIndex: 'astUnitName',
    },
    {
      title: '投资组合',
      dataIndex: 'combiCode',
      render: (text, record) => (
        <span>
          {text}&nbsp;[{record?.combiName}]
        </span>
      ),
    },
    {
      title: '股东账号',
      dataIndex: 'registerAccount',
      render: (text) => desensitization(text),
    },
    {
      title: '证券内码',
      dataIndex: 'interCode',
    },
    {
      title: '证券名称',
      dataIndex: 'secName',
    },
    {
      title: '受限类型',
      dataIndex: 'restrictedType',
    },
    {
      title: '持仓标识',
      dataIndex: 'positionFlag',
    },
    {
      title: '币种',
      dataIndex: 'crrcName',
    },
    {
      title: '交易市场',
      dataIndex: 'marketName',
    },
    {
      title: '流通标识',
      dataIndex: 'circulateFlag',
      render: (text) => (
        <span>{text === '1' ? '流通' : text === '0' ? '非流通' : '--'}</span>
      ),
    },
    {
      title: '当前数量',
      dataIndex: 'currentQty',
      align: 'right',
      render: (text) => (
        <NumberCel number={text}>{moneyFormat({ num: text })}</NumberCel>
      ),
    },
    {
      title: '当日数量变化',
      dataIndex: 'diffQty',
      align: 'right',
      render: (text) => (
        <NumberCel number={text}>{moneyFormat({ num: text })}</NumberCel>
      ),
    },
    {
      title: '可用数量(成交端)',
      dataIndex: 'availableQty',
      align: 'right',
      render: (text) => (
        <NumberCel number={text}>{moneyFormat({ num: text })}</NumberCel>
      ),
    },
    {
      title: '可用数量(指令端)',
      dataIndex: 'instAvailableQty',
      align: 'right',
      render: (text) => (
        <NumberCel number={text}>{moneyFormat({ num: text })}</NumberCel>
      ),
    },
  ];

  const getData = async () => {
    const { headObjectCode, objectCode, parentObjectCode } = paramsForList;
    const apiType = type;
    setTableLoading(true);
    const res = await getPositionDetailByType({
      apiType,
      businDate: moment(date).format('yyyyMMDD'),
      fundCode: headObjectCode === 'fund_code' ? objectCode : parentObjectCode,
      astUnitId: headObjectCode === 'ast_unit_code' ? objectCode : undefined,
    });
    setTableData(res?.records);
    setTableLoading(false);
  };

  useEffect(() => {
    if (paramsForList) {
      getData();
    }
  }, [paramsForList, date, type]);

  return (
    <div>
      {headerRender('positionDetails')}
      <div
        className={styles.comm_table_container}
        style={{ height: "calc(~'100vh - 180px')" }}
        ref={tableWrapperRef}
      >
        <Tabs
          onChange={(e) => {
            setType(e);
          }}
          activeKey={type}
          destroyInactiveTabPane={false}
        >
          {tabArray.map((item) => (
            <Tabs.TabPane tab={item.assetName} key={item.assetType}>
              <PositionTable
                style={{ marginTop: 5 }}
                pageSize={pageSize}
                dataSource={tableData}
                loading={tableLoading}
                columns={columns}
                height={tableHeight > 300 ? tableHeight : 300}
              />
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
