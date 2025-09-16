/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-14 10:04:51
 * @LastEditTime: 2024-11-12 14:26:45
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 */
import { getAllFundTree } from '@asset360/apis/position';
import {
  desensitization,
  ResizableContainers,
  useGetHeight,
} from 'iblive-base';
import { useEffect, useRef, useState } from 'react';
import LeftContent from './views/LeftContent';
import RightContent from './views/RightContent';

const INIT_NODE = [
  {
    isLeaf: false,
    title: '公募',
    key: -1,
    selectable: false,
  },
  {
    isLeaf: false,
    title: '私募',
    key: -2,
    selectable: false,
  },
];

export default function ProductParam() {
  const [tree, setTree] = useState([]);
  const [treeLoading, setTreeLoading] = useState(false);
  const [node, setNode] = useState('');
  const [expandedKeys, setExpandedKeys] = useState([-1, -2]);
  const contentRef = useRef();
  const height = useGetHeight(contentRef.current, 100, 8);

  // 选中显示节点
  const onSelectIndex = (selectedKeys, { selectedNodes }) => {
    const { headObjectCode, objectCode, parentObjectCode } = selectedNodes[0];
    setNode({
      key: selectedKeys?.[0],
      fundCode: headObjectCode === 'fund_code' ? objectCode : parentObjectCode,
      astUnitId: headObjectCode === 'ast_unit_code' ? objectCode : undefined,
    });
  };

  const handleNode = (item, parentObjectCode) => {
    const {
      objectCode,
      objectName,
      childrenObjects,
      headObjectCode,
      parentKey,
    } = item || {};
    const node = {
      key: headObjectCode + objectCode,
      realKey: objectCode,
      title: `${desensitization(objectCode)} ${desensitization(objectName)}`,
      objectCode,
      headObjectCode,
      isLeaf: headObjectCode === 'ast_unit_code',
      selectable: true,
      parentKey,
      parentObjectCode:
        headObjectCode === 'ast_unit_code' ? parentObjectCode : undefined,
      //日终头寸不展示目录树的资产单元
      children: (childrenObjects || []).map((childrenObject) => {
        return handleNode(childrenObject, objectCode);
      }),
    };
    return node;
  };

  const udateTreeData = async () => {
    setTreeLoading(true);
    const res = await getAllFundTree();
    // const array =
    //   res?.records.map((item) => ({
    //     isLeaf: true,
    // title: `${desensitization(item.objectCode)} ${desensitization(
    //   item.objectName,
    // )}`,
    //     key: item.objectCode,
    //     selectable: true,
    //     parentKey: item.parentKey,
    //     children: [],
    //   })) || [];
    const array = res?.records?.map((item) => {
      return handleNode(item);
    });
    const array1 = array.filter((item) => item.parentKey == 1);
    const array2 = array.filter((item) => item.parentKey == 2);
    INIT_NODE[0].children = [...array1];
    INIT_NODE[1].children = [...array2];
    setTree(INIT_NODE);
    //默认选中第一项
    const { headObjectCode, objectCode, parentObjectCode } =
      INIT_NODE?.[0]?.children?.[0] || INIT_NODE?.[1]?.children?.[0] || {};
    objectCode &&
      setNode({
        key: headObjectCode + objectCode,
        fundCode:
          headObjectCode === 'fund_code' ? objectCode : parentObjectCode,
        astUnitId: headObjectCode === 'ast_unit_code' ? objectCode : undefined,
      });
    setTreeLoading(false);
  };

  useEffect(() => {
    udateTreeData();
  }, []);
  return (
    <div ref={contentRef} style={{ marginTop: 8 }}>
      <ResizableContainers
        containdersHeight={height}
        leftDefaultWidth={250}
        leftMinWidth={250}
        leftMaxWidth="60vw"
        isAuto={false}
        leftContent={
          <LeftContent
            height={height}
            tree={tree}
            treeLoading={treeLoading}
            updateTree={udateTreeData}
            selectIndex={node}
            onSelectIndex={onSelectIndex}
            setExpandedKeys={setExpandedKeys}
            expandedKeys={expandedKeys}
          />
        }
        rightContent={<RightContent selectIndex={node} />}
      />
    </div>
  );
}
