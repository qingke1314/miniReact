import { executeApi } from '@asset360/apis/appCommon';
import { Col, Descriptions, Row, Spin } from 'antd';
import { LineChart } from 'echarts/charts';
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { getFormatDate, moneyFormat } from 'iblive-base';
import { useEffect, useState } from 'react';
import styles from '../../index.less';
import StockKLineChart from './StockKLineChart';
import StockQuotesChart from './StockQuotesChart';

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  MarkAreaComponent,
  VisualMapComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

const ZqItem = ({ title, value }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '8px 0',
    }}
  >
    <b
      style={{
        color: 'var(--text-color)',
        fontWeight: 'bold',
        fontSize: '1.3em',
      }}
    >
      {value}
    </b>
    <span style={{ color: '#909090' }}>{title}</span>
  </div>
);

export default ({
  visible,
  selectTreeKey,
  interCode,
  productCode,
  showTitle = true,
}) => {
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [kLineInfo, setKLine] = useState([]);

  const getCardInfo = async () => {
    setLoading(true);
    let serviceId;
    switch (selectTreeKey) {
      case 'gupiao':
        serviceId = 'DD_API_STOCK_BASIC_INFO';
        break;
      case 'zhaiquan':
        serviceId = 'DD_API_BOND_BASIC_INFO';
        break;
      case 'jijinlicai':
        serviceId = 'DD_API_MARKET_FUND_BASIC_INFO';
        break;
      default:
        serviceId = 'DD_API_STOCK_BASIC_INFO';
        break;
    }
    const res = await executeApi({
      serviceId: 'DD_API_MUTUAL_SEC_DAY_TIME_QUOTATION_INTRADAY',
      data: {
        interCode: interCode,
      },
    });
    const infoRes = await executeApi({
      serviceId,
      data: {
        interCode: interCode,
      },
    });
    const info = infoRes?.data || {};
    const timeInfo = { quoDetail: res?.records };
    setInfo({ ...info, ...timeInfo });
    setLoading(false);
  };

  const queryKLineInfo = async () => {
    const res = await executeApi({
      serviceId: 'DD_API_MUTUAL_SEC_DAYK_QUOTATION_INTRADAY',
      data: {
        interCode,
        fundCode: productCode,
      },
    });
    setKLine(res?.records || []);
  };

  useEffect(() => {
    if (visible) {
      getCardInfo();
      queryKLineInfo();
    } else {
      setInfo({});
    }
  }, [visible, interCode]);

  return (
    <div
      style={{
        padding: '0 10px 10px',
        overflow: 'auto',
      }}
    >
      <Spin spinning={loading}>
        {showTitle && (
          <div className="important-title m-b-8 m-t-8">今日行情</div>
        )}
        {selectTreeKey === 'gupiao' || selectTreeKey === 'huigou' ? (
          <>
            <Descriptions
              column={3}
              size="small"
              className={styles.quote_descriptions}
              style={{ marginTop: 16 }}
            >
              <Descriptions.Item
                label="最新价"
                span={3}
                labelStyle={{
                  fontSize: '16px',
                  color: 'var(--text-color-secondary)',
                  fontWeight: 'bold',
                }}
              >
                <span
                  style={{
                    fontSize: '16px',
                    color: 'var(--text-color-secondary)',
                    fontWeight: 'bold',
                  }}
                >
                  {moneyFormat({
                    num: info?.lastPrice,
                  })}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="涨跌幅">
                <span>
                  {moneyFormat({
                    num: info?.increaseRatio,
                    needColor: true,
                    unit: '%',
                  })}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="成交量">
                {moneyFormat({ num: info?.dealQty / 10000 })}
                &nbsp;万手
              </Descriptions.Item>
              <Descriptions.Item label="总市值">
                {moneyFormat({
                  num: info?.marketValue / 100000000,
                  unit: '亿',
                })}
              </Descriptions.Item>
              <Descriptions.Item label="总股本">
                {moneyFormat({
                  num: info?.totalAmount / 100000000,
                  unit: '亿',
                })}
              </Descriptions.Item>
              <Descriptions.Item label="流通股">
                {moneyFormat({
                  num: info?.turnoverAmount / 100000000,
                  unit: '亿',
                })}
              </Descriptions.Item>

              <Descriptions.Item label="行业">
                {moneyFormat({
                  num: info?.tem,
                  unit: '%',
                })}
              </Descriptions.Item>
              <Descriptions.Item label="市盈率">
                {moneyFormat({
                  num: info?.peRatioTtm,
                })}
              </Descriptions.Item>
              <Descriptions.Item label="行业市盈率">
                {moneyFormat({
                  num: info?.tem,
                  unit: '%',
                })}
              </Descriptions.Item>

              <Descriptions.Item label="市净率">
                <span>
                  {moneyFormat({
                    num: info?.tem,
                    unit: '%',
                  })}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="行业市净率">
                <span>
                  {moneyFormat({
                    num: info?.tem,
                    unit: '%',
                  })}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="股息率">
                {moneyFormat({
                  num: info?.tem,
                  unit: '%',
                })}
              </Descriptions.Item>
            </Descriptions>
            {info?.quoDetail && <StockQuotesChart quoDetail={info.quoDetail} />}
            {kLineInfo && <StockKLineChart info={kLineInfo} />}
          </>
        ) : (
          <>
            <Row
              justify="space-around"
              style={{ marginBottom: 8, marginLeft: 8 }}
            >
              <Col>
                <ZqItem title="待偿期" value={info?.compensatoryPeriod} />
              </Col>
              <Col>
                <ZqItem
                  title="成交净价(元)"
                  value={moneyFormat({
                    num: info?.netTransactionPrice,
                    decimal: 2,
                  })}
                />
              </Col>
              <Col>
                <ZqItem
                  title="最新收益率(%)"
                  value={moneyFormat({ num: info?.latestYield, decimal: 2 })}
                />
              </Col>
              <Col>
                <ZqItem
                  title="涨跌(BP)"
                  value={moneyFormat({
                    num: info?.priceLimit,
                    needColor: true,
                  })}
                />
              </Col>
              <Col>
                <ZqItem
                  title="加权收益率(%)"
                  value={moneyFormat({ num: info?.weightedYield, decimal: 2 })}
                />
              </Col>
            </Row>

            {/* <div className="important-title m-b-8">债券基本信息</div> */}
            <Descriptions
              column={2}
              bordered
              size="small"
              className={styles.quote_descriptions}
            >
              <Descriptions.Item label="证券名称">
                {info?.secName}
              </Descriptions.Item>
              <Descriptions.Item label="证券内码">
                {info?.interCode}
              </Descriptions.Item>
              <Descriptions.Item label="债券类型">
                {info?.secType}
              </Descriptions.Item>
              <Descriptions.Item label="发行人">
                {info?.issuerId}
              </Descriptions.Item>
              <Descriptions.Item label="债券发行日">
                {getFormatDate(info?.publishDate)}
              </Descriptions.Item>
              <Descriptions.Item label="到期兑付日">
                {getFormatDate(info?.endDate)}
              </Descriptions.Item>
              <Descriptions.Item label="债券期限">
                {info?.existLimite}
              </Descriptions.Item>
              <Descriptions.Item label="面值（元）">
                {moneyFormat({ num: info?.facePrice, decimal: 2 })}
              </Descriptions.Item>
              <Descriptions.Item label="发行价格（元）">
                {moneyFormat({ num: info?.publicPrice, decimal: 2 })}
              </Descriptions.Item>
              <Descriptions.Item label="计划发行量（亿）">
                {moneyFormat({
                  num: info?.totalAmount / 100000000,
                  decimal: 2,
                })}
              </Descriptions.Item>
              <Descriptions.Item label="实际发行量（亿）">
                {moneyFormat({
                  num: info?.turnoverAmount / 100000000,
                  decimal: 2,
                })}
              </Descriptions.Item>
              <Descriptions.Item label="息票类型">
                {info?.interestType}
              </Descriptions.Item>
              <Descriptions.Item label="付息频率">
                {info?.payInteval}
              </Descriptions.Item>
              <Descriptions.Item label="债券起息日">
                {getFormatDate(info?.startcalDate)}
              </Descriptions.Item>
              <Descriptions.Item label="基准利差（%）">
                {moneyFormat({ num: info?.basicRate * 100, decimal: 2 })}
              </Descriptions.Item>
              <Descriptions.Item label="票面利率（%）">
                {moneyFormat({ num: info?.yearRate * 100, decimal: 2 })}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Spin>
    </div>
  );
};
