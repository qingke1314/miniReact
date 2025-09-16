/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-11-26 17:34:02
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-14 10:41:55
 * @Description:
 */
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Calendar, Col, Row, Select, Space } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import styles from './index.less';

function isWeekday(date) {
  const day = date.day();
  return day >= 1 && day <= 5; // 周一到周五为工作日
}

export default ({
  headerRightExtraContent,
  showWeekend = true,
  beforeYear = 10,
  nextYears = 10,
  className,
  ...config
}) => {
  return (
    <Calendar
      locale={{ ...zhCN }}
      className={`${
        showWeekend
          ? styles.custom_calendar
          : styles.custom_calendar_without_weekend
      } ${className ?? ''}`}
      headerRender={({ value, onChange }) => {
        const year = value.year();
        const month = value.month();
        const yearOptions = [];
        for (
          let i = moment().year() - beforeYear;
          i <= moment().year() + nextYears;
          i += 1
        ) {
          yearOptions.push({
            value: i,
            label: i,
          });
        }
        return (
          <Row justify="space-between" align="middle" className="m-b-8">
            <Col>
              <Space align="center" className="m-l-16 m-t-8">
                <Select
                  size="small"
                  options={yearOptions}
                  value={year}
                  onChange={(year) => {
                    onChange(value.clone().year(year));
                  }}
                />
                <div>
                  <Button
                    icon={<LeftOutlined />}
                    type="text"
                    onClick={() => onChange(value.clone().month(month - 1))}
                  />
                  <span>{month + 1}月</span>
                  <Button
                    icon={<RightOutlined />}
                    type="text"
                    onClick={() => onChange(value.clone().month(month + 1))}
                  />
                </div>
                {(showWeekend || isWeekday(moment())) && (
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => onChange(moment())}
                  >
                    回到今天
                  </Button>
                )}
              </Space>
            </Col>
            <Col>{headerRightExtraContent || null}</Col>
          </Row>
        );
      }}
      {...config}
    />
  );
};
