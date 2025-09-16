/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-06-13 11:46:00
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-07 09:04:10
 * @Description:
 */
import { CustomTable, CustomTableWithYScroll } from 'iblive-base';
import styles from './index.less';

export default function OverviewTable({
  pageSize = 10,
  total,
  current,
  height,
  pagination,
  dataSource,
  showTotal = true,
  onPageChange,
  ...tableProps
}) {
  const count = total || dataSource?.length || 0;
  return (
    <div className={styles.overview_table}>
      {height ? (
        <CustomTableWithYScroll
          bordered={false}
          height={total > 5 ? height - 40 : height}
          pagination={
            pagination === false
              ? false
              : {
                  ...(pagination || {}),
                  hideOnSinglePage: true,
                  showSizeChanger: false,
                  simple: true,
                  position: ['bottomLeft'],
                  pageSize,
                  total,
                  current,
                  onChange: onPageChange,
                  style: {
                    '--current_input_width': `${
                      `${current || 0}`.length * 14 + 4
                    }px`,
                  },
                }
          }
          dataSource={dataSource}
          {...tableProps}
        />
      ) : (
        <CustomTable
          bordered={false}
          pagination={
            pagination === false
              ? false
              : {
                  ...(pagination || {}),
                  hideOnSinglePage: true,
                  showSizeChanger: false,
                  simple: true,
                  position: ['bottomLeft'],
                  pageSize,
                  total,
                  current,
                  onChange: onPageChange,
                  style: {
                    '--current_input_width': `${
                      `${current || 0}`.length * 14 + 4
                    }px`,
                  },
                }
          }
          dataSource={dataSource}
          {...tableProps}
        />
      )}
      {showTotal && count > 5 && (
        <>
          <span className={styles.data_count}>总条数:&nbsp;{count}</span>
          {/* 占位 */}
          <div
            style={{
              height: pagination !== false && count > pageSize ? 0 : 40,
            }}
          />
        </>
      )}
    </div>
  );
}
