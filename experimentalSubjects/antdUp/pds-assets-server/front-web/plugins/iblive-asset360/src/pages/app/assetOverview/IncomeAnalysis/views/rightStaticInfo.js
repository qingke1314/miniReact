/*
 * @Author: 童圣滔 tongshengtao@bosssoft.com.cn
 * @Date: 2025-07-18 09:06:16
 * @LastEditors: 童圣滔 tongshengtao@bosssoft.com.cn
 * @LastEditTime: 2025-07-31 11:56:08
 * @FilePath: \ibor-business-server\pds-assets-server\front-web\plugins\iblive-asset360\src\pages\app\assetOverview\IncomeAnalysis\views\StaticInfo.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { executeApi } from '@asset360/apis/appCommon';
import { Col, Row } from 'antd';
import { formatNumberWithUnit } from '../const';
import { useEffect, useState } from 'react';
import styles from './index.module.less';
import DetailIcon from '@asset360/components/DetailIcon';

const StaticInfo = ({
  activeIndex,
  onChange,
  productCode,
  activeDateRange,
  activeSelect,
  moreValues,
}) => {
  const [info, setInfo] = useState({});
  useEffect(() => {
    if (!productCode || !activeDateRange?.length) return;
    executeApi({
      serviceId: 'DD_API_FUND_STOCK_ASSET_ACC_INCOME_STAT',
      data: {
        fundCode: productCode,
        startDate: activeDateRange?.[0]?.format('YYYYMMDD'),
        endDate: activeDateRange?.[1]?.format('YYYYMMDD'),
        astUnitId: activeSelect?.astUnitId
          ? Number(activeSelect?.astUnitId)
          : null,
        combiCode: activeSelect?.combiCode || null,
        ...moreValues,
      },
    }).then((res) => {
      setInfo(res?.data || {});
    });
  }, [
    activeDateRange,
    productCode,
    activeSelect?.astUnitId,
    activeSelect?.combiCode,
    moreValues,
  ]);
  return (
    <div
      style={{
        border: '1px solid var(--border-color-base)',
        padding: 8,
        display: 'flex',
        alignItems: 'center',
      }}
      className={styles.staticInfo}
    >
      <div
        onClick={onChange}
        className={`${styles.statistical_information} ${
          activeIndex ? styles.active : ''
        }`}
      >
        <Row
          gutter={[4, 12]}
          style={{
            marginTop: 8,
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          <Col style={{ textAlign: 'center' }} span={8}>
            <div style={{ marginTop: 8 }}>
              <span>总市值：</span>
              {formatNumberWithUnit(info?.stockMarketValue, {
                needColor: true,
              })}
            </div>
          </Col>
          <Col style={{ textAlign: 'center' }} span={8}>
            <div>
              <span>
                总盈亏
                <DetailIcon type="incomeStatic1" />：
              </span>
              {formatNumberWithUnit(info?.secIncome, {
                needColor: true,
              })}
              <div className={styles.rightStaticInfo}>
                浮动盈亏：
                {formatNumberWithUnit(info.secFloatIncome, { needColor: true })}
                <span style={{ marginLeft: 8 }}>
                  累计收益：
                  {formatNumberWithUnit(info.secTradeIncome, {
                    needColor: true,
                  })}
                </span>
              </div>
            </div>
          </Col>
          <Col style={{ textAlign: 'center' }} span={8}>
            <div>
              <span>
                当日盈亏
                <DetailIcon
                  marginLeft={4}
                  marginRight={2}
                  type="incomeStatic2"
                />
                ：
              </span>
              {formatNumberWithUnit(info?.todaySecIncome, {
                needColor: true,
              })}
              <div className={styles.rightStaticInfo}>
                浮动盈亏：
                {formatNumberWithUnit(info.todaySecFloatIncome, {
                  needColor: true,
                })}
                <span style={{ marginLeft: 8 }}>
                  差价收益：
                  {formatNumberWithUnit(info.todaySecTradeIncome, {
                    needColor: true,
                  })}
                </span>
              </div>
            </div>
          </Col>
          {/* <div>
            万分收益：
            {moneyFormat({
              num: yearRadio * 100,
              unit: '%',
              needColor: true,
              sign: yearRadio > 0 ? '+' : '',
            })}
          </div>
          <div>七日年化收益率：5.05%</div>
          <div> 净资产： 500万</div> */}
        </Row>
      </div>
    </div>
  );
};

export default StaticInfo;
