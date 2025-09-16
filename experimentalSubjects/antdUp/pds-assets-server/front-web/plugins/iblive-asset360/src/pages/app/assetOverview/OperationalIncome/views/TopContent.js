/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-11-13 10:19:49
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-17 14:22:47
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\OperationalIncome\views\Header.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import ProductRecordHistorySelector from '@asset360/components/ProductRecordHistorySelector';
import { Row } from 'antd';
import styles from '../index.less';

export default ({ productCode, setProductCode }) => {
  return (
    <Row justify="space-between" align="middle" className={styles.top_wrap}>
      <ProductRecordHistorySelector
        productCode={productCode}
        setProductCode={setProductCode}
      />
    </Row>
  );
};
