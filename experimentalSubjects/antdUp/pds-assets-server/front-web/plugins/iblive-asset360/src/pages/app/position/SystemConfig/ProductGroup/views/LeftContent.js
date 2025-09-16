/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2025-02-18 13:54:18
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2025-02-19 10:02:49
 * @Description:
 */
import {
  DeleteOutlined,
  EditOutlined,
  FolderFilled,
  PartitionOutlined,
  PlusOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useSize } from 'ahooks';
import { Button, Input, message, Modal, Space } from 'antd-v5';
import { filterTree } from 'iblive-base';
import { useEffect, useRef, useState } from 'react';
import { Item, Menu, theme, useContextMenu } from 'react-contexify';
import {
  queryGroupTree,
  removeFundGroup,
} from '../../../../../../apis/positionFundGroup';
import CustomTree from '../../../../../../components/CustomTree';
import GroupIconUnderTree from '../../../../../../components/GroupIconUnderTree';
import styles from '../index.less';
import EditModal from './EditModal';

const CONTEXT_MENU_ID = 'CONTEXT_MENU';

const CONTEXT_MENU_LIST = [
  {
    id: 'insert_group',
    label: '新增组',
    icon: <PlusOutlined className={styles.add_icon} />,
  },
  {
    id: 'update_group',
    label: '编辑组',
    icon: <EditOutlined className={styles.edit_icon} />,
  },
  {
    id: 'delete_group',
    label: '删除组',
    icon: <DeleteOutlined className={styles.delete_icon} />,
  },
];

const INIT_NODE = {
  id: -1,
  isLeaf: false,
  title: '产品组',
  key: '-1',
  parentKey: null,
  icon: <PartitionOutlined className="tree_root_icon" />,
};

const formatList = (data) => {
  const list = [];
  (data || []).forEach((item) => {
    const info = {
      id: item.id,
      isLeaf: !item.children?.length,
      title: item.name,
      key: item.code,
      parentKey: item.parentCode ?? '-1',
      icon: item.children?.length ? (
        <GroupIconUnderTree />
      ) : (
        <FolderFilled className="tree_group_icon" />
      ),
    };
    if (item.children?.length) {
      const childrenList = formatList(item.children);
      info.children = childrenList;
    }
    list.push(info);
  });
  list.sort((a, b) => a.isLeaf - b.isLeaf);
  return list;
};

const getAllParentkeys = (data) => {
  const list = [];
  (data || []).forEach((item) => {
    if (!item.isLeaf) {
      list.push(item.key);
      list.push(...getAllParentkeys(item.children));
    }
  });
  return list;
};

export default ({ selectedNode, setSelectedNode }) => {
  const { show } = useContextMenu({ id: CONTEXT_MENU_ID });
  const listRef = useRef([INIT_NODE]);
  const filterValueRef = useRef();
  const [showData, setShowData] = useState([INIT_NODE]);
  const [loading, setLoading] = useState(false);
  const treeRef = useRef();
  const treeSize = useSize(treeRef);
  const [expandedKeys, setExpandedKeys] = useState([INIT_NODE.key]);
  const [showEditModal, setShowEditModal] = useState({
    visible: false,
    info: {},
  }); // 显示新增、重命名modal
  const [contextMenu, setContextMenu] = useState();

  const changeShowData = () => {
    const list = listRef.current || [];
    const filterValue = filterValueRef.current;
    const showData = filterValue
      ? filterTree(list, { title: filterValue, key: filterValue })
      : list;
    setShowData(showData);
  };

  const updateTreeData = async () => {
    setLoading(true);
    const res = await queryGroupTree();
    const list = [{ ...INIT_NODE, children: formatList(res?.records) }];
    listRef.current = list;
    setExpandedKeys(getAllParentkeys(list));
    setLoading(false);
    changeShowData();
  };

  const onSearch = (value) => {
    filterValueRef.current = value;
    changeShowData();
  };

  // 显示右键菜单
  const onRightClick = ({ event, node }) => {
    event.preventDefault();
    show(event, { props: node });
    setContextMenu(
      node.key === '-1' ? CONTEXT_MENU_LIST.slice(0, 1) : CONTEXT_MENU_LIST,
    );
  };
  // 选中右键菜单项
  const onSelectContextMenu = ({ data, props }) => {
    const [action] = data.split('_');
    if (action === 'delete') {
      Modal.confirm({
        title: '确认删除该产品组？',
        onOk: async () => {
          const res = await removeFundGroup({ id: props.id });
          if (res?.code === 1) {
            message.success('删除产品组成功');
            updateTreeData();
          }
        },
      });
    } else if (action === 'insert' || action === 'update') {
      const info =
        action === 'insert'
          ? {
              parentCode: props.key,
            }
          : {
              name: props.title,
              code: props.key,
              parentCode: props.parentKey,
              id: props.id,
            };
      onOpenEdit(info);
    }
  };
  // 选中显示节点
  const onSelectIndex = (_, { node }) => {
    setSelectedNode(node);
  };
  // 开启编辑弹窗
  const onOpenEdit = (info) => setShowEditModal({ visible: true, info });
  // 关闭编辑弹窗
  const oncloseEdit = () => setShowEditModal({ visible: false });

  useEffect(() => {
    updateTreeData();
    setSelectedNode(INIT_NODE);
  }, []);

  return (
    <div className={styles.left_content}>
      <Space size={0} align="middle" className="m-l-8 m-t-8  m-b-8">
        <Input.Search
          style={{ width: 200 }}
          onSearch={onSearch}
          allowClear
          placeholder="请输入名称"
        />
        <Button
          type="text"
          icon={
            <SyncOutlined
              title="更新"
              className="cursor_pointer"
              spin={loading}
              onClick={updateTreeData}
            />
          }
        />
      </Space>
      <div className={styles.tree_content} ref={treeRef}>
        <CustomTree
          treeData={showData}
          height={treeSize?.height || 100}
          expandedKeys={expandedKeys}
          selectedKeys={[selectedNode?.key]}
          onRightClick={onRightClick}
          onExpand={setExpandedKeys}
          onSelect={onSelectIndex}
        />
      </div>
      {/* 右键菜单 */}
      <Menu id="CONTEXT_MENU" theme={theme.light}>
        {(contextMenu || []).map((item) => (
          <Item key={item.id} data={item.id} onClick={onSelectContextMenu}>
            <Space>
              {item.icon}
              {item.label}
            </Space>
          </Item>
        ))}
      </Menu>
      {/* 新增or编辑菜单 */}
      <EditModal
        {...showEditModal}
        updateTree={updateTreeData}
        onCancel={oncloseEdit}
      />
    </div>
  );
};
