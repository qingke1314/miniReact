/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-14 12:54:31
 * @LastEditTime: 2024-09-14 16:54:39
 * @LastEditors: chenzongjun chenzongjun@apexsoft.com.cn
 */

import {
  queryDictTreeByCode,
  removePositionDict,
  updatePositionDict,
} from '@asset360/apis/positionDict';
import CustomModal from '@asset360/components/CustomModal';
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Select,
  Space,
  Typography,
} from 'antd-v5';
import { useEffect, useState } from 'react';
import PositionTable from '../../../components/PositionTable';
import DictModal from './DictModal';

const EditableCell = ({
  editing,
  dataIndex,
  inputType,
  children,
  options,
  rules,
  ...restProps
}) => {
  const inputNode =
    inputType === 'select' ? (
      <Select options={options} />
    ) : inputType === 'inputNumber' ? (
      <InputNumber min={0} />
    ) : (
      <Input />
    );
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={rules}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default ({
  visible,
  onCancel,
  setTypes,
  formatArray,
  types,
  tabKey,
}) => {
  const [form] = Form.useForm();

  const [searchForm] = Form.useForm();

  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [dictVisible, setDictVisible] = useState(false);

  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = (record) => {
    form.validateFields().then(async (values) => {
      const res = await updatePositionDict({
        ...record,
        ...values,
      });
      if (res?.code > 0) {
        message.success('修改成功');
        setEditingKey('');
        getData();
      }
    });
  };

  const formatData = (array) => {
    if (array?.length > 0) {
      return array.map((item) => ({
        ...item,
        children: formatData(item.children),
      }));
    } else {
      return null;
    }
  };

  const getData = async () => {
    setLoading(true);
    const res = await queryDictTreeByCode({
      code: tabKey,
    });
    setData(formatData([res?.data]));
    setTypes(formatArray([res?.data]) || []);
    setLoading(false);
  };

  const columns = [
    {
      dataIndex: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'code',
      title: '字典代码',
    },

    {
      dataIndex: 'name',
      title: '字典名称',
      editable: true,
      rules: [{ required: true, message: '字典名称不能为空' }],
    },
    {
      dataIndex: 'status',
      title: '状态',
      inputType: 'select',
      editable: true,
      render: (text, record) =>
        editingKey == record.id ? text : text == 1 ? '有效' : '无效',
      options: [
        {
          label: '有效',
          value: 1,
        },
        {
          label: '无效',
          value: 0,
        },
      ],
    },
    {
      dataIndex: 'sequence',
      title: '字典顺序',
      editable: true,
      inputType: 'inputNumber',
    },
    {
      dataIndex: 'remarks',
      title: '备注',
      editable: true,
    },
    {
      dataIndex: 'operation',
      title: '操作',
      width: '150px',
      render: (text, record) => (
        <Space>
          {isEditing(record) ? (
            <>
              <Typography.Link
                onClick={() => save(record)}
                style={{ color: '#186DF5' }}
              >
                保存
              </Typography.Link>
              <Popconfirm title="是否取消" onConfirm={cancel}>
                <Typography.Link style={{ color: '#186DF5' }}>
                  取消
                </Typography.Link>
              </Popconfirm>
            </>
          ) : (
            <Typography.Link
              style={{ color: '#186DF5' }}
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
            >
              编辑
            </Typography.Link>
          )}
          <Divider type="vertical" style={{ marginLeft: 0, marginRight: 0 }} />

          <Popconfirm
            placement="top"
            title={'是否删除该字典'}
            okText="是"
            cancelText="否"
            onConfirm={async () => {
              const res = await removePositionDict(record.id);
              if (res?.code > 0) {
                message.success('删除成功');
                getData();
              }
            }}
          >
            <Typography.Link
              style={{ color: '#EF5350' }}
              disabled={editingKey !== ''}
            >
              删除
            </Typography.Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        options: col.options,
        rules: col.optirulesons,
        editing: isEditing(record),
      }),
    };
  });

  useEffect(() => {
    if (visible) {
      getData();
    }
  }, [visible]);

  return (
    <>
      <CustomModal
        title={tabKey == 'TRADE' ? '交易维度' : '估值维度'}
        width="75vw"
        footer={null}
        visible={visible}
        onCancel={onCancel}
        maskClosable={false}
        afterClose={() => {}}
        destroyOnClose
      >
        <Form form={searchForm}>
          <Space>
            <Form.Item
              label={'字典名称'}
              name="name"
              style={{ marginBottom: 8 }}
            >
              <Input placeholder="请输入字典名称" allowClear />
            </Form.Item>

            <Form.Item
              label={'字典代码'}
              name="code"
              style={{ marginBottom: 8 }}
            >
              <Input placeholder="请输入字典代码" allowClear />
            </Form.Item>

            <Button
              type="default"
              onClick={() => {}}
              style={{ marginBottom: 8 }}
            >
              查询
            </Button>

            <Button
              type="primary"
              onClick={() => {
                setEditingKey('');
                setDictVisible(true);
              }}
              style={{ marginBottom: 8 }}
            >
              新增
            </Button>
          </Space>
        </Form>

        <Form form={form}>
          <PositionTable
            dataSource={data}
            columns={mergedColumns}
            loading={loading}
            size="small"
            rowKey="id"
            components={{
              body: {
                cell: EditableCell,
              },
            }}
          />
        </Form>
      </CustomModal>

      <DictModal
        visible={dictVisible}
        onCancel={() => {
          setDictVisible(false);
        }}
        callback={getData}
        types={types}
      />
    </>
  );
};
