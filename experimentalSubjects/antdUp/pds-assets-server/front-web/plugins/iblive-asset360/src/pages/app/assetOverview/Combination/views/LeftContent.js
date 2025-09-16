/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-26 09:38:08
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-11-14 15:35:37
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\OverView\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { DeleteOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import {
  handleAddAsset,
  handleAddCombi,
  handleAddFund,
  handleQueryAllFund,
  handleRemoveAstUnit,
  handleRemoveCombi,
  handleRemoveFund,
} from '@asset360/apis/asset360';
import CustomButtonGroup from '@asset360/components/CustomButtonGroup';
import CustomModal from '@asset360/components/CustomModal';
import CustomTree from '@asset360/components/CustomTree';
import { Form, message, Modal, Space, Spin } from 'antd';
import { CustomForm } from 'iblive-base';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Item, Menu, theme, useContextMenu } from 'react-contexify';
import styles from '../index.less';

const INIT_TREE_NODE = [
  {
    isLeaf: false,
    title: '模拟组合',
    key: '-1',
    level: 'root',
    // icon: <GroupIconUnderTree />,
    icon: null,
  },
];

const CONTEXT_MENU_LIST = (nodeType) => {
  switch (nodeType) {
    case 'root':
      return [
        {
          label: '新增产品',
          id: 'insert_fund',
          icon: <PlusOutlined className={styles.add_icon} />,
        },
      ];
    case 'fund':
      return [
        {
          label: '新增资产单元',
          id: 'insert_asset',
          icon: <PlusOutlined className={styles.add_icon} />,
        },
        {
          label: '删除产品',
          id: 'delete_fund',
          icon: <DeleteOutlined className={styles.add_icon} />,
        },
      ];
    case 'astUnit':
      return [
        {
          label: '新增组合',
          id: 'insert_combi',
          icon: <PlusOutlined className={styles.add_icon} />,
        },
        {
          label: '删除资产单元',
          id: 'delete_asset',
          icon: <DeleteOutlined className={styles.add_icon} />,
        },
      ];
    default:
      return [
        {
          label: '删除组合',
          id: 'delete_combi',
          icon: <DeleteOutlined className={styles.add_icon} />,
        },
      ];
  }
};

const CONTEXT_MENU_ID = 'CONTEXT_MENU';

const LeftContent = ({ height, setDetailInfo, detailInfo }) => {
  const [form] = Form.useForm();
  const [tree, setTree] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState(['-1']);
  const [treeLoading, setTreeLoading] = useState(false);
  const { show } = useContextMenu({ id: CONTEXT_MENU_ID });
  const [contextMenu, setContextMenu] = useState();
  const [visible, setVisible] = useState(false);
  const hasSet = useRef(false);
  const [dialogInfo, setDialogInfo] = useState({});

  const getDeleteInfo = (id) => {
    // 删除是直接执行，通过useMemo(dialogInfo)取的话数据是上一帧的，由于闭包的缘故没法异步取，故实时生成
    const type = id.split('_')[1];
    switch (type) {
      case 'fund':
        return {
          deleteFn: handleRemoveFund,
          deleteFormName: 'fundCode',
        };
      case 'asset':
        return {
          deleteFn: handleRemoveAstUnit,
          deleteFormName: 'astUnitId',
        };
      default:
        return {
          deleteFn: handleRemoveCombi,
          deleteFormName: 'combiCode',
        };
    }
  };
  const infoAboutDialogNode = useMemo(() => {
    if (!dialogInfo?.id) return {};
    const type = dialogInfo.id.split('_')[1];
    switch (type) {
      case 'fund':
        return {
          title: '新增基金',
          fn: handleAddFund,
          deleteFn: handleRemoveFund,
          formName: 'fundName',
          deleteFormName: 'fundCode',
          formLabel: '基金名称',
        };
      case 'asset':
        return {
          title: '新增资产单元',
          fn: handleAddAsset,
          deleteFn: handleRemoveAstUnit,
          formName: 'astUnitName',
          deleteFormName: 'astUnitId',
          formLabel: '资产单元名称',
        };
      default:
        return {
          title: '新增组合',
          deleteFn: handleRemoveCombi,
          fn: handleAddCombi,
          deleteFormName: 'combiCode',
          formName: 'combiName',
          formLabel: '组合名称',
        };
    }
  }, [dialogInfo]);

  const queryFundTree = () => {
    setTreeLoading(true);
    handleQueryAllFund()
      .then((res) => {
        if (res?.code > 0) {
          let expandList = ['-1'];
          const treeData = (res.records || []).map((e) => {
            expandList.push(e.fundCode);
            return {
              fundName: e.fundName,
              fundCode: e.fundCode,
              isLeaf: false,
              title: e.fundName,
              key: e.fundCode,
              parentKey: '-1',
              icon: null,
              level: 'fund',
              children: (e.assetList || []).map((o) => {
                o.combiList && expandList.push(o.astUnitId);
                return {
                  level: 'astUnit',
                  isLeaf: false,
                  title: o.astUnitName,
                  key: o.astUnitId,
                  parentKey: e.fundCode,
                  icon: null,
                  astUnitName: o.astUnitName,
                  astUnitId: o.astUnitId,
                  fundCode: e.fundCode,
                  children: o.combiList
                    ? o.combiList.map((p) => {
                        const returnP = {
                          astUnitName: o.astUnitName,
                          astUnitId: o.astUnitId,
                          fundCode: e.fundCode,
                          combiName: p.combiName,
                          combiCode: p.combiCode,
                          level: 'combi',
                          isLeaf: true,
                          title: p.combiName,
                          key: p.combiCode,
                          parentKey: o.astUnitId,
                        };
                        if (!hasSet.current) {
                          setDetailInfo(returnP);
                          hasSet.current = true;
                        }
                        return returnP;
                      })
                    : null,
                };
              }),
            };
          });
          setExpandedKeys(expandList);
          setTree([
            {
              ...INIT_TREE_NODE[0],
              children: treeData,
            },
          ]);
        }
      })
      .finally(() => {
        setTreeLoading(false);
      });
  };

  useEffect(() => {
    queryFundTree();
  }, []);

  // 显示右键菜单
  const onRightClick = ({ event, node }) => {
    event.preventDefault();
    show(event, { props: node });
    setContextMenu(CONTEXT_MENU_LIST(node.level));
  };

  /**
   * 新增
   */
  const handleSelect = ({ data, props }) => {
    setDialogInfo({
      ...props,
      id: data,
    });
    if (data.startsWith('insert_')) {
      setVisible(true);
    } else if (data.startsWith('delete_')) {
      Promise.resolve().then(() => {
        Modal.confirm({
          title: `确认删除吗？`,
          onOk: async () => {
            const deleteInfo = getDeleteInfo(data);
            const res = await deleteInfo.deleteFn({
              [deleteInfo.deleteFormName]: props[deleteInfo.deleteFormName],
            });
            if (res?.code === 1) {
              message.success(`删除模板成功`);
              queryFundTree();
            }
          },
        });
      });
    }
  };

  /**
   * 弹框取消
   */
  const onCancel = () => {
    setVisible(false);
  };
  /**
   * 弹框确认
   */
  const onConfirm = () => {
    form.validateFields().then((values) => {
      const { fundCode, astUnitId } = dialogInfo;
      infoAboutDialogNode
        .fn({
          [infoAboutDialogNode.formName]: values[infoAboutDialogNode.formName],
          fundCode,
          astUnitId,
        })
        .then((res) => {
          if (res?.code > 0) {
            setVisible(false);
            message.success('新增成功!');
            queryFundTree();
          }
        });
    });
  };
  /**
   * 清楚表格
   */
  const afterClose = () => {
    form.resetFields();
  };
  return (
    <div className={styles.configs_left_content}>
      <Spin spinning={treeLoading} style={{ height }}>
        <CustomTree
          height={height}
          treeData={tree}
          blockNode
          icon={null}
          selectedKeys={[detailInfo?.key]}
          defaultExpandAll
          onSelect={(_, { selectedNodes }) => {
            setDetailInfo(selectedNodes?.[0]);
          }}
          expandAction={false}
          expandedKeys={expandedKeys}
          onExpand={(e) => {
            setExpandedKeys(e);
          }}
          onRightClick={onRightClick}
          switcherIcon={<DownOutlined />}
        />
        {/* 右键菜单 */}
        <Menu id="CONTEXT_MENU" theme={theme.light}>
          {(contextMenu || []).map((item) => (
            <Item onClick={handleSelect} key={item.id} data={item.id}>
              <Space>
                {item.icon}
                {item.label}
              </Space>
            </Item>
          ))}
        </Menu>
      </Spin>
      <CustomModal
        title={infoAboutDialogNode.title}
        visible={visible}
        footer={<CustomButtonGroup onCancel={onCancel} onConfirm={onConfirm} />}
        afterClose={afterClose}
        onCancel={onCancel}
      >
        <CustomForm
          form={form}
          config={[
            {
              colProps: {
                flex: '100%',
              },
              options: {
                rules: [{ required: true, message: '请输入' }],
              },
              type: 'input',
              label: infoAboutDialogNode.formLabel,
              name: infoAboutDialogNode.formName,
            },
          ]}
        />
      </CustomModal>
    </div>
  );
};

export default LeftContent;
