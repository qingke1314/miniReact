/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-06-13 11:46:00
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-06-25 10:04:12
 * @Description:
 */
import { CustomTableWithYScroll } from 'iblive-base';
import styles from '../common/productStyle.less';

export default ({
  pageSize = 10,
  total,
  current,
  height = 300,
  onPageChange,
  ...tableProps
}) => {
  return (
    <CustomTableWithYScroll
      className={styles.position_table}
      pagination={{
        hideOnSinglePage: true,
        showSizeChanger: false,
        simple: true,
        position: ['bottomLeft'],
        pageSize,
        total,
        current,
        onChange: onPageChange,
        style: {
          '--current_input_width': `${`${current || 0}`.length * 14 + 4}px`,
        },
      }}
      height={height}
      {...tableProps}
    />
  );
};
