/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-26 09:38:08
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-11-14 15:35:37
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\OverView\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { DownOutlined } from '@ant-design/icons';
import { invokeAPIIndex } from '@asset360/apis/api';
import CustomTree from '@asset360/components/CustomTree';
import { Row, Space, Spin } from 'antd';
import { convertTreeMenu, moneyFormat, CustomTabs } from 'iblive-base';
import { useEffect, useMemo, useState } from 'react';
import styles from '../index.less';
import { PRODUCT, MANAGER, TAG, TAB_LIST } from '../const';

const INIT_TREE_NODE = [
  {
    isLeaf: false,
    title: '产品组合',
    key: '-1',
    // icon: <GroupIconUnderTree />,
    icon: null,
  },
  {
    isLeaf: true,
    title: '模拟组合',
    key: '-2',
    icon: null,
  },
  // {
  //   isLeaf: true,
  //   title: '虚拟组合',
  //   key: '-3',
  //   icon: null,
  // },
];

const ProductTree = ({ height, onSelectIndex, setDetailInfo, detailInfo }) => {
  const [activeTab, setActiveTab] = useState('product');
  const [tree, setTree] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState(['-1']);
  const [treeLoading, setTreeLoading] = useState(false);
  const apiParams = useMemo(() => {
    switch (activeTab) {
      case PRODUCT:
        return {
          serviceId: 'DD_API_MUTUAL_FUND_FA_TYPE_ASSET_STAT',
          root: INIT_TREE_NODE,
          dataPath: 'data',
          formatItem: (item) => ({
            isLeaf: true,
            title: item.faFundTypeName,
            key: item.faFundType,
            parentKey: '-1',
            icon: null,
            value: item.totalAmount,
            count: item.num,
            activeTab: activeTab,
          }),
        };
      case MANAGER:
        return {
          serviceId: 'DD_API_MUTUAL_FUND_MANAGER_ASSET_STAT',
          root: [],
          dataPath: 'records',
          formatItem: (item) => ({
            isLeaf: true,
            title: item.fundManagerName,
            key: item.fundManager,
            icon: null,
            value: item.totalAmount,
            count: item.num,
            activeTab: activeTab,
          }),
        };
      case TAG:
        return {
          serviceId: 'DD_API_MUTUAL_FUND_TAG_ASSET_STAT',
          root: [],
          dataPath: 'records',
          formatItem: (item) => ({
            isLeaf: true,
            title: item.tag,
            key: item.tag,
            icon: null,
            value: item.totalAmount,
            count: item.num,
            activeTab: activeTab,
          }),
        };
      default:
        return '';
    }
  }, [activeTab]);
  const getLeftOverview = async () => {
    setDetailInfo();
    setTreeLoading(true);
    const res = await invokeAPIIndex({
      groupType: 'fund',
      serviceId: apiParams.serviceId,
      data: {},
    });
    const array = [...apiParams.root];
    res?.[apiParams.dataPath]?.forEach((item) => {
      array.push(apiParams.formatItem(item));
    });
    const nodeList = array.filter((item) => {
      return item.count || ['-1', '-2', '-3'].includes(item.key);
    });
    setDetailInfo(nodeList[0]);
    setTreeLoading(false);
    setTree(convertTreeMenu(nodeList));
  };

  useEffect(() => {
    getLeftOverview();
  }, [apiParams]);

  return (
    <Spin spinning={treeLoading} style={{ height: height - 47 }}>
      <CustomTabs
        value={activeTab}
        onChange={(value) => {
          setActiveTab(value);
        }}
        style={{ margin: '0 8px' }}
        options={TAB_LIST}
      ></CustomTabs>
      <CustomTree
        height={height - 47}
        treeData={tree}
        blockNode
        icon={null}
        selectedKeys={[detailInfo?.key]}
        defaultExpandAll
        onSelect={onSelectIndex}
        expandAction={false}
        expandedKeys={expandedKeys}
        onExpand={(e) => {
          setExpandedKeys(e);
        }}
        switcherIcon={<DownOutlined />}
        titleRender={(record) => {
          const { title, value, count } = record;
          return (
            <Row
              justify="space-between"
              align="middle"
              className={styles.tree_title_wrap}
            >
              <div>
                {['产品组合', '模拟组合', '虚拟组合'].includes(title) ? (
                  <div className={styles.total_product_title}>{`${title}`}</div>
                ) : (
                  <div className={styles.title}>
                    <div>{title}</div>
                    {value ? (
                      <div className="m-t-4">
                        {moneyFormat({
                          num: value / 100000000 || 0,
                          unit: '亿',
                        })}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
              {title == '产品组合' || count == 0 || !count ? null : (
                <Space align="center">
                  <div
                    className={
                      record?.key == detailInfo?.key
                        ? styles.tree_title_number_active
                        : styles.tree_title_number
                    }
                    style={{ fontSize: count > 99 ? '12px' : '14px' }}
                  >
                    <span>{count || 0}</span>
                  </div>
                </Space>
              )}
            </Row>
          );
        }}
      />
    </Spin>
  );
};

export default ProductTree;
