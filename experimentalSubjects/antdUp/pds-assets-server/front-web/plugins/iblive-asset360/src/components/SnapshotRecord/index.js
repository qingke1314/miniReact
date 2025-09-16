import { CalendarOutlined } from '@ant-design/icons';
import {
  queryPositionSnapshot,
  querySnapshotRecord,
} from '@asset360/apis/standardPosition';
import CustomModal from '@asset360/components/CustomModal';
import { Button, DatePicker, Form } from 'antd-v5';
import { CustomTableWithYScroll, moneyFormat, requestUtils } from 'iblive-base';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { POSITION_LINK_DICT } from './CONST';
import styles from './index.less';

const pageSize = 10;

const SNAPSHOT_TYPE = [
  { label: '定时', value: 1 },
  { label: '归档', value: 2 },
  { label: '手动', value: 3 },
];

const textRender = (text, record, type) => {
  if (record?.indexLevel === '2' && type == 't0Amount') {
    return (
      <span
        style={{
          color:
            text < 0 && text !== '--'
              ? '#20D08C'
              : record?.indexLevel === '2'
              ? '#186df5'
              : '',
        }}
      >
        {moneyFormat({ num: text })}
      </span>
    );
  }
  return (
    <span
      style={{
        color: text < 0 ? '#20D08C' : '',
      }}
    >
      {moneyFormat({ num: text })}
    </span>
  );
};

export default function Snap({
  fundCode,
  astUnitId,
  positionType = 'GZ',
  tradeType,
}) {
  const { DownloadFile } = requestUtils;
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState({ visible: false });
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState();
  const [tableLoading, setTableLoading] = useState(false);
  const [detailTableLoading, setDetailTableLoading] = useState(false);
  const [detailTableData, setDeatilTableData] = useState([]);
  const [dateList, setDateList] = useState();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const columns = [
    {
      title: `快照时间`,
      dataIndex: 'snapshotTime',
    },
    {
      title: `头寸口径`,
      dataIndex: 'positionLink',
      render: (text) =>
        POSITION_LINK_DICT.find((item) => item.value == text)?.label,
    },
    {
      title: `快照类型`,
      dataIndex: 'snapshotType',
      render: (text) => SNAPSHOT_TYPE.find((item) => item.value == text)?.label,
    },
    {
      title: '操作',
      width: 90,
      dataIndex: 'operation',
      fixed: 'right',
      align: 'center',
      render: (text, record) => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <a
            onClick={() => {
              openDetailModal(record);
            }}
          >
            查看
          </a>
          <a onClick={() => exportRecord(record?.id)}>导出</a>
        </div>
      ),
    },
  ];

  const detailColumns = [
    {
      title: (
        <span>
          项目 <span style={{ color: '#777', fontSize: 12 }}>单位(元)</span>
        </span>
      ),
      dataIndex: 'name',
      width: 250,
      onCell: (record) => ({
        colSpan: record?.indexLevel === '0' ? 8 : 1,
      }),
      render: (text, record) => (
        <span
          style={{
            color: record?.indexLevel === '2' ? '#186df5' : '',
            fontWeight: record?.indexLevel === '2' ? 'bold' : '',
          }}
        >
          {text}
        </span>
      ),
    },
    ...new Array(7).fill(null).map((item, index) => {
      const title = dateList?.[index]?.businDate
        ? moment(dateList[index].businDate, 'YYYYMMDD').format('YYYY-MM-DD')
        : `T${index + 1}`;
      return {
        title: (
          <span>
            {title}
            {dateList?.[index]?.tradeFlag && <span>（交易日）</span>}
          </span>
        ),
        dataIndex: `t${index}Amount`,
        align: 'right',
        onCell: (record) => ({
          colSpan: record?.indexLevel === '0' ? 0 : 1,
        }),
        render: (text, record) => textRender(text, record, `t${index}Amount`),
      };
    }),
  ];

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const afterClose = () => {
    setTableData([]);
    form.resetFields();
  };

  const openDetailModal = (record) => {
    getDetailTableData(record.id);
    setShowDetailModal({ visible: true, title: record.createdTime });
  };

  const closeDetailModal = () => {
    setShowDetailModal({ visible: false });
  };

  const exportRecord = (id) => {
    let requestURL = '/pds/position-std/snapshot/exportPositionSnapshot';
    DownloadFile(requestURL, {
      method: 'GET',
      params: {
        snapshotId: id,
      },
    });
  };

  const getTableData = async (pageNumber = 1) => {
    if (!fundCode) return;
    setTableLoading(true);
    const businDate = form.getFieldValue('businDate');
    const param = {
      fundCode: fundCode,
      astUnitId: astUnitId === -1 ? undefined : astUnitId,
      positionType,
      tradeType,
      businDate: businDate ? moment(businDate).format('yyyyMMDD') : undefined,
      pageSize,
      pageNumber,
    };
    const res = await querySnapshotRecord(param);
    setTotal(res?.totalRecord || 0);
    setTableData(res?.records);
    setCurrent(pageNumber);
    setTableLoading(false);
  };

  const getDetailTableData = async (id) => {
    setDetailTableLoading(true);
    const res = await queryPositionSnapshot({
      snapshotId: id,
    });
    //children为[] 会导致空的扩展按钮出现
    let ExpandedRowKeys = [];
    const data = res?.records.map((item) => {
      ExpandedRowKeys.push(item.code);
      return {
        ...item,
        children: item?.children?.length == 0 ? null : item?.children,
      };
    });
    setExpandedRowKeys(ExpandedRowKeys);
    setDeatilTableData(data);
    setDateList(res?.data);
    setDetailTableLoading(false);
  };

  useEffect(() => {
    if (showModal) {
      getTableData(1);
    }
  }, [showModal]);

  return (
    <>
      <Button
        size="middle"
        className={styles.comm_btn}
        style={{ marginLeft: 0 }}
        onClick={openModal}
        icon={<CalendarOutlined />}
      >
        快照记录
      </Button>

      {/* 快照记录弹窗 */}
      <CustomModal
        title="全部快照"
        width={'50vw'}
        visible={showModal}
        afterClose={afterClose}
        onCancel={closeModal}
        footer={<Button onClick={closeModal}>关闭</Button>}
      >
        <Form form={form} onValuesChange={getTableData}>
          <Form.Item
            label="查询日期"
            name={'businDate'}
            style={{ marginBottom: 8 }}
            initialValue={moment()}
          >
            <DatePicker allowClear />
          </Form.Item>
        </Form>

        <CustomTableWithYScroll
          height={300}
          columns={columns}
          dataSource={tableData}
          loading={tableLoading}
          rowKey={(record) => {
            return record.id;
          }}
          current={current}
          pageSize={pageSize}
          total={total}
          onChange={({ current }) => getTableData(current)}
        />
      </CustomModal>

      {/* 快照记录详情弹窗 */}
      <CustomModal
        title={`【${showDetailModal?.title || '--'} 】快照详情`}
        visible={showDetailModal?.visible}
        size="big"
        onCancel={closeDetailModal}
        footer={<Button onClick={closeDetailModal}>关闭</Button>}
      >
        <div className={styles.comm_table_container}>
          <CustomTableWithYScroll
            rowKey="code"
            columns={detailColumns}
            loading={detailTableLoading}
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
            dataSource={detailTableData}
            pagination={false}
            rowClassName={(record) => {
              if (record?.indexLevel === '0') {
                return styles.table_content_title_bar;
              } else if (record?.indexLevel === '2') {
                return styles.table_content_total_bar;
              }
            }}
            height={400}
          />
        </div>
      </CustomModal>
    </>
  );
}
