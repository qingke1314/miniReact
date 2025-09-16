/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-26 09:38:08
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-11-14 16:51:26
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\OverView\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { DownOutlined } from '@ant-design/icons';
import { invokeAPIIndex } from '@asset360/apis/api';
import CustomTree from '@asset360/components/CustomTree';
import { Spin } from 'antd-v5';
import { convertTreeMenu } from 'iblive-base';
import { useEffect, useState } from 'react';

const INIT_TREE_NODE = {
  isLeaf: false,
  title: '产品组合',
  key: '-1',
  icon: null,
};

export default ({ height, onSelectIndex, setDetailInfo, detailInfo }) => {
  const [tree, setTree] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState(['-1']);
  const [treeLoading, setTreeLoading] = useState(false);

  const getLeftOverview = async () => {
    setDetailInfo();
    setTreeLoading(true);
    const res = await invokeAPIIndex({
      serviceId: 'DD_API_OUTSIDE_FUND_TYPE_STAT',
      data: {},
    });

    const array = [INIT_TREE_NODE];
    // Process the new array structure
    (res?.records || []).forEach((item) => {
      array.push({
        isLeaf: true,
        title: item.fundType,
        key: item.fundType,
        parentKey: '-1',
        icon: null,
        count: item.num, // Include the count in the node data
      });
    });

    setDetailInfo(array[0]);
    setTreeLoading(false);
    setTree(convertTreeMenu(array));
  };

  useEffect(() => {
    getLeftOverview();
  }, []);

  return (
    <Spin spinning={treeLoading} style={{ height: height - 47 }}>
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
        // titleRender={(record) => {
        //   const { title, value, count } = record;
        //   return (
        //     <Row
        //       justify="space-between"
        //       align="middle"
        //       className={styles.tree_title_wrap}
        //     >
        //       <div>
        //         {title == '产品组合' ? (
        //           <div className={styles.total_product_title}>{`${title}`}</div>
        //         ) : (
        //           <div className={styles.title}>
        //             <div>{title}</div>
        //             {value ? (
        //               <div className="m-t-4">
        //                 {moneyFormat({
        //                   num: value / 100000000 || 0,
        //                   unit: '亿',
        //                 })}
        //               </div>
        //             ) : null}
        //           </div>
        //         )}
        //       </div>
        //       {title == '产品组合' || count == 0 || !count ? null : (
        //         <Space align="center">
        //           <div
        //             className={
        //               record.key == detailInfo.key
        //                 ? styles.tree_title_number_active
        //                 : styles.tree_title_number
        //             }
        //             style={{ fontSize: count > 99 ? '12px' : '14px' }}
        //           >
        //             <span>{count || 0}</span>
        //           </div>
        //         </Space>
        //       )}
        //     </Row>
        //   );
        // }}
      />
    </Spin>
  );
};
