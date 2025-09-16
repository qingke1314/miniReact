/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-14 10:09:41
 * @LastEditTime: 2024-11-12 14:28:34
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 */
import CustomTree from '@asset360/components/CustomTree';
import { Input, Space } from 'antd-v5';
import { filterTree } from 'iblive-base';
import { useMemo, useState } from 'react';
import styles from '../index.less';

export default ({
  height,
  tree,
  treeLoading = false,
  updateTree,
  onSelectIndex,
  selectIndex,
  expandedKeys,
  setExpandedKeys,
}) => {
  const [filterValue, setFilterValue] = useState();
  const treeHeight = height > 148 ? height - 48 : 100;
  const showData = useMemo(() => {
    return filterValue
      ? filterTree(tree, { title: filterValue, realKey: filterValue })
      : tree;
  }, [tree, filterValue]);

  return (
    <div className={styles.configs_left_content}>
      <div className={styles.search_container}>
        <Space
          style={{
            padding: '8px 8px 0px 8px',
            width: '100%',
          }}
          size={0}
        >
          <Input.Search
            onChange={(e) => {
              setFilterValue(e.target.value);
            }}
            allowClear
            placeholder="请输入"
            onSearch={updateTree}
            loading={treeLoading}
          />
        </Space>
      </div>

      <CustomTree
        height={treeHeight}
        treeData={showData}
        blockNode
        icon={null}
        defaultExpandAll
        expandAction={false}
        expandedKeys={expandedKeys}
        onExpand={setExpandedKeys}
        onSelect={onSelectIndex}
        selectedKeys={[selectIndex.key]}
      />
    </div>
  );
};
