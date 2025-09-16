/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-12-26 16:57:27
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-12-27 13:41:06
 * @Description:
 */

import { executeApi } from '@asset360/apis/appCommon';
import CustomTitle from '@asset360/components/CustomTitle';
import { Descriptions, Input, Spin } from 'antd-v5';
import { useEffect, useState } from 'react';

export default ({ tabKey, activedTab, selectedMarket }) => {
  const [info, setInfo] = useState();
  const [loading, setLoading] = useState(false);

  const getInfo = async () => {
    setLoading(true);
    const res = await executeApi({
      serviceId: 'APEX_MARKET_INDEX_INFO',
      data: {
        interCode: selectedMarket,
      },
    });
    setInfo(res?.data?.eventData || {});
    setLoading(false);
  };

  useEffect(() => {
    if (tabKey === activedTab) {
      getInfo();
    }
  }, [tabKey, activedTab, selectedMarket]);

  return (
    <>
      <Spin spinning={loading}>
        <CustomTitle title="基本资料" className="m-b-16" />
        <div className="m-l-8">
          <Descriptions bordered={false} column={2}>
            <Descriptions.Item label="指数代码">
              {info?.indexCode ?? '--'}
            </Descriptions.Item>
            <Descriptions.Item label="指数币种">
              {info?.crrcNo ?? '--'}
            </Descriptions.Item>
            <Descriptions.Item label="指数全称">
              {info?.indexFullname ?? '--'}
            </Descriptions.Item>
            <Descriptions.Item label="指数简称">
              {info?.indexName ?? '--'}
            </Descriptions.Item>
            <Descriptions.Item label="指数介绍" span={2}>
              <Input.TextArea
                rows={6}
                bordered={false}
                readOnly
                value={info?.indexRemark ?? '--'}
              />
            </Descriptions.Item>
            <Descriptions.Item label="指数基日">
              {info?.baseDate ?? '--'}
            </Descriptions.Item>
            <Descriptions.Item label="发布日期">
              {info?.publishDate ?? '--'}
            </Descriptions.Item>
            <Descriptions.Item label="指数基点">
              {info?.basePoint ?? '--'}
            </Descriptions.Item>
            <Descriptions.Item label="加权方式">
              {info?.waMethod ?? '--'}
            </Descriptions.Item>
            <Descriptions.Item label="发行机构">
              {info?.issuerId ?? '--'}&nbsp;/&nbsp;{info?.issuerName ?? '--'}
            </Descriptions.Item>
            <Descriptions.Item label="编制机构">
              {info?.creatIssuerId ?? '--'}&nbsp;/&nbsp;
              {info?.creatIssuerName ?? '--'}
            </Descriptions.Item>
          </Descriptions>
        </div>

        <CustomTitle title="指数特征" className="m-b-16" />
        <div className="m-l-8">
          <Descriptions bordered={false} column={2}>
            <Descriptions.Item label="指数类别" span={2}>
              {info?.indexType ?? '--'}
            </Descriptions.Item>
            <Descriptions.Item label="行业标准">
              {info?.industryStandard ?? '--'}
            </Descriptions.Item>
            <Descriptions.Item label="行业类别">
              {info?.industryType ?? '--'}
            </Descriptions.Item>
            {/* TODO */}
            <Descriptions.Item label="证券标准">
              {info?.zqbz ?? '--'}
            </Descriptions.Item>
            <Descriptions.Item label="证券类别">
              {info?.secType ?? '--'}
            </Descriptions.Item>
            <Descriptions.Item label="证券调整周期">
              {info?.secAdjPeriod ?? '--'}
            </Descriptions.Item>
            <Descriptions.Item label="证券数量">
              {info?.secQty ?? '--'}
            </Descriptions.Item>
            <Descriptions.Item label="指数计算类别">
              {info?.indexPriceType ?? '--'}
            </Descriptions.Item>
            <Descriptions.Item label="指数设计类别">
              {info?.indexSesignType ?? '--'}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Spin>
    </>
  );
};
