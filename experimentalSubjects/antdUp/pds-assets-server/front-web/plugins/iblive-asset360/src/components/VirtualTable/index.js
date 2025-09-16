/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-06-13 11:46:00
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-07 09:04:10
 * @Description:
 */
import { CustomTable } from 'iblive-base';
import { VList } from 'virtuallist-antd';
import styles from './index.less';
import { useMemo } from 'react';

const getTableLength = (tableData = []) => {
  let length = 0;
  const count = (list) => {
    list.forEach((e) => {
      length++;
      if (e.children) {
        count(e.children);
      }
    });
  };
  count(tableData);
  return length;
};
export default function OverviewTable({
  pageSize = 10,
  total,
  current,
  height,
  pagination,
  dataSource,
  showTotal = true,
  onPageChange,
  virtualWidth = '3200px',
  ...tableProps
}) {
  const calcHeight = useMemo(() => {
    if (!total || !height) {
      return height;
    }
    return total > 5 ? height - 40 : height;
  }, [height, total]);
  const vc = useMemo(() => {
    return VList({
      height: calcHeight, // 此值和scrollY值相同. 必传. (required).  same value for scrolly
      vid: 'vid',
    });
  }, [calcHeight]);
  const actualLength = useMemo(() => {
    return getTableLength(dataSource);
  }, [dataSource]);
  const count = total || dataSource?.length || 0;
  return (
    <div className={styles.overview_table}>
      {calcHeight ? (
        <CustomTable
          bordered={false}
          height={calcHeight}
          scroll={{
            y: actualLength > 5 ? calcHeight : undefined,
            x: virtualWidth,
          }}
          components={actualLength > 100 ? vc : null}
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
