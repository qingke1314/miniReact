/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-11 09:43:05
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 * @LastEditTime: 2024-09-23 09:38:19
 * @FilePath: \invest-index-server-front\src\pages\monitor\CashPosition\views\CatalogTree.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { SyncOutlined } from '@ant-design/icons';
import CustomTree from '@asset360/components/CustomTree';
import { Badge, Button, Input, Radio, Space, Spin } from 'antd';
import { desensitization } from 'iblive-base';
import { useEffect, useState } from 'react';
import styles from '../index.less';
import cashFilterTree from '../utils/cashFilterTree';

export default ({
  height,
  tree,
  treeLoading = false,
  updateTree,
  paramsForList,
  setParamsForList,
  expandedKeys,
  setExpandedKeys,
}) => {
  const [filterValue, setFilterValue] = useState('');
  const [ruleType, setRuleType] = useState('ALL');
  const [notEnoughNumber, setNotEnoughNumber] = useState(0);
  const [positionLessNumber, setPositionLessNumber] = useState(0);
  const [showData, setShowData] = useState([]);

  useEffect(() => {
    const filterTitleTree = cashFilterTree(tree, (item) => {
      const namePass =
        (item.filterTitle || '')
          .toLowerCase()
          .indexOf(`${filterValue ?? ''}`.toLowerCase()) > -1;
      const statusPass = ruleType === 'ALL' ? true : item.status === ruleType;
      return namePass && statusPass;
    });
    setShowData(filterTitleTree);
    setExpandedKeys(Array.from(new Set([-1, -2, ...expandedKeys])));
  }, [tree, filterValue, ruleType]);

  useEffect(() => {
    const allData = [
      ...(tree[0]?.children || []),
      ...(tree[1]?.children || []),
    ];
    const newNotEnoughNumber = cashFilterTree(allData, (item) => {
      const namePass =
        (item.filterTitle || '')
          .toLowerCase()
          .indexOf(`${filterValue ?? ''}`.toLowerCase()) > -1;
      const statusPass = item.status === 'POSITION_NOT_ENOUGH';
      return namePass && statusPass;
    });
    const newPositionLessNumber = cashFilterTree(allData, (item) => {
      const namePass =
        (item.filterTitle || '')
          .toLowerCase()
          .indexOf(`${filterValue ?? ''}`.toLowerCase()) > -1;
      const statusPass = item.status === 'POSITION_LESS';
      return namePass && statusPass;
    });
    setNotEnoughNumber(newNotEnoughNumber.length);
    setPositionLessNumber(newPositionLessNumber.length);
  }, [tree, filterValue]);

  // 选中显示节点
  const onSelectIndex = (selectedKeys, { node = {} }) => {
    const {
      headObjectCode,
      objectCode,
      parentObjectCode,
      title,
      parentTitle,
    } = node;
    setParamsForList({
      key: selectedKeys?.[0],
      objectCode,
      headObjectCode,
      parentObjectCode,
      parentTitle,
      title,
    });
  };

  const changeRuleType = (type) => {
    setRuleType(type);
  };

  return (
    <div className={styles.configs_left_content}>
      <Spin spinning={treeLoading}>
        <div className={styles.search_container}>
          <Space size={0} align="middle" className="m-l-8 m-t-8">
            <Input.Search
              onSearch={(value) => {
                setFilterValue(value.trim());
              }}
              allowClear
              placeholder="请输入"
              style={{ width: 200 }}
            />
            <Button
              type="text"
              icon={
                <SyncOutlined
                  title="更新"
                  className="cursor_pointer"
                  spin={treeLoading}
                  onClick={() => updateTree()}
                />
              }
            />
          </Space>
          <Radio.Group
            size="small"
            value={ruleType}
            onChange={(e) => {
              changeRuleType(e?.target?.value);
            }}
          >
            <Radio.Button value={'ALL'}>全部</Radio.Button>
            <Radio.Button value={'POSITION_NOT_ENOUGH'}>
              {notEnoughNumber == 0 ? (
                '头寸不足'
              ) : (
                <Badge
                  count={notEnoughNumber}
                  offset={[12, 10]}
                  size={'small'}
                  overflowCount={99}
                  showZero
                  color="#ef5350"
                >
                  头寸不足
                </Badge>
              )}
            </Radio.Button>
            <Radio.Button value={'POSITION_LESS'}>
              {positionLessNumber == 0 ? (
                '金额较少'
              ) : (
                <Badge
                  count={positionLessNumber}
                  offset={[12, 10]}
                  size={'small'}
                  overflowCount={99}
                  showZero
                  color="#ff763c"
                >
                  金额较少
                </Badge>
              )}
            </Radio.Button>
          </Radio.Group>
        </div>
        <CustomTree
          height={height > 158 ? height - 88 : 100}
          treeData={showData}
          blockNode
          showIcon={false}
          expandedKeys={expandedKeys}
          selectedKeys={[paramsForList?.key]}
          onSelect={onSelectIndex}
          onExpand={(e) => {
            setExpandedKeys(e);
          }}
          titleRender={(record) => {
            return (
              <div className={styles.tree_title_wrap}>
                <span className={styles.tree_title}>
                  {record.headObjectCode === 'fund_code' &&
                    desensitization(record.objectCode) + ' '}
                  {record.key == '-1' || record.key == '-2'
                    ? record.title
                    : desensitization(record.title)}{' '}
                </span>
                {record.status == 'POSITION_NOT_ENOUGH' ? (
                  <span className={styles.tree_title_status}>
                    {record.warnText || '--'}
                  </span>
                ) : record.status == 'POSITION_LESS' ? (
                  <span className={styles.tree_title_status_2}>
                    {record.warnText || '--'}
                  </span>
                ) : null}
              </div>
            );
          }}
        />
      </Spin>
    </div>
  );
};
