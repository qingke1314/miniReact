/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-26 10:02:26
 * @LastEditors: chenzongjun chenzongjun@apexsoft.com.cn
 * @LastEditTime: 2024-10-30 17:32:16
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\AssetInventory\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useGetHeight } from 'iblive-base';
import { useRef } from 'react';
import VariationOverview from '../VariationOverview';
import styles from './index.less';
import RightContent from './views/RightContent';
const AssetVariation = () => {
  const contentRef = useRef();
  const height = useGetHeight(
    contentRef.current,
    100,
    0,
    document.getElementById('content_container'),
  );

  return (
    <div
      className={styles.assetInventory_main}
      style={{ height: '100%' }}
      id="content_container"
    >
      <VariationOverview />
      <div ref={contentRef}>
        <RightContent height={height - 20} />
      </div>
    </div>
  );
};

export default AssetVariation;
