/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-26 09:38:08
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-11-14 15:35:37
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\OverView\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { getVirtualList } from '@asset360/apis/asset360';
import CustomModal from '@asset360/components/CustomModal';
import CustomTree from '@asset360/components/CustomTree';
import { Button, Col, Form, Row, Spin, Tree } from 'antd';
import { CustomForm } from 'iblive-base';
import { useEffect, useState } from 'react';
import styles from '../index.less';
import { conceptList, fundTypeList, managerList, sectorList } from './const';

const INIT_TREE_NODE = [
  {
    isLeaf: false,
    title: '虚拟组合',
    key: '-1',
    // icon: <GroupIconUnderTree />,
    icon: null,
  },
];

const LeftContent = ({ height, setDetailInfo, detailInfo }) => {
  const [tree, setTree] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState(['-1']);
  const [treeLoading, setTreeLoading] = useState(false);
  const [form] = Form.useForm();
  const [leftCheckedKeys, setLeftCheckedKeys] = useState([]);
  const [rightCheckedKeys, setRightCheckedKeys] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const fundType = Form.useWatch('fund', form);
  const dimension = Form.useWatch('dimension', form);
  const onAdd = () => {
    setShowEditModal(true);
  };
  useEffect(() => {
    setTreeLoading(true);
    getVirtualList()
      .then((res) => {
        if (res?.code > 0) {
          const treeData = (res.records || []).map((e) => {
            return {
              isLeaf: true,
              title: e.name,
              key: e.code,
              icon: null,
              parentKey: '-1',
            };
          });
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
  }, []);

  return (
    <div className={styles.configs_left_content}>
      <Spin spinning={treeLoading} style={{ height: height - 47 }}>
        <div
          style={{
            marginBottom: 0,
            padding: '8px 8px 4px 8px',
            borderBottom: '1px solid var(--border-color-base)',
          }}
        >
          <Button type="primary" onClick={onAdd}>
            新增虚拟组合
          </Button>
        </div>
        <CustomTree
          height={height - 47}
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
          //switcherIcon={<DownOutlined />}
        />
      </Spin>
      <CustomModal
        title="新增虚拟组合"
        width={'60vw'}
        visible={showEditModal}
        onOk={() => {
          setShowEditModal(false);
        }}
        onCancel={() => {
          setShowEditModal(false);
        }}
      >
        <Row gutter={12}>
          <Col
            style={{
              borderRight: '1px solid var(--border-color-base)',
            }}
            span={12}
          >
            <CustomForm
              form={form}
              initialValues={{
                fund: 'category',
              }}
              config={[
                {
                  label: '产品',
                  type: 'radio',
                  name: 'fund',
                  props: {
                    options: [
                      { label: '分类', value: 'category' },
                      { label: '基金经理', value: 'fundManager' },
                    ],
                    onChange: () => {
                      setLeftCheckedKeys([]);
                    },
                    optionType: 'button',
                    buttonStyle: 'solid',
                  },
                },
              ]}
            />
            <Tree
              blockNode
              checkable
              checkedKeys={leftCheckedKeys}
              treeData={fundType === 'category' ? fundTypeList : managerList}
              onCheck={(keys) => {
                setLeftCheckedKeys(keys);
              }}
            />
          </Col>
          <Col span={12}>
            <CustomForm
              form={form}
              initialValues={{
                dimension: 'sector',
              }}
              config={[
                {
                  label: '维度',
                  type: 'radio',
                  name: 'dimension',
                  props: {
                    optionType: 'button',
                    buttonStyle: 'solid',
                    onChange: () => {
                      setRightCheckedKeys([]);
                    },
                    options: [
                      { label: '行业', value: 'sector' },
                      { label: '概念', value: 'concept' },
                    ],
                  },
                },
              ]}
            />
            <Tree
              blockNode
              checkable
              checkedKeys={rightCheckedKeys}
              treeData={dimension === 'sector' ? sectorList : conceptList}
              onCheck={(keys) => {
                setRightCheckedKeys(keys);
              }}
            />
          </Col>
        </Row>
      </CustomModal>
    </div>
  );
};

export default LeftContent;
