/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2023-02-17 15:34:18
 * @LastEditors: wenyiqian
 * @LastEditTime: 2025-01-21 14:01:33
 * @Description: 组别带图表的树形选择ui组件
 */
import { FolderFilled, FolderOpenFilled } from '@ant-design/icons';
import { TreeSelect } from 'antd';

export default ({ ...config }) => {
  return (
    <TreeSelect
      treeLine={{}}
      switcherIcon={(props) =>
        props.expanded ? (
          <FolderOpenFilled className="tree_group_icon" />
        ) : (
          <FolderFilled rotate={360} className="tree_group_icon" />
        )
      }
      {...config}
    />
  );
};
