/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-12-30 09:19:47
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-12-30 13:52:44
 * @Description:
 */
import { executeApi } from '@asset360/apis/appCommon';
import { Col, Row, Space, Spin } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import PieChart from '../components/PieChart';
import styles from '../index.less';

const MARKET_MODE = 'MARKET';
const BOARD_MODE = 'BOARD';
export default ({ needUpade, selectedMarket, setUpdateTime }) => {
  const [loading, setLoading] = useState();
  const [data, setData] = useState();
  const [mode, setMode] = useState(MARKET_MODE);

  const updateData = async () => {
    setLoading(false);
    const res = await executeApi({
      serviceId: 'APEX_ASSET_INDEX_COMPONENT_MARKET_RATIO',
      data: {
        interCode: selectedMarket,
        type: mode,
      },
    });
    setUpdateTime(moment().format('YYYY-MM-DD HH:mm'));
    setData(
      (res?.data?.eventData || []).map((item) => ({
        name: item.name,
        value: item.ratio || 0,
      })),
    );
    setLoading(false);
  };

  useEffect(() => {
    needUpade && updateData();
  }, [needUpade, selectedMarket, mode]);

  return (
    <>
      <Row justify="center">
        <Col>
          <Space size={4}>
            <a
              type="link"
              className={
                mode === MARKET_MODE
                  ? styles.link_btn
                  : styles.link_btn_inactive
              }
              onClick={() => setMode(MARKET_MODE)}
            >
              交易所
            </a>
            |
            <a
              type="link"
              className={
                mode === BOARD_MODE ? styles.link_btn : styles.link_btn_inactive
              }
              onClick={() => setMode(BOARD_MODE)}
            >
              板块
            </a>
          </Space>
        </Col>
      </Row>
      <Spin spinning={loading}>
        <PieChart data={data} />
      </Spin>
    </>
  );
};
