/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-09-30 17:12:02
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 * @LastEditTime: 2024-11-14 09:54:15
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\AssetInventory\views\DetailCard.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { CloseOutlined } from '@ant-design/icons';
import CustomAnchor from '@asset360/components/CustomAnchor';
import { Button } from 'antd';
import { useEffect, useRef } from 'react';
import styles from '../../index.less';
import DealTable from './DealTable';
import Quotes from './Quotes';
import TransactionSummary from './TransactionSummary';

const anchorList = [
  {
    id: 'quotes',
    title: '行情',
  },
  {
    id: 'transactionSummary',
    title: '交易汇总',
  },
  {
    id: 'dealTable',
    title: '交易明细',
  },
];
export default ({
  visible,
  height,
  setRightCardVisible,
  selectTreeKey,
  tableSecCode,
  productCode,
}) => {
  const wrapperRef = useRef();

  useEffect(() => {
    setRightCardVisible(false);
  }, [selectTreeKey]);

  return (
    <>
      {visible && (
        <div className={styles.configs_right_card_content}>
          <div
            className="blank-card-asset"
            style={{ display: 'flex', padding: 0 }}
          >
            <div
              ref={wrapperRef}
              style={{
                height: height - 78,
                overflow: 'auto',
                flex: 1,
                width: 0,
              }}
            >
              {/* 行情 */}
              <div id="quotes" style={{ width: 500 }}>
                <Quotes
                  visible={visible}
                  selectTreeKey={selectTreeKey}
                  height={height}
                  interCode={tableSecCode}
                  productCode={productCode}
                  setRightCardVisible={setRightCardVisible}
                />
              </div>
              {/* 交易汇总 */}
              <div id="transactionSummary" style={{ width: 500 }}>
                <TransactionSummary
                  visible={visible}
                  // selectTreeKey={selectTreeKey}
                  interCode={tableSecCode}
                  productCode={productCode}
                />
              </div>
              {/* 交易明细 */}
              <div id="dealTable" style={{ width: 500 }}>
                <DealTable
                  visible={visible}
                  selectTreeKey={selectTreeKey}
                  height={height}
                  interCode={tableSecCode}
                  productCode={productCode}
                />
              </div>
            </div>
            <div className={styles.steps_wrap}>
              <Button
                onClick={() => setRightCardVisible(false)}
                className={styles.close_icon}
              >
                <CloseOutlined />
              </Button>
              <CustomAnchor
                items={anchorList}
                getContainer={() => wrapperRef.current}
                size="small"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
