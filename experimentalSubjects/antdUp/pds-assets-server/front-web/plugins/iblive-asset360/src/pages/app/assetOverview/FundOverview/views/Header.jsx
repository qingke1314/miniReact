import { executeApi } from '@asset360/apis/appCommon';
import { useRequest } from 'ahooks';
import { Badge, Col, Row, Skeleton, Space, Spin } from 'antd';
import { moneyFormat } from 'iblive-base';
import { isNumber } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setShowTop10Bonds,
  setShowTop10Stocks,
} from '../../../../../store/assetLayoutSlice';
import LineChart from './LineChart';
import { configUtils } from 'iblive-base';
import DetailIcon from '@asset360/components/DetailIcon';

const CompanySummary = () => {
  const { envConfig } = configUtils.getConfig();
  const productCode = useSelector(
    (state) => state.asset360AssetLayout.productCode,
  );
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [netLoading, setNetLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [indexInfoLoading, setIndexInfoLoading] = useState(false);
  const [indexInfo, setIndexInfo] = useState(false);
  const [summaryInfo, setSummaryInfo] = useState();
  const {
    data: netValues,
    run: getNetValues,
    cancel: cancelGetNetValues,
  } = useRequest(
    async () => {
      const res = await executeApi({
        serviceId: 'DD_API_REAL_TIME_NET_VALUE_STAT',
        data: {
          fundCode: productCode,
          businDate: moment().format('YYYYMMDD'),
        },
      });
      setNetLoading(false);
      return res?.data || {};
    },
    {
      manual: true,
      pollingWhenHidden: false,
      pollingInterval: 10000,
    },
  );
  const {
    data: baseInfo,
    run: getBaseInfo,
    cancel: cancelIntervalGetBaseInfo,
  } = useRequest(
    async () => {
      const res = await executeApi({
        serviceId: 'DD_API_MUTUAL_FUND_ASSET_ITEM',
        data: {
          fundCode: productCode,
          businDate: moment().format('YYYYMMDD'),
        },
      });
      setLoading(false);
      if (res?.data?.stockAsset) {
        dispatch(setShowTop10Stocks(true));
      } else {
        dispatch(setShowTop10Stocks(false));
      }
      if (res?.data?.bondAsset) {
        dispatch(setShowTop10Bonds(true));
      } else {
        dispatch(setShowTop10Bonds(false));
      }
      return {
        ...res?.data,
        otherAsset:
          (res?.data?.fundTotalValue || 0) -
          (res?.data?.bondAsset || 0) -
          (res?.data?.stockAsset || 0) -
          (res?.data?.currentCash || 0),
      };
    },
    {
      manual: true,
      pollingWhenHidden: false,
      pollingInterval: 10000,
    },
  );

  const getSummaryInfo = async () => {
    setSummaryLoading(true);
    const res = await executeApi({
      serviceId: 'APEX_FUND_SUMMARY_INFO_API',
      data: {
        fundCode: productCode,
        businDate: moment().format('YYYYMMDD'),
      },
    });
    const info = (res?.records || []).reduce(
      (obj, cur) => {
        const { item, fluctuate, SharpeRatio, maxWithdrawal } = cur || {};
        obj.item.push({ value: item });
        obj.fluctuate.push({ value: fluctuate });
        obj.SharpeRatio.push({ value: SharpeRatio });
        obj.maxWithdrawal.push({ value: maxWithdrawal });
        return obj;
      },
      { fluctuate: [], SharpeRatio: [], maxWithdrawal: [], item: [] },
    );
    setSummaryInfo(info);
    setSummaryLoading(false);
  };

  const getIndexInfo = async () => {
    setIndexInfoLoading(true);
    const res = await executeApi({
      serviceId: 'DD_API_MUTUAL_FUND_ASSET_ITEM',
      data: {
        fundCode: productCode,
        businDate: moment().format('YYYYMMDD'),
      },
    });
    setIndexInfo(res?.data || {});
    setIndexInfoLoading(false);
  };

  useEffect(() => {
    cancelIntervalGetBaseInfo();
    cancelGetNetValues();
    if (productCode) {
      setLoading(true);
      setNetLoading(true);
      getNetValues();
      getBaseInfo();
      getSummaryInfo();
      getIndexInfo();
    }
  }, [productCode]);

  return (
    <Row
      gutter={[8, 8]}
      className="m-b-8"
      wrap={false}
      style={{ whiteSpace: 'nowrap', width: '100%' }}
    >
      <Col flex={1} style={{ minWidth: 'fit-content' }}>
        <div className="header-card-asset">
          <Skeleton active paragraph={{ rows: 2 }} loading={loading}>
            <Row
              style={{ width: '100%' }}
              justify="space-between"
              align="middle"
              wrap={false}
              gutter={8}
            >
              <Col span={8}>
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '60%' }}>
                    <DetailIcon
                      type="overviewStatic"
                      marginLeft={0}
                      marginRight={2}
                    />
                    实时净值
                  </div>
                  <div>净资产</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    className="large-important-text"
                    style={{ width: '60%' }}
                  >
                    {moneyFormat({
                      num: netValues?.realTimeNetValue,
                      decimal: 3,
                    })}
                  </div>
                  <Space>
                    <div className="large-important-text">
                      {moneyFormat({
                        num: parseFloat(baseInfo?.netAsset) / 10000,
                      })}
                    </div>
                    <span>万</span>
                  </Space>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  className="small-text"
                >
                  <div style={{ width: '60%' }}>
                    今日
                    <span style={{ marginLeft: 8 }} className="important-text">
                      {moneyFormat({
                        num: netValues?.todayChgValue,
                        decimal: 3,
                        needColor: true,
                        sign: netValues?.todayChg > 0 ? '+' : '',
                        unit: '  |  ',
                      })}
                      {moneyFormat({
                        num: netValues?.todayChg * 100,
                        unit: '%',
                        needColor: true,
                        sign: netValues?.todayChg > 0 ? '+' : '',
                      })}
                    </span>
                  </div>
                  <Space size={8} align="center">
                    总资产
                    <span>
                      <span
                        className="important-text"
                        style={{
                          color: 'var(--red-color)',
                        }}
                      >
                        {moneyFormat({
                          num: parseFloat(baseInfo?.totalAsset) / 10000,
                        })}
                      </span>
                      <span>万</span>
                    </span>
                  </Space>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '60%' }}>
                    本月
                    <span style={{ marginLeft: 8 }} className="important-text">
                      {moneyFormat({
                        num: netValues?.monthChgValue,
                        decimal: 3,
                        needColor: true,
                        sign: netValues?.monthChg > 0 ? '+' : '',
                        unit: '  |  ',
                      })}
                      {moneyFormat({
                        num: netValues?.monthChg * 100,
                        unit: '%',
                        needColor: true,
                        sign: netValues?.monthChg > 0 ? '+' : '',
                      })}
                    </span>
                  </div>

                  <Space size={8} align="center">
                    总负债
                    <span>
                      <span
                        className="important-text"
                        style={{
                          color: 'var(--green-color)',
                        }}
                      >
                        {moneyFormat({
                          num: parseFloat(baseInfo?.totalDebt) / 10000,
                        })}
                      </span>
                      <span>万</span>
                    </span>
                  </Space>
                </div>
              </Col>

              <Col flex={1}>
                <Spin spinning={netLoading} delay={100}>
                  <LineChart data={netValues?.netValueList} />
                </Spin>
              </Col>
            </Row>
          </Skeleton>
        </div>
      </Col>
      {/*<Col span={6} style={{ minWidth: 'fit-content' }}>*/}
      {/*  <div className="header-card-asset">*/}
      {/*    <Skeleton active paragraph={{ rows: 2 }} loading={loading}>*/}
      {/*      <Row*/}
      {/*        style={{ width: '100%' }}*/}
      {/*        justify="space-between"*/}
      {/*        align="middle"*/}
      {/*        wrap={false}*/}
      {/*      >*/}
      {/*        <Col>*/}
      {/*          <p>净资产</p>*/}
      {/*          <p>*/}
      {/*            <Space>*/}
      {/*              <div className="large-important-text">*/}
      {/*                {moneyFormat({*/}
      {/*                  num: parseFloat(baseInfo?.totalDebt) / 10000,*/}
      {/*                })}*/}
      {/*              </div>*/}
      {/*              <span>万</span>*/}
      {/*            </Space>*/}
      {/*          </p>*/}

      {/*          <Space className="small-text">*/}
      {/*            <Space>*/}
      {/*              总资产*/}
      {/*              <span>*/}
      {/*                <span*/}
      {/*                  className="important-text"*/}
      {/*                  style={{*/}
      {/*                    color: 'var(--red-color)',*/}
      {/*                  }}*/}
      {/*                >*/}
      {/*                  {moneyFormat({*/}
      {/*                    num: parseFloat(baseInfo?.totalAsset) / 10000,*/}
      {/*                  })}*/}
      {/*                </span>*/}
      {/*                <span>万</span>*/}
      {/*              </span>*/}
      {/*            </Space>*/}
      {/*            <Space>*/}
      {/*              总负债*/}
      {/*              <span>*/}
      {/*                <span*/}
      {/*                  className="important-text"*/}
      {/*                  style={{*/}
      {/*                    color: 'var(--green-color)',*/}
      {/*                  }}*/}
      {/*                >*/}
      {/*                  {moneyFormat({*/}
      {/*                    num: parseFloat(baseInfo?.netAsset) / 10000,*/}
      {/*                  })}*/}
      {/*                </span>*/}
      {/*                <span>万</span>*/}
      {/*              </span>*/}
      {/*            </Space>*/}
      {/*          </Space>*/}
      {/*        </Col>*/}
      {/*        /!* <Col>*/}
      {/*          <div>*/}
      {/*            <Space align="center">*/}
      {/*              股票*/}
      {/*              <Progress*/}
      {/*                style={{ width: 100 }}*/}
      {/*                strokeColor="#00AEFF"*/}
      {/*                percent={*/}
      {/*                  baseInfo?.totalAsset*/}
      {/*                    ? ((baseInfo?.stockAsset || 0) /*/}
      {/*                        baseInfo.totalAsset) **/}
      {/*                      100*/}
      {/*                    : 0*/}
      {/*                }*/}
      {/*                showInfo={false}*/}
      {/*              />*/}
      {/*              <span*/}
      {/*                style={{*/}
      {/*                  fontWeight: 'bold',*/}
      {/*                  color: '#00AEFF',*/}
      {/*                  display: 'inline-block',*/}
      {/*                  width: 48,*/}
      {/*                  textAlign: 'right',*/}
      {/*                }}*/}
      {/*              >*/}
      {/*                {moneyFormat({*/}
      {/*                  num: baseInfo?.totalAsset*/}
      {/*                    ? ((baseInfo?.stockAsset || 0) /*/}
      {/*                        baseInfo.totalAsset) **/}
      {/*                      100*/}
      {/*                    : 0,*/}
      {/*                  unit: '%',*/}
      {/*                })}*/}
      {/*              </span>*/}
      {/*            </Space>*/}
      {/*          </div>*/}
      {/*          <div>*/}
      {/*            <Space align="center">*/}
      {/*              债券*/}
      {/*              <Progress*/}
      {/*                style={{ width: 100 }}*/}
      {/*                strokeColor="#4ED2B9"*/}
      {/*                percent={*/}
      {/*                  baseInfo?.totalAsset*/}
      {/*                    ? ((baseInfo?.bondAsset || 0) / baseInfo.totalAsset) **/}
      {/*                      100*/}
      {/*                    : 0*/}
      {/*                }*/}
      {/*                showInfo={false}*/}
      {/*              />*/}
      {/*              <span*/}
      {/*                style={{*/}
      {/*                  fontWeight: 'bold',*/}
      {/*                  color: '#4ED2B9',*/}
      {/*                  display: 'inline-block',*/}
      {/*                  width: 48,*/}
      {/*                  textAlign: 'right',*/}
      {/*                }}*/}
      {/*              >*/}
      {/*                {moneyFormat({*/}
      {/*                  num: baseInfo?.totalAsset*/}
      {/*                    ? ((baseInfo?.bondAsset || 0) / baseInfo.totalAsset) **/}
      {/*                      100*/}
      {/*                    : 0,*/}
      {/*                  unit: '%',*/}
      {/*                })}*/}
      {/*              </span>*/}
      {/*            </Space>*/}
      {/*          </div>*/}
      {/*          <div>*/}
      {/*            <Space align="center">*/}
      {/*              现金*/}
      {/*              <Progress*/}
      {/*                style={{ width: 100 }}*/}
      {/*                strokeColor="#FBBF47"*/}
      {/*                percent={*/}
      {/*                  baseInfo?.totalAsset*/}
      {/*                    ? ((baseInfo?.currentCash || 0) /*/}
      {/*                        baseInfo.totalAsset) **/}
      {/*                      100*/}
      {/*                    : 0*/}
      {/*                }*/}
      {/*                showInfo={false}*/}
      {/*              />*/}
      {/*              <span*/}
      {/*                style={{*/}
      {/*                  fontWeight: 'bold',*/}
      {/*                  color: '#FBBF47',*/}
      {/*                  display: 'inline-block',*/}
      {/*                  width: 48,*/}
      {/*                  textAlign: 'right',*/}
      {/*                }}*/}
      {/*              >*/}
      {/*                {moneyFormat({*/}
      {/*                  num: baseInfo?.totalAsset*/}
      {/*                    ? ((baseInfo?.currentCash || 0) /*/}
      {/*                        baseInfo.totalAsset) **/}
      {/*                      100*/}
      {/*                    : 0,*/}
      {/*                  unit: '%',*/}
      {/*                })}*/}
      {/*              </span>*/}
      {/*            </Space>*/}
      {/*          </div>*/}
      {/*          <div>*/}
      {/*            <Space align="center">*/}
      {/*              其他*/}
      {/*              <Progress*/}
      {/*                style={{ width: 100 }}*/}
      {/*                strokeColor="#8B85ED"*/}
      {/*                percent={*/}
      {/*                  baseInfo?.totalAsset*/}
      {/*                    ? ((baseInfo?.otherAsset || 0) /*/}
      {/*                        baseInfo.totalAsset) **/}
      {/*                      100*/}
      {/*                    : 0*/}
      {/*                }*/}
      {/*                showInfo={false}*/}
      {/*              />*/}
      {/*              <span*/}
      {/*                style={{*/}
      {/*                  fontWeight: 'bold',*/}
      {/*                  color: '#8B85ED',*/}
      {/*                  display: 'inline-block',*/}
      {/*                  width: 48,*/}
      {/*                  textAlign: 'right',*/}
      {/*                }}*/}
      {/*              >*/}
      {/*                {moneyFormat({*/}
      {/*                  num: baseInfo?.totalAsset*/}
      {/*                    ? ((baseInfo?.otherAsset || 0) /*/}
      {/*                        baseInfo.totalAsset) **/}
      {/*                      100*/}
      {/*                    : 0,*/}
      {/*                  unit: '%',*/}
      {/*                })}*/}
      {/*              </span>*/}
      {/*            </Space>*/}
      {/*          </div>*/}
      {/*        </Col> *!/*/}
      {/*      </Row>*/}
      {/*    </Skeleton>*/}
      {/*  </div>*/}
      {/*</Col>*/}
      {!envConfig.HXOMS_AUTO_HIDE && (
        <>
          <Col span={6}>
            <div className="header-card-asset">
              <Skeleton
                active
                paragraph={{ rows: 2 }}
                loading={indexInfoLoading}
              >
                <div>
                  <p>
                    指令可用头寸
                    <DetailIcon type="overviewInstAsset" />
                  </p>
                  <p>
                    <Space>
                      <div className="large-important-text">
                        {isNumber(indexInfo?.instAmountT0)
                          ? moneyFormat({
                              num: indexInfo.instAmountT0 / 10000,
                            })
                          : '--'}
                      </div>
                      <span>万</span>
                    </Space>
                  </p>
                  <Space className="small-text">
                    <Space>
                      交易可用
                      <span>
                        <span
                          className="important-text"
                          style={{
                            color: 'var(--red-color)',
                          }}
                        >
                          {isNumber(indexInfo?.etruAmountT0)
                            ? moneyFormat({
                                num: indexInfo.etruAmountT0 / 10000,
                              })
                            : '--'}
                        </span>
                        <span>万</span>
                      </span>
                    </Space>
                    <Space>
                      交收预测
                      <span>
                        <span
                          className="important-text"
                          style={{
                            color: 'var(--primary-color)',
                          }}
                        >
                          {isNumber(indexInfo?.settleAmountT0)
                            ? moneyFormat({
                                num: indexInfo.settleAmountT0 / 10000,
                              })
                            : '--'}
                        </span>
                        <span>万</span>
                      </span>
                    </Space>
                  </Space>
                </div>
              </Skeleton>
            </div>
          </Col>
          <Col span={5}>
            <div className="header-card-asset">
              <Skeleton active paragraph={{ rows: 2 }} loading={summaryLoading}>
                <Row
                  justify="space-around"
                  gutter={8}
                  wrap={false}
                  style={{ width: '100%' }}
                >
                  <Col>
                    <div>
                      <DetailIcon marginLeft={0} type="overviewDetail" />
                    </div>
                    <div>
                      {(summaryInfo?.item || []).map((item) => (
                        <div key={item.label}>
                          <span>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </Col>
                  <Col style={{ textAlign: 'right' }}>
                    <div>
                      <Badge color="#00AEFF" text="波动率" />
                    </div>
                    <div>
                      {(summaryInfo?.fluctuate || []).map((item) => (
                        <div key={item.label}>
                          <span className="important-text">
                            {isNumber(item.value)
                              ? moneyFormat({
                                  num: item.value * 100,
                                  unit: '%',
                                })
                              : '--'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Col>
                  <Col style={{ textAlign: 'right' }}>
                    <div>
                      <Badge color="#FBBF47" text="夏普比率" />
                    </div>
                    <div>
                      {(summaryInfo?.SharpeRatio || []).map((item) => (
                        <div key={item.label}>
                          <span className="important-text">
                            {isNumber(item.value)
                              ? moneyFormat({
                                  num: item.value,
                                })
                              : '--'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Col>
                  <Col style={{ textAlign: 'right' }}>
                    <div>
                      <Badge color="#4ED2B9" text="最大回撤" />
                    </div>
                    <div>
                      {(summaryInfo?.maxWithdrawal || []).map((item) => (
                        <div key={item.label}>
                          <span className="important-text">
                            {isNumber(item.value)
                              ? moneyFormat({
                                  num: item.value * 100,
                                  unit: '%',
                                })
                              : '--'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>
              </Skeleton>
            </div>
          </Col>
        </>
      )}
    </Row>
  );
};

export default CompanySummary;
