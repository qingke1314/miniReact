/*
 * @Author: 童圣滔 tongshengtao@bosssoft.com.cn
 * @Date: 2025-07-18 09:06:16
 * @LastEditors: 童圣滔 tongshengtao@bosssoft.com.cn
 * @LastEditTime: 2025-07-31 11:56:08
 * @FilePath: \ibor-business-server\pds-assets-server\front-web\plugins\iblive-asset360\src\pages\app\assetOverview\IncomeAnalysis\views\StaticInfo.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Col, Row } from 'antd-v5';
import { memo } from 'react';
import { formatNumberWithUnit } from '../const';
import styles from './index.module.less';

const StaticInfo = ({ activeIndex, onChange, staticInfo }) => {
  return (
    <div className={styles.staticInfo}>
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
            <div>持仓市值</div>
            {formatNumberWithUnit(7865499416.97, {
              needColor: true,
            })}
          </Col>
          <Col style={{ textAlign: 'center' }} span={8}>
            <div>区间总收益</div>
            {formatNumberWithUnit(staticInfo?.income, {
              needColor: true,
            })}
          </Col>
          <Col style={{ textAlign: 'center' }} span={8}>
            <div>当日收益</div>
            {formatNumberWithUnit(staticInfo?.todayIncome, {
              needColor: true,
            })}
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

export default memo(StaticInfo);
