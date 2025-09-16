/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-12-26 17:35:59
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-12-27 10:23:45
 * @Description:
 */
import { CheckCircleFilled, PlusOutlined } from '@ant-design/icons';
import CustomTree from '@asset360/components/CustomTree';
import { Button, Col, Dropdown, Input, message, Row, Space } from 'antd';
import { useMemo, useState } from 'react';
import styles from '../index.less';

export default ({
  selectedMarket,
  controlGroup,
  marketList,
  toggleControlGroup,
  getChartWrapper,
}) => {
  const [filterValue, setFilterValue] = useState();
  const showData = useMemo(() => {
    return filterValue
      ? (marketList || []).filter(
          (item) =>
            item.indexCode.includes(filterValue) ||
            item.indexName.includes(filterValue),
        )
      : marketList || [];
  }, [filterValue, marketList]);

  const onSelect = (keys, { node }) => {
    if (node.interCode === selectedMarket) return;
    const key = keys[0];
    if (controlGroup?.length === 4 && !controlGroup.includes(key)) {
      message.warn({
        content: '最多添加4条指数',
        getContainer: getChartWrapper,
      });
      return;
    }
    toggleControlGroup(key);
  };

  return (
    <Dropdown
      trigger={['click']}
      overlay={
        <div className="blank-card-asset" onClick={(e) => e.stopPropagation()}>
          <Input.Search
            className={styles.search_input}
            value={filterValue}
            onSearch={setFilterValue}
          />
          <CustomTree
            selectedKeys={[selectedMarket]}
            height={300}
            treeData={showData}
            showIcon={false}
            className={styles.dropdown_tree}
            fieldNames={{ key: 'interCode', title: 'indexName' }}
            titleRender={(record) => (
              <Row justify="space-between" align="middle">
                <Col>
                  <Space size={16}>
                    {record.indexCode}
                    {record.indexName}
                  </Space>
                </Col>
                {(controlGroup || []).includes(record.interCode) && (
                  <Col>
                    <CheckCircleFilled className={styles.checked_icon} />
                  </Col>
                )}
              </Row>
            )}
            onSelect={onSelect}
          />
        </div>
      }
    >
      <Button icon={<PlusOutlined />} type="primary">
        指数比较
      </Button>
    </Dropdown>
  );
};
