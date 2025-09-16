import { Tabs } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import DayPane from './DayPane';
import HourPane from './HourPane';
import MinutePane from './MinutePane';
import MonthPane from './MonthPane';
import SecondPane from './SecondPane';

const { TabPane } = Tabs;
export default ({ defaultValue, setPropsCron, activeTab }) => {
  const [defaultCron, setDefaultCron] = useState([
    '*',
    '*',
    '*',
    '*',
    '*',
    '?',
  ]);
  const [activeKey, setActiveKey] = useState('1');
  const currentCorn = useRef(['*', '*', '*', '*', '*', '?']);
  const dayDefaultCron = useMemo(() => [defaultCron[3], defaultCron[5]], [
    defaultCron,
  ]);

  const onCronChange = (ary) => {
    setPropsCron(ary.join(' '));
    currentCorn.current = ary;
  };
  const onChange = (type, value) => {
    const newCron = [...currentCorn.current];
    switch (type) {
      case 'second': {
        newCron[0] = value;
        break;
      }
      case 'minute': {
        newCron[1] = value;
        break;
      }
      case 'hour': {
        newCron[2] = value;
        break;
      }
      case 'date': {
        const [date, day] = value;
        newCron[3] = date;
        newCron[5] = day;
        break;
      }
      case 'month': {
        newCron[4] = value;
        break;
      }
      default: {
        break;
      }
    }
    onCronChange(newCron);
  };
  useEffect(() => {
    if (defaultValue.tab2) {
      const cronAry = defaultValue.tab2.split(' ').slice(0, 6);
      currentCorn.current = cronAry;
      setDefaultCron(cronAry);
    }
  }, [defaultValue]);
  useEffect(() => {
    if (activeTab === '2') {
      setActiveKey('1');
    }
  }, [activeTab]);
  return (
    <>
      <Tabs
        tabPosition="left"
        activeKey={activeKey}
        onTabClick={(e) => {
          setActiveKey(e);
        }}
      >
        <TabPane tab="秒" key="1">
          <SecondPane
            onChange={onChange}
            activeKey={activeKey}
            defaultCron={defaultCron[0]}
          />
        </TabPane>
        <TabPane tab="分" key="2">
          <MinutePane
            onChange={onChange}
            activeKey={activeKey}
            defaultCron={defaultCron[1]}
          />
        </TabPane>
        <TabPane tab="时" key="3">
          <HourPane
            onChange={onChange}
            activeKey={activeKey}
            defaultCron={defaultCron[2]}
          />
        </TabPane>
        <TabPane tab="日" key="4">
          <DayPane
            onChange={onChange}
            activeKey={activeKey}
            defaultCron={dayDefaultCron}
          />
        </TabPane>
        <TabPane tab="月" key="5">
          <MonthPane
            onChange={onChange}
            activeKey={activeKey}
            defaultCron={defaultCron[4]}
          />
        </TabPane>
      </Tabs>
    </>
  );
};
