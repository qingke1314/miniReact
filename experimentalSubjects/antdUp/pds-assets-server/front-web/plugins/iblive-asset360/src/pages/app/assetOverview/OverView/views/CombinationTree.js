/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-26 09:38:08
 * @LastEditors: chenzongjun chenzongjun@apexsoft.com.cn
 * @LastEditTime: 2024-11-05 10:29:30
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\OverView\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { DownOutlined } from '@ant-design/icons';
import CustomTree from '@asset360/components/CustomTree';
import { Row, Space } from 'antd-v5';
import { convertTreeMenu, moneyFormat } from 'iblive-base';
import { useEffect, useState } from 'react';
import styles from '../index.less';

const INIT_TREE_NODE = [
  {
    isLeaf: false,
    title: '模拟组合',
    key: '-2',
    // icon: <GroupIconUnderTree />,
    icon: null,
  },
  {
    isLeaf: true,
    title: '组合列表',
    key: '-2-1',
    parentKey: '-2',
    icon: null,
  },
];

export default ({ height, onSelectIndex, detailInfo, setDetailInfo }) => {
  const [tree, setTree] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState(['-2']);
  const [amout, setAmout] = useState();
  const [count, setCount] = useState();

  const getLeftOverview = async () => {
    setAmout({
      模拟组合: 0,
      组合列表: 0,
    });
    setCount({
      模拟组合: 0,
      组合列表: 0,
    });
    setDetailInfo();
  };

  useEffect(() => {
    const nodeList = INIT_TREE_NODE.filter((item) => {
      return count?.[item.title] || item.key === '-2' || item.key === '-2-1';
    }); // 滤掉数量为0的类型
    setTree(convertTreeMenu(nodeList));
  }, [count]);

  useEffect(() => {
    getLeftOverview();
  }, []);

  return (
    <CustomTree
      height={height}
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
        const title = record.title;
        const value = amout[title];
        return (
          <Row
            justify="space-between"
            align="middle"
            className={styles.tree_title_wrap}
          >
            <div>
              {title == '模拟组合' ? (
                <div className={styles.total_product_title}>{`${title}（${
                  count[title] || 0
                }）`}</div>
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
            {title == '模拟组合' ||
            count[title] == 0 ||
            !count[title] ? null : (
              <Space align="center">
                <div
                  className={
                    record.key == detailInfo.key
                      ? styles.tree_title_number_active
                      : styles.tree_title_number
                  }
                  style={{ fontSize: count[title] > 99 ? '12px' : '14px' }}
                >
                  <span>{count[title] || 0}</span>
                </div>
              </Space>
            )}
          </Row>
        );
      }}
    />
  );
};
