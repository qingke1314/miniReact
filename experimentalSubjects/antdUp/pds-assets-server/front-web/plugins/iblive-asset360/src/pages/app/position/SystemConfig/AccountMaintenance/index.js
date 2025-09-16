/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-06-17 10:12:12
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-12-23 17:18:50
 * @Description:
 */
import { getPositionAuthList } from '@asset360/apis/position';
import { getAllUsers } from '@asset360/apis/user';
import CustomCard from '@asset360/components/CustomCard';
import { Input, Tag } from 'antd';
import { useGetHeight } from 'iblive-base';
import { useEffect, useRef, useState } from 'react';
import PositionTable from '../../components/PositionTable';
import EditModal from './views/EditModal';

const pageSize = 15;
export default function AccountMaintenance() {
  const userAccOrNameRef = useRef();
  const [userObj, setUserObj] = useState();
  // 表格数据
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  // 编辑弹窗
  const [showEditModal, setShowEditModal] = useState({ visible: false });
  // 表格尺寸
  const tableWrapperRef = useRef();
  const tableWrapperHeight = useGetHeight(tableWrapperRef.current, 300);
  const tableHeight =
    total > pageSize ? tableWrapperHeight - 64 : tableWrapperHeight - 16;

  const columns = [
    {
      title: '账号',
      dataIndex: 'userAcc',
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
    },
    {
      title: '用户岗位',
      dataIndex: 'roleName',
    },
    {
      title: '修改头寸项权限',
      dataIndex: 'editPosition',
      width: '10em',
      align: 'center',
      render: (text) =>
        text ? (
          <Tag color="success">开启</Tag>
        ) : (
          <Tag color="default">关闭</Tag>
        ),
    },
    {
      title: '备注',
      dataIndex: 'remarks',
    },
    {
      title: '更新人',
      dataIndex: 'updatedBy',
      render: (text) => userObj?.[text] || text,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedTime',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      render: (text, record) => (
        <>
          <a onClick={() => setShowEditModal({ visible: true, ...record })}>
            编辑
          </a>
        </>
      ),
    },
  ];

  const getUserList = async () => {
    const res = await getAllUsers();
    const obj = {};
    (res?.records || []).forEach((item) => {
      obj[item.userAcc] = item.userName;
    });
    setUserObj(obj);
  };

  const updateList = async (pageNumber) => {
    setCurrent(pageNumber);
    setLoading(true);
    const res = await getPositionAuthList({
      pageNumber,
      pageSize,
      userAccOrName: userAccOrNameRef.current,
    });
    setList(res?.records || []);
    setTotal(res?.totalRecord || 0);
    setLoading(false);
  };

  const onSearch = (value) => {
    userAccOrNameRef.current = value || undefined;
    updateList(1);
  };

  useEffect(() => {
    updateList(1);
    getUserList();
  }, []);

  return (
    <CustomCard bodyStyle={{ padding: 8 }} style={{ marginTop: 8 }}>
      <Input.Search
        placeholder="账号或用户名称"
        allowClear
        style={{ marginBottom: 8, width: 200 }}
        onSearch={onSearch}
        loading={loading}
      />
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
      <EditModal
        {...showEditModal}
        onCancel={() => setShowEditModal({ visible: false })}
        callback={() => updateList(current)}
      />
    </CustomCard>
  );
}
