/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-11 09:43:05
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-12-09 14:04:00
 * @FilePath: \invest-index-server-front\src\pages\monitor\CashPosition\views\CatalogTree.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Icon from '@ant-design/icons';
import { ReactComponent as toucunriliIcon } from '@asset360/assets/app/assetOverview/toucunriliIcon.svg';
import { ReactComponent as toucunriliIconWhite } from '@asset360/assets/app/assetOverview/toucunriliIconWhite.svg';
import { ReactComponent as toucunyuceIcon } from '@asset360/assets/app/assetOverview/toucunyuceIcon.svg';
import { ReactComponent as toucunyuceIconWhite } from '@asset360/assets/app/assetOverview/toucunyuceIconWhite.svg';
import { ReactComponent as zijinminxiIcon } from '@asset360/assets/app/assetOverview/zijinminxiIcon.svg';
import { ReactComponent as zijinminxiIconWhite } from '@asset360/assets/app/assetOverview/zijinminxiIconWhite.svg';
import CustomTree from '@asset360/components/CustomTree';
import { useState } from 'react';
import styles from '../index.less';

export default ({ height, activedKey, setActivedKey }) => {
  const [expandedKeys, setExpandedKeys] = useState(['zl']);
  const treeData = [
    {
      isLeaf: true,
      title: '单产品头寸',
      key: 'forecastedStatement',
      icon:
        activedKey === 'forecastedStatement' ? (
          <Icon component={toucunyuceIcon} />
        ) : (
          <Icon component={toucunyuceIconWhite} />
        ),
    },
    {
      isLeaf: true,
      title: 'O32交易头寸',
      key: 'dealDetailDrawer',
      icon:
        activedKey === 'dealDetailDrawer' ? (
          <Icon component={zijinminxiIconWhite} />
        ) : (
          <Icon component={zijinminxiIcon} />
        ),
    },
    {
      isLeaf: true,
      title: '头寸事件',
      key: 'fundCalendar',
      icon:
        activedKey === 'fundCalendar' ? (
          <Icon component={toucunriliIconWhite} />
        ) : (
          <Icon component={toucunriliIcon} />
        ),
    },
  ];
  return (
    <div className={styles.left_content}>
      <CustomTree
        height={height > 158 ? height - 16 : 100}
        treeData={treeData}
        blockNode
        className={styles.left_tree}
        showIcon={true}
        expandedKeys={expandedKeys}
        selectedKeys={[activedKey]}
        onSelect={(keys) => setActivedKey(keys[0])}
        onExpand={(e) => {
          setExpandedKeys(e);
        }}
      />
    </div>
  );
};
