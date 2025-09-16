/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-10-14 19:00:08
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 * @LastEditTime: 2024-12-11 11:37:12
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\AssetInventory\views\NavigationInfo.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { executeApi } from '@asset360/apis/appCommon';
import { Space, Spin } from 'antd-v5';
import { moneyFormat } from 'iblive-base';
import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from '../index.less';
import DetailIcon from '@asset360/components/DetailIcon';

export default function NavigationInfo({
  productCode,
  selectTreeKey,
  date,
  refrshFlag,
}) {
  const { astUnitId } = useSelector((state) => state.asset360AssetLayout);
  const [navigationInfo, setNavigationInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const getNavigationInfo = async (isNeedLoading) => {
    isNeedLoading && setLoading(true);
    if (['yingshou', 'yingfu'].includes(selectTreeKey)) {
      setNavigationInfo({});
      return;
    }
    // let serviceId;
    let assetType;
    switch (selectTreeKey) {
      case 'gupiao':
        assetType = 'GP';
        // serviceId = 'APEX_STOCK_STAT_ASSET_API';
        break;
      case 'zhaiquan':
        assetType = 'ZQ';
        // serviceId = 'APEX_BOND_STAT_ASSET_API';
        break;
      case 'jijinlicai':
        assetType = 'JJ';
        // serviceId = 'APEX_TOT_STAT_ASSET_API';
        break;
      case 'huigou':
        assetType = 'HG';
        // serviceId = 'APEX_REPO_STAT_ASSET_API';
        break;
      case 'qihuo':
        assetType = 'QH';
        // serviceId = 'APEX_FUTURES_STAT_ASSET_API';
        break;
      case 'qiquan':
        assetType = 'QQ';
        // serviceId = 'APEX_OPTION_STAT_ASSET_API';
        break;
      case 'qita':
        assetType = 'QT';
        // serviceId = 'APEX_OTHER_STAT_ASSET_API';
        break;
      case 'cunkuan':
        assetType = 'CK';
        // serviceId = 'APEX_DEPOSIT_STAT_ASSET_API';
        break;
      case 'xianjin':
        assetType = 'XJ';
        break;
      default:
        break;
    }
    const res = await executeApi({
      serviceId: 'DD_API_STAT_ASSET',
      data: {
        fundCode: productCode,
        assetType,
        astUnitId,
        businDate: moment().format('YYYYMMDD'),
      },
    });
    const data = res?.data || {};
    setNavigationInfo(data);
    isNeedLoading && setLoading(false);
  };

  useEffect(() => {
    if (productCode) {
      getNavigationInfo(true);
    }
  }, [date, productCode, selectTreeKey, astUnitId]);

  useEffect(() => {
    if (productCode) {
      getNavigationInfo();
    }
  }, [refrshFlag]);

  return (
    <Spin spinning={loading}>
      <div className={styles.money_head_wrap}>
        <div style={{ lineHeight: '18px' }}>
          <div>
            <span className={styles.money_title}>
              市值
              <DetailIcon marginLeft={2} type="assentInventory" />
            </span>
            <span className={styles.money_value} style={{ marginLeft: 11 }}>
              {moneyFormat({
                num: navigationInfo?.nowMktValue / 10000,
                decimal: 2,
              })}
            </span>
            <span className={styles.money_title}>&nbsp;万</span>
          </div>
          <Space size={16} className="m-t-4">
            <Space size={8}>
              <span className={styles.money_title_small}>今日</span>
              <span className={styles.money_value_small}>
                {moneyFormat({
                  num: navigationInfo?.todayValueChg * 100,
                  decimal: 2,
                  needColor: true,
                  unit: '%',
                })}
              </span>
            </Space>
            <Space size={8}>
              <span
                className={styles.money_title_small}
                style={{ marginLeft: 11 }}
              >
                本月
              </span>
              <span className={styles.money_value_small}>
                {moneyFormat({
                  num: navigationInfo?.monthValueChg * 100,
                  decimal: 2,
                  needColor: true,
                  unit: '%',
                })}
              </span>
            </Space>
          </Space>
        </div>

        <div style={{ marginLeft: 130 }}>
          <div className={styles.money_title}>资产占净比</div>
          <span className={styles.money_value} style={{ marginTop: 4 }}>
            {moneyFormat({
              num:
                (navigationInfo?.nowMktValue / navigationInfo?.nowNetAst) * 100,
              decimal: 2,
              unit: '%',
            })}
          </span>
        </div>

        {['gupiao', 'zhaiquan'].includes(selectTreeKey) && (
          <div style={{ lineHeight: '20px', marginLeft: 130 }}>
            <div className={styles.money_title}>Top10持仓集中度</div>
            <div
              className={styles.comm_head_value}
              style={{ color: '#FF7B2C', marginTop: 4 }}
            >
              {moneyFormat({
                num: navigationInfo?.top10RateInNetVal * 100,
                decimal: 2,
                unit: '%',
              })}
            </div>
          </div>
        )}
      </div>
    </Spin>
  );
}
