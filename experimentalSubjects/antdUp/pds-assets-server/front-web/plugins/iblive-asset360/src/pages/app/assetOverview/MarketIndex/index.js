/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-12-26 10:02:13
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-12-30 10:04:14
 * @Description:
 */
import { ResizableContainers, useGetHeight } from 'iblive-base';
import { useRef, useState } from 'react';
import LeftContent from './views/LeftContent';
import RightContent from './views/RightContent';

export default () => {
  const contentRef = useRef();
  const [selectedMarket, setSelectedMarket] = useState();
  const [marketList, setMarketList] = useState();
  const height = useGetHeight(
    contentRef.current,
    '100%',
    8,
    document.getElementById('content_container'),
  );

  return (
    <div style={{ height: '100%' }} id="content_container">
      <ResizableContainers
        containdersHeight={height}
        leftMinWidth={270}
        leftContent={
          <LeftContent
            selectedMarket={selectedMarket}
            marketList={marketList}
            setSelectedMarket={setSelectedMarket}
            setMarketList={setMarketList}
          />
        }
        rightContent={
          <RightContent
            selectedMarket={selectedMarket}
            marketList={marketList}
          />
        }
      />
    </div>
  );
};
