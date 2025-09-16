import { executeApi } from '@asset360/apis/appCommon';
import OverviewTable from '@asset360/components/OverviewTable';
import { Col, Row, Table } from 'antd-v5';
import { moneyFormat } from 'iblive-base';
import moment from 'moment';
import { useEffect, useState } from 'react';
import styles from '../index.less';

const assetMap = {
  'demandDeposit+timeDeposit': '银行存款',
  jsbfj: '结算备付金',
  ccbzj: '存出保证金',
  // 核心资产类别
  stockAsset: '股票资产',
  bondAsset: '债券资产',
  fundAsset: '理财资产',
  ysgx: '应收股利', // undefined
  yslx: '应收利息', // undefined
  yssgk: '应收申购款',
  'secSettleAmt1+secSettleAmt2': '清算资金往来款',
  repoAsset: '回购资产',
  warrantAsset: '权证资产',
  otherAsset: '其他资产',
};
const debtMap = {
  redeemAmt: '应付赎回款', // Redemption Payable
  redeemFee: '应付赎回费', // Redemption Fee Payable
  managementFee: '应付管理费', // Management Fee Payable (Note: original key is `managementFee`)
  custodyFee: '应付托管费', // Custody Fee Payable (Note: original key is `custodyFee`)
  salesFee: '应付销售费', // Sales Fee Payable
  otherAmt: '其他应付款', // Other Payables
  taxFee: '应付税费', // Tax Payable
  profitAmt: '应付利润', // Profit Payable
  estimateFee: '预提费用', // Accrued Expenses
  secSettleAmt2: '清算资金往来款', // Settlement Payable (Liabilities side)
};
export default function BalanceSheet({ productCode }) {
  const [loading, setLoading] = useState(false);
  const [assetInfo, setAssetInfo] = useState({
    columns: [
      {
        title: '资产',
        dataIndex: 'type',
        fixed: 'left',
      },
    ],
    dataSource: Object.values(assetMap).map((title) => ({ title })),
  });
  const [debtInfo, setDebtInfo] = useState({
    columns: [
      {
        title: '负债和所有者权益',
        dataIndex: 'type',
        fixed: 'left',
      },
    ],
    dataSource: Object.values(debtMap).map((title) => ({ title })),
  });
  // 获取格式化之后的数据
  function transformData(dataMap = {}, rawData = []) {
    if (!rawData?.length) return;
    return Object.keys(dataMap).map((field) => {
      // 2. 对每一个字段，创建一个对象（包含 name 和各 updateTime 的值）
      const fieldEntry = { name: field, title: dataMap[field] };
      const valList = field.split('+');
      rawData.forEach((item) => {
        fieldEntry[item.updateTime] =
          valList?.length > 1
            ? valList.reduce((acc, cur) => acc + (item?.[cur] ?? 0), 0)
            : item?.[field];
      });
      return fieldEntry;
    });
  }
  // 获取格式化后的列
  function transformColumns(dataSource) {
    return Object.keys(dataSource?.[0] ?? {})
      ?.filter((key) => key !== 'name' && key !== 'title')
      ?.map((key) => ({
        title: moment(key, 'YYYYMMDDHHmm').format('YYYY-MM-DD'),
        dataIndex: key,
        align: 'right',
        render: (text) =>
          moneyFormat({
            num: text,
            decimal: 2,
          }),
      }));
  }

  const getInfo = async () => {
    const res = await executeApi({
      serviceId: 'DD_API_ASSET_DEBET_DETAIL',
      data: {
        fundCode: productCode,
        businDate: moment().format('YYYYMMDD'),
      },
    });
    const dataSource = transformData(assetMap, res?.records);
    const debtDataSource = transformData(debtMap, res?.records);
    const columns = [
      {
        title: '资产',
        dataIndex: 'title',
        fixed: 'left',
        render: (text) =>
          text === '资产总计' ? (
            <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
              {text}
            </span>
          ) : (
            text
          ),
      },
      ...transformColumns(dataSource),
    ];
    const debtColumns = [
      {
        title: '负债',
        dataIndex: 'title',
        fixed: 'left',
        render: (text) =>
          text === '总计' ? (
            <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
              {text}
            </span>
          ) : (
            text
          ),
      },
      ...transformColumns(debtDataSource),
    ];
    setLoading(false);
    setAssetInfo({
      columns,
      dataSource,
    });
    setDebtInfo({
      columns: debtColumns,
      dataSource: debtDataSource,
    });
  };

  const getSummaryRow = (pageData, columns = [], sumName = '合计') => {
    const sum = {};
    const cols = columns
      .map((item) => item.dataIndex)
      .filter((item) => item !== 'title');
    pageData.forEach((item) => {
      cols.forEach((col) => {
        sum[col] = sum[col] ? sum[col] + (item[col] ?? 0) : item[col] ?? 0;
      });
    });
    return (
      <Table.Summary.Row className={styles.selected_row}>
        <Table.Summary.Cell
          index={0}
          style={{
            color: 'var(--sider-hover-color)',
            fontWeight: 'bold',
          }}
        >
          <span
            style={{
              color: 'var(--sider-hover-color)',
              fontWeight: 'bold',
            }}
          >
            {sumName}
          </span>
        </Table.Summary.Cell>
        {Object.values(sum)?.map((item, index) => (
          <Table.Summary.Cell key={index} index={index + 1}>
            {moneyFormat({
              num: item,
              decimal: 2,
            })}
          </Table.Summary.Cell>
        ))}
      </Table.Summary.Row>
    );
  };

  useEffect(() => {
    if (productCode) {
      setLoading(true);
      getInfo();
    }
  }, [productCode]);
  return (
    <div className="blank-card-asset">
      <Row gutter={8}>
        <Col span={12}>
          <div className="important-title m-b-8">资产表</div>
          <OverviewTable
            loading={loading}
            showTotal={false}
            pagination={false}
            columns={assetInfo?.columns}
            dataSource={assetInfo?.dataSource}
            rowKey="type"
            onRow={(record) =>
              record.type === '资产总计'
                ? { className: styles.selected_row }
                : {}
            }
            summary={(pageData) => {
              return getSummaryRow(pageData, assetInfo?.columns, '资产总计');
            }}
          />
        </Col>
        <Col span={12}>
          <div className="important-title m-b-8">负债表</div>
          <OverviewTable
            showTotal={false}
            pagination={false}
            columns={debtInfo?.columns}
            dataSource={debtInfo?.dataSource}
            loading={loading}
            summary={(pageData) => {
              return getSummaryRow(pageData, debtInfo?.columns, '负债合计');
            }}
          />
        </Col>
      </Row>
    </div>
  );
}
