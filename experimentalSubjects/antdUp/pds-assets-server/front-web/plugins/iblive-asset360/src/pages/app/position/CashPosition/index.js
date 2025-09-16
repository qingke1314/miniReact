/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-11 09:43:05
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 * @LastEditTime: 2024-12-06 11:54:49
 * @FilePath: \invest-index-server-front\src\pages\monitor\CashPosition\views\Configs.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  getFundTreeByAuth,
  getFundTreeStatusByAuth,
} from '@asset360/apis/position';
import { useLocation } from '@umijs/max';
import { ResizableContainers, useGetHeight } from 'iblive-base';
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
    title: '专户',
    key: -2,
    selectable: false,
  },
];

export default () => {
  const [tree, setTree] = useState([]);
  const [treeLoading, setTreeLoading] = useState(false); // 菜单加载状态
  const contentRef = useRef();
  const [paramsForList, setParamsForList] = useState();
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [activeTab, setActiveTab] = useState('cashForecast');
  const [positionLink, setPositionLink] = useState('SETTLE'); // 盘中/盘后
  const height = useGetHeight(contentRef.current, 100, 8);
  const location = useLocation();
  const routeJumpInfo = location.state?.info;
  const handleNode = (item, parentObjectCode, parentTitle, isFilterZCDY) => {
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
      title: objectName,
      filterTitle:
        headObjectCode === 'fund_code' ? objectCode + objectName : objectName, //产品可查code 基金不行
      objectCode,
      headObjectCode,
      isLeaf: headObjectCode === 'ast_unit_code',
      selectable: true,
      parentKey,
      disabled: isFilterZCDY && headObjectCode === 'ast_unit_code', //日终头寸下禁用资产单元且自动选中上一级
      parentTitle: headObjectCode === 'ast_unit_code' ? parentTitle : undefined,
      parentObjectCode:
        headObjectCode === 'ast_unit_code' ? parentObjectCode : undefined,
      //日终头寸不展示目录树的资产单元
      children: (childrenObjects || []).map((childrenObject) => {
        return handleNode(childrenObject, objectCode, objectName, isFilterZCDY);
      }),
    };
    return node;
  };

  //isFilterZCDY 是否过滤第二级的资产单元(仅昨日日终头寸菜单下触发)
  const updateTree = async (isFilterZCDY = false) => {
    setTreeLoading(true);
    Promise.all([
      getFundTreeStatusByAuth({ positionLink }),
      getFundTreeByAuth(),
    ]).then((res) => {
      const warnList = res?.[0]?.records?.map((item) => {
        if (item?.astUnitId) {
          item.fundCode = item?.astUnitId + '';
        }
        return item;
      });
      const list = (res?.[1]?.records || [])?.map((item) => {
        return handleNode(item, null, null, isFilterZCDY);
      });
      const getConformity = (tree) => {
        let newTree = [];
        newTree = tree?.map((item) => {
          let obj;
          if (item?.children && item?.children.length > 0) {
            warnList?.forEach((item2) => {
              if (item.objectCode === item2.fundCode) {
                item.status = item2.warnType;
                item.warnText = item2.warnText;
              }
            });
            obj = {
              ...item,
              children: getConformity(item.children),
            };
            if (obj.children?.length < 1) obj = undefined;
          } else {
            warnList?.forEach((item3) => {
              if (item.objectCode === item3.fundCode) {
                item.status = item3.warnType;
                item.warnText = item3.warnText;
                obj = item;
              }
            });
          }
          return obj;
        });
        return newTree;
      };
      getConformity(list);
      const list1 = list.filter((item) => item.parentKey == 1);
      const list2 = list.filter((item) => item.parentKey == 2);
      INIT_NODE[0].children = list1;
      INIT_NODE[1].children = list2;
      //总览页面跳转到此 默认选中目标项且提到列表第一位
      if (routeJumpInfo) {
        const { fundCode, fundName, unitId, unitName } = routeJumpInfo || {};
        const selectItem = list.filter((item) => item.objectCode == fundCode);
        const { parentKey } = selectItem?.[0] || {};
        let newList = parentKey == '1' ? list1.slice() : list2.slice();
        newList.forEach((item, index) => {
          if (item.objectCode == fundCode) {
            newList = [
              newList[index],
              ...newList.slice(0, index),
              ...newList.slice(index + 1),
            ];
          }
        });
        INIT_NODE[Number(parentKey) - 1]?.children &&
          (INIT_NODE[Number(parentKey) - 1].children = newList);
        //unitId存在代表是单元跳转
        if (unitId) {
          setParamsForList({
            key: `ast_unit_code${unitId}`,
            objectCode: unitId,
            headObjectCode: 'ast_unit_code',
            title: unitName,
            parentObjectCode: fundCode,
            parentTitle: fundName,
          });
        } else {
          setParamsForList({
            key: `fund_code${fundCode}`,
            objectCode: fundCode,
            headObjectCode: 'fund_code',
            title: fundName,
          });
        }
        const parentMenuKey = parentKey == '1' ? -1 : -2;
        setExpandedKeys([parentMenuKey, `fund_code${fundCode}`]);
      } else {
        //默认选中第一项
        const { objectCode, title } =
          INIT_NODE?.[0]?.children?.[0] || INIT_NODE?.[1]?.children?.[0] || {};
        // paramsForList为空代表第一次刷新树,目的是positionLink触发更新后保留选中效果
        if (objectCode && !paramsForList) {
          setParamsForList({
            key: `fund_code${objectCode}`,
            objectCode: objectCode,
            headObjectCode: 'fund_code',
            title: title,
          });
          setExpandedKeys([-1, -2]);
        }
        //日终头寸下 如果选中资产单元则改为选中父级
        if (isFilterZCDY && paramsForList?.headObjectCode === 'ast_unit_code') {
          setParamsForList({
            key: `fund_code${paramsForList?.parentObjectCode}`,
            objectCode: paramsForList?.parentObjectCode,
            headObjectCode: 'fund_code',
            title: paramsForList?.parentTitle,
          });
        }
      }
      // 用...触发effect监听
      setTree([...INIT_NODE]);
    });
    setTreeLoading(false);
  };

  useEffect(() => {
    //交易维度跳交易可用头寸 估值维度跳现金流预测
    if (routeJumpInfo?.tabKey) {
      setActiveTab(
        routeJumpInfo?.tabKey === 'TRADE' ? 'dealIndex' : 'cashForecast',
      );
    }
  }, [routeJumpInfo]);

  useEffect(() => {
    updateTree();
  }, [positionLink]);

  return (
    <div ref={contentRef} style={{ marginTop: 8 }}>
      <ResizableContainers
        containdersHeight={height}
        leftDefaultWidth={277}
        leftMinWidth={277}
        leftMaxWidth="60vw"
        leftContent={
          <LeftContent
            height={height}
            tree={tree}
            treeLoading={treeLoading}
            paramsForList={paramsForList}
            setParamsForList={setParamsForList}
            updateTree={updateTree}
            expandedKeys={expandedKeys}
            setExpandedKeys={setExpandedKeys}
          />
        }
        rightContent={
          <RightContent
            height={height}
            paramsForList={paramsForList}
            updateTree={updateTree}
            positionLink={positionLink}
            setPositionLink={setPositionLink}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        }
      />
    </div>
  );
};
