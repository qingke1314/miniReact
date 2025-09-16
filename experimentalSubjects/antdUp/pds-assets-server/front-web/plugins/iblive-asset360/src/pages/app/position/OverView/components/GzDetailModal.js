/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-14 12:54:31
 * @LastEditTime: 2024-12-13 11:22:04
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 */

import { LockOutlined, SearchOutlined } from '@ant-design/icons';
import { getCashByCode } from '@asset360/apis/position';
import CustomModal from '@asset360/components/CustomModal';
import OperationColunm from '@asset360/components/OperationColunm';
import { Tooltip } from 'antd-v5';
import { CustomTableWithYScroll, moneyFormat } from 'iblive-base';
import moment from 'moment';
import { useEffect, useState } from 'react';
import NumberCel from '../../components/NumberCel';
import styles from '../index.less';
import GzEditModal from './GzEditModal';
import IndexModal from './IndexModal';
export default ({
  visible,
  onCancel,
  title,
  type,
  astUnitId,
  fundCode,
  updateDate,
}) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const [tableRecord, setTableRecord] = useState({});

  const [indexModalVisible, setIndexModalVisible] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);

  const [tableData, setTableData] = useState([]);

  const closeEditModal = () => setEditModalVisible(false);
  const closeIndexModal = () => setIndexModalVisible(false);
  const [tableLoading, setTableLoading] = useState(false);
  const getData = async () => {
    setTableLoading(true);
    const res = await getCashByCode({
      businDate: moment(updateDate).format('YYYYMMDD'),
      fundCode,
      astUnitId,
      updateKey: moment().valueOf(),
      positionLink: type,
      indexType: 'POSITION',
    });
    //children为[] 会导致空的扩展按钮出现
    let ExpandedRowKeys = [];
    const data = res?.records.map((item) => {
      ExpandedRowKeys.push(item.code);
      return {
        ...item,
        children: item?.children.length == 0 ? null : item.children,
      };
    });
    //切换产品时滚动条复位
    const table = document.querySelector('.ant-table-content');
    table && (table.scrollTop = 0);
    setExpandedRowKeys(ExpandedRowKeys);
    setTableData(data);
    setTableLoading(false);
  };

  useEffect(() => {
    if (visible) {
      getData();
    }
  }, [visible]);

  const sharedOnCell = (record) => {
    if (record?.isPos === false) {
      return { colSpan: 0 };
    }
    return {};
  };

  const handleEditModal = (record, type) => {
    setTableRecord({ ...record, modalType: type });
    setEditModalVisible(true);
  };

  const handleIndex = async (record) => {
    setTableRecord(record);
    setIndexModalVisible(true);
  };

  const textRender = (text, record, type) => {
    if (record?.indexLevel === '2' && type == 't0Amount') {
      return (
        <span
          style={{
            color: record?.indexLevel === '2' ? '#186df5' : '',
          }}
        >
          <NumberCel number={text}>{moneyFormat({ num: text })}</NumberCel>
        </span>
      );
    }
    return record?.indexLevel === '2' ? (
      <NumberCel number={text}>{moneyFormat({ num: text })}</NumberCel>
    ) : (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          cursor: 'pointer',
        }}
        onClick={() => handleEditModal(record, type)}
      >
        {record?.[`${type}Locked`] && (
          <Tooltip title={`锁定时间:${record?.[`${type}LockedTime`]}`}>
            <LockOutlined style={{ marginRight: 3, lineHeight: '22px' }} />
          </Tooltip>
        )}

        <NumberCel number={text}>{moneyFormat({ num: text })}</NumberCel>
        <SearchOutlined style={{ fontSize: 10, marginLeft: 2 }} />
      </div>
    );
  };

  const columns = [
    {
      title: (
        <span>
          项目 <span style={{ color: '#777', fontSize: 12 }}>单位(元)</span>
        </span>
      ),
      dataIndex: 'name',
      width: 250,
      onCell: (record) => ({
        colSpan: record?.isPos === false ? 7 : 1,
      }),
      render: (text, record) => (
        <span
          style={{
            color: record?.indexLevel === '2' ? '#186df5' : '',
            fontWeight: record?.indexLevel === '2' ? 'bold' : '',
          }}
        >
          {text}
          {/* 编辑后锁定 */}
          {record?.locked && <LockOutlined style={{ marginLeft: 3 }} />}
          {/* 指标执行失败 */}
          {record?.execStatus === 'fail' && (
            <span className={styles.fail_block} style={{ marginLeft: 8 }}>
              计算异常
            </span>
          )}
          {record?.indexLevel !== '2' && record?.enable === false && (
            <span className={styles.unenable_block} style={{ marginLeft: 8 }}>
              未启用
            </span>
          )}
          {record?.warnType === 'POSITION_NOT_ENOUGH' ? (
            <span className={styles.tree_title_status}>
              {record.warnText || '--'}
            </span>
          ) : record?.warnType === 'POSITION_LESS' ? (
            <span className={styles.tree_title_status_2}>
              {record.warnText || '--'}
            </span>
          ) : null}
        </span>
      ),
    },
    {
      title: 'T0余额',
      dataIndex: 't0Amount',
      width: '80px',
      align: 'right',
      onCell: sharedOnCell,
      render: (text, record) => textRender(text, record, 't0Amount'),
    },
    {
      title: 'T1影响T0',
      dataIndex: 'affectsT0',
      width: '80px',
      align: 'right',
      onCell: sharedOnCell,
      render: (text, record) => textRender(text, record, 'affectsT0'),
    },
    {
      title: 'T1余额',
      dataIndex: 't1Amount',
      align: 'right',
      width: '80px',
      onCell: sharedOnCell,
      render: (text, record) => textRender(text, record, 't1Amount'),
    },
    {
      title: 'T2余额',
      dataIndex: 't2Amount',
      align: 'right',
      width: '80px',
      onCell: sharedOnCell,
      render: (text, record) => textRender(text, record, 't2Amount'),
    },
    {
      title: 'T3余额',
      dataIndex: 't3Amount',
      align: 'right',
      width: '80px',
      onCell: sharedOnCell,
      render: (text, record) => textRender(text, record, 't3Amount'),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '100px',
      align: 'center',
      onCell: sharedOnCell,
      render: (text, record) => (
        <OperationColunm
          customButton={
            record?.indexLevel !== '2' && (
              <>
                {record?.execStatus !== 'success' && record?.enable === true && (
                  <a
                    style={{ marginRight: 10 }}
                    onClick={() => {
                      handleIndex(record);
                    }}
                  >
                    重算
                  </a>
                )}
              </>
            )
          }
        />
      ),
    },
  ];
  return (
    <>
      <CustomModal
        title={title}
        width="75vw"
        footer={null}
        visible={visible}
        onCancel={onCancel}
        maskClosable={false}
        style={{ top: 30 }}
        bodyStyle={{ maxHeight: '80vh' }}
        destroyOnClose
      >
        <CustomTableWithYScroll
          bordered={false}
          className={styles.cash_forecast_main}
          rowKey="code"
          columns={columns}
          height={'75vh'}
          loading={tableLoading}
          expandable={{
            expandedRowKeys: expandedRowKeys,
            onExpand: (expanded, record) => {
              if (expanded) {
                expandedRowKeys.push(record.code);
                setExpandedRowKeys(expandedRowKeys);
              } else {
                setExpandedRowKeys(
                  expandedRowKeys.filter((item) => record.code !== item),
                );
              }
            },
          }}
          dataSource={tableData}
          pagination={false}
          rowClassName={(record) => {
            if (!record.isPos) {
              return styles.title;
            } else if (record.indexLevel == 2) {
              return styles.indexLevel;
            }
          }}
        />

        <GzEditModal
          visible={editModalVisible}
          onCancel={closeEditModal}
          formData={tableRecord}
          date={updateDate}
          updateTable={getData}
          positionLink={type}
          fundCode={fundCode}
          astUnitId={astUnitId}
        />

        <IndexModal
          visible={indexModalVisible}
          onCancel={closeIndexModal}
          date={updateDate}
          updateTable={getData}
          tableRecord={tableRecord}
          positionLink={type}
          fundCode={fundCode}
          astUnitId={astUnitId}
        />
      </CustomModal>
    </>
  );
};
