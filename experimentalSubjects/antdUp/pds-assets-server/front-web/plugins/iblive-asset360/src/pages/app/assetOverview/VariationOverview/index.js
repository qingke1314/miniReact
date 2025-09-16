import { executeApi } from '@asset360/apis/appCommon';
import { Col, Progress, Row, Skeleton, Space } from 'antd';
import { moneyFormat } from 'iblive-base';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import DetailIcon from '@asset360/components/DetailIcon';

const VariationOverview = () => {
  const [overViewInfo, setOverViewInfo] = useState({});
  const { date, productCode } = useSelector(
    (state) => state.asset360AssetLayout,
  );
  const [loading, setLoading] = useState(false);
  const getOverViewData = () => {
    setLoading(true);
    Promise.allSettled([
      executeApi({
        data: {
          fundCode: productCode,
          businDate: moment(date).format('YYYYMMDD'),
        },
        serviceId: 'DD_API_SETTLE_STAT_INFO',
      }),
      executeApi({
        data: {
          fundCode: productCode,
          businessDate: moment(date).format('YYYYMMDD'),
        },
        serviceId: 'DD_API_FUND_INST_NUM_STAT',
      }),
    ]).then((results) => {
      const [res1, res2] = results;
      setOverViewInfo(
        {
          ...(res1?.value?.data ?? {}),
          ...(res2?.value?.data ?? {}),
        } || {},
      );
      setLoading(false);
    });
  };
  useEffect(() => {
    if (productCode) {
      getOverViewData();
    }
  }, [date, productCode]);
  const ratioMap = useMemo(() => {
    if (!overViewInfo.totalAmt) return {};
    const totalRatio = (overViewInfo.settleedAmt || 0) / overViewInfo.totalAmt;
    const exchangeRatio =
      (overViewInfo.exchangeAmt || 0) / overViewInfo.totalAmt;
    const bankAmtRatio = (overViewInfo.bankAmt || 0) / overViewInfo.totalAmt;
    const bfjAmtRatio = (overViewInfo.bfjAmt || 0) / overViewInfo.totalAmt;
    return {
      totalRatio,
      exchangeRatio,
      bankAmtRatio,
      bfjAmtRatio,
    };
  }, [overViewInfo]);
  return (
    <>
      <Row gutter={8} className="m-b-8" align="middle">
        <Col span={12}>
          <div className="header-card-asset">
            <Skeleton loading={loading} title={false} paragraph={{ rows: 3 }}>
              <div>
                <div>当日指令数量</div>
                <Space size={4} className="m-t-4">
                  <span className="large-important-text">
                    {moneyFormat({
                      num: overViewInfo.todayInstSum,
                      decimal: 0,
                    })}
                  </span>
                  个
                </Space>
                <div>
                  <Space size={16} align="center" className="m-t-4 small-text">
                    <Space size={8}>
                      预置指令
                      <span className="important-text">
                        {moneyFormat({
                          num: overViewInfo.instPresetNum,
                          decimal: 0,
                        })}
                      </span>
                    </Space>
                    <Space size={8}>
                      草稿指令
                      <span
                        className="important-text"
                        style={{ color: '#8B85ED' }}
                      >
                        {moneyFormat({
                          num: overViewInfo.instDraftNum,
                          decimal: 0,
                        })}
                      </span>
                    </Space>
                    <Space size={8}>
                      远期指令
                      <span
                        className="important-text"
                        style={{ color: '#186DF5' }}
                      >
                        {moneyFormat({
                          num: overViewInfo.instFdNum,
                          decimal: 0,
                        })}
                      </span>
                    </Space>
                  </Space>
                </div>
              </div>
            </Skeleton>
          </div>
        </Col>
        <Col span={12}>
          <div className="header-card-asset">
            <Skeleton loading={loading} title={false} paragraph={{ rows: 3 }}>
              <Row gutter={40} align="middle" style={{ width: '100%' }}>
                <Col span={12}>
                  <Row justify="space-between" align="middle" className="m-t-4">
                    <Col>
                      <DetailIcon
                        marginLeft={0}
                        marginRight={8}
                        type="variationOverview"
                      />
                      <Progress
                        percent={ratioMap.totalRatio || 0}
                        strokeColor="#f0f0f0"
                        trailColor="#FF8A4A"
                        showInfo={false}
                        style={{ width: '175px' }}
                      />
                    </Col>
                    <Col>
                      <Space>
                        交收比例
                        <span
                          className="important-text"
                          style={{ color: '#FF8A4A' }}
                        >
                          {moneyFormat({
                            num: ratioMap.totalRatio * 100,
                            decimal: 2,
                            unit: '%',
                          })}
                        </span>
                      </Space>
                    </Col>
                  </Row>
                  <Row justify="space-between" align="middle" className="m-t-4">
                    <Col>
                      <Space>
                        交易所金额
                        <span className="important-text">
                          {moneyFormat({
                            num: overViewInfo.exchangeAmt,
                            decimal: 2,
                          })}
                        </span>
                      </Space>
                    </Col>
                    <Col>
                      <span
                        className="important-text"
                        style={{ color: '#FF8A4A' }}
                      >
                        {/* {moneyFormat({
                          num: ratioMap.exchangeRatio * 100,
                          decimal: 2,
                          unit: '%',
                        })} */}
                      </span>
                    </Col>
                  </Row>
                  <Row justify="space-between" align="middle" className="m-t-4">
                    <Col>
                      <Space>
                        银行间金额
                        <span className="important-text">
                          {moneyFormat({
                            num: overViewInfo.bankAmt,
                            decimal: 2,
                          })}
                        </span>
                      </Space>
                    </Col>
                    <Col>
                      <span
                        className="important-text"
                        style={{ color: '#FF8A4A' }}
                      >
                        {/* {moneyFormat({
                          num: ratioMap.bankAmtRatio * 100,
                          decimal: 2,
                          unit: '%',
                        })} */}
                      </span>
                    </Col>
                  </Row>
                  <Row justify="space-between" align="middle" className="m-t-4">
                    <Col>
                      <Space>
                        备付金金额
                        <span className="important-text">
                          {moneyFormat({
                            num: overViewInfo.bfjAmt,
                            decimal: 2,
                          })}
                        </span>
                      </Space>
                    </Col>
                    <Col>
                      <span
                        className="important-text"
                        style={{ color: '#FF8A4A' }}
                      >
                        {/* {moneyFormat({
                          num: ratioMap.bfjAmtRatio * 100,
                          decimal: 2,
                          unit: '%',
                        })} */}
                      </span>
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <div className="m-t-4">
                    <Space>
                      交收未到账金额
                      <span className="important-text">
                        {moneyFormat({
                          num: overViewInfo.uncashedAmt,
                          decimal: 2,
                        })}
                      </span>
                    </Space>
                  </div>
                  <div className="m-t-4">
                    <Space>
                      交收失败金额
                      <span
                        className="important-text"
                        style={{ color: 'var(--green-color)' }}
                      >
                        {moneyFormat({
                          num: overViewInfo.failAmt,
                          decimal: 2,
                        })}
                      </span>
                    </Space>
                  </div>
                  <div className="m-t-4">
                    <Space>
                      已交收金额
                      <span
                        style={{ color: 'var(--red-color)' }}
                        className="important-text"
                      >
                        {moneyFormat({
                          num: overViewInfo.settleedAmt,
                          decimal: 2,
                        })}
                      </span>
                    </Space>
                  </div>
                </Col>
              </Row>
            </Skeleton>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default VariationOverview;
