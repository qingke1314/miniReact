/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-26 09:38:08
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-11-14 16:32:11
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\OverView\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { Empty } from 'antd';
import { ResizableContainers } from 'iblive-base';
import { useState } from 'react';
import styles from './index.less';
import Chart from './views/Chart';
import ProductTable from './views/ProductTable';
import ProductTree from './views/ProductTree';

const OverView = () => {
  const height = 'calc(100vh - 90px)';
  const [detailInfo, setDetailInfo] = useState('');
  const onSelectIndex = (_, { selectedNodes }) => {
    setDetailInfo(selectedNodes?.[0]);
  };

  return (
    <div style={{ width: '100%' }} id="overview_container">
      <div>
        <Chart />
        <ResizableContainers
          containdersHeight={height}
          leftDefaultWidth={300}
          leftMinWidth={300}
          isAuto={false}
          leftMaxWidth="60vw"
          leftContent={
            <div className={styles.configs_left_content}>
              <ProductTree
                height={height}
                onSelectIndex={onSelectIndex}
                setDetailInfo={setDetailInfo}
                detailInfo={detailInfo}
              />
            </div>
          }
          rightContent={
            detailInfo ? (
              <ProductTable
                detailInfo={detailInfo}
                type={'0'}
                height={height}
              />
            ) : (
              <Empty />
            )
          }
        />
      </div>
    </div>
  );
};

export default OverView;
