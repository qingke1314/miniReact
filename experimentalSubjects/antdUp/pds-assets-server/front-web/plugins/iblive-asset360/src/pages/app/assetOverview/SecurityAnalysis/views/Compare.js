import { executeApi } from '@asset360/apis/appCommon';
import OverviewTable from '@asset360/components/OverviewTable';
import { Row } from 'antd';
import { desensitization, moneyFormat } from 'iblive-base';

import { useEffect, useState } from 'react';

const pageSize = 8;

export default ({ detailInfo, height }) => {
  const [current, setCurrent] = useState(1);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState();
  const [unit, setUnit] = useState(100000000);

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (text, record, index) => (current - 1) * pageSize + index + 1,
    },
    {
      title: '证券代码',
      dataIndex: 'interCode',
      render: (text) => desensitization(text),
    },
    {
      title: '证券名称',
      dataIndex: 'secName',
      render: (text) => desensitization(text),
    },
    {
      title: '板块',
      dataIndex: 'stockPlate',
    },
    {
      title: '持仓变动数量',
      dataIndex: 'qtyChg',
      align: 'right',
      render: (text) => moneyFormat({ num: text, decimal: 0 }),
    },
    {
      title: '持有数量',
      dataIndex: 'holdQty',
      align: 'right',
      render: (text) => moneyFormat({ num: text, decimal: 0 }),
    },
    {
      title: '持有产品数量',
      dataIndex: 'fundNum',
      align: 'right',
    },
    {
      title: '证券最新价',
      dataIndex: 'lastPrice',
      align: 'right',
      render: (text) => moneyFormat({ num: text, decimal: 2 }),
    },
    {
      title: '证券交易数量',
      dataIndex: 'dealNum',
      align: 'right',
      render: (text) => moneyFormat({ num: text, decimal: 0 }),
    },
    {
      title: '证券交易金额',
      dataIndex: 'dealAmount',
      align: 'right',
      render: (text) => moneyFormat({ num: text / unit, decimal: 2 }),
    },
    {
      title: '当日涨跌幅',
      dataIndex: 'priceChgToday',
      align: 'right',
      render: (text) => moneyFormat({ num: text, decimal: 2, unit: '%' }),
    },
    {
      title: '近五日涨跌幅',
      dataIndex: 'priceChgWeek',
      align: 'right',
      render: (text) => moneyFormat({ num: text, decimal: 2, unit: '%' }),
    },
    {
      title: '持有市值',
      dataIndex: 'holdMarketValue',
      align: 'right',
      render: (text) => moneyFormat({ num: text / unit, decimal: 2 }),
    },
    {
      title: '持有市值占比',
      dataIndex: 'holdMarketValueRatio',
      align: 'right',
      render: (text) => moneyFormat({ num: text, decimal: 2, unit: '%' }),
    },
  ];

  const updateData = async (current) => {
    setTableLoading(true);
    const data = {
      secType: detailInfo?.secType,
      interCode: detailInfo?.key,
    };

    const res = await executeApi({
      serviceId: 'DD_API_INDUSTRY_COMPARISION',
      data,
    });

    setTableData(res?.records || []);
    setTotal(res?.records?.length || 0);
    setCurrent(current);
    setTableLoading(false);
  };

  useEffect(() => {
    if (detailInfo) {
      updateData(1);
    }
  }, [detailInfo]);

  return (
    <>
      <Row justify="space-between" align="middle">
        <span className="important-title">同行业比较</span>
      </Row>

      <div style={{ marginTop: 8 }}>
        <OverviewTable
          pageSize={pageSize}
          current={current}
          dataSource={tableData}
          loading={tableLoading}
          columns={columns}
          onPageChange={setCurrent}
          total={total}
          height={height}
        />
      </div>
    </>
  );
};
