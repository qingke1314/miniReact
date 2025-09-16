/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-26 09:38:08
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 * @LastEditTime: 2024-12-03 11:39:46
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\OverView\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { executeApi } from '@asset360/apis/appCommon';
import { Col, Radio, Row } from 'antd';
import { useEffect, useState } from 'react';
import BaseMsg from './BaseMsg';
import StockKLineChart from './StockKLineChart';
import StockQuotesChart from './StockQuotesChart';

export default function StockBaseMsg({ interCode }) {
  const [unit, setUnit] = useState('0');
  const [info, setInfo] = useState({});
  const [kLineInfo, setKLine] = useState({});
  const [BaseInfo, setBaseInfo] = useState({});

  const queryInfo = async () => {
    const res = await executeApi({
      serviceId: 'DD_API_MUTUAL_SEC_DAY_TIME_QUOTATION_INTRADAY',
      data: {
        interCode,
      },
    });
    setInfo(res || {});
  };

  const queryKLineInfo = async () => {
    const res = await executeApi({
      serviceId: 'DD_API_MUTUAL_SEC_DAYK_QUOTATION_INTRADAY',
      data: {
        interCode,
      },
    });
    setKLine(res?.records || {});
  };

  const queryBaseInfo = async () => {
    const res = await executeApi({
      serviceId: 'DD_API_STOCK_BASIC_INFO',
      data: {
        interCode,
      },
    });
    setBaseInfo(res?.data || {});
  };

  useEffect(() => {
    queryInfo();
    queryKLineInfo();
    queryBaseInfo();
    let timer = setInterval(() => {
      queryInfo();
      queryKLineInfo();
      queryBaseInfo();
    }, 10000);
    return () => {
      clearInterval(timer);
    };
  }, [interCode]);

  return (
    <>
      <Row gutter={8}>
        <Col style={{ width: '70%' }}>
          <Row justify="space-between">
            <span className="important-title">股票基本信息</span>
            <Radio.Group
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              optionType="button"
              buttonStyle="solid"
            >
              <Radio value={'0'}>分时图</Radio>
              <Radio value={'1'}>K线图</Radio>
            </Radio.Group>
          </Row>
          {unit == '0' ? (
            <StockQuotesChart quotationInfoList={info.records} />
          ) : (
            <StockKLineChart info={kLineInfo} />
          )}
        </Col>
        <Col style={{ width: '30%', alignContent: 'center' }}>
          <BaseMsg info={BaseInfo} />
        </Col>
      </Row>
    </>
  );
}
