/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-14 10:04:51
 * @LastEditTime: 2024-09-02 09:06:09
 * @LastEditors: chenzongjun chenzongjun@apexsoft.com.cn
 */
import { ResizableContainers, useGetHeight } from 'iblive-base';
import { useRef } from 'react';
import LeftContent from './LeftContent';
import RightContent from './RightContent';
export default ({
  tree = [],
  columns,
  header,
  data,
  treeLoading,
  updateTree,
  onSelectIndex,
  selectIndex,
  func,
  expandedKeys,
  setExpandedKeys,
}) => {
  const contentRef = useRef();
  const height = useGetHeight(contentRef.current, 100, 8);

  return (
    <div ref={contentRef} style={{ marginTop: 8 }}>
      <ResizableContainers
        containdersHeight={height}
        leftDefaultWidth={250}
        leftMinWidth={250}
        leftMaxWidth="60vw"
        isAuto={false}
        leftContent={
          <LeftContent
            height={height}
            tree={tree}
            treeLoading={treeLoading}
            updateTree={updateTree}
            selectIndex={selectIndex}
            onSelectIndex={onSelectIndex}
            func={func}
            setExpandedKeys={setExpandedKeys}
            expandedKeys={expandedKeys}
          />
        }
        rightContent={
          selectIndex ? (
            <RightContent
              height={height}
              columns={columns}
              header={header}
              data={data}
              selectIndex={selectIndex}
            />
          ) : null
        }
      />
    </div>
  );
};
