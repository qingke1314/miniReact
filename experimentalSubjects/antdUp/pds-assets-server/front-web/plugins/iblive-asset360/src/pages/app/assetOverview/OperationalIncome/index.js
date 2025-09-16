/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-06-26 15:41:26
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-26 11:00:09
 * @Description:
 */
import Icon from '@ant-design/icons';
import { ReactComponent as shishichicangIcon } from '@asset360/assets/app/assetOverview/shishichicangIcon.svg';
import { ReactComponent as zuhegailanIcon } from '@asset360/assets/app/assetOverview/zuhegailanIcon.svg';
import DateRangeWithQuickSelect from '@asset360/components/DateRangeWithQuickSelect';
import { Empty, Tabs } from 'antd';
import { CustomTabs } from 'iblive-base';
import moment from 'moment';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProductCode } from '../../../../store/assetLayoutSlice';
import styles from './index.less';
import StockContent from './views/StockContent';
import TopContent from './views/TopContent';

const { TabPane } = Tabs;
export default () => {
  const ref = useRef();
  const dispatch = useDispatch();
  const { productCode } = useSelector((state) => state.asset360AssetLayout);
  const [time, setTime] = useState([moment().subtract(3, 'months'), moment()]);
  const [activeKey, setActiveKey] = useState('1');

  const onTabChange = (tab) => {
    setActiveKey(tab);
  };

  const disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  return (
    <div className={styles.operational_income_main}>
      <TopContent
        productCode={productCode}
        setProductCode={(value) => {
          dispatch(setProductCode(value));
        }}
        time={time}
        setTime={setTime}
      />
      {productCode ? (
        <>
          <CustomTabs
            type="primary"
            activeKey={activeKey}
            onChange={onTabChange}
            tabBarExtraContent={
              <DateRangeWithQuickSelect
                onDateRangeChange={setTime}
                disabledDate={disabledDate}
              />
            }
          >
            <TabPane
              tab={
                <>
                  <Icon
                    component={zuhegailanIcon}
                    className={styles.tab_icon}
                  />
                  股票
                </>
              }
              key="1"
            />
            <TabPane
              tab={
                <>
                  <Icon
                    component={shishichicangIcon}
                    className={styles.tab_icon}
                  />
                  债券
                </>
              }
              key="2"
              disabled={true}
            />
          </CustomTabs>
          <StockContent productCode={productCode} time={time} parentRef={ref} />
        </>
      ) : (
        <Empty />
      )}
    </div>
  );
};
