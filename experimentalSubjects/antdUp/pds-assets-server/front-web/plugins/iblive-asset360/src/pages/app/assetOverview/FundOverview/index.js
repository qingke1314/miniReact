/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-11-07 08:54:40
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-08 14:05:47
 * @Description:
 */
/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-10-08 16:54:23
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-10-30 14:42:23
 * @Description:
 */
import CustomAnchor from '@asset360/components/CustomAnchor';
import { Col, Row } from 'antd-v5';
import { useGetHeight } from 'iblive-base';
import { useId, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import styles from './index.less';
import AssetChart from './views/AssetChart';
import BalanceSheet from './views/BalanceSheet';
import BondPositionTable from './views/BondPositionTable';
// import BondTable from './views/BondTable';
import Header from './views/Header';
import IncomeAnalysis from './views/incomeAnalysis';
import StockPositionTable from './views/StockPositionTable';
import StockTable from './views/StockTable';
import SecAnalysis from './views/SecAnalysis';

const initAnchorList = [
  {
    id: 'incomeAnalysis',
    title: '业绩比较基准',
  },
  {
    id: 'asset',
    title: '大类资产占净比',
  },
  {
    id: 'stock',
    title: '股票行业配置',
  },
  // {
  //   id: 'bond',
  //   title: '债券品种配置',
  // },
  {
    id: 'secAnalysis',
    title: '债券资产分布',
  },
  {
    id: 'balance',
    title: '资产负债表',
  },
];
const FundOverview = () => {
  const id = useId();
  const wrapperRef = useRef();
  const height = useGetHeight(
    wrapperRef.current,
    100,
    14,
    document.getElementById('fund_overview_container'),
  );

  const { productCode, showTop10Stocks, showTop10Bonds } = useSelector(
    (state) => state.asset360AssetLayout,
  );

  const anchorList = useMemo(() => {
    const list = [...initAnchorList];
    if (showTop10Bonds) {
      list.splice(3, 0, { id: 'bond-position', title: '债券Top10' });
    }
    if (showTop10Stocks) {
      list.splice(2, 0, { id: 'stock-position', title: '股票TOP10' });
    }
    return list;
  }, [showTop10Bonds, showTop10Stocks]);

  return (
    <div style={{ height: '100%' }} id="fund_overview_container">
      <Header />
      <Row wrap={false} style={{ width: '100%', marginTop: 8 }}>
        <Col flex={1}>
          <div
            id={id}
            ref={wrapperRef}
            style={{ height, overflowY: 'auto', position: 'relative' }}
          >
            <div id="incomeAnalysis" className={styles.module_card}>
              <IncomeAnalysis productCode={productCode} />
            </div>
            <div id="asset" className={styles.module_card}>
              <AssetChart productCode={productCode} />
            </div>
            {showTop10Stocks ? (
              <div id="stock-position" className={styles.module_card}>
                <StockPositionTable productCode={productCode} />
              </div>
            ) : null}

            <div id="stock" className={styles.module_card}>
              <StockTable productCode={productCode} />
            </div>
            {showTop10Bonds ? (
              <div id="bond-position" className={styles.module_card}>
                <BondPositionTable productCode={productCode} />
              </div>
            ) : null}
            <div id="secAnalysis" className={styles.module_card}>
              <SecAnalysis productCode={productCode} />
            </div>
            {/* <div id="bond" className={styles.module_card}>
              <BondTable productCode={productCode} />
            </div> */}
            <div id="balance" className={styles.module_card}>
              <BalanceSheet productCode={productCode} />
            </div>
          </div>
        </Col>
        <Col style={{ width: 180 }}>
          <CustomAnchor
            items={anchorList}
            getContainer={() => wrapperRef.current}
          />
        </Col>
      </Row>
    </div>
  );
};

export default FundOverview;
