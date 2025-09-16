import { executeApi } from '@asset360/apis/appCommon';
import ProductRecordHistorySelector from '@asset360/components/IndicatorComponents/ProductRecordHistorySelector';
import { history, useLocation } from '@umijs/max'; //Outlet
import { useRequest } from 'ahooks';
import { Empty, Row, Space } from 'antd-v5';
import {
  configUtils,
  getRealPath,
  getUserInfo,
  moneyFormat,
  routesUtils,
  useGetHeight,
  CustomSearchRecordHistorySelector,
} from 'iblive-base';
import { isNumber } from 'lodash';
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetData,
  setProductCode,
  setAstUnitId,
} from '../../store/assetLayoutSlice';
import styles from './index.less';
import Time from './Time';

const OVERVIEW_PATH = '/APP/assetOverview/product/FundOverview';
const ProductAssetLayout = ({ children, needAssetType = false }) => {
  const { authMap } = getUserInfo() || {};
  const { state, pathname } = useLocation();
  const { productCode, astUnitId } = useSelector(
    (state) => state.asset360AssetLayout,
  );
  const dispatch = useDispatch();

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
  const tabList = pathList.filter((item) => authMap?.[item.key]);
  const [assetList, setAssetList] = useState([]);
  const tabWrapper = useRef();
  const tabHeight = useGetHeight(
    tabWrapper.current,
    100,
    8,
    document.getElementById('overview_container'),
  );
  const productSelectRef = useRef();
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

  useEffect(() => {
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
    return () => {
      dispatch(resetData());
      cancelIntervalGetBaseInfo();
    };
  }, []);

  useEffect(() => {
    getBaseInfo();
    if (!productCode) return;
    executeApi({
      serviceId: 'DD_API_FUND_ASTUNIT_INFO',
      data: {
        fundCode: productCode,
      },
    }).then((res) => {
      setAssetList(res?.records || []);
      dispatch(setAstUnitId(''));
    });
  }, [pathname, productCode]);
  /**
   * 今日涨幅
   */
  const todayRise = useMemo(() => {
    if (!baseInfo || !baseInfo.ytdAssetValue) return '';
    return (
      (((baseInfo?.netAsset || 0) - baseInfo?.ytdAssetValue) /
        baseInfo?.ytdAssetValue) *
      100
    );
  }, [baseInfo]);
  return (
    <div style={{ height: '100%', width: '100%' }} id="overview_container">
      <Row
        justify="space-between"
        align="middle"
        className={styles.top_title_wrap}
      >
        <div>
          <ProductRecordHistorySelector
            productCode={productCode}
            setProductCode={setProductCode}
            ref={productSelectRef}
          />
          {needAssetType && (
            <CustomSearchRecordHistorySelector
              value={astUnitId}
              onChange={(v) => {
                dispatch(setAstUnitId(v));
              }}
              rootOptiions={assetList}
              optionMainKey="astUnitId"
              localStorageKey="assetOverview-assetInventory-astUnitId"
              selectConfig={{
                style: {
                  minWidth: '200px',
                },
                fieldNames: {
                  value: 'astUnitId',
                  label: 'astUnitName',
                },
                bordered: false,
                placeholder: '选择资产单元',
                filterOption: (inputValue, option) =>
                  (option.astUnitId || '').includes(inputValue) ||
                  (option.astUnitName || '').includes(inputValue),
              }}
            />
          )}
        </div>
        <Space align="center" size={16}>
          <Time />
          {pathname !== OVERVIEW_PATH && (
            <>
              <Space size={4}>
                净资产
                <span className="important-text">
                  {isNumber(baseInfo?.netAsset)
                    ? moneyFormat({ num: baseInfo?.netAsset / 10000 })
                    : '--'}
                </span>
                万
              </Space>
              <Space size={4}>
                今日涨幅
                <span className="important-text">
                  {todayRise
                    ? moneyFormat({
                        num: todayRise,
                        needColor: true,
                        sign: todayRise > 0 ? '+' : '',
                      })
                    : '--'}
                </span>
                %
              </Space>
            </>
          )}
        </Space>
      </Row>
      {productCode ? (
        <>
          <div style={{ position: 'relative' }}>
            <div
              ref={tabWrapper}
              style={{
                height: tabHeight,
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
            >
              {children}
              {/* <Outlet /> */}
            </div>
          </div>
        </>
      ) : (
        <Empty description="请选择产品" className="p-t-16" />
      )}
    </div>
  );
};

export default ProductAssetLayout;
