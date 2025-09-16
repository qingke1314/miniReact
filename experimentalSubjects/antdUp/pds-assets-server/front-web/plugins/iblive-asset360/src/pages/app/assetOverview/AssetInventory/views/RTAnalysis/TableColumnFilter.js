/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-11-05 11:02:30
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 * @LastEditTime: 2024-12-23 14:12:37
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\AssetInventory\views\TableColumnMenu.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { SettingOutlined } from '@ant-design/icons';
import { Button, Popover, Space, Tree } from 'antd';
import { useEffect, useState } from 'react';
import styles from '../../index.less';

const INIT_DATA = {
  title: '列展示',
  key: '0',
  selectable: false,
  children: [],
};

const TableColumnFilter = ({
  selectTreeKey,
  treeDataList,
  tableColumnFilter,
  setTableColumnFilter,
}) => {
  const [treeData, setTreeData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [draggTreeData, setDraggTreeData] = useState([]); //拖拽后的最新treeData
  const [visivle, setVisivle] = useState(false);

  const onSave = () => {
    const newTableColumn =
      draggTreeData?.length > 0 ? draggTreeData : checkedKeys;
    setTableColumnFilter(newTableColumn);
    let localData = localStorage.getItem('tableColumnFilter360')
      ? JSON.parse(localStorage.getItem('tableColumnFilter360'))
      : {};
    localData[selectTreeKey] = newTableColumn;
    localStorage.setItem('tableColumnFilter360', JSON.stringify(localData));
    setVisivle(false);
  };

  const handleOpenChange = (newOpen) => {
    setVisivle(newOpen);
  };

  const hide = () => {
    setVisivle(false);
  };

  const onDrop = ({ dragNode, node }) => {
    //禁止拖拽到列展示下
    if (['列展示', '序号', '证券内码', '名称'].includes(node.key)) return;
    let dragIndex = '';
    let nodeIndex = '';
    // 找到序列索引
    draggTreeData.forEach((item, index) => {
      item === dragNode.key && (dragIndex = index);
      item === node.key && (nodeIndex = index);
    });

    if(dragIndex > nodeIndex){
      nodeIndex += 1;
    }

    // 删除并插入节点
    const draggedIndex = draggTreeData.splice(
      dragIndex,
      1,
    )[0];
    draggTreeData.splice(nodeIndex, 0, draggedIndex);
    setDraggTreeData([...draggTreeData]);

    //表格树更新
    const treeDataTemp = treeData[0].children.splice(
      dragIndex,
      1,
    )[0];
    treeData[0].children.splice(nodeIndex, 0, treeDataTemp);
    setTreeData([...treeData]);
  };

  useEffect(() => {
    setDraggTreeData([...tableColumnFilter]);
  }, [tableColumnFilter]);

  useEffect(() => {
    const AllColumnKeys = [];
    const newTree = treeDataList.map((item) => {
      AllColumnKeys.push(item.title);
      return {
        title: item.title,
        key: item.title,
        disabled: ['序号', '证券内码', '名称'].includes(item.title), //序号,证券内码,名称不可隐藏
      };
    });
    INIT_DATA.children = newTree;
    setTreeData([INIT_DATA]);
    //判断localStorage存储状态
    let localData = localStorage.getItem('tableColumnFilter360')
      ? JSON.parse(localStorage.getItem('tableColumnFilter360'))
      : {};
    if (localData?.[selectTreeKey]) {
      setTableColumnFilter(localData[selectTreeKey]);
      setCheckedKeys(localData[selectTreeKey]);
    } else {
      setTableColumnFilter(AllColumnKeys);
      setCheckedKeys(AllColumnKeys);
      localData[selectTreeKey] = AllColumnKeys;
      localStorage.setItem('tableColumnFilter360', JSON.stringify(localData));
    }
  }, [selectTreeKey]);

  return (
    <div className={styles.table_column_menu_main}>
      <Popover
        placement="bottomRight"
        trigger="click"
        visible={visivle}
        onVisibleChange={handleOpenChange}
        overlayClassName={styles['zuhe360_table_column_wrap']}
        content={
          <div>
            <Tree
              treeData={treeData}
              showLine={true}
              checkable
              height={300}
              checkedKeys={checkedKeys}
              fieldNames={{ title: 'title', key: 'title' }}
              defaultExpandAll
              draggable
              onCheck={(checkedKeys) => {
                setCheckedKeys(checkedKeys);
              }}
              onDrop={onDrop}
            />
            <div className={styles.footer_wrap}>
              <Button size="small" style={{ marginRight: 10 }} onClick={hide}>
                取消
              </Button>
              <Button size="small" type="primary" onClick={() => onSave()}>
                保存
              </Button>
            </div>
          </div>
        }
      >
        <Space>
          <SettingOutlined className={styles.icon} title="列设置" />
        </Space>
      </Popover>
    </div>
  );
};

export default TableColumnFilter;
