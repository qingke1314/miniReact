/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-12 16:28:06
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-26 09:33:25
 * @FilePath: \invest-index-server-front\src\pages\monitor\CashPosition\views\CashForecast\EditModal.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  getTradeDetail,
  queryTradeDetailPositionList,
} from '@asset360/apis/position';
import CustomTree from '@asset360/components/CustomTree';
import { Input, Radio, Space, Tabs } from 'antd';
import {
  desensitization,
  filterTree,
  ResizableContainers,
  useGetHeight,
} from 'iblive-base';
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import PositionTable from '../../components/PositionTable';
import styles from '../index.less';

const TABLIST = [
  {
    name: 'T+0',
    key: 't0List',
  },
  {
    name: 'T+1',
    key: 't1List',
  },
  {
    name: 'T+2',
    key: 't2List',
  },
  {
    name: 'T+3',
    key: 't3List',
  },
];
const kyzjColor = '#999';
const zjlrColor = '#ff0000a6';
const zjlcColor = '#20d08cbf';
const pageSize = 10;
export default ({
  headerRender,
  paramsForList,
  date,
  positionLink,
  setUpdateDate,
}) => {
  const [tree, setTree] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [treeLoading, setTreeLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [type, setType] = useState('T+0');
  const [detailInfo, setDetailInfo] = useState({ key: '', name: '', code: '' });
  const [expandedKeys, setExpandedKeys] = useState([]);
  const tableWrapperRef = useRef();
  const [ruleType, setRuleType] = useState('');
  const tableWrapperHeight = useGetHeight(tableWrapperRef.current, 300);
  const tableHeight = tableWrapperHeight - 135;

  const [filterValue, setFilterValue] = useState();
  const contentRef = useRef();
  const height = useGetHeight(contentRef.current, 100, 8);
  const treeHeight = height > 148 ? height - 98 : 100;

  const changeRuleType = (type) => {
    setRuleType(type);
  };
  const showData = useMemo(() => {
    const filteredTree = filterValue
      ? filterTree(tree, { title: filterValue, realKey: filterValue })
      : tree;
    const finalTree = ruleType
      ? filteredTree.filter((item) => item.businessName === ruleType)
      : filteredTree;
    return finalTree;
  }, [tree, filterValue, ruleType]);

  const udateTreeData = async () => {
    const { headObjectCode, objectCode, parentObjectCode } = paramsForList;
    setTreeLoading(true);
    const res = await queryTradeDetailPositionList({
      fundCode: headObjectCode === 'fund_code' ? objectCode : parentObjectCode,
      astUnitId: headObjectCode === 'ast_unit_code' ? objectCode : undefined,
    });
    const tem = res?.records.map((item) => ({
      ...item,
      title: item.name,
      isLeaf: true,
      selectable: true,
      key: item.id,
      disabled: item.status === '0',
    }));
    // const newTree = convertTreeMenu(tem);
    setTree(tem);
    setTreeLoading(false);
  };

  const getTableData = async (code) => {
    setTableLoading(true);
    const { headObjectCode, objectCode, parentObjectCode } = paramsForList;
    const res = await getTradeDetail({
      positionId: code,
      businDate: moment(date).format('yyyyMMDD'),
      fundCode: headObjectCode === 'fund_code' ? objectCode : parentObjectCode,
      astUnitId: headObjectCode === 'ast_unit_code' ? objectCode : undefined,
      positionLink,
    });
    if (res?.code > 0) {
      setTableData(res?.data?.dataList || []);
      setColumns(
        (res?.data?.header || []).map((item) => ({
          ...item,
          dataIndex: item.key,
          render: (text) => {
            if (item.key == 'fundCode' || item.key == 'fundName') {
              return desensitization(text);
            } else {
              return text;
            }
          },
        })),
      );
    } else {
      setTableData([]);
      setColumns([]);
    }
    setTableLoading(false);
    setUpdateDate(moment().format('yyyy-MM-DD HH:mm:ss'));
  };

  const onSelectIndex = (_, { selectedNodes }) => {
    const { key, name, code, id } = selectedNodes?.[0] || {};
    getTableData(id);
    setDetailInfo({
      key,
      name,
      code,
      id,
    });
  };

  useEffect(() => {
    if (detailInfo?.id) {
      getTableData(detailInfo?.id);
    }
  }, [positionLink]);

  useEffect(() => {
    if (paramsForList) {
      udateTreeData();
    }
  }, [date]);

  useEffect(() => {
    //切换产品时 清空上一个产品信息
    if (paramsForList) {
      setDetailInfo({ key: '', name: '', code: '' });
      setTableData([]);
      setColumns([]);
      udateTreeData();
    }
  }, [paramsForList, date]);

  return (
    <div>
      {headerRender('DealDetail')}
      <div className={styles.deal_drawer}>
        <ResizableContainers
          containdersHeight={'calc(100vh - 180px)'}
          leftDefaultWidth={284}
          leftMinWidth={284}
          leftMaxWidth="60vw"
          leftContent={
            <div ref={contentRef} className={styles.configs_left_content}>
              <div className={styles.dealDetail_search_container}>
                <Space
                  style={{
                    padding: '8px 8px 6px 8px',
                    width: '100%',
                  }}
                  size={0}
                >
                  <Input.Search
                    allowClear
                    placeholder="请输入"
                    onSearch={setFilterValue}
                    loading={treeLoading}
                  />
                </Space>
                <Radio.Group
                  size="small"
                  value={ruleType}
                  onChange={(e) => {
                    changeRuleType(e?.target?.value);
                  }}
                >
                  <Radio.Button value={''}>全部</Radio.Button>
                  <Radio.Button value={'可用资金'}>可用资金</Radio.Button>
                  <Radio.Button value={'资金流入'}>资金流入</Radio.Button>
                  <Radio.Button value={'资金流出'}>资金流出</Radio.Button>
                </Radio.Group>
              </div>

              <CustomTree
                height={treeHeight}
                treeData={showData}
                blockNode
                icon={null}
                selectedKeys={[detailInfo.key]}
                defaultExpandAll
                onSelect={onSelectIndex}
                expandedKeys={expandedKeys}
                onExpand={(e) => {
                  setExpandedKeys(e);
                }}
                titleRender={(record) => {
                  return (
                    <div className={styles.tree_title_wrap}>
                      <span className={styles.tree_title}>{record?.title}</span>
                      <span
                        style={{
                          fontSize: 12,
                          color:
                            record.businessName === '可用资金'
                              ? kyzjColor
                              : record.businessName === '资金流入'
                              ? zjlrColor
                              : zjlcColor,
                          marginLeft: 5,
                        }}
                      >
                        {record.businessName || '--'}
                      </span>
                    </div>
                  );
                }}
              />
            </div>
          }
          rightContent={
            <div
              className={styles.comm_table_container}
              style={{ marginLeft: 10 }}
            >
              <span className={styles.comm_title} style={{ fontSize: 16 }}>
                {detailInfo.name || '--'}
              </span>
              <div ref={tableWrapperRef}>
                <Tabs
                  onChange={(e) => {
                    setType(e);
                  }}
                  activeKey={type}
                  destroyInactiveTabPane={false}
                >
                  {TABLIST.map((item) => (
                    <Tabs.TabPane tab={item.name} key={item.name}>
                      <PositionTable
                        style={{ marginTop: 5 }}
                        pageSize={pageSize}
                        dataSource={tableData?.[item.key]}
                        loading={tableLoading}
                        columns={columns}
                        height={tableHeight > 300 ? tableHeight : 300}
                      />
                    </Tabs.TabPane>
                  ))}
                </Tabs>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};
