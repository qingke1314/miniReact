/*
 * @Author: 童圣滔 tongshengtao@bosssoft.com.cn
 * @Date: 2025-07-18 09:06:16
 * @LastEditors: 童圣滔 tongshengtao@bosssoft.com.cn
 * @LastEditTime: 2025-07-31 11:56:08
 * @FilePath: \ibor-business-server\pds-assets-server\front-web\plugins\iblive-asset360\src\pages\app\assetOverview\IncomeAnalysis\views\StaticInfo.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { memo, useEffect, useState } from 'react';
import { executeApi } from '@asset360/apis/appCommon';
import { formatNumberWithUnit } from '../const';
import styles from './index.module.less';
import DetailIcon from '../../../../../components/DetailIcon';

const StaticInfo = ({ productCode, activeDateRange, activeSelect }) => {
  const [staticInfo, setStaticInfo] = useState({});
  useEffect(() => {
    if (!productCode || !activeDateRange?.length) return;
    executeApi({
      serviceId: 'DD_API_FUND_ASSET_AND_INCOME',
      data: {
        fundCode: productCode,
        startDate: activeDateRange?.[0]?.format('YYYYMMDD'),
        endDate: activeDateRange?.[1]?.format('YYYYMMDD'),
        astUnitId: activeSelect?.astUnitId
          ? Number(activeSelect?.astUnitId)
          : null,
      },
    }).then((res) => {
      setStaticInfo(res?.data || {});
    });
  }, [
    activeDateRange,
    productCode,
    activeSelect?.astUnitId,
    activeSelect?.combiCode,
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
      <div className={styles.statistical_information}>
        <div
          style={{
            marginTop: 8,
            fontSize: 16,
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <div>
              <span>净资产：</span>
              {formatNumberWithUnit(staticInfo?.netAsset, {
                needColor: true,
              })}
              <div className={styles.rightStaticInfo}>
                持仓市值：
                {formatNumberWithUnit(staticInfo?.totalMarketValue, {
                  needColor: true,
                })}
              </div>
              <div className={styles.rightStaticInfo}>
                现金余额：
                {formatNumberWithUnit(staticInfo?.cashBalance, {
                  needColor: true,
                })}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div>
              <span>
                区间总收益
                <DetailIcon
                  marginLeft={2}
                  marginRight={2}
                  type="momRightStatic1"
                />
                ：
              </span>
              {formatNumberWithUnit(staticInfo?.income, {
                needColor: true,
              })}
              <div className={styles.rightStaticInfo}>
                浮动收益：
                {formatNumberWithUnit(staticInfo?.floatIncome, {
                  needColor: true,
                })}
              </div>
              <div className={styles.rightStaticInfo}>
                累计收益：
                {formatNumberWithUnit(staticInfo?.accumulateProfit, {
                  needColor: true,
                })}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div>
              <span>
                当日收益
                <DetailIcon marginLeft={2} marginRight={2} type="momStatic2" />
                ：
              </span>
              {formatNumberWithUnit(staticInfo?.todayIncome, {
                needColor: true,
              })}
              <div className={styles.rightStaticInfo}>
                浮动收益：
                {formatNumberWithUnit(staticInfo?.todayFloatIncome, {
                  needColor: true,
                })}
              </div>
              <div className={styles.rightStaticInfo}>
                差价收入：
                {formatNumberWithUnit(staticInfo?.todaySpreadIncome, {
                  needColor: true,
                })}
              </div>
            </div>
          </div>
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
        </div>
      </div>
    </div>
  );
};

export default memo(StaticInfo);
