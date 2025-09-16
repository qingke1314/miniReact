/*
 * @Author: guoxuan
 * @Date: 2025-02-08 09:04:07
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-08 11:41:34
 * @Description:
 */
/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-06-26 15:41:26
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-08 10:47:59
 * @Description:
 */
import { executeApi } from '@asset360/apis/appCommon';
import ProductRecordHistorySelector from '@asset360/components/IndicatorComponents/ProductRecordHistorySelector';
import { history, Outlet, useLocation } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Empty, Row, Space } from 'antd-v5';
import {
  configUtils,
  CustomTabs,
  getRealPath,
  getUserInfo,
  moneyFormat,
  routesUtils,
  useGetHeight,
} from 'iblive-base';
import { isNumber } from 'lodash';
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetData, setProductCode } from '../../../../store/assetLayoutSlice';
import styles from './index.less';

const OVERVIEW_PATH = '/APP/assetOverview/product/FundOverview';
const PARENT_PATH = '/APP/assetOverview/product';
export default function observer() {
  const prePathname = useRef();
  const { authMap } = getUserInfo() || {};
  const { state, pathname } = useLocation();
  const productCode = useSelector(
    (state) => state.asset360AssetLayout.productCode,
  );
  const dispatch = useDispatch();
  const [time, setTime] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));

  const pathList = useMemo(() => {
    const preName = pathname.endsWith('/product')
      ? `${pathname}/`
      : pathname.slice(0, pathname.lastIndexOf('/') + 1);
    const routesList = routesUtils.flatRoutes(
      configUtils.getConfig().routes ?? [],
    );
    return routesList
      .filter((item) => item.path.startsWith(preName))
      .map((item) => ({
        tab: (
          <>
            {item?.icon ?? ''}
            {item?.permissionName ?? ''}
          </>
        ),
        key: item?.path,
      }));
  }, [pathname, configUtils, routesUtils]);
  // const pathList = [
  //   {
  //     tab: (
  //       <>
  //         <Icon component={zuhegailanIcon} className={styles.tab_icon} />
  //         产品概览
  //       </>
  //     ),
  //     key: '/APP/assetOverview/product/FundOverview',
  //   },
  //   {
  //     tab: (
  //       <>
  //         <Icon component={shishichicangIcon} className={styles.tab_icon} />
  //         实时持仓
  //       </>
  //     ),
  //     key: '/APP/assetOverview/product/assetInventory',
  //   },
  //   {
  //     tab: (
  //       <>
  //         <Icon component={incomeIcon} className={styles.tab_icon} />
  //         收益分析
  //       </>
  //     ),
  //     key: '/APP/assetOverview/product/incomeAnalysis',
  //   },
  //   {
  //     tab: (
  //       <>
  //         <Icon component={dindanjiaoyiIcon} className={styles.tab_icon} />
  //         订单交易
  //       </>
  //     ),
  //     key: '/APP/assetOverview/product/assetVariation',
  //   },
  //   {
  //     tab: (
  //       <>
  //         <Icon component={quanyiriliIcon} className={styles.tab_icon} />
  //         权益日历
  //       </>
  //     ),
  //     key: '/APP/assetOverview/product/equityVariation',
  //   },
  //
  //   {
  //     tab: (
  //       <>
  //         <Icon component={fengxiangjiankongIcon} className={styles.tab_icon} />
  //         风险监控
  //       </>
  //     ),
  //     key: '/APP/assetOverview/product/riskControlOverview',
  //   },
  //   {
  //     tab: (
  //       <>
  //         <Icon component={toucunyuceIcon} className={styles.tab_icon} />
  //         头寸预测
  //       </>
  //     ),
  //     key: '/APP/assetOverview/product/cashOverview',
  //   },
  // ];
  const tabList = pathList.filter((item) => authMap?.[item.key]);
  const tabWrapper = useRef();
  const tabHeight = useGetHeight(
    tabWrapper.current,
    100,
    8,
    document.getElementById('overview_container'),
  );
  const productSelectRef = useRef();
  const [indexInfo, setIndexInfo] = useState();
  const {
    data: netValues,
    run: getNetValues,
    cancel: cancelGetNetValues,
  } = useRequest(
    async () => {
      if (!productCode) return;
      const res = await executeApi({
        serviceId: 'DD_API_REAL_TIME_NET_VALUE_STAT',
        data: {
          fundCode: productCode,
          businDate: moment().format('YYYYMMDD'),
        },
      });
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
      if (!productCode) return;
      const res = await executeApi({
        serviceId: 'DD_API_MUTUAL_FUND_ASSET_ITEM',
        data: {
          fundCode: productCode,
          businDate: moment().format('YYYYMMDD'),
        },
      });
      return {
        ...res?.data,
      };
    },
    {
      manual: true,
      pollingWhenHidden: false,
      pollingInterval: 10000,
    },
  );

  const getIndexInfo = async () => {
    if (!productCode) return;
    const res = await executeApi({
      serviceId: 'DD_API_MUTUAL_FUND_ASSET_ITEM',
      data: {
        fundCode: productCode,
        businDate: moment().format('YYYYMMDD'),
      },
    });
    setIndexInfo(res?.data || {});
  };

  const onTabChange = (tabKey) => {
    prePathname.current = pathname;
    history.push(tabKey);
  };

  useEffect(() => {
    // 右上角时间滚动
    let timeInterval;
    const createInterVal = () => {
      timeInterval = setInterval(() => {
        setTime(moment().format('YYYY-MM-DD HH:mm:ss'));
      }, 1000);
    };
    // 跳转到默认Tab
    if (pathname === getRealPath('/APP/assetOverview/product')) {
      const info = tabList?.[0];
      if (info) {
        history.push(info.key);
      }
    }
    if (state) {
      // 其他页面跳转携带
      dispatch(setProductCode(state.code));
      productSelectRef.current.setLocalStorageSearchRecord({
        value: state.code,
        label: `${state.code}-${state.name}`,
      });
    } else {
      // localStorage缓存近期选择的前十条
      const localHistory = productSelectRef.current.getLocalStorageSearchRecords();
      dispatch(setProductCode(localHistory[0]?.value));
    }
    createInterVal();
    return () => {
      dispatch(resetData());
      clearInterval(timeInterval);
    };
  }, []);

  useEffect(() => {
    if (pathname === OVERVIEW_PATH || pathname === PARENT_PATH) {
      cancelIntervalGetBaseInfo();
      cancelGetNetValues();
    } else {
      getNetValues();
      getBaseInfo();
      getIndexInfo();
    }
  }, [pathname, productCode]);

  return (
    <div style={{ height: '100%', width: '100%' }} id="overview_container">
      <Row
        justify="space-between"
        align="middle"
        className={styles.top_title_wrap}
      >
        <ProductRecordHistorySelector
          productCode={productCode}
          setProductCode={setProductCode}
          ref={productSelectRef}
        />
        <Space align="center" size={16}>
          {pathname !== '/APP/assetOverview/product/riskControlOverview' && (
            <>
              <div>
                <span>{time}</span>
              </div>
            </>
          )}
          {pathname !== OVERVIEW_PATH && (
            <>
              <Space size={4}>
                净资产
                <span className="important-text">
                  {isNumber(baseInfo?.fundValue)
                    ? moneyFormat({ num: baseInfo?.fundValue / 10000 })
                    : '--'}
                </span>
                万
              </Space>
              <Space size={4}>
                今日涨幅
                <span className="important-text">
                  {isNumber(netValues?.todayRiseRatio)
                    ? moneyFormat({
                        num: netValues?.todayRiseRatio * 100,
                        needColor: true,
                        sign: netValues?.todayRiseRatio > 0 ? '+' : '',
                      })
                    : '--'}
                </span>
                %
              </Space>
              <Space size={4}>
                指令可用头寸
                <span className="important-text">
                  {isNumber(indexInfo?.instAmountT0)
                    ? moneyFormat({
                        num: indexInfo.instAmountT0 / 10000,
                      })
                    : '--'}
                </span>
                万
              </Space>
            </>
          )}
        </Space>
      </Row>
      {productCode ? (
        <>
          <div style={{ position: 'relative' }}>
            <CustomTabs
              type="primary"
              activeKey={pathname}
              onChange={onTabChange}
              fieldNames={{ value: 'key', label: 'tab' }}
              options={tabList}
            />
            <div
              ref={tabWrapper}
              style={{
                height: tabHeight,
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
            >
              <Outlet />
            </div>
          </div>
        </>
      ) : (
        <Empty description="请选择产品" className="p-t-16" />
      )}
    </div>
  );
}
