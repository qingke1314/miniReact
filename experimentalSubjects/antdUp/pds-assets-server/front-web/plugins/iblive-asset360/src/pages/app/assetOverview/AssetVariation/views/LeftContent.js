/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-11 09:43:05
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-06-28 10:44:28
 * @FilePath: \invest-index-server-front\src\pages\monitor\CashPosition\views\CatalogTree.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import CustomTree from '@asset360/components/CustomTree';
import { convertTreeMenu, filterTree } from 'iblive-base';
import { useMemo, useState } from 'react';
import styles from '../index.less';

export default ({
  height,
  tree,
  treeLoading = false,
  updateTree,
  activedKey,
  setActivedKey,
}) => {
  const [filterValue, setFilterValue] = useState();
  const [expandedKeys, setExpandedKeys] = useState(['zl']);
  const showData = useMemo(() => {
    const treeData = convertTreeMenu(tree);
    return filterValue
      ? filterTree(treeData, { title: filterValue, realKey: filterValue })
      : treeData;
  }, [tree]);
  return (
    <div className={styles.configs_left_content}>
      <CustomTree
        height={height > 158 ? height - 58 : 100}
        treeData={showData}
        blockNode
        showIcon={false}
        expandedKeys={expandedKeys}
        selectedKeys={[activedKey]}
        onSelect={(keys) => setActivedKey(keys[0])}
        onExpand={(e) => {
          setExpandedKeys(e);
        }}
      />
    </div>
  );
};
