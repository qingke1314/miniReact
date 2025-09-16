/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-09-30 17:12:02
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 * @LastEditTime: 2024-11-14 15:13:39
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\AssetInventory\views\DetailCard.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { executeApi } from '@asset360/apis/appCommon';
import OverviewTable from '@asset360/components/OverviewTable';
import { Col, Row, Spin } from 'antd';
import { moneyFormat } from 'iblive-base';
import { isNumber } from 'lodash';
import { useEffect, useState } from 'react';
import styles from '../../index.less';

const columns = [
  {
    title: '',
    dataIndex: 'item',
  },
  {
    title: '增减情况',
    dataIndex: 'changeNum',
    align: 'right',
    render: (text) => (
      <span>
        {text > 0 ? (
          <CaretUpOutlined style={{ color: '#ef5350', paddingRight: 2 }} />
        ) : text < 0 ? (
          <CaretDownOutlined style={{ color: '#20d08c', paddingRight: 2 }} />
        ) : (
          ''
        )}
        {text === 0
          ? '不变'
          : moneyFormat({
              num: text,
              decimal: 0,
            })}
      </span>
    ),
  },
  {
    title: '流通股比例',
    dataIndex: 'turnoverAmountRatio',
    align: 'right',
    render: (text) => moneyFormat({ num: text * 100, unit: '%', decimal: 2 }),
  },
  {
    title: '占净值比',
    dataIndex: 'netValueRatio',
    align: 'right',
    render: (text) => moneyFormat({ num: text * 100, unit: '%', decimal: 3 }),
  },
];

export default ({ visible, interCode, productCode }) => {
  const [info, setInfo] = useState();
  const [loading, setLoading] = useState(false);

  const getInfo = async () => {
    setLoading(true);
    const res = await executeApi({
      serviceId: 'DD_API_MUTUAL_FUND_SEC_POSITION_SUMMARY',
      data: {
        fundCode: productCode,
        interCode,
      },
    });
    setInfo(res?.data || {});
    setLoading(false);
  };

  useEffect(() => {
    if (visible) {
      getInfo();
    }
  }, [visible, interCode]);

  return (
    <div style={{ padding: '0 0 0 16px', whiteSpace: 'nowrap' }}>
      <div className="important-title m-b-8 m-t-8">交易汇总</div>
      <Spin spinning={loading}>
        <Row gutter={8} className="m-b-8" align="middle">
          <Col>
            <span className={styles.comm_head_title}>持仓数量：</span>
            <span className={styles.comm_head_value_small}>
              {isNumber(info?.currentQty)
                ? moneyFormat({
                    num: info?.currentQty,
                    decimal: 0,
                  })
                : '--'}
            </span>
          </Col>
          <Col>
            <span className={styles.comm_head_title}>持仓市值：</span>
            <span className={styles.comm_head_value_small}>
              {isNumber(info?.marketValue)
                ? moneyFormat({
                    num: info?.marketValue / 10000,
                  })
                : '--'}
            </span>
            &nbsp; 万
          </Col>
        </Row>
        <OverviewTable
          pagination={false}
          columns={columns}
          dataSource={info?.tradeData}
          showTotal={false}
        />
      </Spin>
    </div>
  );
};
