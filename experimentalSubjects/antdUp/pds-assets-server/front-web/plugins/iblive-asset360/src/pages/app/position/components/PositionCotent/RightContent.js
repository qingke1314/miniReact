/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-06-14 14:04:50
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-27 09:37:07
 * @Description:
 */
import CustomCard from '@asset360/components/CustomCard';
import { CustomTableWithYScroll, useGetHeight } from 'iblive-base';
import { useEffect, useRef } from 'react';
import styles from '../index.less';

export default ({ columns, header, data, selectIndex }) => {
  const tableRef = useRef();
  const tableHeight = useGetHeight(tableRef.current, 400, 18);

  useEffect(() => {
    let box = document.getElementById('box');
    if (box) {
      let v = document.getElementsByClassName('ant-table-content')[0];
      if (v) {
        v.scrollTop = 0;
      }
    }
  }, [selectIndex]);

  return (
    <div className={styles.configs_right_content}>
      {header}
      <CustomCard
        bodyStyle={{ padding: 8 }}
        style={{ marginTop: 8, border: 'none' }}
      >
        <div ref={tableRef}>
          {data.length > 0 ? (
            <CustomTableWithYScroll
              id="box"
              dataSource={data}
              columns={columns}
              rowKey="code"
              className={styles.cash_forecast_main}
              rowClassName={(record) => {
                if (!record.isPos) {
                  return styles.title;
                } else if (record.indexLevel == 2) {
                  return styles.indexLevel;
                }
              }}
              defaultExpandAllRows
              pagination={false}
              height={tableHeight}
            />
          ) : null}
        </div>
      </CustomCard>
    </div>
  );
};
