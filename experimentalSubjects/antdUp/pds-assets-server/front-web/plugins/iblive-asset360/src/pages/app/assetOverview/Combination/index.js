/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-26 10:02:26
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-10 09:05:04
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\AssetInventory\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ResizableContainers, useGetHeight } from 'iblive-base';
import { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import LeftContent from './views/LeftContent';
import RightContent from './views/RightContent';

const Combination = () => {
  const contentRef = useRef();
  const height = useGetHeight(
    contentRef.current,
    100,
    0,
    document.getElementById('asset_overview_combination'),
  );
  const [detailInfo, setDetailInfo] = useState({});
  const [refreshFlag, setRefreshFlag] = useState(1);

  let timeInterval = '';

  const createTimeInterVal = () => {
    timeInterval = setInterval(() => {
      setRefreshFlag((pre) => pre + 1);
    }, 10000);
  };

  useEffect(() => {
    createTimeInterVal();
    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div
      style={{ height: 'calc(100vh - 80px)' }}
      id="asset_overview_combination"
      className={`${styles.container}`}
    >
      <div ref={contentRef}>
        <ResizableContainers
          containdersHeight={height}
          leftDefaultWidth={230}
          leftMinWidth={230}
          leftMaxWidth="30vw"
          leftContent={
            <LeftContent
              height={height}
              setDetailInfo={setDetailInfo}
              detailInfo={detailInfo}
              refreshFlag={refreshFlag}
            />
          }
          rightContent={
            <RightContent
              height={height}
              detailInfo={detailInfo}
              refreshFlag={refreshFlag}
            />
          }
        />
      </div>
    </div>
  );
};

export default Combination;
