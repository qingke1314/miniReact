/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-10-17 14:09:34
 * @LastEditTime: 2024-11-06 09:48:08
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 */
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Badge, Button, Calendar, Col, Row, Select, Space, Tabs } from 'antd';
import { useGetHeight } from 'iblive-base';
import moment from 'moment';
import { useRef, useState } from 'react';
import styles from './index.less';
import DateDetail from './views/DateDetail';
import MarketInfos from './views/MarketInfos';

function isWeekday(date) {
  const day = date.day();
  return day >= 1 && day <= 5; // 周一到周五为工作日
}

const initData = [
  {
    type: 'success',
    content: (
      <>
        平安银行&nbsp;<span style={{ color: 'var(--red-color)' }}>分红</span>
      </>
    ),
  },
  {
    type: 'success',
    content: (
      <>
        贵州茅台&nbsp;<span style={{ color: 'var(--red-color)' }}>[分红]</span>
        &nbsp;
        <span style={{ color: 'var(--primary-color)' }}>[送股]</span>
      </>
    ),
  },
  {
    type: 'success',
    content: (
      <>
        中国石油&nbsp;<span style={{ color: 'var(--red-color)' }}>[分红]</span>
      </>
    ),
  },
];

const getListData = (value) => {
  let listData;
  switch (value.format('MM-DD')) {
    case moment().format('MM-DD'):
      listData = initData;
      break;
    case moment().add(1, 'day').format('MM-DD'):
      listData = initData.map((item) => ({ ...item, type: 'processing' }));
      break;
    default:
  }
  return listData || [];
};

export default () => {
  const contentRef = useRef();
  const height = useGetHeight(contentRef.current, 100, 0, contentRef.current);
  const [showDetail, setShowDetail] = useState({ visible: false });
  const [activedTab, setActivedTab] = useState('1');

  const closeDateTab = () => {
    setActivedTab('1');
    setShowDetail({ visible: false });
  };

  const changeDateTab = (info = {}) => {
    setActivedTab(info.date);
    setShowDetail({ visible: true, ...info });
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    const isCurrentMonth = value.month() === moment().month();
    return isCurrentMonth ? (
      <div className={styles.date_cell}>
        <div className={styles.date_content}>
          {(listData || []).slice(0, 4).map((item, index) => (
            <div key={index} className="small-text">
              <Badge status={item.type} text={item.content} />
            </div>
          ))}
        </div>
        {listData?.length ? (
          <>
            <Badge className={styles.message_count} count={listData?.length} />
            <Button
              className={styles.more_button}
              type="link"
              onClick={(e) => {
                e.stopPropagation();
                changeDateTab({
                  date: value.format('YYYY-MM-DD'),
                  isFuture: value.date() > moment().date(),
                });
              }}
            >
              ...详细
            </Button>
          </>
        ) : null}
      </div>
    ) : null;
  };

  return (
    <div ref={contentRef} style={{ height: '100%' }}>
      <Row gutter={8} wrap={false} style={{ width: '100%' }}>
        <Col span={16}>
          <div
            className="blank-card-asset"
            style={{ height, overflow: 'auto', padding: 0 }}
          >
            <Calendar
              className={styles.work_calendar}
              dateCellRender={dateCellRender}
              headerRender={({ value, onChange }) => {
                const year = value.year();
                const month = value.month();
                const yearOptions = [];
                for (let i = year - 10; i < year + 10; i += 1) {
                  yearOptions.push({
                    value: i,
                    label: i,
                  });
                }

                return (
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
                    {isWeekday(value) && (
                      <Button
                        type="dashed"
                        size="small"
                        onClick={() => onChange(moment())}
                      >
                        回到今天
                      </Button>
                    )}
                  </Space>
                );
              }}
            />
          </div>
        </Col>
        <Col span={8}>
          <>
            <Tabs
              type="editable-card"
              hideAdd
              activeKey={activedTab}
              onChange={setActivedTab}
              onEdit={closeDateTab}
              style={{ '--custom-tabs-height': `${height}px` }}
              className={styles.custom_tabs}
            >
              <Tabs.TabPane tab="市场权益事件" key="1" closable={false}>
                <MarketInfos height={height} />
              </Tabs.TabPane>
              {showDetail?.visible && (
                <Tabs.TabPane
                  tab={`【${showDetail?.date}】权益事件`}
                  key={showDetail?.date}
                >
                  <DateDetail {...showDetail} height={height} />
                </Tabs.TabPane>
              )}
            </Tabs>
          </>
        </Col>
      </Row>
    </div>
  );
};
