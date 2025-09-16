/*
 * @Author: wenyiqian
 * @Date: 2025-01-09 11:40:58
 * @LastEditors: wenyiqian
 * @LastEditTime: 2025-01-09 11:40:58
 * @Description: desc
 */
import { FolderFilled, FolderOpenFilled } from '@ant-design/icons';
import styles from './index.less';

const GroupIconUnderTree = () => (
  <div className={styles.group_icon_under_tree}>
    <FolderOpenFilled className="tree_group_icon" />
    <FolderFilled className="tree_group_icon" />
  </div>
);

export default GroupIconUnderTree;
