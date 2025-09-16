/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-09-30 17:12:02
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 * @LastEditTime: 2024-11-12 17:24:07
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\AssetInventory\views\DetailCard.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { executeApi } from '@asset360/apis/appCommon';
import OverviewTable from '@asset360/components/OverviewTable';
import { moneyFormat } from 'iblive-base';
import moment from 'moment';
import { useEffect, useState } from 'react';

const pageSize = 9;

export default ({ visible, height, interCode, productCode }) => {
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);

  const columns = [
    {
      title: '交易时间',
      dataIndex: 'etruTime',
      render: (text) => moment(text, 'HHmmss').format('HH:mm:ss'),
    },
    {
      title: '委托方向',
      dataIndex: 'etruName',
    },
    {
      title: '数量',
      dataIndex: 'etruQty',
      align: 'right',
      render: (text) => moneyFormat({ num: text, decimal: 0 }),
    },
    {
      title: '平均成交价格',
      dataIndex: 'etruPrice',
      align: 'right',
      render: (text) => moneyFormat({ num: text, decimal: 2 }),
    },
  ];

  const getCardInfo = async (page) => {
    setTableLoading(true);
    const res = await executeApi({
      serviceId: 'APEX_STOCK_TRADE_REALDEAL_RECORD_API',
      data: {
        fundCode: productCode,
        interCode: interCode,
        page: page,
        pageSize: pageSize,
      },
    });
    const data = res?.data?.records || [];
    setTableData(data);
    setCurrent(page);
    setTotal(res?.data?.totalRecord);
    setTableLoading(false);
  };

  const expandedRowRender = (record) => {
    const columns = [
      {
        title: '成交时间',
        dataIndex: 'matchTime',
        key: 'matchTime',
        render: (text) => moment(text, 'HHmmss').format('HH:mm:ss'),
      },
      { title: '成交价格', dataIndex: 'matchPrice', key: 'matchPrice' },
      { title: '成交数量', dataIndex: 'matchQty', key: 'matchQty' },
    ];

    return (
      <OverviewTable
        columns={columns}
        dataSource={record?.realdealList}
        pagination={false}
      />
    );
  };

  useEffect(() => {
    if (visible) {
      getCardInfo(1);
    } else {
      setTableData([]);
    }
  }, [visible, interCode]);

  return (
    <div style={{ padding: '0 0 0 8px' }}>
      <div className="important-title m-b-8 m-t-8">本日交易明细</div>
      <OverviewTable
        dataSource={tableData}
        style={{ marginBottom: 10 }}
        rowKey={(record) => {
          return record.etruNo;
        }}
        loading={tableLoading}
        columns={columns}
        height={`calc(${height}px - 155px )`}
        expandable={{ expandedRowRender }}
        pagination={{
          pageSize,
          hideOnSinglePage: false,
          showSizeChanger: false,
          showTotal: (total) => `共${total}条`,
          total,
          current,
          onChange: (page) => getCardInfo(page),
        }}
      />
    </div>
  );
};
