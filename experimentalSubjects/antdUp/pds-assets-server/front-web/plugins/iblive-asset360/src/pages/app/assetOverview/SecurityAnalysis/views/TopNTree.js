/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-26 09:38:08
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2025-02-05 09:50:59
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\OverView\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { DownOutlined } from '@ant-design/icons';
import { executeApi } from '@asset360/apis/appCommon';
import CustomTree from '@asset360/components/CustomTree';
import SearchRecordHistorySelector from '@asset360/components/SearchRecordHistorySelector';
import { history, useLocation } from '@umijs/max';
import { Radio, Row, Space, Spin } from 'antd';
import { moneyFormat, useGetRequestCancelOperation } from 'iblive-base';
import { useEffect, useRef, useState } from 'react';
import styles from '../index.less';

let current = 0;
let oldTree = [];
let realFilterValue = '';
export default function TopNTree({
  height,
  onSelectIndex,
  detailInfo,
  setDetailInfo,
  type,
  setType,
}) {
  const { state, pathname } = useLocation();
  const initInterCode = useRef();
  const [filterValue, setFilterValue] = useState();
  const [filterOption, setFilterOption] = useState();
  const [filterLoading, setFilterLoading] = useState();
  const {
    getRequestCancelSignal,
    breakRequest,
  } = useGetRequestCancelOperation();
  const [tree, setTree] = useState([]);
  const [treeLoading, setTreeLoading] = useState(false);
  const treeRef = useRef(null);

  const getItems = async (page, secCodeOrName, requestConfig) => {
    const serviceId =
      type == 'GP'
        ? 'DD_API_COMPANY_STOCK_TOPN_INFO'
        : 'DD_API_COMPANY_BOND_TOPN_INFO';
    const res = await executeApi(
      {
        serviceId,
        data: {
          page,
          secCodeOrName,
        },
      },
      requestConfig,
    );
    const array = (res?.records || []).map((item) => ({
      isLeaf: true,
      title: item.secName,
      key: item.interCode,
      fundCount: item.fundCount,
      assetRatio: item.assetRatio,
      icon: null,
      secType: type,
      numb: item.numb,
    }));
    return array;
  };

  const getSearchOptions = async (value) => {
    if (!value) return;
    setFilterLoading(true);
    // 中断上次查询
    breakRequest();
    const signal = getRequestCancelSignal();
    const array = await getItems(0, value, { signal });
    setFilterOption(array);
    setFilterLoading(false);
  };

  const selectFilterOption = (value, option) => {
    setFilterValue(value);
    if (option) {
      onSelectIndex(option);
    }
    init(value);
  };

  const getLeftData = async (page) => {
    setTreeLoading(true);
    const array = await getItems(page, realFilterValue);
    if (page == 0) {
      !detailInfo && setDetailInfo(array[0]);
    }

    const newArray = Array.from(
      new Set([...oldTree, ...array].map(JSON.stringify)),
    ).map(JSON.parse);
    setTreeLoading(false);
    setTree(newArray);
    current = page;
    oldTree = newArray;
  };

  const init = (value) => {
    if (initInterCode.current) {
      realFilterValue = initInterCode.current;
      initInterCode.current = undefined;
    } else {
      realFilterValue = value;
    }
    treeRef.current.scrollTop = 0;
    oldTree.length = 0;
    setTree([]);
    getLeftData(0);
  };
  useEffect(() => {
    if (state?.interCode) {
      initInterCode.current = state.interCode;
      if (state.type !== type) {
        changeTab(state.type);
      } else {
        init();
      }
      history.push(pathname, {}); // 清空path state
    } else {
      init();
    }
  }, [type]);

  const handleScroll = async () => {
    let isLoading = false;
    const { scrollHeight, scrollTop, clientHeight } = treeRef.current;
    if (scrollTop != 0) {
      if (scrollHeight - (scrollTop + clientHeight) < 2 && !isLoading) {
        isLoading = true;
        await getLeftData(current + 1); // 获取更多数据
        setTimeout(() => {
          isLoading = false;
        }, 5000);
      }
    }
  };

  const changeTab = (value) => {
    setType(value);
    setFilterValue(null);
    realFilterValue = '';
  };
  // 监听滚动事件
  useEffect(() => {
    if (treeRef.current) {
      treeRef.current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (treeRef.current) {
        treeRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const returnIcon = (index) => {
    return (
      <div
        style={{
          background: '#EEEEEE',
          height: 24,
          width: 24,
          textAlign: 'center',
          color: '#777777',
          borderRadius: 50,
        }}
      >
        {index}
      </div>
    );
  };

  return (
    <>
      <div className={styles.tree_radio}>
        <Radio.Group
          size="small"
          value={type}
          onChange={(e) => changeTab(e.target.value)}
        >
          <Radio.Button value={'GP'}>股票TOP</Radio.Button>
          <Radio.Button value={'ZQ'}>债券TOP</Radio.Button>
        </Radio.Group>
      </div>

      <div style={{ padding: '0px 8px 8px 8px' }}>
        <SearchRecordHistorySelector
          selectConfig={{
            style: {
              width: '100%',
              minWidth: 'fit-content',
              maxWidth: 300,
            },
            loading: filterLoading,
            fieldNames: { value: 'key', label: 'title' },
            filterOption: () => true,
          }}
          value={filterValue}
          localStorageKey={`security_analysis_${type}_search_history`}
          onChangeValue={selectFilterOption}
          optionMainKey="key"
          rootOptiions={filterOption}
          onSearch={getSearchOptions}
        />
      </div>
      <Spin spinning={treeLoading}>
        <div ref={treeRef} style={{ height: height - 89, overflow: 'auto' }}>
          <CustomTree
            treeData={tree}
            blockNode
            icon={null}
            selectedKeys={[detailInfo?.key]}
            defaultExpandAll
            onSelect={(_, { selectedNodes }) => onSelectIndex(selectedNodes[0])}
            expandAction={false}
            switcherIcon={<DownOutlined />}
            className={`${styles.tree}`}
            titleRender={(record) => {
              const title = record.title;
              const count = record.fundCount;
              const assetRatio = record.assetRatio;
              return (
                <Row
                  justify="space-between"
                  align="middle"
                  className={styles.tree_title_wrap}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {returnIcon(record.numb)}
                    <div className={styles.title} style={{ marginLeft: 8 }}>
                      <div>{title}</div>
                      {assetRatio ? (
                        <div className="m-t-4">
                          {moneyFormat({
                            num: assetRatio * 100 || 0,
                            unit: '%',
                          })}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {count == 0 || !count ? null : (
                    <Space align="center">
                      <div
                        className={
                          record.key == detailInfo.key
                            ? styles.tree_title_number_active
                            : styles.tree_title_number
                        }
                        style={{ fontSize: count > 99 ? '12px' : '14px' }}
                      >
                        <span>{count || 0}</span>
                      </div>
                    </Space>
                  )}
                </Row>
              );
            }}
          />
        </div>
      </Spin>
    </>
  );
}
