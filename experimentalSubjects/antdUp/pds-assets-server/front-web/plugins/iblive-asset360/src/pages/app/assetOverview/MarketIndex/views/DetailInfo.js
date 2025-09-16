/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-12-27 14:13:17
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-12-30 16:17:42
 * @Description:
 */
import { Tabs } from 'antd-v5';
import { useState } from 'react';
import ChangeLog from './ChangeLog';
import IndexComponent from './IndexComponent';
import IndexInformation from './IndexInformation';

export default ({ selectedMarket }) => {
  const [activedTab, setActivedTab] = useState('1');

  return (
    <>
      <div className="blank-card-asset m-t-8">
        <Tabs activeKey={activedTab} onChange={setActivedTab}>
          <Tabs.TabPane key="1" tab="指数信息">
            <IndexInformation
              selectedMarket={selectedMarket}
              tabKey="1"
              activedTab={activedTab}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="2" tab="指数成分">
            <IndexComponent
              selectedMarket={selectedMarket}
              tabKey="2"
              activedTab={activedTab}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="3" tab="变更历史">
            <ChangeLog
              selectedMarket={selectedMarket}
              tabKey="3"
              activedTab={activedTab}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  );
};
