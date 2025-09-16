import { StarFilled, StarOutlined, SyncOutlined } from '@ant-design/icons';
import { executeApi } from '@asset360/apis/appCommon';
import CustomTree from '@asset360/components/CustomTree';
import SearchInputWithQuickSelect from '@asset360/components/SearchInputWithQuickSelect';
import { Button, Col, Row, Space, Spin } from 'antd-v5';
import { useGetHeight } from 'iblive-base';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from '../index.less';

const ATTENTION_LOCAL_STORAGE_KEY = 'market_index_attention_obj';

export default ({
  selectedMarket,
  marketList,
  setSelectedMarket,
  setMarketList,
}) => {
  const treeWrapperRef = useRef();
  const treeWrapperHeight = useGetHeight(
    treeWrapperRef.current,
    300,
    8,
    document.getElementById('content_container'),
  );
  const [loading, setLoading] = useState(false);
  const [filterValue, setFilterValue] = useState();
  const [attentionObj, setAttentionObj] = useState();
  const showData = useMemo(() => {
    return filterValue
      ? (marketList || []).filter(
          (item) =>
            item.indexCode.includes(filterValue) ||
            item.indexName.includes(filterValue),
        )
      : marketList || [];
  }, [filterValue, marketList]);
  // 关注
  const getAttentionObj = () => {
    return JSON.parse(
      localStorage.getItem(ATTENTION_LOCAL_STORAGE_KEY) || '{}',
    );
  };
  const addAttentionObjItem = (e, indexCode) => {
    e.stopPropagation();
    const localHistory = { ...attentionObj, [indexCode]: true };
    setAttentionObj(localHistory);
    localStorage.setItem(
      ATTENTION_LOCAL_STORAGE_KEY,
      JSON.stringify(localHistory),
    );
  };
  const removeAttentionObjItem = (e, indexCode) => {
    e.stopPropagation();
    const localHistory = { ...attentionObj };
    delete localHistory[indexCode];
    setAttentionObj(localHistory);
    localStorage.setItem(
      ATTENTION_LOCAL_STORAGE_KEY,
      JSON.stringify(localHistory),
    );
  };
  // 获取列表
  const getList = async () => {
    setLoading(true);
    const res = await executeApi({
      serviceId: 'APEX_INDEX_INFORMATION',
    });
    const list = res?.data?.eventData || [];
    setMarketList(list);
    if (selectedMarket === undefined) {
      setSelectedMarket(list[0]?.interCode);
    }
    setLoading(false);
  };

  useEffect(() => {
    setAttentionObj(getAttentionObj());
    getList();
  }, []);

  return (
    <>
      <Space className={styles.tree_filtrator}>
        <SearchInputWithQuickSelect
          localStorageKey="market_index_search_history"
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          inputConfig={{
            className: styles.search_input,
          }}
        />
        <Button
          title="刷新"
          type="text"
          icon={<SyncOutlined spin={loading} />}
          onClick={getList}
        />
      </Space>
      <div ref={treeWrapperRef}>
        <Spin spinning={loading}>
          <CustomTree
            selectedKeys={[selectedMarket]}
            className={styles.market_tree}
            height={treeWrapperHeight}
            treeData={showData}
            showIcon={false}
            fieldNames={{ key: 'interCode', title: 'indexName' }}
            titleRender={(record) => (
              <Row
                justify="space-between"
                align="middle"
                className={styles.tree_item}
                gutter={8}
              >
                <Col flex={1}>
                  <div className={styles.tree_item_code}>
                    {record.indexCode}
                  </div>
                  <div className={styles.tree_item_name}>
                    {record.indexName}
                  </div>
                </Col>
                <Col>
                  {attentionObj?.[record.indexCode] ? (
                    <StarFilled
                      className={styles.tree_item_attention_icon}
                      title="取消关注"
                      onClick={(e) =>
                        removeAttentionObjItem(e, record.indexCode)
                      }
                    />
                  ) : (
                    <StarOutlined
                      className={styles.tree_item_icon}
                      title="关注"
                      onClick={(e) => addAttentionObjItem(e, record.indexCode)}
                    />
                  )}
                </Col>
              </Row>
            )}
            onSelect={(keys) => setSelectedMarket(keys[0])}
          />
        </Spin>
      </div>
    </>
  );
};
