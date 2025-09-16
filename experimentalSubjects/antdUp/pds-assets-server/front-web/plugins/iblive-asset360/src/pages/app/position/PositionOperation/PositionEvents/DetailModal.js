/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-06-19 09:40:42
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-17 15:32:07
 * @Description:
 */
import { queryByEventId } from '@asset360/apis/position';
import CustomModal from '@asset360/components/CustomModal';
import PositionTable from '@asset360/components/PositionTable';
import { Tag } from 'antd-v5';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { EVENT_STATUS_LIST } from './CONST';

let pageSize = 10;
export default ({ visible, onCancel, eventId, userObj }) => {
  const [content, setCotent] = useState('');

  const [title, setTitle] = useState('');

  const columns = [
    {
      title: '邮件id',
      dataIndex: 'id',
    },
    {
      title: '收件人邮箱',
      dataIndex: 'recipient',
    },
    {
      title: '用户',
      dataIndex: 'userAccs',
      render: (text) => {
        const str = text?.length
          ? text.map((userAcc) => userObj[userAcc] || userAcc).join('、')
          : '';
        return str;
      },
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '发送状态',
      dataIndex: 'sendStatus',
      render: (text) => {
        const info = EVENT_STATUS_LIST.find((item) => item.value === text);
        return <Tag color={info.color}>{info.label}</Tag>;
      },
    },
    {
      title: '失败原因',
      dataIndex: 'failCause',
      render: (text) => text || '--',
    },
  ];

  const getData = async () => {
    setTableLoading(true);
    const res = await queryByEventId({
      eventId,
    });
    setDataSource(res?.records || []);
    const record = res?.records[0];
    setCotent(record?.content || '');
    setTitle(record?.title || '');
    setTableLoading(false);
  };

  const [tableLoading, setTableLoading] = useState(false);

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (visible) {
      getData();
    }
  }, [visible]);

  return (
    <CustomModal
      title={'邮件详情'}
      size="big"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      needChangeSize
      destroyOnClose
      width={'85vw'}
      bodyStyle={{
        maxHeight: '70vh',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>邮件标题</div>
        <div
          style={{
            border: '1px solid #f0f0f0',
            marginLeft: 8,
            flex: 1,
            padding: 8,
          }}
        >
          {title}
        </div>
      </div>

      <div style={{ display: 'flex', marginTop: 8, alignItems: 'center' }}>
        <div>邮件内容</div>
        <div
          style={{
            border: '1px solid #f0f0f0',
            marginLeft: 8,
            flex: 1,
            padding: 8,
          }}
        >
          <p dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <div style={{ marginBottom: 4 }}>邮件发送记录</div>
        <PositionTable
          pageSize={pageSize}
          dataSource={dataSource}
          loading={tableLoading}
          columns={columns}
          height=""
        />
      </div>
    </CustomModal>
  );
};
