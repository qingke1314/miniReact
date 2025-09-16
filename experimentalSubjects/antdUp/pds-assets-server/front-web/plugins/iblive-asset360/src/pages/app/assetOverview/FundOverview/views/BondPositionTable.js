import { executeApi } from '@asset360/apis/appCommon';
import OverviewTable from '@asset360/components/OverviewTable';
import { history } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Col, Row, Space } from 'antd-v5';
import { getRealPath, getUserInfo, moneyFormat } from 'iblive-base';
import { sumBy } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import TopTenChart from './TopTenChart';

export default function BondPositionTable({ productCode }) {
  const { authMap } = getUserInfo() || {};
  const [loading, setLoading] = useState(false);
  const zqColumns = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (text, record, index) => index + 1,
      fixed: 'left',
    },
    {
      title: '证券内码',
      dataIndex: 'interCode',
      fixed: 'left',
    },
    {
      title: '证券名称',
      dataIndex: 'secName',
      fixed: 'left',
      render: (text, record) => {
        if (authMap?.['/APP/assetOverview/securityAnalysis']) {
          return (
            <a
              onClick={() =>
                history.push(
                  getRealPath('/APP/assetOverview/securityAnalysis'),
                  {
                    type: 'ZQ',
                    interCode: record.interCode,
                  },
                )
              }
            >
              {text}
            </a>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: '占净值比例',
      align: 'right',
      dataIndex: 'netValueRatio',
      render: (text) => moneyFormat({ num: text * 100, unit: '%' }),
    },
    {
      title: '持仓市值',
      align: 'right',
      dataIndex: 'marketValue',
      render: (text) => moneyFormat({ num: text }),
    },
    {
      title: '持仓数量',
      dataIndex: 'currentQty',
      align: 'right',
      render: (text) => moneyFormat({ num: text, decimal: 0 }),
    },
  ];
  const { data: info, run: getInfo, cancel: cancelGetInfo } = useRequest(
    async () => {
      const res = await executeApi({
        serviceId: 'DD_API_MUTUAL_BOND_MARKET_VALUE_TOP',
        data: {
          fundCode: productCode,
          businDate: moment().format('YYYYMMDD'),
        },
      });
      const res2 = await executeApi({
        serviceId: 'DD_API_FUND_BOND_NET_RATIO_STAT',
        data: {
          fundCode: productCode,
          businDate: moment().format('YYYYMMDD'),
        },
      });
      setLoading(false);
      return {
        bondTop10List: res?.records ?? [],
        marketValueRatioT10: sumBy(res?.records ?? [], 'netValueRatio'),
        marketValueT10: sumBy(res?.records ?? [], 'marketValue'),
        bondTop10RatioList: res2?.records ?? [],
        showInfoItem:
          res2?.records?.length > 0
            ? res2?.records[res2?.records?.length - 1]
            : {},
      };
    },
    {
      manual: true,
      pollingWhenHidden: false,
      pollingInterval: 10000,
    },
  );
  useEffect(() => {
    cancelGetInfo();
    if (productCode) {
      setLoading(true);
      getInfo();
    }
  }, [productCode]);

  return (
    <div className="blank-card-asset">
      <Row justify="space-between" align="middle" className="m-b-8">
        <div className="important-title">债券TOP10</div>
      </Row>

      <Row>
        <Col span={16}>
          <OverviewTable
            showTotal={false}
            pagination={false}
            dataSource={info?.bondTop10List}
            columns={zqColumns}
            loading={loading}
          />
        </Col>
        <Col span={8} style={{ alignSelf: 'center' }}>
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--border-color-base)',
              justifyContent: 'center',
              paddingBottom: 20,
              marginBottom: 33,
              textAlign: 'center',
            }}
          >
            <div>
              <Space>
                <span className="large-important-text">
                  {moneyFormat({
                    num: info?.showInfoItem?.totalAmount / 10000,
                  })}
                </span>
                万
              </Space>
              <p>总市值</p>
            </div>
            <div style={{ marginLeft: 40 }}>
              <Space>
                <span className="large-important-text">
                  {moneyFormat({
                    num: info?.showInfoItem?.netAssetRatio * 100,
                  })}
                </span>
                %
              </Space>
              <p>集中度</p>
            </div>
          </div>

          <TopTenChart
            title="前十债券占净值比（%）"
            data={info?.bondTop10RatioList || []}
          />
        </Col>
      </Row>
    </div>
  );
}
