/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-06-28 15:02:52
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 * @LastEditTime: 2025-01-02 10:32:25
 * @Description:
 */
import { SyncOutlined } from '@ant-design/icons';
import {
  queryEmailTemplatesByPage,
  removeEmailTemplate,
} from '@asset360/apis/positionEmailTemplate';
import add from '@asset360/assets/app/position/add.svg';
import CustomCard from '@asset360/components/CustomCard';
import { Col, Form, Input, message, Popconfirm, Row, Space } from 'antd';
import { useGetHeight } from 'iblive-base';
import { debounce } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import PositionButton from '../../components/PositionButton';
import PositionIcon from '../../components/PositionIcon';
import PositionImg from '../../components/PositionImg';
import PositionTable from '../../components/PositionTable';
import { WARN_LEVEL } from '../PositionEvents/CONST';
import styles from './index.less';
import EmailTemplateModal from './views/EmailTemplateModal';

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
  const [showEditModal, setShowEditModal] = useState({ visible: false });
  const searchValues = useRef();
  // 表格数据
  const [data, setData] = useState();
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  // 表格尺寸
  const tableWrapperRef = useRef();
  const tableWrapperHeight = useGetHeight(tableWrapperRef.current, 300);
  const tableHeight =
    total > pageSize ? tableWrapperHeight - 64 : tableWrapperHeight - 16;

  const columns = [
    {
      title: '模板名称',
      dataIndex: 'name',
    },
    {
      title: '预警级别',
      dataIndex: 'warnLevel',
      render: (text) =>
        WARN_LEVEL.find((item) => item.value === text)?.label || text,
    },
    {
      title: '预警指标',
      dataIndex: 'indexCode',
    },
    {
      title: '执行Cron',
      dataIndex: 'executeCron',
    },
    {
      dataIndex: 'status',
      title: '状态',
      render: (text) =>
        STATUS_OBJ.find((item) => item.value == text)?.label || '',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      width: 300,
      render: (text) => (
        <span
          className={styles.table_span_ellipsis}
          style={{ '--width': '300px' }}
          title={text}
        >
          {text}
        </span>
      ),
    },

    {
      title: '操作',
      dataIndex: 'operations',
      width: 120,
      render: (text, record) => (
        <Space>
          <a onClick={() => setShowEditModal({ visible: true, record })}>
            编辑
          </a>
          <Popconfirm
            title="确认删除改模板？"
            onConfirm={() => deleteTemplate(record.id)}
            className={styles.danger_text}
          >
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const deleteTemplate = async (id) => {
    const res = await removeEmailTemplate({ id });
    if (res?.code === 1) {
      message.success('邮件模板删除成功');
      updateData(current);
    }
  };

  const updateData = async (current) => {
    setLoading(true);
    const res = await queryEmailTemplatesByPage({
      size: pageSize,
      page: current,
      ...(searchValues.current || {}),
    });
    setData(res?.records || []);
    setTotal(res?.totalRecord || 0);
    setCurrent(current);
    setLoading(false);
  };

  const onValuesChange = (changeValues, values) => {
    searchValues.current = values;
    updateData(1);
  };

  useEffect(() => {
    updateData(1);
  }, []);
  return (
    <>
      <Row
        gutter={[8, 8]}
        style={{ width: '100%' }}
        className="m-t-8 m-b-8"
        align="bottom"
      >
        <Col flex={1}>
          <Form
            onValuesChange={debounce(
              (changeValues, values) => onValuesChange(changeValues, values),
              100,
            )}
          >
            <Space>
              <Form.Item
                label="模板名称"
                name="name"
                style={{ marginBottom: 0 }}
              >
                <Input allowClear />
              </Form.Item>
            </Space>
          </Form>
        </Col>

        <Col>
          <PositionButton
            icon={<PositionImg imgSrc={add} />}
            func={() => setShowEditModal({ visible: true })}
            text="新增"
          />
        </Col>
        <Col>
          <PositionButton
            icon={<PositionIcon icon={<SyncOutlined spin={loading} />} />}
            text="刷新"
            onClick={() => updateData(current)}
          />
        </Col>
      </Row>
      <CustomCard bodyStyle={{ padding: 8 }}>
        <div ref={tableWrapperRef}>
          <PositionTable
            total={total}
            pageSize={pageSize}
            columns={columns}
            dataSource={data}
            loading={loading}
            current={current}
            rowKey="id"
            height={tableHeight > 300 ? tableHeight : 300}
            onPageChange={(current) => updateData(current)}
          />
        </div>
      </CustomCard>
      <EmailTemplateModal
        {...showEditModal}
        onCancel={() => setShowEditModal({ visible: false })}
        callback={() => updateData(current)}
      />
    </>
  );
};
