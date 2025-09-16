/**
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-10-25 17:16:37
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 * @LastEditTime: 2024-11-18 09:24:09
 * @Description:
 */
import { moneyFormat } from 'iblive-base';
import { Col, Divider, Row, Skeleton, Space } from 'antd-v5';
import StatisticalInformation from '../components/StatisticalInformation';
import styles from '../index.less';
import LineChart from './LineChart';

const CompanySummary = ({ companyData, loading }) => {
  const total = companyData.totalFundNumbs;

  // 从数组中获取不同类型的数据
  const getFundTypeData = (code) => {
    const item = companyData?.fundTypeNumbsStat?.find(
      (item) => item.code === code,
    );
    return item ? item.num : 0;
  };

  return (
    <Row
      align="middle"
      className="header-card-asset"
      wrap={false}
      style={{ marginTop: 44, marginLeft: -4 }}
    >
      <Skeleton loading={loading} title={false} paragraph={{ rows: 3 }}>
        <Col md={16} xl={12}>
          <Row justify="space-between" align="middle" wrap={false}>
            <Col>
              <StatisticalInformation
                title="资产管理规模"
                currentValue={companyData?.totalAmount / 100000000}
                monthRadio={companyData?.overLastMonthAmountRatio}
                quarterRadio={companyData?.overLastQuarterAmountRatio}
                yearRadio={companyData?.overLastYearAmountRatio}
              />
            </Col>
            <Col>
              <LineChart />
            </Col>
          </Row>
        </Col>
        <Col>
          <Divider
            dashed
            type="vertical"
            style={{ height: 72, borderColor: '#bdbbbb', marginRight: 16 }}
          />
        </Col>
        <Col>
          <StatisticalInformation
            title="非货规模"
            currentValue={companyData?.noloanAmount / 100000000}
            monthRadio={companyData?.overLastMonthToloanRatio}
            quarterRadio={companyData?.overLastQuarterNoloanRatio}
            yearRadio={companyData?.overLastYearNoloanRatio}
          />
        </Col>
        <Divider
          dashed
          type="vertical"
          style={{ height: 72, borderColor: '#bdbbbb', marginRight: 16 }}
        />
        <Col flex={1}>
          <div className={styles.statistical_information}>
            <span className="default-text">{'产品数量'}</span>
            <Space className="large-important-text">
              {moneyFormat({ num: total, decimal: 0 })}
              <span className="default-text">个</span>
            </Space>
            <Space size={16} className="small-text">
              <Space>
                权益
                {moneyFormat({
                  num: getFundTypeData('QY'),
                  decimal: 0,
                })}
              </Space>
              <Space>
                固收
                {moneyFormat({
                  num: getFundTypeData('GS'),
                  decimal: 0,
                })}
              </Space>
              <Space>
                货币
                {moneyFormat({
                  num: getFundTypeData('HB'),
                  decimal: 0,
                })}
              </Space>
              <Space>
                其他
                {moneyFormat({
                  num: getFundTypeData('QT'),
                  decimal: 0,
                })}
              </Space>
            </Space>
          </div>
        </Col>
      </Skeleton>
    </Row>
  );
};

export default CompanySummary;
