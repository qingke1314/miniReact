/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2025-02-18 13:40:08
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2025-02-19 11:42:09
 * @Description:
 */
import { ResizableContainers, useGetHeight } from 'iblive-base';
import { useRef, useState } from 'react';
import LeftContent from './views/LeftContent';
import RightContent from './views/RightContent';

export default () => {
  const [selectedNode, setSelectedNode] = useState();
  const contentRef = useRef();
  const height = useGetHeight(contentRef.current, 100, 8);

  return (
    <div className="m-t-8" ref={contentRef}>
      <ResizableContainers
        containdersHeight={height}
        leftMinWidth={250}
        leftDefaultWidth={250}
        leftMaxWidth="60vw"
        leftContent={
          <LeftContent
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
          />
        }
        rightContent={<RightContent selectedNode={selectedNode} />}
      />
    </div>
  );
};
