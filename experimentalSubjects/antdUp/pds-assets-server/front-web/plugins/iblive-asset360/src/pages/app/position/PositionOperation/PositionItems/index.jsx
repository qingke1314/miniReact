/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-14 10:54:31
 * @LastEditTime: 2025-02-27 09:40:29
 * @LastEditors: guoxuan
 */

import { DeleteOutlined, RollbackOutlined } from '@ant-design/icons';
import { queryDictTreeByCode } from '@asset360/apis/positionDict';
import {
  queryByPage,
  removeBatch,
  removePositionItem,
} from '@asset360/apis/positionItem';
import add from '@asset360/assets/app/position/add.svg';
import bulkOperation from '@asset360/assets/app/position/bulkOperation.svg';
import classificationMaintenance from '@asset360/assets/app/position/classificationMaintenance.svg';
import CustomCard from '@asset360/components/CustomCard';
import {
  Col,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Space,
  Tabs,
  TreeSelect,
  Typography,
} from 'antd';
import { useGetHeight } from 'iblive-base';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import styles from '../../components/index.less';
import PositionButton from '../../components/PositionButton';
import PositionIcon from '../../components/PositionIcon';
import PositionImg from '../../components/PositionImg';
import PositionTable from '../../components/PositionTable';
import ClassModal from './components/ClassModal';
import EditModal from './components/EditModal';
const pageSize = 15;
export default () => {
  const [form] = Form.useForm();
  const [types, setTypes] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [detail, setDetail] = useState({
    visible: false,
    info: {},
  });

  const [tabKey, setTabKey] = useState('TRADE');
  const itemType = [
    {
      key: 'TRADE',
      label: '交易维度',
    },
    {
      key: 'GZ',
      label: '估值维度',
    },
  ];

  const [classVisible, setClassVisible] = useState(false);
  // 表格尺寸
  const tableWrapperRef = useRef();
  const tableWrapperHeight = useGetHeight(tableWrapperRef.current, 300);
  const tableHeight =
    total > pageSize ? tableWrapperHeight - 64 : tableWrapperHeight - 16;
  const [showBatchSelection, setShowBatchSelection] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const getData = async (page) => {
    setLoading(true);
    const params = form.getFieldsValue();
    const object = {
      page,
      size: pageSize,
      positionType: tabKey,
      ...params,
    };
    const res = await queryByPage(object);
    setSelectedRowKeys([]);
    setData(res?.records || []);
    setTotal(res?.totalRecord || 0);
    setCurrent(page);
    setLoading(false);
  };

  const formatArray = (array) => {
    if (array?.length > 0) {
      return array.map((item) => ({
        value: item.id,
        title: item.name,
        children: formatArray(item.children),
      }));
    } else {
      return [];
    }
  };
  const getDict = async () => {
    const res = await queryDictTreeByCode({
      code: tabKey,
    });
    const array = formatArray([res?.data]);
    setTypes(array);
  };

  useEffect(() => {
    getData(1);
    getDict();
  }, [tabKey]);

  const toggleShowBatchSelection = () => {
    setShowBatchSelection((pre) => !pre);
    setSelectedRowKeys([]);
  };

  const removeItemBatch = async () => {
    const res = await removeBatch(selectedRowKeys);
    if (res?.code > 0) {
      getData(current);
      message.success('删除成功');
      setSelectedRowKeys('');
      setShowBatchSelection(false);
    }
  };

  const columns = [
    {
      dataIndex: 'name',
      title: '头寸项名称',
    },
    {
      dataIndex: 'code',
      title: '头寸项代码',
      render: (text) => text || '--',
    },
    {
      dataIndex: 'businessType',
      title: '业务类别',
      render: (text) => {
        let object = '';
        const queryNode = (children, value) => {
          if (children?.length > 0) {
            children.map((item) => {
              if (item.value == value) {
                object = item;
              } else {
                queryNode(item.children, value);
              }
            });
          }
        };
        queryNode(types, text);
        return object.title || '--';
      },
    },
    {
      dataIndex: 'updatedBy',
      title: '维护人',
    },
    {
      dataIndex: 'updatedTime',
      title: '维护时间',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      dataIndex: 'status',
      title: '状态',
      render: (text) => (text == '1' ? '有效' : '无效'),
    },
    {
      dataIndex: 'sequence',
      title: '头寸项顺序',
    },
    {
      dataIndex: 'indexLevel',
      title: '指标层级',
      render: (text) => (text == '1' ? '原子项' : '复合项'),
    },
    {
      dataIndex: 'operation',
      title: '操作',
      render: (text, record) => (
        <Space>
          <Typography.Link
            style={{ color: '#108EE9' }}
            onClick={() => {
              setDetail({
                visible: true,
                info: {
                  ...record,
                },
              });
            }}
            disabled={showBatchSelection}
          >
            编辑
          </Typography.Link>
          <Popconfirm
            placement="top"
            title={'是否删除该头寸项'}
            okText="是"
            cancelText="否"
            onConfirm={async () => {
              const res = await removePositionItem(record.id);
              if (res?.code > 0) {
                message.success('删除成功');
                getData(current);
              }
            }}
          >
            <Typography.Link
              style={{ color: '#ED4D67' }}
              disabled={showBatchSelection}
            >
              删除
            </Typography.Link>
          </Popconfirm>
        </Space>
      ),
    },
    {
      dataIndex: 'remarks',
      title: '备注',
    },
  ];

  return (
    <div style={{ marginTop: 8 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <Form
          form={form}
          style={{ alignItems: 'center' }}
          onValuesChange={() => {
            getData(1);
          }}
        >
          <Row gutter={8}>
            <Col>
              <Form.Item name="name" style={{ marginBottom: 0 }}>
                <Input
                  allowClear
                  size="small"
                  placeholder="头寸项名称"
                  style={{ height: 28, width: 200 }}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="businessType" style={{ marginBottom: 0 }}>
                <TreeSelect
                  allowClear
                  treeData={types}
                  showSearch
                  placeholder="业务类别"
                  filterTreeNode={(inputValue, node) =>
                    node.title?.indexOf(inputValue) > -1
                  }
                  className={styles.position_select}
                  style={{ width: 175 }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Space>
          <PositionButton
            icon={<PositionImg imgSrc={add} />}
            text={'新增项'}
            func={() => {
              setDetail({
                visible: true,
              });
            }}
          />
          <PositionButton
            icon={<PositionImg imgSrc={classificationMaintenance} />}
            text={'分类维护'}
            func={() => {
              setClassVisible(true);
            }}
          />
          {showBatchSelection ? (
            <>
              <Popconfirm
                title={`确认删除选中的${selectedRowKeys?.length}个头寸项`}
                onConfirm={() => {
                  removeItemBatch();
                }}
              >
                <PositionButton
                  text={'批量删除'}
                  icon={<PositionIcon icon={<DeleteOutlined />} />}
                  disabled={!selectedRowKeys?.length}
                  danger
                />
              </Popconfirm>
              <PositionButton
                text={'退出批量操作'}
                icon={<PositionIcon icon={<RollbackOutlined />} />}
                func={toggleShowBatchSelection}
              />
            </>
          ) : (
            <PositionButton
              icon={<PositionImg imgSrc={bulkOperation} />}
              text={'批量操作'}
              func={toggleShowBatchSelection}
            />
          )}
        </Space>
      </div>

      <CustomCard bodyStyle={{ padding: 8 }} style={{ border: 'none' }}>
        <Tabs
          type="card"
          onChange={(e) => {
            setTabKey(e);
          }}
          activeKey={tabKey}
        >
          {itemType.map((item) => (
            <Tabs.TabPane tab={item.label} key={item.key}>
              <div ref={tableWrapperRef} style={{ marginTop: -8 }}>
                <PositionTable
                  columns={columns}
                  dataSource={data}
                  loading={loading}
                  rowKey="id"
                  current={current}
                  pageSize={pageSize}
                  total={total}
                  height={tableHeight > 300 ? tableHeight : 300}
                  onPageChange={(current) => {
                    getData(current);
                  }}
                  rowSelection={
                    showBatchSelection
                      ? {
                          selectedRowKeys,
                          onChange: setSelectedRowKeys,
                        }
                      : undefined
                  }
                />
              </div>
            </Tabs.TabPane>
          ))}
        </Tabs>
      </CustomCard>
      <EditModal
        {...detail}
        onCancel={() => {
          setDetail({
            visible: false,
            info: {},
          });
        }}
        types={types}
        positionType={tabKey}
        callback={() => getData(current)}
      />

      <ClassModal
        onCancel={() => {
          setClassVisible(false);
        }}
        visible={classVisible}
        setTypes={setTypes}
        types={types}
        formatArray={formatArray}
        tabKey={tabKey}
      />
    </div>
  );
};
