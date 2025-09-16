/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-08-19 10:19:31
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-08 17:24:51
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\AssetInventory\views\ClearanceRecord.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { executeApi } from '@asset360/apis/appCommon';
import OverviewTable from '@asset360/components/VirtualTable';
import { Button, Col, Form, Input, Radio, Row, Select, Space } from 'antd';
import { requestUtils } from 'iblive-base';
import { debounce } from 'lodash';
import { useEffect, useState, useRef } from 'react';
import styles from '../../index.less';
import { useSelector } from 'react-redux';
import TableColumnFilter from './TableColumnFilter';

const exportUrlObj = {
  gupiao: '/assets360/stock/exportStockList',
  zhaiquan: '/assets360/bond/exportBondList',
  jijinlicai: '/assets360/totasset/exportTotAssetList',
  huigou: '/assets360/repo/exportRepoList',
  qihuo: '/assets360/futures/exportFuturesList',
  cunkuan: '/assets360/deposit/exportDepositList',
  qita: '/assets360/other/exportOtherList',
  xianjin: '/assets360/cash/exportCashList',
  yingshou: '/assets360/recvAndPay/exportReceivableList',
  yingfu: '/assets360/recvAndPay/exportPayableList',
};

export default function RTAnalysis({
  selectTreeKey,
  productCode,
  height,
  combinationList,
  combination,
  setCombination,
  rightCardVisible,
  sameStyleList,
  columnsObj,
  unit,
  setUnit,
  setTableSecCode,
  setRightCardVisible,
  date,
  // activedTab,
  tabledataRef,
  refrshFlag,
  selectedRows,
  setSelectedRows,
}) {
  const { astUnitId } = useSelector((state) => state.asset360AssetLayout);
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [dimension, setDimension] = useState('ALL');
  const [tableColumnFilter, setTableColumnFilter] = useState([]); //表格列控制/排序
  const [column, setColumn] = useState();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [expandableAll, setExpandableAll] = useState(false);
  const { DownloadFile } = requestUtils;
  // 引用表格的滚动容器 用于记录十秒轮询前表格滚动位置
  const tableWrapperRef = useRef(null); // 用于引用表格的外部包裹元素
  // 滚动位置
  const scrollPositionRef = useRef(0);
  const [searchForm] = Form.useForm();

  const handleTableUpdate = async (isNeedLoading) => {
    if (tableWrapperRef.current) {
      const scrollableBody = tableWrapperRef.current.querySelector(
        '.privateAntd-table-body',
      );
      if (scrollableBody) {
        // 保存它的滚动位置
        scrollPositionRef.current = scrollableBody.scrollTop;
      }
    }
    isNeedLoading && setTableLoading(true);
    let serviceId;
    switch (selectTreeKey) {
      case 'gupiao':
        serviceId = 'DD_API_MUTUAL_STOCK_ANALYSIS_INTRADAY';
        break;
      case 'zhaiquan':
        serviceId = 'DD_API_MUTUAL_BOND_ANALYSIS_INTRADAY';
        break;
      case 'jijinlicai':
        serviceId = 'DD_API_MUTUAL_TOT_ASSET_ANALYSIS_INTRADAY';
        break;
      case 'huigou':
        serviceId = 'DD_API_MUTUAL_REPO_ANALYSIS_INTRADAY';
        break;
      case 'qihuo':
        serviceId = 'DD_API_MUTUAL_FUTURES_ANALYSIS_INTRADAY';
        break;
      case 'qiquan':
        serviceId = 'DD_API_MUTUAL_OPTIONS_ANALYSIS_INTRADAY';
        break;
      case 'qita':
        serviceId = 'DD_API_MUTUAL_OTHER_ANALYSIS_INTRADAY';
        break;
      case 'cunkuan':
        serviceId = 'DD_API_MUTUAL_DEPOSIT_ANALYSIS_INTRADAY';
        break;
      case 'xianjin':
        serviceId = 'DD_API_MUTUAL_CASH_ANALYSIS_INTRADAY';
        break;
      case 'yingshou':
        serviceId = 'DD_API_ASSET_RECEIVABLE';
        break;
      case 'yingfu':
        serviceId = 'DD_API_ASSET_PAYABLE';
        break;
      default:
        break;
    }
    const { secCodeOrName } = searchForm.getFieldsValue();
    const res = await executeApi({
      serviceId,
      data: {
        fundCode: productCode,
        // businDate: Number(moment(date).format('yyyyMMDD')),
        type: dimension === 'ALL' ? undefined : dimension,
        secCodeOrName: secCodeOrName,
        astUnitId,
        combiCode:
          selectTreeKey !== 'xianjin' ? combination ?? undefined : undefined,
      },
    });
    const data = res?.records?.filter((item) => item.currentQty !== 0);
    //过滤掉持仓数量为0数据
    setTableData(data);
    tabledataRef.current = data;
    isNeedLoading && setTableLoading(false);
  };

  // 如果使用layoutEffect，表格内部虚拟滚动还未计算完毕，导致与layout effect冲突
  useEffect(() => {
    if (tableWrapperRef.current) {
      const scrollableBody = tableWrapperRef.current.querySelector(
        '.privateAntd-table-body',
      );
      if (scrollableBody) {
        scrollableBody.scrollTop = scrollPositionRef.current;
      }
    }
  }, [tableData]);

  const onTableSecName = (record) => {
    setTableSecCode(record?.interCode);
    setRightCardVisible(true);
  };

  const tableExpandAll = (value) => {
    if (value) {
      const keys = [];
      tabledataRef.current.forEach((item) => {
        keys.push(item.key);
      });
      setExpandedRowKeys(keys);
    } else {
      setExpandedRowKeys([]);
    }
    setExpandableAll(value);
  };

  const handleExport = () => {
    let requestURL = exportUrlObj[selectTreeKey];
    DownloadFile(requestURL, {
      method: 'GET',
      params: {
        fundCode: productCode,
        type: dimension === 'ALL' ? undefined : dimension, //股票 债券独有
      },
    });
  };

  useEffect(() => {
    if (productCode) {
      setExpandedRowKeys([]);
      handleTableUpdate(true);
    }
  }, [date, productCode, selectTreeKey, combination, dimension, astUnitId]);

  //表格列动态切换
  useEffect(() => {
    let finalColumn =
      columnsObj[
        ['qihuo', 'qita', 'qiquan']?.includes(selectTreeKey)
          ? 'qihuo'
          : ['yingshou', 'yingfu']?.includes(selectTreeKey)
          ? 'yingshou'
          : selectTreeKey
      ];
    //表格列控制和排序功能
    if (tableColumnFilter?.length > 0) {
      let tableOrderobject = {};
      finalColumn.filter(
        (item) =>
          tableColumnFilter.includes(item.title) || item.dataIndex === 'index', //表头全展开和过滤功能冲突,序号index特殊处理
      );
      tableColumnFilter.forEach((item, index) => {
        tableOrderobject[item] = index;
      });
      finalColumn.forEach((item) => {
        item.index = tableOrderobject?.[item.title];
      });
      finalColumn.sort((a, b) => a.index - b.index);
    }
    //控制序号的+显影
    if (dimension && dimension !== 'ALL') {
      setExpandedRowKeys([]);
      setExpandableAll(false);
      finalColumn[0].title = (
        <span>
          <PlusSquareOutlined
            className={styles.table_expand_icon}
            onClick={() => tableExpandAll(true)}
          />{' '}
          序号
        </span>
      );
    } else {
      finalColumn[0].title = '序号';
    }

    setColumn([...finalColumn]);
  }, [tableColumnFilter, selectTreeKey, unit, dimension]);

  useEffect(() => {
    if (!column || dimension === 'ALL') return;
    column[0].title = (
      <span>
        {expandableAll ? (
          <MinusSquareOutlined
            className={styles.table_expand_icon}
            onClick={() => tableExpandAll(false)}
          />
        ) : (
          <PlusSquareOutlined
            className={styles.table_expand_icon}
            onClick={() => tableExpandAll(true)}
          />
        )}{' '}
        序号
      </span>
    );
    setColumn([...column]);
  }, [expandableAll]);

  //定时器触发的查询不需要loading效果
  useEffect(() => {
    if (productCode) {
      handleTableUpdate();
    }
  }, [refrshFlag]);

  useEffect(() => {
    //切换菜单时 重置维度状态
    if (selectTreeKey === 'gupiao' || selectTreeKey === 'zhaiquan') {
      setDimension('ALL');
    } else {
      dimension && setDimension();
    }
  }, [selectTreeKey]);

  return (
    <div style={{ padding: '0 8px' }}>
      <Form form={searchForm}>
        <Row
          justify="space-between"
          gutter={[0, 8]}
          align="middle"
          className="m-b-8"
        >
          <Col flex={1}>
            <Row gutter={8}>
              {!['gupiao', 'zhaiquan', 'xianjin'].includes(selectTreeKey) && (
                <Col>
                  <Space align="center">
                    <span
                      style={{
                        color: 'var(--important-text-color)',
                      }}
                    >
                      组合:
                    </span>
                    <Select
                      style={{ width: rightCardVisible ? 90 : 160 }}
                      options={combinationList}
                      allowClear
                      value={combination}
                      onChange={setCombination}
                    />
                  </Space>
                </Col>
              )}
              {['gupiao', 'zhaiquan'].includes(selectTreeKey) && (
                <Col style={{ marginTop: rightCardVisible ? 6 : 0 }}>
                  <Space>
                    维度 :
                    <Radio.Group
                      size={rightCardVisible ? 'small' : ''}
                      value={dimension}
                      optionType="button"
                      buttonStyle="solid"
                      onChange={(e) => setDimension(e.target.value)}
                    >
                      {selectTreeKey === 'gupiao' ? (
                        <>
                          <Radio value="ALL">全部</Radio>
                          <Radio value="INDUSTRIES_CLASS">行业</Radio>
                          <Radio value="PE">PE</Radio>
                          <Radio value="PB">PB</Radio>
                          <Radio value="MA">盘子</Radio>
                        </>
                      ) : (
                        <>
                          <Radio value="ALL">全部</Radio>
                          <Radio value="OUTER_APPRAISE">外部评级</Radio>
                          <Radio value="INSIDE_APPRAISE">内部评级</Radio>
                          <Radio value="EXIST_LIMITE">期限</Radio>
                          <Radio value="MATURITY">久期</Radio>
                        </>
                      )}
                    </Radio.Group>
                  </Space>
                </Col>
              )}
            </Row>
          </Col>
          <Col>
            <Row justify="end" gutter={[4, 4]}>
              {sameStyleList.includes(selectTreeKey) && (
                <>
                  <Col>
                    <Form.Item
                      name="secCodeOrName"
                      style={{ marginBottom: 0 }}
                      label="证券内码/名称"
                    >
                      <Input
                        style={{
                          width: rightCardVisible ? 60 : 160,
                        }}
                        onChange={debounce(() => handleTableUpdate(true), 100)}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      shouldUpdate={(prevValue, curValue) =>
                        prevValue.secCodeOrName !== curValue.secCodeOrName
                      }
                      noStyle
                    >
                      {({ getFieldValue }) => {
                        const secCodeOrName = getFieldValue('secCodeOrName');
                        return (
                          secCodeOrName && (
                            <Col>
                              <a
                                style={{
                                  marginBottom: 0,
                                  lineHeight: '33px',
                                  fontWeight: 'bold',
                                }}
                                onClick={() => {
                                  searchForm.resetFields();
                                  handleTableUpdate(true);
                                }}
                              >
                                取消筛选
                              </a>
                            </Col>
                          )
                        );
                      }}
                    </Form.Item>
                  </Col>
                </>
              )}
              <Col style={{ marginTop: rightCardVisible ? '4px' : '' }}>
                <Space>
                  单位 :
                  <Radio.Group
                    size={rightCardVisible ? 'small' : ''}
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    optionType="button"
                    buttonStyle="solid"
                  >
                    <Radio value={1}>元</Radio>
                    <Radio value={10000}>万</Radio>
                    <Radio value={100000000}>亿</Radio>
                  </Radio.Group>
                </Space>
              </Col>
              <Col style={{ marginTop: rightCardVisible ? '4px' : '' }}>
                <Button
                  style={{ margin: '0 5px' }}
                  size={rightCardVisible ? 'small' : 'middle'}
                  onClick={() => handleExport()}
                >
                  导出
                </Button>
              </Col>
              <Col>
                <TableColumnFilter
                  selectTreeKey={selectTreeKey}
                  treeDataList={
                    columnsObj[
                      ['qihuo', 'qita', 'qiquan']?.includes(selectTreeKey)
                        ? 'qihuo'
                        : ['yingshou', 'yingfu']?.includes(selectTreeKey)
                        ? 'yingshou'
                        : selectTreeKey
                    ]
                  }
                  setTableColumnFilter={setTableColumnFilter}
                  tableColumnFilter={tableColumnFilter}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
      <div ref={tableWrapperRef}>
        <OverviewTable
          dataSource={tableData}
          loading={tableLoading}
          rowKey={(record) => (record?.key ? record.key : undefined)}
          height={`calc(${height}px - 180px)`}
          columns={column}
          indentSize={0}
          pagination={false} // 该页面表格不要分页
          rowClassName={(record) => {
            return record?.name ? styles.table_sort : '';
          }}
          onRow={(record) => {
            return {
              onClick: () =>
                ['gupiao', 'zhaiquan', 'huigou'].includes(selectTreeKey) &&
                !record?.name &&
                onTableSecName(record),
            };
          }}
          expandable={{
            expandedRowKeys: expandedRowKeys,
            onExpand: (expanded, record) => {
              if (expanded) {
                expandedRowKeys.push(record.key);
                setExpandedRowKeys(expandedRowKeys);
              } else {
                setExpandedRowKeys(
                  expandedRowKeys.filter((item) => record.key !== item),
                );
              }
            },
          }}
          rowSelection={{
            selectedRowKeys: (selectedRows || []).map((item) => item.key),
            onChange: (_, rows) => setSelectedRows(rows),
            checkStrictly: false,
          }}
        />
      </div>
    </div>
  );
}
