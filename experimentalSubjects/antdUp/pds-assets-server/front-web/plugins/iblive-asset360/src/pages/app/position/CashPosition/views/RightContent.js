/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-11 09:43:05
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 * @LastEditTime: 2024-12-06 11:06:22
 * @FilePath: \invest-index-server-front\src\pages\monitor\CashPosition\views\ConfigTabs.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  // AccountBookOutlined,
  CalendarOutlined,
  CameraOutlined,
  ExportOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { reloadPosition } from '@asset360/apis/position';
import { doSnapshot } from '@asset360/apis/snapshot';
import cashDealDetailIcon from '@asset360/assets/app/position/cashDealDetailIcon.png';
import cashForecastIcon from '@asset360/assets/app/position/cashForecastIcon.png';
import cashFundCalendayIcon from '@asset360/assets/app/position/cashFundCalendayIcon.png';
import cashMonitoringIcon from '@asset360/assets/app/position/cashMonitoringIcon.png';
import customFundDetailsIcon from '@asset360/assets/app/position/customFundDetailsIcon.png';
import positionDetailsIcon from '@asset360/assets/app/position/positionDetailsIcon.png';
import { useLocation } from '@umijs/max';
import { Button, Col, DatePicker, message, Row, Select, Tabs } from 'antd-v5';
import { getUserInfo, requestUtils } from 'iblive-base';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import styles from '../index.less';
import CashForecast from './CashForecast';
import CashMonitoring from './CashMonitoring';
import CashReconciliation from './CashReconciliation';
import CustomFundDetails from './CustomFundDetails';
import DealDetail from './DealDetail';
import DealIndex from './DealIndex';
import FundCalendar from './FundCalendar';
import IndexSshootModal from './IndexSshootModal';
import PositionDetails from './PositionDetails';

const { TabPane } = Tabs;

const { DownloadFile } = requestUtils;
const POSITION_LINK = [
  {
    value: 'TRADE',
    name: '盘中',
  },
  {
    value: 'SETTLE',
    name: '盘后',
  },
];
const FOREAST_INDEX = [
  {
    value: 'instAvailT0',
    name: 'T0指令可用',
  },
  {
    value: 'instAvailT1',
    name: 'T1指令可用',
  },
  {
    value: 'cashAvailT0',
    name: 'T0交易可用',
  },
  {
    value: 'cashAvailT1',
    name: 'T1交易可用',
  },
];
export default ({
  height,
  paramsForList,
  updateTree,
  positionLink,
  setPositionLink,
  activeTab,
  setActiveTab,
}) => {
  const [updateDate, setUpdateDate] = useState('');
  const [indexLoading, setIndexLoading] = useState(false);
  const [indexSshootVisible, setIndexSshootVisible] = useState(false);
  const [forecastType, setForecastType] = useState('instAvailT0');
  const [date, setDate] = useState(moment());
  const ChildRef = useRef();
  const ChildTwoRef = useRef();
  const ChildThreeRef = useRef();
  const location = useLocation();
  const { authMap } = getUserInfo();

  const closeIndexSshootModal = () => setIndexSshootVisible(false);
  const onTabChange = (tab) => {
    setActiveTab(tab);
    //日终头寸不展示目录树的资产单元
    if (tab === 'cashReconciliation') {
      updateTree(true);
    } else {
      updateTree();
    }
  };

  const refreshIndex = async () => {
    if (!paramsForList?.objectCode) return;
    setIndexLoading(true);
    const { headObjectCode, objectCode, parentObjectCode } = paramsForList;
    const param = {
      businDate: moment(date).format('yyyyMMDD'),
      fundCode: headObjectCode === 'fund_code' ? objectCode : parentObjectCode,
      astUnitId: headObjectCode === 'ast_unit_code' ? objectCode : undefined,
      positionLink: activeTab === 'cashForecast' ? positionLink : undefined,
      indexType: activeTab === 'cashForecast' ? 'POSITION' : 'FINANCE',
      positionType: activeTab === 'dealIndex' ? 'TRADE' : 'GZ',
    };
    const res = await reloadPosition({
      ...param,
      indexType: activeTab === 'cashForecast' ? 'POSITION' : 'FINANCE',
    });
    if (res?.code === 1) {
      message.success('刷新成功');
      const childRef =
        activeTab === 'cashForecast'
          ? ChildRef
          : activeTab === 'cashReconciliation'
          ? ChildTwoRef
          : ChildThreeRef;
      childRef?.current && childRef.current.getData();
    }
    setIndexLoading(false);
  };

  const handleExport = (activedTabKey) => {
    if (!paramsForList?.objectCode) return;
    const { headObjectCode, objectCode, parentObjectCode } = paramsForList;
    let requestURL = '';
    if (
      activedTabKey === 'cashForecast' ||
      activedTabKey === 'cashReconciliation' ||
      activedTabKey === 'dealIndex'
    ) {
      requestURL = '/pds/position/forecast/exportPositionForecast';
    } else if (activedTabKey === 'positionDetails') {
      requestURL = '/pds/position/fundAssetHold/exportHoldDetail';
    } else if (activedTabKey === 'cashMonitoring') {
      requestURL = '/pds/position/positionMonitor/positionMonitor';
    } else if (activedTabKey === 'fundCalendar') {
      requestURL = '/pds/position/calendar/exportCalendarDetails';
    }

    DownloadFile(requestURL, {
      method: 'GET',
      params: {
        businDate: moment(date).format('yyyyMMDD'),
        fundCode:
          headObjectCode === 'fund_code' ? objectCode : parentObjectCode,
        astUnitId: headObjectCode === 'ast_unit_code' ? objectCode : undefined,
        month:
          activedTabKey === 'fundCalendar'
            ? moment(date).format('MM')
            : undefined,
        year:
          activedTabKey === 'fundCalendar'
            ? moment(date).format('yyyy')
            : undefined,
        positionLink:
          activedTabKey === 'cashForecast' ? positionLink : undefined,
        indexType:
          activeTab === 'cashForecast'
            ? 'POSITION'
            : activeTab === 'cashReconciliation'
            ? 'FINANCE'
            : undefined,
        positionType:
          activeTab === 'dealIndex'
            ? 'TRADE'
            : ['cashForecast', 'cashReconciliation'].includes(activeTab)
            ? 'GZ'
            : undefined,
        tradeType: activeTab === 'dealIndex' ? forecastType : undefined,
      },
    });
  };

  const handleIndexSshoot = async () => {
    if (!paramsForList) return;
    const { headObjectCode, objectCode, parentObjectCode } = paramsForList;
    const param = {
      fundCode: headObjectCode === 'fund_code' ? objectCode : parentObjectCode,
      astUnitId: headObjectCode === 'ast_unit_code' ? objectCode : undefined,
      businDate: moment(date).format('yyyyMMDD'),
      positionLink,
      positionType: activeTab === 'dealIndex' ? 'TRADE' : 'GZ',
      tradeType: activeTab === 'dealIndex' ? forecastType : undefined,
    };
    const res = await doSnapshot(param);
    if (res?.code == 1) {
      message.success('快照成功');
    }
  };

  const headerRender = (activedTabKey) => {
    return (
      <>
        <Row
          style={{ width: '100%' }}
          justify="space-between"
          align="middle"
          gutter={8}
          className="m-t-8 m-b-8"
        >
          <Col>
            <span className={styles.comm_label}>
              {activedTabKey == 'cashForecast'
                ? '头寸预测表'
                : activedTabKey == 'cashReconciliation'
                ? '昨日日终头寸'
                : activedTabKey == 'dealIndex'
                ? '交易可用头寸'
                : activedTabKey == 'positionDetails'
                ? '持仓明细表'
                : activedTabKey == 'DealDetail'
                ? '交易明细'
                : activedTabKey == 'fundCalendar'
                ? '资金日历'
                : '头寸监控'}
            </span>
            <span className={styles.comm_update_date}>
              更新时间: {updateDate}
            </span>
          </Col>
          <Col>
            {(activedTabKey == 'cashForecast' ||
              activedTabKey == 'DealDetail') && (
              <Select
                value={positionLink}
                onChange={(value) => {
                  setPositionLink(value);
                }}
                className={styles.position_select}
              >
                {POSITION_LINK.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            )}
            {activedTabKey == 'dealIndex' && (
              <Select
                value={forecastType}
                onChange={(value) => {
                  setForecastType(value);
                }}
                className={styles.position_select}
              >
                {FOREAST_INDEX.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            )}
            {/* {activedTabKey == 'cashMonitoring' && (
              <Button
                size="middle"
                className={styles.comm_btn}
                icon={<AccountBookOutlined />}
              >
                指标试算
              </Button>
            )} */}
            {(activedTabKey == 'cashForecast' ||
              activedTabKey == 'dealIndex') && (
              <>
                <Button
                  size="middle"
                  className={styles.comm_btn}
                  onClick={() => {
                    handleIndexSshoot();
                  }}
                  icon={<CameraOutlined />}
                >
                  快照
                </Button>
                <Button
                  size="middle"
                  className={styles.comm_btn}
                  onClick={() => {
                    paramsForList && setIndexSshootVisible(true);
                  }}
                  icon={<CalendarOutlined />}
                >
                  快照记录
                </Button>
              </>
            )}
            {['cashForecast', 'cashReconciliation', 'dealIndex'].includes(
              activedTabKey,
            ) &&
              moment().format('yyyyMMDD') ===
                moment(date).format('yyyyMMDD') && (
                <Button
                  size="middle"
                  className={styles.comm_btn}
                  disabled={indexLoading}
                  icon={
                    <SyncOutlined
                      title="更新"
                      spin={indexLoading}
                      onClick={updateTree}
                    />
                  }
                  onClick={() => refreshIndex()}
                >
                  刷新头寸
                </Button>
              )}
            {activedTabKey !== 'DealDetail' && (
              <Button
                size="middle"
                className={styles.comm_btn}
                icon={<ExportOutlined />}
                onClick={() => handleExport(activedTabKey)}
              >
                导出
              </Button>
            )}
          </Col>
        </Row>
      </>
    );
  };

  //根据路由决定默认tab项
  useEffect(() => {
    const pathname = location.pathname;
    let nowActiveTab = '';
    switch (pathname) {
      case '/APP/realTimePosition/cashPosition': {
        nowActiveTab = 'cashForecast';
        break;
      }
      case '/APP/realTimePosition/positionDetails': {
        nowActiveTab = 'positionDetails';
        break;
      }
      case '/APP/realTimePosition/cashMonitoring': {
        nowActiveTab = 'cashMonitoring';
        break;
      }
      case '/APP/realTimePosition/dealDetail': {
        nowActiveTab = 'DealDetail';
        break;
      }
      case '/APP/realTimePosition/fundCalendar': {
        nowActiveTab = 'fundCalendar';
        break;
      }
      case '/APP/realTimePosition/customFundDetails': {
        nowActiveTab = 'customFundDetails';
        break;
      }
    }
    setActiveTab(nowActiveTab);
  }, [location]);
  return (
    <div
      className={styles.configs_right_content}
      style={{ '--height': `${height}px` }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={onTabChange}
        destroyInactiveTabPane={true}
        tabBarExtraContent={
          <DatePicker
            style={{ width: 180 }}
            value={date}
            onChange={(e) => {
              setDate(e);
            }}
            allowClear={false}
          />
        }
      >
        {authMap?.['/APP/realTimePosition/cashPosition'] && (
          <TabPane
            tab={
              <span className={styles.tab_title}>
                <img src={cashForecastIcon} />
                现金流预测
              </span>
            }
            key="cashForecast"
          >
            <CashForecast
              ref={ChildRef}
              updateTree={updateTree}
              headerRender={headerRender}
              paramsForList={paramsForList}
              date={date}
              setUpdateDate={setUpdateDate}
              positionLink={positionLink}
              setIndexSshootVisible={setIndexSshootVisible}
              indexSshootVisible={indexSshootVisible}
            />
          </TabPane>
        )}

        <TabPane
          tab={
            <span className={styles.tab_title}>
              <img src={cashForecastIcon} />
              昨日日终头寸
            </span>
          }
          key="cashReconciliation"
        >
          <CashReconciliation
            ref={ChildTwoRef}
            updateTree={updateTree}
            headerRender={headerRender}
            paramsForList={paramsForList}
            date={date}
            setUpdateDate={setUpdateDate}
            activeTab={activeTab}
          />
        </TabPane>
        <TabPane
          tab={
            <span className={styles.tab_title}>
              <img src={cashForecastIcon} />
              交易可用头寸
            </span>
          }
          key="dealIndex"
        >
          <DealIndex
            ref={ChildThreeRef}
            headerRender={headerRender}
            paramsForList={paramsForList}
            date={date}
            type={forecastType}
            FOREAST_INDEX={FOREAST_INDEX}
            setUpdateDate={setUpdateDate}
          />
        </TabPane>
        {authMap?.['/APP/realTimePosition/positionDetails'] && (
          <TabPane
            tab={
              <span className={styles.tab_title}>
                <img src={positionDetailsIcon} />
                持仓明细
              </span>
            }
            key="positionDetails"
          >
            <PositionDetails
              headerRender={headerRender}
              paramsForList={paramsForList}
              date={date}
            />
          </TabPane>
        )}
        {authMap?.['/APP/realTimePosition/cashMonitoring'] && (
          <TabPane
            tab={
              <span className={styles.tab_title}>
                <img src={cashMonitoringIcon} />
                头寸监控
              </span>
            }
            key="cashMonitoring"
          >
            <CashMonitoring
              headerRender={headerRender}
              paramsForList={paramsForList}
              date={date}
              setUpdateDate={setUpdateDate}
            />
          </TabPane>
        )}
        {authMap?.['/APP/realTimePosition/dealDetail'] && (
          <TabPane
            tab={
              <span className={styles.tab_title}>
                <img src={cashDealDetailIcon} />
                交易/资金明细
              </span>
            }
            key="DealDetail"
          >
            <DealDetail
              headerRender={headerRender}
              paramsForList={paramsForList}
              date={date}
              positionLink={positionLink}
              setUpdateDate={setUpdateDate}
            />
          </TabPane>
        )}
        {authMap?.['/APP/realTimePosition/fundCalendar'] && (
          <TabPane
            tab={
              <span className={styles.tab_title}>
                <img src={cashFundCalendayIcon} />
                资金日历
              </span>
            }
            key="fundCalendar"
          >
            <FundCalendar
              headerRender={headerRender}
              paramsForList={paramsForList}
              date={date}
              setDate={setDate}
              setUpdateDate={setUpdateDate}
            />
          </TabPane>
        )}
        {authMap?.['/APP/realTimePosition/customFundDetails'] && (
          <TabPane
            tab={
              <span className={styles.tab_title}>
                <img src={customFundDetailsIcon} />
                手工资金管理明细
              </span>
            }
            key="customFundDetails"
          >
            <CustomFundDetails paramsForList={paramsForList} date={date} />
          </TabPane>
        )}
      </Tabs>
      <IndexSshootModal
        visible={indexSshootVisible}
        onCancel={closeIndexSshootModal}
        paramsForList={paramsForList}
        positionLink={positionLink}
        activeTab={activeTab}
        forecastType={forecastType}
      />
    </div>
  );
};
