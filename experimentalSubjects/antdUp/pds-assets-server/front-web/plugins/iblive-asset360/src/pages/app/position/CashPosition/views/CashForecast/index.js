/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-11 09:43:05
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-12-13 11:43:43
 * @FilePath: \invest-index-server-front\src\pages\monitor\CashPosition\views\ConfigTabs.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { LockOutlined, SearchOutlined } from '@ant-design/icons';
import { getCashByCode } from '@asset360/apis/position';
import { Tooltip } from 'antd';
import { CustomTableWithYScroll, moneyFormat, useGetHeight } from 'iblive-base';
import moment from 'moment';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import NumberCel from '../../../components/NumberCel';
import styles from '../../index.less';
import EditModal from './EditModal';
import IndexModal from './IndexModal';

export default forwardRef(
  (
    {
      headerRender,
      paramsForList,
      date,
      setUpdateDate,
      updateTree,
      positionLink,
    },
    ref,
  ) => {
    const [tableData, setTableData] = useState();
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [indexModalVisible, setIndexModalVisible] = useState(false);
    const [tableRecord, setTableRecord] = useState({});
    const [tableLoading, setTableLoading] = useState(false);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const tableWrapperRef = useRef();
    const tableWrapperHeight = useGetHeight(tableWrapperRef.current, 300);
    const tableHeight = tableWrapperHeight - 24;

    const closeEditModal = () => setEditModalVisible(false);
    const closeIndexModal = () => setIndexModalVisible(false);

    const handleEditModal = (record, type) => {
      setTableRecord({ ...record, modalType: type });
      setEditModalVisible(true);
    };

    const sharedOnCell = (record) => {
      if (record?.isPos === false) {
        return { colSpan: 0 };
      }

      return {};
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

    const handleIndex = async (record) => {
      setTableRecord(record);
      setIndexModalVisible(true);
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
        render: (text, record) =>
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
          ),
      },
    ];

    const getData = async () => {
      const { headObjectCode, objectCode, parentObjectCode } = paramsForList;
      setTableLoading(true);
      const res = await getCashByCode({
        businDate: moment(date).format('yyyyMMDD'),
        fundCode:
          headObjectCode === 'fund_code' ? objectCode : parentObjectCode,
        astUnitId: headObjectCode === 'ast_unit_code' ? objectCode : undefined,
        updateKey: moment().valueOf(),
        positionLink,
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
      setUpdateDate(moment().format('yyyy-MM-DD HH:mm:ss'));
      setTableLoading(false);
    };

    useImperativeHandle(ref, () => ({
      getData,
    }));

    useEffect(() => {
      if (paramsForList) {
        getData();
      }
    }, [paramsForList, date, positionLink]);

    return (
      <div className={styles.cash_forecast_main}>
        {headerRender('cashForecast')}
        <div className={styles.comm_table_container} ref={tableWrapperRef}>
          <CustomTableWithYScroll
            bordered={false}
            rowKey="code"
            columns={columns}
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
              if (record?.isPos === false) {
                return styles.table_content_title_bar;
              } else if (record?.indexLevel === '2') {
                return styles.table_content_total_bar;
              }
            }}
            height={tableHeight > 300 ? tableHeight : 300}
          />
        </div>
        <EditModal
          visible={editModalVisible}
          onCancel={closeEditModal}
          formData={tableRecord}
          updateTree={updateTree}
          date={date}
          updateTable={getData}
          paramsForList={paramsForList}
          positionLink={positionLink}
        />
        <IndexModal
          visible={indexModalVisible}
          onCancel={closeIndexModal}
          date={date}
          updateTable={getData}
          tableRecord={tableRecord}
          paramsForList={paramsForList}
          positionLink={positionLink}
        />
      </div>
    );
  },
);
