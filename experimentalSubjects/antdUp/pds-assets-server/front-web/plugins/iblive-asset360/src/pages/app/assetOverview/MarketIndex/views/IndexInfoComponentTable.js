/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-12-27 15:29:37
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2025-02-05 09:14:11
 * @Description:
 */
import { executeApi } from '@asset360/apis/appCommon';
import { CustomTable, moneyFormat } from 'iblive-base';
import moment from 'moment';
import { useEffect, useState } from 'react';

const columns = [
  {
    title: '名称/代码',
    dataIndex: 'compCode',
    render: (text, record) => `${record.compName} / ${record.compCode}`,
  },
  {
    title: '类别',
    dataIndex: 'compTypeName',
  },
  {
    title: '归属市场',
    dataIndex: 'compMarketName',
  },
  {
    title: '权重（%）',
    dataIndex: 'weight',
    align: 'right',
    render: (text) => moneyFormat({ num: text }),
  },
];
export default ({ needUpade, selectedMarket, setUpdateTime }) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState();
  const [current, setCurrent] = useState(1);

  const updateTable = async (current) => {
    setLoading(false);
    setCurrent(current);
    const res = await executeApi({
      serviceId: 'APEX_INDEX_COMPONENT_DETAILS',
      data: {
        interCode: selectedMarket,
      },
    });
    setUpdateTime(moment().format('YYYY-MM-DD HH:mm'));
    setData(res?.data?.eventData || []);
    setLoading(false);
  };

  useEffect(() => {
    needUpade && updateTable(1);
  }, [needUpade, selectedMarket]);

  return (
    <CustomTable
      loading={loading}
      total={data?.length}
      current={current}
      pageSize={10}
      dataSource={data}
      onChange={({ current }) => setCurrent(current)}
      columns={columns}
    />
  );
};
