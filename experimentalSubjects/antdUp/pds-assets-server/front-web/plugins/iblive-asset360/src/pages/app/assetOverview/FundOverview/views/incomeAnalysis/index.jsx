import CustomCard from '@asset360/components/CustomCard';
import {
  getMomentDateRanges,
  options,
} from '@asset360/pages/app/assetOverview/IncomeAnalysis/const';
import EarningsChart from '@asset360/pages/app/assetOverview/IncomeAnalysis/views/EarningsChart';
import { Col, Form, Row } from 'antd-v5';
import { CustomForm } from 'iblive-base';
import moment from 'moment';
import { useMemo, useState } from 'react';
import StatsCard from '../../../IncomeAnalysis/views/StatsCard';
import Winfo from './Winfo';
import DetailIcon from '@asset360/components/DetailIcon';

const IncomeAnalysis = ({ productCode }) => {
  const [headForm] = Form.useForm(); // 头部表单
  const rangeType = Form.useWatch('rangeType', headForm);
  const validateDate = Form.useWatch('validateDate', headForm);
  const [stats, setStats] = useState([]);

  /**
   * 根据日期范围类型和约束日期获取当前选中的日期范围
   */
  const activeDateRange = useMemo(() => {
    if (rangeType === 'FIXED_DATE') {
      return validateDate;
    } else {
      return getMomentDateRanges()[rangeType];
    }
  }, [rangeType, validateDate]);
  return (
    <CustomCard>
      <div style={{ display: 'flex', gap: 12 }}>
        <div className="important-title">
          业绩比较基准
          <DetailIcon type="overviewBaseline" />
        </div>
        <CustomForm
          initialValues={{
            rangeType: 'ONE_MONTH',
            validateDate: getMomentDateRanges()['ONE_MONTH'],
          }}
          rowGutter={12}
          style={{ marginTop: '8px' }}
          form={headForm}
          config={[
            {
              name: 'rangeType',
              type: 'radio',
              props: {
                options,
                optionType: 'button',
                buttonStyle: 'solid',
                onChange: (e) => {
                  const dateList = getMomentDateRanges()[e.target.value];
                  headForm.setFieldValue('validateDate', dateList);
                },
              },
            },
            {
              visible: rangeType === 'FIXED_DATE',
              type: 'dateRange',
              name: 'validateDate',
              label: '约束日期',
              props: {
                allowClear: false,
                style: { width: '100%' },
                onChange: (value) => {
                  const ranges = getMomentDateRanges();
                  let selected = false;
                  Object.keys(ranges).forEach((key) => {
                    if (value === ranges[key]) {
                      selected = true;
                      headForm.setFieldValue('rangeType', key);
                    }
                  });
                  if (!selected) {
                    headForm.setFieldValue('rangeType', 'FIXED_DATE');
                  }
                },
              },
            },
          ]}
        />
      </div>
      <Row>
        <Col span={14}>
          <EarningsChart
            setStats={setStats}
            activeDateRange={activeDateRange}
            productCode={productCode}
          />
        </Col>
        <Col span={5}>
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
        <Col span={5}>
          <Winfo productCode={productCode} />
        </Col>
      </Row>
    </CustomCard>
  );
};

export default IncomeAnalysis;
