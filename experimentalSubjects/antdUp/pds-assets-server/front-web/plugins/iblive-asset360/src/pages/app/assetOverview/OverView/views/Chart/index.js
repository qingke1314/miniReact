import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { executeApi } from '@asset360/apis/appCommon';
import CustomCard from '@asset360/components/CustomCard';
import { useEffect, useMemo, useState } from 'react';
import { CARD_LIST } from './const';
import styles from './index.less';
import Pie from './Pie';
import StockBar from './StockBar';
import DetailIcon from '@asset360/components/DetailIcon';

const Chart = () => {
  const [allInfo, setAllInfo] = useState({});
  const [stockData, setStockData] = useState([]);
  useEffect(() => {
    executeApi({
      serviceId: 'DD_API_COMPANY_ASEET_ANALYSIS',
      data: {},
    }).then((res) => {
      setAllInfo(res?.data || {});
    });
    executeApi({
      serviceId: 'DD_API_COMPANY_ASEET_STAT',
      data: {},
    }).then((res) => {
      setStockData(res?.records || []);
    });
  }, []);
  const showMapList = useMemo(() => {
    return CARD_LIST.map((e) => {
      const compareValue = e.compareValueMap(allInfo);
      return {
        ...e,
        value: e.valueMap(allInfo),
        compareValue: compareValue.startsWith('-')
          ? compareValue.slice(1)
          : compareValue,
        up: e.up(allInfo),
      };
    });
  }, [allInfo]);
  return (
    <div className={styles.chart}>
      {/* <div className={styles.secondContent}>
        {showMapList.map((item) => (
          <CustomCard key={item.label} className={styles.oneFive}>
            <div className={styles.cardTitle}>{item.label}</div>
            <div className={styles.cardValue}>{item.value}</div>
            <div
              style={{
                color: item.up ? 'var(--red-color)' : 'var(--green-color)',
              }}
              className={styles.cardCompareValue}
            >
              {item.up ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              {item.compareValue}
              <span className={styles.detail}>较上月</span>
            </div>
          </CustomCard>
        ))}
      </div> */}
      <div className={styles.secondContent}>
        <CustomCard key={showMapList[0].label} className={styles.totalBlock}>
          <div className={styles.cardTitle}>
            {showMapList[0].label}
            <DetailIcon type="total" />
          </div>
          <div className={styles.cardValue}>{showMapList[0].value}</div>
          <div
            style={{
              color: showMapList[0].up
                ? 'var(--red-color)'
                : 'var(--green-color)',
            }}
            className={styles.cardCompareValue}
          >
            {showMapList[0].up ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {showMapList[0].compareValue}
            <span className={styles.detail}>较上月</span>
          </div>
          <div style={{ marginTop: 24 }}>
            {showMapList
              .slice(1)
              .map((item) =>
                item.label === '投资经理(人)' && !item.value ? null : (
                  <div style={{ marginTop: 8, fontSize: 13 }} key={item.label}>
                    <span style={{ marginRight: '8px' }}>
                      {item.label}：{item.value}
                    </span>
                    {/* <span
                      style={{
                        color: item.up
                          ? 'var(--red-color)'
                          : 'var(--blue-color)',
                      }}
                    >
                      {item.up ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                      {item.compareValue}
                    </span> */}
                  </div>
                ),
              )
              .filter(Boolean)}
          </div>
        </CustomCard>
        <CustomCard style={{ flex: 1, height: 300 }}>
          <StockBar stockData={stockData} />
        </CustomCard>
        <CustomCard className={styles.oneFour}>
          <Pie pieData={allInfo.fundInvestTypeStat || []} />
        </CustomCard>
        {/* <CustomCard className={styles.oneFour}>
          <Person
            allPerson={allInfo?.managerNum || 0}
            data={allInfo.managerStat}
          />
        </CustomCard> */}
      </div>
    </div>
  );
};

export default Chart;
