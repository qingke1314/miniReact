/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-12-26 16:57:27
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-12-30 15:52:36
 * @Description:
 */
import { Col, Radio, Row } from 'antd-v5';
import { useState } from 'react';
import IndexInfoComponentTable from './IndexInfoComponentTable';
import IndustrialDistribution from './IndustrialDistribution';
import MarketShare from './MarketShare';
import TopTen from './TopTen';

const MODE_TABLE = '1';
const MODE_MARKET_RATIO = '2';
const MODE_INDUSTRY_RATIO = '3';
const MODE_TOP_10 = '4';

export default ({ tabKey, activedTab, selectedMarket }) => {
  const [updateTime, setUpdateTime] = useState('xxxx-xx-xx xx:xx');
  const [mode, setMode] = useState(MODE_TABLE);

  return (
    <>
      <Row justify="space-between" align="middle" className="m-b-8">
        <Col>
          <Radio.Group
            buttonStyle="solid"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <Radio.Button value={MODE_TABLE}>详表</Radio.Button>
            <Radio.Button value={MODE_MARKET_RATIO}>市场占比统计</Radio.Button>
            <Radio.Button value={MODE_INDUSTRY_RATIO}>
              行业分布统计
            </Radio.Button>
            <Radio.Button value={MODE_TOP_10}>十大权重统计</Radio.Button>
          </Radio.Group>
        </Col>
        <Col>
          <span>更新日期：{updateTime}</span>
        </Col>
      </Row>
      <>
        {mode === MODE_TABLE ? (
          <IndexInfoComponentTable
            needUpade={activedTab === tabKey}
            selectedMarket={selectedMarket}
            setUpdateTime={setUpdateTime}
          />
        ) : mode === MODE_MARKET_RATIO ? (
          <MarketShare
            needUpade={activedTab === tabKey}
            selectedMarket={selectedMarket}
            setUpdateTime={setUpdateTime}
          />
        ) : mode === MODE_INDUSTRY_RATIO ? (
          <IndustrialDistribution
            needUpade={activedTab === tabKey}
            selectedMarket={selectedMarket}
            setUpdateTime={setUpdateTime}
          />
        ) : mode === MODE_TOP_10 ? (
          <TopTen
            needUpade={activedTab === tabKey}
            selectedMarket={selectedMarket}
            setUpdateTime={setUpdateTime}
          />
        ) : null}
      </>
    </>
  );
};
