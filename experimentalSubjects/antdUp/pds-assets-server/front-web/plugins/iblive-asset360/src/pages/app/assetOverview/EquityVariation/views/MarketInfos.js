/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-11-05 10:13:43
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-11-06 09:52:52
 * @Description:
 */
import { List } from 'antd';
import styles from '../index.less';

const list = new Array(10).fill(
  '发布本次中期现金分红方案:以总股本 205,386,979 股为分配基数，向全体股东每10股派发现金股利 2 元(含税)，共计分配股利 41,077,395.80 元，占 2024 年前三季度合并归属于上市公司股东净利润的 40.58%',
);
export default ({}) => {
  return (
    <>
      <List size="small">
        {list.map((item, index) => (
          <List.Item
            key={index}
            className={styles.list_item}
            title={`顶点软件[603383]：${item}`}
          >
            <div className="important-text">顶点软件[603383]</div>
            <div className="default-text">{item}</div>
          </List.Item>
        ))}
      </List>
    </>
  );
};
