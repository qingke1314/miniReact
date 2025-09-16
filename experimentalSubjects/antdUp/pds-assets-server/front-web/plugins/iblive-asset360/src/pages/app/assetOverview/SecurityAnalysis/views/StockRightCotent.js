/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-26 09:38:08
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-27 10:47:24
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\OverView\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { Divider } from 'antd';
import Compare from './Compare';
import Hand from './Hand';
import ProductTable from './ProductTable';
import StockBaseMsg from './StockBaseMsg';

const StockRightCotent = ({ secType, detailInfo, height, wrapperRef }) => {
  return (
    <div
      className="blank-card-asset"
      style={{ height, overflow: 'auto', overflowX: 'hidden' }}
      ref={wrapperRef}
    >
      <div id="id-1">
        <Hand interCode={detailInfo?.key} name={detailInfo?.title} />
      </div>
      <Divider />
      <div id="id-2">
        <StockBaseMsg interCode={detailInfo?.key} name={detailInfo?.title} />
      </div>
      <Divider />
      <div id="id-3">
        <ProductTable detailInfo={detailInfo} secType={secType} />
      </div>
      <Divider />
      <div id="id-4">
        <Compare detailInfo={detailInfo} />
      </div>

      {/*<div id="id-5">*/}
      {/*  <CorrelationAnalysis />*/}
      {/*</div>*/}
    </div>
  );
};

export default StockRightCotent;
