import { executeApi } from '@asset360/apis/appCommon';
import CustomTitle from '@asset360/components/CustomTitle';
import DateRangeWithQuickSelect from '@asset360/components/DateRangeWithQuickSelect';
import { Col, Row, Space, Spin } from 'antd';
import { moneyFormat } from 'iblive-base';
import { isArray, isString } from 'lodash';
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from '../index.less';
import CompareChart from './CompareChart';
import ControlGroupSelector from './ControlGroupSelector';
import SingleTrendChart from './SingleTrendChart';

const QUICK_RANGE_LIST = [
  {
    value: '7_day',
    label: '7天',
  },
  {
    value: '3_month',
    label: '近3月',
  },
  {
    value: '6_month',
    label: '近6月',
  },
  {
    value: '1_year',
    label: '近1年',
  },
  {
    value: '3_year',
    label: '近3年',
  },
  {
    value: '5_year',
    label: '近5年',
  },
  {
    value: `${moment().diff(moment().startOf('year'), 'days')}_day`,
    label: '今年',
  },
];

const QUICK_RANGE_EXTRA_LIST = [
  {
    value: 'ALL',
    label: '创建以来',
  },
];

const LAST_DATA_OBJ = {
  indexMarketValue: {
    title: '总市值',
    decimal: 2,
  },
  holdQty: {
    title: '持仓量',
    decimal: 0,
  },
  indexPeRatio1: {
    title: '市盈率',
    decimal: 2,
  },
  indexDivYield1: {
    title: '股息率',
    decimal: 2,
  },
  duration: {
    title: '久期',
    decimal: 2,
  },
  modifyDuration: {
    title: '修正久期',
    decimal: 2,
  },
  convexity: {
    title: '凸性',
    decimal: 2,
  },
  ytm: {
    title: '到期收益率',
    decimal: 2,
  },
  avgytmIndex: {
    title: '平均收益率',
    decimal: 2,
  },
  avgModifyDuration: {
    title: '平均修正久期',
    decimal: 2,
  },
  avgConvexity: {
    title: '平均凸性',
    decimal: 2,
  },
  avgbasisPointvalue: {
    title: '平均基点价值',
    decimal: 2,
  },
};

export default ({ selectedMarket, marketList }) => {
  const [updateTime, setUpdateTime] = useState('xxxx-xx-xx xx:xx');
  const [loading, setLoading] = useState();
  const [dateRange, setDateRange] = useState();
  const [lastInfo, setLastInfo] = useState();
  const [chartDataList, setChartDataList] = useState();
  const [chartDateList, setChartDateList] = useState();
  const [controlGroup, setControlGroup] = useState();
  const chartWrapperRef = useRef();
  const marketNameObj = useMemo(
    () =>
      (marketList || []).reduce((obj, item) => {
        obj[item.interCode] = item.indexName;
        return obj;
      }, {}),
    [marketList],
  );

  const getChartWrapper = () => chartWrapperRef.current;

  const getIndexCodeInfo = (interCode) =>
    executeApi({
      serviceId: 'APEX_ASSET_INDEX_QUO_DATA',
      data: {
        interCode,
        startDate: isArray(dateRange)
          ? dateRange[0].format('YYYYMMDD')
          : undefined,
        endDate: isArray(dateRange)
          ? dateRange[1].format('YYYYMMDD')
          : undefined,
        dateType: isString(dateRange) ? dateRange : undefined,
      },
    });

  const getInfos = () => {
    setLoading(true);
    Promise.allSettled(
      [selectedMarket, ...(controlGroup || [])].map((interCode) =>
        getIndexCodeInfo(interCode),
      ),
    ).then((results) => {
      setLoading(false);
      const array = [];
      results.forEach((res) => {
        array.push(res?.value?.data?.eventData || []);
      });
      setChartDataList(array);
      setChartDateList(array[0].map((item) => item.businDate));
      setUpdateTime(moment().format('YYYY-MM-DD HH:mm'));
      setLastInfo(results[0]?.value?.data?.lastData || {});
    });
  };

  const toggleControlGroup = (key) => {
    if ((controlGroup || []).includes(key)) {
      removeControlGroup(key);
    } else {
      addControlGroup(key);
    }
  };
  const addControlGroup = (key) =>
    setControlGroup((pre) => [...new Set([...(pre || []), key])]);
  const removeControlGroup = (key) =>
    setControlGroup((pre) => (pre || []).filter((item) => item !== key));
  const resetControlGroup = () => setControlGroup();

  useEffect(() => {
    if (!dateRange) return;
    getInfos();
  }, [dateRange, controlGroup, selectedMarket]);

  return (
    <>
      <div className="blank-card-asset">
        <Row justify="space-between" align="middle" className="m-b-8">
          <Col>
            <DateRangeWithQuickSelect
              quickOptions={QUICK_RANGE_LIST}
              extraRadioOptions={QUICK_RANGE_EXTRA_LIST}
              onDateRangeChange={setDateRange}
            />
          </Col>
          <Col>
            <Space>
              <span>更新日期：{updateTime}</span>
              <ControlGroupSelector
                selectedMarket={selectedMarket}
                controlGroup={controlGroup}
                marketList={marketList}
                toggleControlGroup={toggleControlGroup}
                getChartWrapper={getChartWrapper}
              />
            </Space>
          </Col>
        </Row>
        <Spin spinning={loading}>
          <div ref={chartWrapperRef}>
            <Row wrap={false} className={styles.trend_info_content}>
              <Col flex={1}>
                {controlGroup?.length ? (
                  <CompareChart
                    xData={chartDateList}
                    data={chartDataList}
                    marketNameObj={marketNameObj}
                    controlGroup={controlGroup}
                    selectedMarket={selectedMarket}
                    removeControlGroup={removeControlGroup}
                    resetControlGroup={resetControlGroup}
                  />
                ) : (
                  <SingleTrendChart
                    indexName={marketNameObj?.[selectedMarket]}
                    xData={chartDateList}
                    data={chartDataList}
                  />
                )}
              </Col>
              <Col span={6} className={styles.trend_info_last_info_col}>
                <CustomTitle title="最新指标" className="m-b-8" />
                {Object.keys(lastInfo || {})
                  .filter(
                    (key) =>
                      lastInfo[key] !== null && lastInfo[key] !== undefined,
                  )
                  .map((key) => {
                    const info = LAST_DATA_OBJ[key];
                    return (
                      <Row
                        key={key}
                        align="middle"
                        justify="space-between"
                        gutter={16}
                      >
                        <Col>{info?.title ?? key}</Col>
                        <Col className="important-text">
                          {moneyFormat({
                            num: lastInfo[key],
                            decimal: info?.decimal ?? 2,
                          })}
                        </Col>
                      </Row>
                    );
                  })}
              </Col>
            </Row>
          </div>
        </Spin>
      </div>
    </>
  );
};
