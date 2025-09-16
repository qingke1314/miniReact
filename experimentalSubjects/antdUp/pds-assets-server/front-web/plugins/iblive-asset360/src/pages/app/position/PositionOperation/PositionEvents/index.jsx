/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-13 10:34:44
 * @LastEditTime: 2025-02-26 17:01:18
 * @LastEditors: guoxuan
 */
import {
  DeleteOutlined,
  RollbackOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import {
  queryEventRecordsByPage,
  removeEventRecords,
} from '@asset360/apis/positionEventRecord';
import { getAllUsers } from '@asset360/apis/user';
import bulkOperation from '@asset360/assets/app/position/bulkOperation.svg';
import CustomCard from '@asset360/components/CustomCard';
import OperationColunm from '@asset360/components/OperationColunm';
import {
  Col,
  DatePicker,
  Form,
  message,
  Popconfirm,
  Row,
  Space,
  Tag,
} from 'antd';
import { desensitization, useGetHeight } from 'iblive-base';
import { useEffect, useRef, useState } from 'react';
import styles from '../../components/index.less';
import PositionButton from '../../components/PositionButton';
import PositionIcon from '../../components/PositionIcon';
import PositionImg from '../../components/PositionImg';
import PositionSelect from '../../components/PositionSelect';
import PositionTable from '../../components/PositionTable';
import { EVENT_STATUS_LIST, EVENT_TYPE_LIST } from './CONST';
import DetailModal from './DetailModal';
import pageStyles from './index.less';

const pageSize = 15;
export default () => {
  const [form] = Form.useForm();
  const [userList, setUserList] = useState();
  const userObj = {};
  (userList || []).forEach((item) => {
    userObj[item.userAcc] = item.userName;
  });
  // 批量操作
  const [showBatchSelection, setShoeBatchSelection] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState();
  // 表格数据
  const [data, setData] = useState();
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  const [detailInfo, setDetailInfo] = useState({
    visible: false,
    eventId: '',
  });
  // 表格尺寸
  const tableWrapperRef = useRef();
  const tableWrapperHeight = useGetHeight(tableWrapperRef.current, 300);
  const tableHeight =
    total > pageSize ? tableWrapperHeight - 64 : tableWrapperHeight - 16;
  const columns = [
    {
      dataIndex: 'eventType',
      title: '事件类型',
    },
    {
      dataIndex: 'content',
      title: '事件内容',
      ellipsis: true,
      width: 400,
    },
    {
      dataIndex: 'fundName',
      title: '产品代码/名称',
      ellipsis: true,
      width: 400,
      render: (text, record) => {
        const str = (record?.warningDetails || [])
          .map(
            (item) =>
              `${desensitization(item.fundCode)}/${desensitization(
                item.fundName,
              )}`,
          )
          .join('、');
        return (
          <span className={pageStyles.table_cell} title={str}>
            {str}
          </span>
        );
      },
    },
    {
      dataIndex: 'warnUser',
      title: '通知人',
      ellipsis: true,
      width: 400,
      render: (text) => {
        const str = text?.length
          ? text.map((userAcc) => userObj[userAcc] || userAcc).join('、')
          : '';
        return str;
      },
    },
    {
      dataIndex: 'createdTime',
      title: '通知时间',
    },
    {
      dataIndex: 'eventStatus',
      title: '消息投递状态',
      render: (text, record) => {
        const info = EVENT_STATUS_LIST.find((item) => item.value === text);
        return (
          info && (
            <>
              <Tag color={info.color}>{info.label}</Tag>
              {text === 'FAIL' && <span>{record.failCause}</span>}
            </>
          )
        );
      },
    },
    {
      dataIndex: 'operation',
      title: '操作',
      fixed: 'right',
      render: (text, record) => (
        <OperationColunm
          showDetail={true}
          detailFunc={() => {
            setDetailInfo({
              visible: true,
              eventId: record.id,
            });
          }}
        />
      ),
    },
  ];

  const toggleShowBatchSelection = () => {
    setShoeBatchSelection((pre) => !pre);
    setSelectedRowKeys();
  };
  const onPageChange = (current) => {
    updateData(current);
    setSelectedRowKeys();
  };
  const getUserList = async () => {
    const res = await getAllUsers();
    setUserList(res?.records || []);
  };
  const updateData = async (current) => {
    setLoading(true);
    const { eventType, warnUser, dateRange } = form.getFieldsValue();
    const res = await queryEventRecordsByPage({
      size: pageSize,
      page: current,
      eventType,
      warnUser,
      startTime: dateRange?.[0]
        ? dateRange[0].startOf('day').format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      endTime: dateRange?.[1]
        ? dateRange[1].endOf('day').format('YYYY-MM-DD HH:mm:ss')
        : undefined,
    });
    setCurrent(current);
    setLoading(false);
    setTotal(res?.totalRecord || 0);
    setData(res?.records || []);
  };
  const removeEvents = async () => {
    const res = await removeEventRecords(selectedRowKeys);
    if (res?.code === 1) {
      message.success('批量删除成功');
      updateData(current);
    }
  };

  useEffect(() => {
    updateData(1);
    getUserList();
  }, []);

  return (
    <div className="m-t-8">
      <Row align="middle" justify="space-between" className="m-b-8">
        <Form form={form} onValuesChange={() => updateData(1)}>
          <Row gutter={8}>
            <Col>
              <Form.Item name="eventType" style={{ marginBottom: 0 }}>
                <PositionSelect options={EVENT_TYPE_LIST} text={'事件类型'} />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="warnUser" style={{ marginBottom: 0 }}>
                <PositionSelect
                  options={userList}
                  fieldNames={{
                    label: 'userName',
                    value: 'userAcc',
                  }}
                  text={'通知人'}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="dateRange" style={{ marginBottom: 0 }}>
                <DatePicker.RangePicker
                  style={{ height: 28 }}
                  placeholder={['发生开始时间', '发生结束时间']}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Space>
          <PositionButton
            text={'刷新'}
            icon={<PositionIcon icon={<SyncOutlined spin={loading} />} />}
            func={() => updateData(current)}
          />
          {showBatchSelection ? (
            <>
              <Popconfirm
                className={styles.popconfirm_button}
                title={`确认删除选中的${selectedRowKeys?.length}个事件`}
                onConfirm={removeEvents}
              >
                <PositionButton
                  text={'批量删除'}
                  icon={<PositionIcon icon={<DeleteOutlined />} />}
                  disabled={!selectedRowKeys?.length}
                  className={styles.position_button_danger}
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
      </Row>

      <CustomCard bodyStyle={{ padding: 8 }} style={{ border: 'none' }}>
        <div ref={tableWrapperRef}>
          <PositionTable
            scroll={{ x: 1800 }}
            total={total}
            pageSize={pageSize}
            columns={columns}
            dataSource={data}
            loading={loading}
            current={current}
            rowSelection={
              showBatchSelection
                ? {
                    selectedRowKeys,
                    onChange: setSelectedRowKeys,
                  }
                : undefined
            }
            onPageChange={onPageChange}
            rowKey="id"
            height={tableHeight > 300 ? tableHeight : 300}
          />
        </div>
      </CustomCard>

      <DetailModal
        {...detailInfo}
        userObj={userObj}
        onCancel={() => {
          setDetailInfo({
            visible: false,
            eventId: '',
          });
        }}
      />
    </div>
  );
};
