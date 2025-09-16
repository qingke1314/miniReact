/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-26 09:38:08
 * @LastEditors: chenzongjun chenzongjun@apexsoft.com.cn
 * @LastEditTime: 2024-11-07 16:58:01
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\OverView\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import OverviewTable from '@asset360/components/OverviewTable';
import { desensitization } from 'iblive-base';
import { useEffect, useState } from 'react';

const pageSize = 12;

export default ({ detailInfo }) => {
  const [current, setCurrent] = useState(1);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState();
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (text, record, index) => (current - 1) * pageSize + index + 1,
    },
    {
      title: '证券代码',
      dataIndex: 'code',
      render: (text) => desensitization(text),
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '持有产品数量',
      dataIndex: 'count',
      align: 'right',
      // render: (text) => moneyFormat({ num: text , decimal: 0 }),
      // sorter: (a, b) => a.count - b.count,
    },

    {
      title: '占总规模比例',
      dataIndex: '5',
      align: 'right',
      // render: (text) => moneyFormat({ num: text, decimal: 3 }),
      // sorter: (a, b) => a.netValue - b.netValue,
    },
  ];

  const updateData = async (current) => {
    setTableLoading(true);
    setTableData([]);
    setTotal(0);
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
      <span className="important-title m-b-8">相关性分析</span>
      <OverviewTable
        pageSize={pageSize}
        current={current}
        dataSource={tableData}
        loading={tableLoading}
        columns={columns}
        onPageChange={(current) => setCurrent(current)}
        total={total}
      />
    </>
  );
};
