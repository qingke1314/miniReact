/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-11-27 14:53:02
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-15 09:44:13
 * @Description:
 */
import { Col, DatePicker, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setDate } from '../../store/standardPositionSlice';
import styles from './index.less';
import ProductSelector from './ProductSelector';

export default ({ needDateSelector = true, initFundCode, initAstUnitId }) => {
  const dispatch = useDispatch();
  const { date } = useSelector((state) => state.asset360StandardPosition);

  return (
    <>
      <Row
        justify="space-between"
        align="middle"
        className={styles.product_header}
      >
        <Col>
          <ProductSelector
            initFundCode={initFundCode}
            initAstUnitId={initAstUnitId}
          />
        </Col>
        {needDateSelector && (
          <Col>
            <DatePicker
              value={date}
              onChange={(date) => dispatch(setDate(date))}
            />
          </Col>
        )}
      </Row>
    </>
  );
};
