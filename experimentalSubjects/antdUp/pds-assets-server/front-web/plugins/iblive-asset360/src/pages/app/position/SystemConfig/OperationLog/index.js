/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-06-13 09:19:54
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-07-04 09:01:17
 * @Description:
 */
import { SyncOutlined } from '@ant-design/icons';
import { getAuditLogByPage } from '@asset360/apis/position';
import { getAllUsers } from '@asset360/apis/user';
import CustomCard from '@asset360/components/CustomCard';
import { Col, DatePicker, Form, Row, Select, Space, Tag } from 'antd';
import { useGetHeight } from 'iblive-base';
import { useEffect, useRef, useState } from 'react';
import PositionButton from '../../components/PositionButton';
import PositionIcon from '../../components/PositionIcon';
import PositionTable from '../../components/PositionTable';

const pageSize = 15;
const OP_TYPE_LIST = [
  {
    label: '新增',
    value: 'SAVE',
    color: 'green',
  },
  {
    label: '修改',
    value: 'UPDATE',
    color: 'blue',
  },
  {
    label: '删除',
    value: 'REMOVE',
    color: 'red',
  },
  {
    label: '导入',
    value: 'IMPORT',
    color: 'purple',
  },
  {
    label: '导出',
    value: 'EXPORT',
    color: 'lime',
  },
];

export default function OperationLog() {
  const [userList, setUserList] = useState([]);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  const searchValue = useRef({});
  const [form] = Form.useForm();
  // 表格尺寸
  const tableWrapperRef = useRef();
  const tableWrapperHeight = useGetHeight(tableWrapperRef.current, 300);
  const tableHeight =
    total > pageSize ? tableWrapperHeight - 64 : tableWrapperHeight - 16;

  const columns = [
    {
      title: '操作模块',
      dataIndex: 'module',
      with: 200,
    },
    {
      title: '操作时间',
      dataIndex: 'opTime',
      width: 200,
    },
    {
      title: '操作类型',
      dataIndex: 'opType',
      width: 80,
      render: (text) => {
        const info = OP_TYPE_LIST.find((item) => item.value === text);
        return <Tag color={info?.color}>{info?.label ?? text}</Tag>;
      },
    },
    {
      title: '操作详情',
      dataIndex: 'details',
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      width: 200,
    },
    {
      title: '操作人',
      dataIndex: 'userAcc',
      width: 100,
      render: (text) =>
        (userList || []).find((item) => item.userAcc === text)?.userName ??
        text,
    },
  ];

  const updateList = async (pageNumber) => {
    setCurrent(pageNumber);
    setLoading(true);
    const res = await getAuditLogByPage({
      pageNumber,
      pageSize,
      ...(searchValue.current || {}),
    });
    setList(res?.records || []);
    setTotal(res?.totalRecord || 0);
    setLoading(false);
  };

  const onSearch = () => {
    const { timeRange, ...values } = form.getFieldsValue();
    searchValue.current = {
      ...values,
      startTime: timeRange?.[0]?.format
        ? timeRange[0].format('YYYYMMDDHHmmss')
        : undefined,
      endTime: timeRange?.[1]?.format
        ? timeRange[1].format('YYYYMMDDHHmmss')
        : undefined,
    };
    updateList(1);
  };

  const getUserList = async () => {
    const res = await getAllUsers();
    setUserList(res?.records || []);
  };

  useEffect(() => {
    updateList(1);
    getUserList();
  }, []);

  return (
    <>
      <Form form={form} onValuesChange={onSearch}>
        <Row
          gutter={[8, 8]}
          className="m-b-8 m-t-8"
          justify="space-between"
          align="middle"
          style={{ width: '100%' }}
        >
          <Col>
            <Space>
              <Form.Item
                name="userAcc"
                label="操作人"
                style={{ marginBottom: 0 }}
              >
                <Select
                  style={{ minWidth: 200 }}
                  allowClear
                  options={userList}
                  fieldNames={{
                    label: 'userName',
                    value: 'userAcc',
                  }}
                />
              </Form.Item>
              <Form.Item
                name="timeRange"
                label="时间"
                style={{ marginBottom: 0 }}
              >
                <DatePicker.RangePicker showTime allowClear />
              </Form.Item>
            </Space>
          </Col>
          <Col>
            <PositionButton
              text="更新"
              func={() => updateList(current)}
              icon={<PositionIcon icon={<SyncOutlined spin={loading} />} />}
            />
          </Col>
        </Row>
      </Form>
      <CustomCard bodyStyle={{ padding: '8px' }}>
        <div ref={tableWrapperRef}>
          <PositionTable
            scroll={{ x: 'max-content' }}
            pageSize={pageSize}
            columns={columns}
            current={current}
            total={total}
            dataSource={list}
            loading={loading}
            height={tableHeight > 300 ? tableHeight : 300}
            onPageChange={updateList}
          />
        </div>
      </CustomCard>
    </>
  );
}
