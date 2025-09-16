/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-12-30 09:19:47
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-12-30 14:08:31
 * @Description:
 */
import { executeApi } from '@asset360/apis/appCommon';
import { Spin } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import PieChart from '../components/PieChart';

export default ({ needUpade, selectedMarket, setUpdateTime }) => {
  const [loading, setLoading] = useState();
  const [data, setData] = useState();

  const updateData = async () => {
    setLoading(false);
    const res = await executeApi({
      serviceId: 'APEX_ASSET_INDEX_COMPONENT_MARKET_RATIO',
      data: {
        interCode: selectedMarket,
        type: 'INDUSTRY',
      },
    });
    setUpdateTime(moment().format('YYYY-MM-DD HH:mm'));
    setData(
      (res?.data?.eventData || []).map((item) => ({
        name: item.name,
        value: item.ratio,
      })),
    );
    setLoading(false);
  };

  useEffect(() => {
    needUpade && updateData();
  }, [needUpade, selectedMarket]);

  return (
    <>
      <Spin spinning={loading}>
        <PieChart data={data} />
      </Spin>
    </>
  );
};
