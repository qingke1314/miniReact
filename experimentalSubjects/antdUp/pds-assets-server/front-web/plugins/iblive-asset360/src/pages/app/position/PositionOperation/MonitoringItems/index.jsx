/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-14 10:54:31
 * @LastEditTime: 2024-12-16 14:48:31
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 */

import { queryByPage, removeMonitorRuleItem } from '@asset360/apis/monitorRule';
import add from '@asset360/assets/app/position/add.svg';
import CustomCard from '@asset360/components/CustomCard';
import {
  Col,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Space,
  Typography,
} from 'antd';
import { useGetHeight } from 'iblive-base';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import PositionButton from '../../components/PositionButton';
import PositionImg from '../../components/PositionImg';
import PositionTable from '../../components/PositionTable';
import EditModal from './components/EditModal';
const STATUS_OBJ = [
  {
    label: '有效',
    value: 1,
  },
  {
    label: '无效',
    value: 0,
  },
];
const pageSize = 15;
export default () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [detail, setDetail] = useState({
    visible: false,
    info: {},
  });
  // 表格尺寸
  const tableWrapperRef = useRef();
  const tableWrapperHeight = useGetHeight(tableWrapperRef.current, 300);
  const tableHeight =
    total > pageSize ? tableWrapperHeight - 64 : tableWrapperHeight - 16;
  const getData = async (page) => {
    setLoading(true);
    const params = form.getFieldsValue();
    const object = {
      page,
      size: pageSize,
      ...params,
    };
    const res = await queryByPage(object);
    setData(res?.records || []);
    setTotal(res?.totalRecord || 0);
    setCurrent(page);
    setLoading(false);
  };

  useEffect(() => {
    getData(1);
  }, []);

  const columns = [
    {
      dataIndex: 'name',
      title: '监控项名称',
    },
    {
      dataIndex: 'indexCode',
      title: '监控项代码',
    },
    {
      dataIndex: 'updatedBy',
      title: '维护人',
    },
    {
      dataIndex: 'updateTime',
      title: '维护时间',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      dataIndex: 'sequence',
      title: '监控项顺序',
    },
    {
      dataIndex: 'status',
      title: '状态',
      render: (text) =>
        STATUS_OBJ.find((item) => item.value == text)?.label || '',
    },
    {
      dataIndex: 'executeCron',
      title: '调度cron',
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
          >
            编辑
          </Typography.Link>
          <Popconfirm
            placement="top"
            title={'是否删除该监控项'}
            okText="是"
            cancelText="否"
            onConfirm={async () => {
              const res = await removeMonitorRuleItem(record.id);
              if (res?.code > 0) {
                message.success('删除成功');
                getData(current);
              }
            }}
          >
            <Typography.Link style={{ color: '#ED4D67' }}>删除</Typography.Link>
          </Popconfirm>
        </Space>
      ),
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
              <Form.Item name="nameOrCode" style={{ marginBottom: 0 }}>
                <Input
                  allowClear
                  size="small"
                  placeholder="监控项名称或代码"
                  style={{ height: 28, width: 200 }}
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
        </Space>
      </div>

      <CustomCard bodyStyle={{ padding: 8 }}>
        <div ref={tableWrapperRef}>
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
          />
        </div>
      </CustomCard>
      <EditModal
        {...detail}
        onCancel={() => {
          setDetail({
            visible: false,
            info: {},
          });
        }}
        callback={() => getData(current)}
      />
    </div>
  );
};
