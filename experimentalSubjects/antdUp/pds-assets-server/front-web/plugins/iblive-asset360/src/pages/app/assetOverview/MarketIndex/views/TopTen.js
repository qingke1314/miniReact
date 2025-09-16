/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-12-30 09:19:47
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-12-30 16:36:24
 * @Description:
 */
import { executeApi } from '@asset360/apis/appCommon';
import { Col, Row, Spin } from 'antd';
import { CustomTable, moneyFormat } from 'iblive-base';
import moment from 'moment';
import { useEffect, useState } from 'react';
import PolarChart from '../components/PolarChart';

const columns = [
  {
    title: '证券代码',
    dataIndex: 'compCode',
  },
  {
    title: '证券名称',
    dataIndex: 'compName',
  },
  {
    title: '中证一级行业分类',
    dataIndex: 'firstIndustryName',
  },
  {
    title: '中证二级行业分类',
    dataIndex: 'secondIndustryName',
  },
  {
    title: '权重（%）',
    dataIndex: 'weight',
    align: 'right',
    render: (text) => moneyFormat({ num: text }),
  },
];

export default ({ needUpade, selectedMarket, setUpdateTime }) => {
  const [loading, setLoading] = useState();
  const [data, setData] = useState();
  const [radioData, setRadioData] = useState([0, 0]);

  const updateData = async () => {
    setLoading(false);
    const res = await executeApi({
      serviceId: 'APEX_ASSET_INDEX_WEIGHT_TOP10',
      data: {
        interCode: selectedMarket,
      },
    });
    const data = res?.data?.eventData || [];
    const radioData = data.reduce(
      (arry, item, index) => {
        if (index < 5) {
          arry[0] = arry[0] + item.weight;
        }
        arry[1] = arry[1] + item.weight;
        return arry;
      },
      [0, 0],
    );
    setUpdateTime(moment().format('YYYY-MM-DD HH:mm'));
    setData(data);
    setRadioData(radioData);
    setLoading(false);
  };

  useEffect(() => {
    needUpade && updateData();
  }, [needUpade, selectedMarket]);

  return (
    <>
      <Row gutter={8} wrap={false}>
        <Col>
          <CustomTable
            dataSource={data}
            loading={loading}
            pagination={false}
            columns={columns}
          />
        </Col>
        <Col flex={1}>
          <Spin spinning={loading}>
            <PolarChart
              data={radioData}
              typeList={['前5大权重之和', '前10大权重之和']}
            />
          </Spin>
        </Col>
      </Row>
    </>
  );
};
