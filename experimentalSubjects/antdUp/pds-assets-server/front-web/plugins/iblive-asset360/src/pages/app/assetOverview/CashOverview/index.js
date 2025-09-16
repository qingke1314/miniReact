/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-26 10:02:26
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-12-09 14:09:10
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\AssetInventory\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ResizableContainers, useGetHeight } from 'iblive-base';
import { useRef, useState } from 'react';
import LeftContent from './views/LeftContent';
import RightContent from './views/RightContent';

export default () => {
  const contentRef = useRef();
  const height = useGetHeight(contentRef.current, 100, 0, contentRef.current);
  const [activedKey, setActivedKey] = useState('forecastedStatement');

  return (
    <div
      ref={contentRef}
      className="m-t-8"
      style={{
        height: 'calc(100% - 8px)',
      }}
    >
      <ResizableContainers
        containdersHeight={height}
        leftDefaultWidth={210}
        leftMinWidth={210}
        leftMaxWidth="60vw"
        leftContent={
          <LeftContent
            height={height}
            activedKey={activedKey}
            setActivedKey={setActivedKey}
          />
        }
        rightContent={<RightContent activedKey={activedKey} height={height} />}
      />
    </div>
  );
};
