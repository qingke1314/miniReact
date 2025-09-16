/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-11-20 17:56:41
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-10 09:15:59
 * @Description:
 */
import { Col, Row } from 'antd-v5';
import { useSelector } from 'react-redux';
import EarningsChart from './views/EarningsChart';

export default () => {
  const { productCode } = useSelector((state) => state.asset360AssetLayout);

  return (
    <div className="blank-card-asset" style={{ padding: 8, marginTop: 8 }}>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <EarningsChart productCode={productCode} />
        </Col>
      </Row>
    </div>
  );
};
