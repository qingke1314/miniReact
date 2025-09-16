/*
 * @Author: wenyiqian
 * @Date: 2025-01-08 11:48:59
 * @LastEditors: wenyiqian
 * @LastEditTime: 2025-01-08 11:48:59
 * @Description: desc
 */
import { Tree } from 'antd';
import styles from './index.less';

const CustomTree = ({ className, ...config }) => {
  return (
    <Tree.DirectoryTree
      showIcon
      blockNode
      className={`${styles.tree} ${className}`}
      defaultExpandAll
      {...config}
    />
  );
};

export default CustomTree;
