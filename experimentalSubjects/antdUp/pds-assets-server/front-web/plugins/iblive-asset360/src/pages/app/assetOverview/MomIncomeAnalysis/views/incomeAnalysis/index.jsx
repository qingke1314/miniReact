import EarningsChart from './EarningsChart';
import { Col, Row } from 'antd-v5';
import moment from 'moment';
import { memo, useState } from 'react';
import StatsCard from '../../../IncomeAnalysis/views/StatsCard';
import Winfo from './Winfo';

const IncomeAnalysis = ({ productCode, activeDateRange, activeSelect }) => {
  const [stats, setStats] = useState([]);

  return (
    <div>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ marginBottom: 4 }} className="important-title">
          账户规模
        </div>
      </div>
      <Row>
        <Col span={16}>
          <EarningsChart
            activeSelect={activeSelect}
            setStats={setStats}
            activeDateRange={activeDateRange}
            productCode={productCode}
          />
        </Col>
        <Col span={8}>
          <StatsCard
            title={'最大涨幅'}
            mainValue={(stats?.[0]?.maxGainInfo?.maxGain || 0) * 100}
            daysTitle={'增长天数'}
            days={stats?.[0]?.maxGainInfo?.maxGainDays || 0}
            dateRange={`${moment(stats?.[0]?.maxGainInfo?.startDate).format(
              'YYYY/MM/DD',
            )} - ${moment(stats?.[0]?.maxGainInfo?.endDate).format(
              'YYYY/MM/DD',
            )}`}
            type="profit"
          />
          <StatsCard
            title={'最大回撤'}
            mainValue={(stats?.[0]?.maxDrawdownInfo?.maxDrawdown || 0) * 100}
            daysTitle={'回撤天数'}
            days={stats?.[0]?.maxDrawdownInfo?.maxDrawdownDays || 0}
            dateRange={`${moment(stats?.[0]?.maxDrawdownInfo?.startDate).format(
              'YYYY/MM/DD',
            )} - ${moment(stats?.[0]?.maxDrawdownInfo?.endDate).format(
              'YYYY/MM/DD',
            )}`}
          />
        </Col>
      </Row>
      <div className="important-title">业绩指标</div>
      <Winfo productCode={productCode} />
    </div>
  );
};

export default memo(IncomeAnalysis);
