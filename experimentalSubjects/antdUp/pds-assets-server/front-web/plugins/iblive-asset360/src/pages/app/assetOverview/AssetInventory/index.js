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
import { useSelector } from 'react-redux';
import comm_styles from '../../../../common/productStyle.less';
import styles from './index.less';
import LeftContent from './views/LeftContent';
import RightContent from './views/RightContent';

const AssetInventory = () => {
  const contentRef = useRef();
  const height = useGetHeight(
    contentRef.current,
    100,
    0,
    document.getElementById('asset_inventory_container'),
  );
  const [selectTreeKey, setSelectTreeKey] = useState('gupiao');
  const [refrshFlag, setRefrshFlag] = useState(1);
  const { date, productCode, astUnitId } = useSelector(
    (state) => state.asset360AssetLayout,
  );

  let timeInterval = '';

  const createTimeInterVal = () => {
    timeInterval = setInterval(() => {
      setRefrshFlag((pre) => pre + 1);
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
      style={{ height: 'calc(100% - 8px)' }}
      id="asset_inventory_container"
      className={`${styles.assetInventory_main} ${comm_styles.assetOverview_comm}`}
    >
      <div ref={contentRef}>
        <ResizableContainers
          containdersHeight={height}
          leftDefaultWidth={230}
          leftMinWidth={230}
          leftMaxWidth="60vw"
          isAuto={false}
          leftContent={
            <LeftContent
              astUnitId={astUnitId}
              height={height}
              setSelectTreeKey={setSelectTreeKey}
              selectTreeKey={selectTreeKey}
              productCode={productCode}
            />
          }
          rightContent={
            <RightContent
              height={height}
              selectTreeKey={selectTreeKey}
              date={date}
              productCode={productCode}
              refrshFlag={refrshFlag}
            />
          }
        />
      </div>
    </div>
  );
};

export default AssetInventory;
