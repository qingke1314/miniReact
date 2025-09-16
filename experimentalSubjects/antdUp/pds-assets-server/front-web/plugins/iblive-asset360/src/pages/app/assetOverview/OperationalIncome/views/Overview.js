/**
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-11-13 10:19:49
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-26 15:50:05
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\OperationalIncome\views\Header.js
 * @Description: 操作收益概览头部组件
 */
import { moneyFormat } from 'iblive-base';
import { Col, Row, Spin } from 'antd';
import styles from '../index.less';

const ZqItem = ({ title, value, className }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '8px 0',
    }}
    className={className}
  >
    <b style={{ color: 'var(--text-color)', fontWeight: 'bold', fontSize: '1.3em' }}>
      {value}
    </b>
    <span>{title}</span>
  </div>
);

const Overview = ({ loading, info }) => {
  // 计算操作次数总和
  const totalOperationNum = info?.records?.reduce((sum, record) => {
    return sum + (record?.opeartionNum || 0);
  }, 0) || 0;

  // 计算正收益次数总和
  const totalPositiveNum = info?.records?.reduce((sum, record) => {
    return sum + (record?.positiveNum || 0);
  }, 0) || 0;

  // 计算操作盈亏总和
  const totalOperationErngins = info?.records?.reduce((sum, record) => {
    return sum + (record?.operationErngins || 0);
  }, 0) || 0;

  // 计算单笔最大盈亏（从maxErngings中取最大值）
  const maxSingleProfitLoss = info?.records?.reduce((max, record) => {
    const current = record?.maxErngings || 0;
    return current > max ? current : max;
  }, 0) || 0;

  return (
    <div className="blank-card-asset" style={{ marginBottom: 9 }}>
      <Spin spinning={loading}>
        <Row justify="space-around">
          <Col>
            <ZqItem
              title="操作盈亏"
              value={moneyFormat({
                num: totalOperationErngins,
                decimal: 2,
              })}
              className={
                totalOperationErngins > 0
                  ? styles.totalProfitAmout
                  : styles.totalDeficitAmout
              }
            />
          </Col>
          <Col>
            <ZqItem
              title="操作次数"
              value={moneyFormat({
                num: totalOperationNum,
                decimal: 0,
              })}
            />
          </Col>
          <Col>
            <ZqItem
              title="正收益次数"
              value={moneyFormat({
                num: totalPositiveNum,
                decimal: 0,
              })}
            />
          </Col>
          <Col>
            <ZqItem
              title="单笔最大盈亏"
              value={moneyFormat({
                num: maxSingleProfitLoss, // 使用计算得到的单笔最大盈亏值
                decimal: 2,
                needColor: true, // 保留颜色标记
              })}
            />
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default Overview;
