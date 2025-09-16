/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-06-13 15:00:33
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 * @LastEditTime: 2024-10-30 11:31:04
 * @Description:
 */
import { SyncOutlined } from '@ant-design/icons';
import { querySystemCfg, updateSystemCfg } from '@asset360/apis/position';
import save from '@asset360/assets/app/position/save.svg';
import CustomCard from '@asset360/components/CustomCard';
import { Col, Input, message, Row, Space, Tabs } from 'antd';
import { useGetHeight } from 'iblive-base';
import { debounce } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import PositionButton from '../../components/PositionButton';
import PositionIcon from '../../components/PositionIcon';
import PositionImg from '../../components/PositionImg';
import PositionTable from '../../components/PositionTable';
import styles from './index.less';

const pageSize = 14;
const columns = [
  {
    title: '参数代码',
    dataIndex: 'code',
    formItemProps: {
      rules: [{ required: true, message: '参数代码不能为空' }],
    },
    editable: (text, record) => !record.codeReadonly,
  },
  {
    title: '参数名称',
    dataIndex: 'name',
    formItemProps: {
      rules: [{ required: true, message: '参数名称不能为空' }],
    },
  },
  {
    title: '参数值',
    dataIndex: 'value',
    formItemProps: {
      rules: [{ required: true, message: '参数值不能为空' }],
    },
  },
  {
    title: '操作',
    valueType: 'option',
    width: 80,
  },
];

const TYPE_LIST = [
  {
    label: '系统指标',
    value: 'SYSTEM_INDEX',
  },
  {
    label: '系统参数',
    value: 'SYSTEM_PARAMS',
  },
  {
    label: '业务参数',
    value: 'BUSIN_PARAMS',
  },
];
export default () => {
  const searchValue = useRef();
  const [list, setList] = useState([]);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editableKeys, setEditableRowKeys] = useState();
  const [saving, setSaving] = useState(false);
  const tableRef = useRef();
  const [type, setType] = useState(TYPE_LIST[0].value);
  // 表格尺寸
  const tableWrapperRef = useRef();
  const tableWrapperHeight = useGetHeight(tableWrapperRef.current, 300);
  const tableHeight =
    total > pageSize ? tableWrapperHeight - 110 : tableWrapperHeight - 62;

  const updateList = async () => {
    setLoading(true);
    const res = await querySystemCfg({ type, name: searchValue.current });
    const keys = [];
    const newList = (res?.records || []).map((item) => {
      const id = Math.random();
      keys.push(id);
      return {
        ...item,
        id,
        codeReadonly: true,
      };
    });
    setTotal(newList.length);
    setList(newList);
    setEditableRowKeys(keys);
    setLoading(false);
  };

  const saveList = () => {
    setSaving(true);
    tableRef.current.validateFields().then(async () => {
      setSaving(true);
      const res = await updateSystemCfg({
        // eslint-disable-next-line
        list: list.map(({ id, codeReadonly, ...values }) => ({
          ...values,
          type,
        })),
        type: type,
      });
      if (res?.code === 1) {
        message.success('参数保存成功');
        // 相同id直接设置list，可编辑表格不会有变化，所以用该模式设置。保存后的code不可编辑
        tableRef.current.setFields(
          list.map((item) => ({
            name: item.id,
            value: { ...item, codeReadonly: true },
          })),
        );
        setList((pre) => pre.map((item) => ({ ...item, codeReadonly: true })));
      }
      setSaving(false);
    });
    setSaving(false);
  };

  const onSearch = (value) => {
    searchValue.current = value;
    setCurrent(1);
    updateList();
  };

  useEffect(() => {
    setCurrent(1);
    searchValue.current = undefined;
    updateList();
  }, [type]);

  return (
    <>
      <Tabs activeKey={type} onChange={setType} className={styles.type_tabs}>
        {TYPE_LIST.map((item) => (
          <Tabs.TabPane tab={item.label} key={item.value} />
        ))}
      </Tabs>
      <Row
        gutter={8}
        justify="space-between"
        className="m-b-8"
        style={{ width: '100%' }}
      >
        <Col>
          <Input
            placeholder="参数名称"
            onChange={debounce((e) => onSearch(e.target.value), 100)}
            allowClear
          />
        </Col>
        <Col>
          <Space>
            <PositionButton
              text="刷新"
              icon={<PositionIcon icon={<SyncOutlined spin={loading} />} />}
              func={() => updateList()}
            />
            <PositionButton
              loading={saving}
              text="保存"
              icon={<PositionImg imgSrc={save} />}
              func={saveList}
            />
          </Space>
        </Col>
      </Row>
      <CustomCard bodyStyle={{ padding: 8 }}>
        <div ref={tableWrapperRef}>
          <PositionTable
            isEditable
            pageSize={pageSize}
            columns={columns}
            total={total}
            loading={loading}
            rowKey="id"
            value={list}
            current={current}
            editable={{
              type: 'multiple',
              editableKeys,
              actionRender: (row, config, defaultDoms) => {
                return [defaultDoms.delete];
              },
              onValuesChange: (record, recordList) => {
                setTotal(recordList?.length);
                setList(recordList);
              },
              onChange: (keys) => {
                setEditableRowKeys(keys);
              },
            }}
            recordCreatorProps={{
              position: 'bottom',
              newRecordType: 'dataSource',
              record: () => ({
                id: Math.random(),
              }),
            }}
            editableFormRef={tableRef}
            height={tableHeight > 300 ? tableHeight : 300}
            onPageChange={setCurrent}
          />
        </div>
      </CustomCard>
    </>
  );
};
