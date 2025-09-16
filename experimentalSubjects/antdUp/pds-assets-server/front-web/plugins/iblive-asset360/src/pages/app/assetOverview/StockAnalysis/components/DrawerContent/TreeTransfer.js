import { Transfer, Tree } from 'antd';
import React from 'react';
import styles from './index.less';

// Customize Table Transfer
const generateTree = (treeNodes = [], checkedKeys = []) =>
  treeNodes.map(({ questionPool, ...props }) => ({
    ...props,
    disabled: checkedKeys.includes(props.key),
    questionPool: generateTree(questionPool, checkedKeys),
  }));

const TreeTransfer = ({
  dataSource = [],
  targetKeys,
  childrenKey = 'questionPool',
  ...restProps
}) => {
  const transferDataSource = [];
  function flatten(list = []) {
    list.forEach((item) => {
      transferDataSource.push(item);
      flatten(item[childrenKey]);
    });
  }
  flatten(dataSource);

  // 获取所有叶子节点 key
  const getLeafKeys = (nodes) => {
    let keys = [];
    nodes.forEach((node) => {
      if (!node[childrenKey] || node[childrenKey].length === 0) {
        keys.push(node.key);
      } else {
        keys = keys.concat(getLeafKeys(node[childrenKey]));
      }
    });
    return keys;
  };

  return (
    <div className={styles['tree-transfer']}>
      <Transfer
        {...restProps}
        targetKeys={targetKeys}
        dataSource={transferDataSource}
        render={(item) => item.questionContent}
        showSelectAll={false}
      >
        {({ direction, onItemSelectAll, onItemSelect, selectedKeys }) => {
          if (direction === 'left') {
            // 只保留叶子节点的 key 作为 checkedKeys
            const leafKeys = getLeafKeys(dataSource);
            const checkedKeys = selectedKeys
              .filter((key) => leafKeys.includes(key))
              .concat(targetKeys.filter((key) => leafKeys.includes(key)));
            return (
              <Tree
                fieldNames={{
                  title: 'questionContent',
                  key: 'key',
                  children: 'questionPool',
                }}
                blockNode
                checkable
                checkedKeys={checkedKeys}
                treeData={generateTree(dataSource, targetKeys)}
                onCheck={(_, { node }) => {
                  if (!node[childrenKey] || node[childrenKey].length === 0) {
                    const isSelected = checkedKeys.includes(node.key);
                    onItemSelect(node.key, !isSelected);
                  } else {
                    // 父节点切换所有子孙节点
                    const descendantLeafKeys = getLeafKeys([node]);
                    const allSelected = descendantLeafKeys.every((key) =>
                      checkedKeys.includes(key),
                    );
                    onItemSelectAll(descendantLeafKeys, !allSelected);
                  }
                }}
                onSelect={(_, { node }) => {
                  if (!node[childrenKey] || node[childrenKey].length === 0) {
                    const isSelected = checkedKeys.includes(node.key);
                    onItemSelect(node.key, !isSelected);
                  } else {
                    const descendantLeafKeys = getLeafKeys([node]);
                    const allSelected = descendantLeafKeys.every((key) =>
                      checkedKeys.includes(key),
                    );
                    onItemSelectAll(descendantLeafKeys, !allSelected);
                  }
                }}
              />
            );
          }
        }}
      </Transfer>
    </div>
  );
};

export default TreeTransfer;
