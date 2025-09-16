import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { executeApi } from '@asset360/apis/appCommon';
import { Button, Calendar, Col, Radio, Row, Select } from 'antd-v5';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { calendarType, formatNumberWithUnit, selectType } from '../../const';
import styles from './index.module.less';

const { DECADE, MONTH, YEAR } = calendarType;
const YearlyView = ({ value, onYearSelect, activeDateRange, calendarData }) => {
  const currentYear = moment().year();
  const startYear = activeDateRange?.[0]?.year();
  const endYear = activeDateRange?.[1]?.year();
  // const [decadeStart, setDecadeStart] = useState(
  //   Math.floor(value.year() / 10) * 10,
  // );
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i,
  );

  // const handlePrevDecade = () => setDecadeStart(decadeStart - 10);
  // const handleNextDecade = () => setDecadeStart(decadeStart + 10);

  return (
    <div className={styles.yearlyView}>
      {/* <div className={styles.yearlyHeader}>
        <Button
          icon={<LeftOutlined />}
          type="text"
          onClick={handlePrevDecade}
        />
        <span className={styles.yearlyTitle}>{`${decadeStart} - ${
          decadeStart + 9
        }`}</span>
        <Button
          icon={<RightOutlined />}
          type="text"
          onClick={handleNextDecade}
        />
      </div> */}
      <div
        style={{
          position: 'absolute',
          right: 12,
          top: -34,
        }}
      >
        <Select
          value={value.year()}
          onChange={(year) => onYearSelect(year)}
          options={years.map((year) => ({
            label: year,
            value: year,
          }))}
        ></Select>
      </div>
      <Row gutter={[4]}>
        {years.map((year) => (
          <Col span={8} key={year}>
            <div
              style={{
                borderTop:
                  year === currentYear ? '2px solid var(--primary-color)' : '',
              }}
              className={`${styles.yearCellWrapper} ${
                year === value.year() ? styles.active : ''
              }`}
            >
              <div
                className={styles.yearCell}
                onClick={() => onYearSelect(year)}
                style={{
                  background: calendarData[year]?.income
                    ? calendarData[year]?.income > 0
                      ? '#fcecec'
                      : '#d4f4ec'
                    : 'var(--background-color-base)',
                }}
                role="button"
                tabIndex={0}
              >
                <div style={{ color: '#333' }}>{year}年</div>
                <div>{formatNumberWithUnit(calendarData[year]?.income)}</div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

const App = ({
  productCode,
  activeDateRange,
  activeSelect,
  moreValues,
  calendarValue,
  setCalendarValue,
}) => {
  const [viewMode, setViewMode] = useState(MONTH);
  const [calendarData, setCalendarData] = useState({});
  useEffect(() => {
    switch (viewMode) {
      case MONTH:
        selectType.set('day');
        break;
      case YEAR:
        selectType.set('month');
        break;
      case DECADE:
        selectType.set('year');
        break;
    }
  }, [viewMode]);
  useEffect(() => {
    if (!productCode || !activeDateRange?.length) return;
    executeApi({
      serviceId: 'DD_API_FUND_STOCK_INCOME_CALENDAR',
      data: {
        fundCode: productCode,
        startDate: activeDateRange?.[0]?.format('YYYYMMDD'),
        endDate: activeDateRange?.[1]?.format('YYYYMMDD'),
        astUnitId: activeSelect?.astUnitId
          ? Number(activeSelect?.astUnitId)
          : null,
        combiCode: activeSelect?.combiCode || null,
        calendarType:
          viewMode === MONTH ? 'DATE' : viewMode === YEAR ? 'MONTH' : 'YEAR',
        ...moreValues,
      },
    }).then((res) => {
      setCalendarData(
        res?.records.reduce((acc, item) => {
          acc[item.businDate] = item;
          return acc;
        }, {}) || {},
      );
    });
  }, [
    activeDateRange,
    productCode,
    activeSelect?.astUnitId,
    activeSelect?.combiCode,
    moreValues,
    viewMode,
  ]);
  const onSelect = (newValue) => {
    setCalendarValue(newValue);
  };
  const onPanelChange = (newValue, mode) => {
    // When the panel is changed by antd-v5, we update our state
    setCalendarValue(newValue);
    setViewMode(mode);
  };

  const handleYearSelect = (year) => {
    const newValue = calendarValue.clone().year(year);
    setCalendarValue(newValue);
    // setViewMode('year'); // Switch back to 'year' (monthly) view
  };

  const dateCellRender = (value) => {
    const date = value.format('YYYYMMDD');
    const num = calendarData[date]?.income;
    const colorClass = num
      ? num > 0
        ? '#fcecec'
        : '#d4f4ec'
      : 'var(--background-color-base)';
    return (
      <div className={styles.events} style={{ background: colorClass }}>
        <div className={styles.cellHeader}>{value.date()}号</div>
        <div>{formatNumberWithUnit(num)}</div>
      </div>
    );
  };
  const monthCellRender = (value) => {
    const date = value.format('YYYYMM');
    const num = calendarData[date]?.income;
    const colorClass = num
      ? num > 0
        ? '#fcecec'
        : '#d4f4ec'
      : 'var(--background-color-base)';
    return (
      <div className={styles.events} style={{ background: colorClass }}>
        <div className={styles.cellHeader}>{value.month() + 1}月</div>
        <div>{formatNumberWithUnit(num)}</div>
      </div>
    );
  };
  const headerRender = ({ value, onChange, onTypeChange }) => {
    const startYear = activeDateRange?.[0]?.year();
    const endYear = activeDateRange?.[1]?.year();
    const startMonth = activeDateRange?.[0]?.month();
    const endMonth = activeDateRange?.[1]?.month();
    const year = value.year();
    const month = value.month();
    const options = [];
    for (let i = startYear; i <= endYear; i += 1) {
      options.push(
        <Select.Option key={i} value={i} className="year-item">
          {i}
        </Select.Option>,
      );
    }
    const handleModeChange = (e) => {
      const newMode = e.target.value;
      setViewMode(newMode);
      if (newMode !== 'decade') {
        onTypeChange(newMode);
      }
    };
    return (
      <div
        style={{
          padding: 8,
        }}
      >
        <Row gutter={8} justify="space-between">
          <Col>
            <Radio.Group
              size="small"
              onChange={handleModeChange}
              value={viewMode}
            >
              <Radio.Button value={MONTH}>日</Radio.Button>
              <Radio.Button value={YEAR}>月</Radio.Button>
              <Radio.Button value={DECADE}>年</Radio.Button>
            </Radio.Group>
          </Col>

          {viewMode !== DECADE && (
            <Col>
              <Row gutter={8}>
                <Col>
                  <Select
                    size="small"
                    dropdownMatchSelectWidth={false}
                    className="my-year-select"
                    value={year}
                    onChange={(newYear) => {
                      const now = value.clone().year(newYear);
                      onChange(now);
                    }}
                  >
                    {options}
                  </Select>
                </Col>
                <Col>
                  <div>
                    <Button
                      icon={<LeftOutlined />}
                      type="text"
                      onClick={() => {
                        if (month > startMonth) {
                          onChange(value.clone().month(month - 1));
                        }
                      }}
                    />
                    <span>{month + 1}月</span>
                    <Button
                      icon={<RightOutlined />}
                      type="text"
                      onClick={() => {
                        if (month < endMonth) {
                          onChange(value.clone().month(month + 1));
                        }
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
          )}
        </Row>
      </div>
    );
  };
  return (
    <div
      className={`${styles.calendar} ${
        viewMode === MONTH ? styles.dayCalendar : ''
      } ${viewMode === DECADE ? styles.decadeViewActive : ''}`}
    >
      <div className="important-title">日历图</div>
      <Calendar
        value={calendarValue}
        onSelect={onSelect}
        // Let antd-v5 calendar think it's in 'year' mode when we show our decade view
        mode={viewMode === DECADE ? 'year' : viewMode}
        onPanelChange={onPanelChange}
        dateCellRender={dateCellRender}
        monthCellRender={monthCellRender}
        headerRender={headerRender}
        // disabledDate={(current, other) => {
        //   if (mode === 'month') {
        //     return current && current.month() !== moment().month();
        //   }
        //   return false;
        // }}
        validRange={activeDateRange?.length ? activeDateRange : undefined}
      />
      {viewMode === 'decade' && (
        <YearlyView
          calendarData={calendarData}
          value={calendarValue}
          onYearSelect={handleYearSelect}
          activeDateRange={activeDateRange}
        />
      )}
    </div>
  );
};
export default App;
