/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-26 09:38:08
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-26 15:40:23
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\OverView\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { executeApi } from '@asset360/apis/appCommon';
import { Col, Row } from 'antd';
import { moneyFormat } from 'iblive-base';
import { useEffect, useState } from 'react';
const ZqItem = ({ title, value }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '8px 0',
    }}
  >
    <b
      style={{
        color: 'var(--text-color)',
        fontWeight: 'bold',
        fontSize: '1.3em',
      }}
    >
      {value}
    </b>
    <span>{title}</span>
  </div>
);

export default function Hand({ interCode, name }) {
  const [info, setInfo] = useState({});

  const queryInfo = async () => {
    const res = await executeApi({
      serviceId: 'DD_API_HOLD_SEC_STAT',
      data: {
        interCode,
        assetType: 'GP',
      },
    });
    setInfo(res?.data || {});
  };
  useEffect(() => {
    queryInfo();
  }, [interCode]);

  return (
    <>
      <span className="important-title">公司产品持仓</span>

      <Row justify="space-around" style={{ marginTop: 8 }}>
        <Col>
          <ZqItem title={info?.interCode} value={name} />
        </Col>

        <Col>
          <ZqItem
            title="持有产品数量"
            value={moneyFormat({
              num: info?.fundNum,
              decimal: 0,
            })}
          />
        </Col>
        <Col>
          <ZqItem
            title="总持股数"
            value={moneyFormat({ num: info?.holdQty, decimal: 0 })}
          />
        </Col>

        <Col>
          <ZqItem
            title="占总股本比例"
            value={moneyFormat({
              decimal: 4,
              num: info?.totalAmountRatio,
              unit: '%',
            })}
          />
        </Col>

        <Col>
          <ZqItem
            title="占流通股本比例"
            value={moneyFormat({
              decimal: 4,
              num: info?.turnoverAmountRatio,
              unit: '%',
            })}
          />
        </Col>
      </Row>
    </>
  );
}
