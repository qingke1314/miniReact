/*
 * @Author: guoxuan
 * @Date: 2025-02-14 09:39:01
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-14 09:48:41
 * @Description:
 */
/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2023-12-06 14:28:28
 * @LastEditTime: 2024-11-11 15:14:07
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 */
import {
  queryDynamicExecuteHistory,
  queryExecuteHistory,
} from '@asset360/apis/lastResult';
import { queryAllRiskGroupList } from '@asset360/apis/riskGroup';
import { queryByProductCode } from '@asset360/apis/riskItem';
import OverviewTable from '@asset360/components/OverviewTable';
import OverviewTabs from '@asset360/components/OverviewTabs';
import { Badge, Descriptions, Empty, List, Space, Tabs, Tag } from 'antd-v5';
import { useGetHeight } from 'iblive-base';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { COMPARE_DIRECTION } from './CONST';
import styles from './index.less';
import DetailModal from './views/DetailModal';

const array = [
  {
    label: '禁止',
    color: 'red',
    code: 'FORBID',
  },
  {
    label: '预警',
    color: 'orange',
    code: 'WARN',
  },
  {
    label: '送审',
    color: 'blue',
    code: 'AUDIT',
  },
  {
    label: '合规',
    color: 'green',
    code: 'COMPLIANCE',
  },
];

const pageSize = 10;
export default ({}) => {
  const [data, setData] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [resultColumn, setResultColumn] = useState([]);
  const [items, setItems] = useState([]);
  const [resultCurrent, setResultCurrent] = useState(1);
  const [resultCode, setResultCode] = useState('');
  const [resultTotal, setResultTotal] = useState(0);
  const { productCode } = useSelector((state) => state.asset360AssetLayout);
  const [showDetail, setShowDetail] = useState({
    visible: false,
    detail: {},
    label: '',
  });
  const [showMenu, setShowMenu] = useState({
    visible: false,
    menu: [],
    label: '',
  });
  const [showModal, setShowModal] = useState({
    visible: false,
    valueinfo: {},
  }); // 显示新增、重命名modal
  const [activedTab, setActivedTab] = useState('1');
  const tabWrapper = useRef();
  const tabContentHeight = useGetHeight(
    tabWrapper.current,
    100,
    80,
    tabWrapper.current,
  );
  const onOpenModal = (info) => setShowModal({ visible: true, info });

  const oncloseModal = () => setShowModal({ visible: false });

  const queryAllData = async () => {
    const res = await queryDynamicExecuteHistory(productCode, '', '');
    setData(res?.records);
  };

  const queryResultData = async (item, page) => {
    const res = await queryExecuteHistory(
      productCode,
      page || resultCurrent,
      pageSize,
      item.code,
      '',
      'SUCCESS',
    );
    setResultData(res?.records);
    setResultTotal(res?.totalRecords);
    setResultCurrent(page);
    setResultCode(item.code);
    const object = res?.records?.[0]?.params;
    if (object) {
      const resultExtraColunm = Object.keys(object)?.map((item) => {
        let value = object[item]?.toString();
        return {
          dataIndex: item,
          title: item,
          width: 180,
          render: () => (
            <div
              style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                width: 164,
              }}
              title={value}
            >
              {value}
            </div>
          ),
        };
      });
      setResultColumn([...resultExtraColunm, ...columns2]);
    } else {
      setResultColumn(columns2);
    }
  };

  const getAllRiskGroup = async () => {
    const groupRes = await queryAllRiskGroupList();
    const groups = groupRes?.records || [];
    const listRes = await queryByProductCode(161614);
    const lists = listRes?.records || [];
    const items = [];
    groups.map((group) => {
      const children = lists
        .filter((list) => list?.basicConfig?.riskGroupId === group.id)
        ?.map((list) => {
          const { name, code, description } = list?.basicConfig;
          const {
            thresholdList,
            compareDirection,
            compareUnit,
          } = list?.thresholdConfig;
          const values = thresholdList.map((threshold) => {
            let unit = compareUnit === 'PERCENT' ? '%' : '';
            return {
              value: `${threshold.value}${unit}`,
              operation: array.find((item) => item.code === threshold.operation)
                ?.label,
            };
          });
          return {
            label: name,
            code,
            compareDirection,
            description,
            values,
          };
        });
      items.push({
        label: group?.name,
        children,
      });
    });
    setItems(items);
  };

  const columns1 = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (text, record, index) =>
        (resultCurrent - 1) * pageSize + index + 1,
    },
    // {
    //   title: '流水序号',
    //   dataIndex: 'id',
    // },
    {
      title: '风险代码',
      dataIndex: 'code',
    },
    {
      title: '规则名称',
      dataIndex: 'name',
    },
    {
      title: '风控类型',
      dataIndex: 'riskGroupName',
    },
    // {
    //   title: '风控说明',
    //   dataIndex: 'description',
    // },
    {
      title: '触发时间',
      dataIndex: 'executeTime',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '阈值',
      dataIndex: 'setValue',
    },
    {
      title: '实际值',
      dataIndex: 'result',
    },
    // {
    //   title: '比较方向',
    //   dataIndex: 'compareDirection',
    //   render: (text) =>
    //     text
    //       ? COMPARE_DIRECTION.find((item) => item.value === text)?.label
    //       : '--',
    // },
    // {
    //   title: '触警操作',
    //   dataIndex: 'operation',
    //   render: (text) => {
    //     const object = array.find((item) => item.code === text);
    //     return <Tag color={object?.color}>{object?.label}</Tag>;
    //   },
    // },
    // {
    //   title: '风控等级',
    //   dataIndex: 'riskLevel',
    // },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <a
          onClick={() => {
            onOpenModal(record);
          }}
        >
          查看详情
        </a>
      ),
    },
  ];

  const columns2 = [
    {
      title: '临近控制值',
      dataIndex: 'setValue',
    },
    {
      title: '结果值',
      dataIndex: 'result',
    },
    {
      title: '触警操作',
      dataIndex: 'operation',
      render: (text) => {
        const object = array.find((item) => item.code === text);
        return <Tag color={object?.color}>{object?.label}</Tag>;
      },
    },
  ];

  useEffect(() => {
    queryAllData(1);
  }, [productCode]);

  useEffect(() => {
    getAllRiskGroup();
  }, []);

  return (
    <div
      className="blank-card-asset"
      ref={tabWrapper}
      style={{
        marginTop: 8,
        height: 'calc(100% - 8px)',
        minHeight: 'fit-content',
      }}
    >
      <OverviewTabs
        activeKey={activedTab}
        onChange={setActivedTab}
        tabBarExtraContent={{
          right: activedTab === '1' && (
            <Space>
              {array.map((item) => (
                <Space key={item.label}>
                  {item.label}
                  <Badge style={{ marginLeft: 8 }} color={item.color} />
                </Space>
              ))}
            </Space>
          ),
        }}
      >
        <Tabs.TabPane tab="产品风险预警" key="1">
          <OverviewTable
            columns={columns1}
            dataSource={data}
            style={{ marginTop: 8, overflow: 'auto' }}
            height={tabContentHeight}
            pagination={false}
          />

          <DetailModal
            visible={!!showModal.visible}
            info={showModal?.info}
            onCancel={oncloseModal}
            columns={columns1}
            array={array}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="风险条目详情" key="2">
          <div
            style={{
              display: 'flex',
              minHeight: 250,
              alignItems: 'flex-start',
              marginTop: -4,
            }}
          >
            <div style={{ width: '35%', display: 'flex' }}>
              <List
                header={null}
                footer={null}
                bordered
                style={{
                  marginTop: 8,
                  width: '50%',
                  maxHeight: tabContentHeight,
                  overflow: 'auto',
                }}
                size="small"
                dataSource={items}
                renderItem={(item) => (
                  <List.Item
                    className={`${styles.first_list_item} ${
                      item.label === showMenu?.label
                        ? styles.first_list_item_actived
                        : ''
                    } `}
                    onClick={() => {
                      if (item.label !== showMenu?.label) {
                        setShowMenu({
                          visible: true,
                          label: item.label,
                          menu: item.children,
                        });
                        setShowDetail({
                          visible: false,
                          label: '',
                          menu: {},
                        });
                      }
                    }}
                    title={item.label}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <div
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          width: '100%',
                        }}
                      >
                        {item.label}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Badge count={item.children.length} />
                      </div>
                    </div>
                  </List.Item>
                )}
              />

              {showMenu.visible ? (
                <List
                  header={null}
                  footer={null}
                  bordered
                  style={{
                    marginTop: 8,
                    width: '50%',
                    marginLeft: 2,
                    maxHeight: tabContentHeight,
                    overflow: 'auto',
                    background: 'rgba(24, 109, 245, .1)',
                  }}
                  size="small"
                  dataSource={showMenu.menu}
                  renderItem={(item) => (
                    <List.Item
                      className={`${styles.second_list_item} ${
                        item.label === showDetail?.label
                          ? styles.second_list_item_actived
                          : ''
                      } `}
                      onClick={() => {
                        setShowDetail({
                          visible: true,
                          detail: {
                            ...item,
                          },
                          label: item.label,
                        });
                        queryResultData(item, 1);
                      }}
                      title={item.label}
                    >
                      <div
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          width: '100%',
                        }}
                      >
                        {item.label}
                      </div>
                    </List.Item>
                  )}
                />
              ) : null}
            </div>

            <div
              style={{
                width: '65%',
                marginLeft: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {showDetail?.visible ? (
                <div
                  className="blank-card-asset"
                  style={{ marginTop: 8, padding: 8 }}
                >
                  <div className="important_title">条目基础配置</div>
                  <Descriptions style={{ marginTop: 8 }} size="small">
                    <Descriptions.Item label="风控名称" span={3}>
                      {showDetail?.detail?.label}
                    </Descriptions.Item>
                    <Descriptions.Item label="风控说明" span={3}>
                      {showDetail?.detail?.description}
                    </Descriptions.Item>
                    <Descriptions.Item label="风控代码" span={2}>
                      {showDetail?.detail?.code}
                    </Descriptions.Item>

                    <Descriptions.Item label="比较方向">
                      {
                        COMPARE_DIRECTION.find(
                          (item) =>
                            item.value === showDetail?.detail?.compareDirection,
                        )?.label
                      }
                    </Descriptions.Item>
                  </Descriptions>
                  {showDetail?.detail?.values ? (
                    <OverviewTable
                      columns={[
                        {
                          dataIndex: 'value',
                          title: '阈值',
                        },
                        {
                          dataIndex: 'operation',
                          title: '触警操作',
                          render: (text) => {
                            const color = array.find(
                              (item) => item.label === text,
                            )?.color;
                            return <Tag color={color}>{text}</Tag>;
                          },
                        },
                      ]}
                      dataSource={showDetail?.detail?.values || []}
                      pagination={false}
                      size="small"
                      bordered={false}
                      showTotal={false}
                    />
                  ) : null}

                  <div className="important_title">结果比对</div>

                  <OverviewTable
                    columns={resultColumn}
                    dataSource={resultData}
                    style={{ marginTop: 8 }}
                    total={resultTotal}
                    pageSize={10}
                    onPageChange={(pageNum) =>
                      queryResultData(resultCode, pageNum)
                    }
                    showTotal={false}
                  />
                </div>
              ) : (
                <Empty />
              )}
            </div>
          </div>
        </Tabs.TabPane>
      </OverviewTabs>
    </div>
  );
};
