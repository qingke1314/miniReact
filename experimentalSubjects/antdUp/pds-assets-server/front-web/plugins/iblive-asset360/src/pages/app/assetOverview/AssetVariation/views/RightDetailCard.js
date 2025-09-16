import { CloseOutlined } from '@ant-design/icons';
import { executeApi } from '@asset360/apis/appCommon';
import OverviewTable from '@asset360/components/OverviewTable';
import { moneyFormat } from 'iblive-base';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatDate, formatTime } from '../formatTimeAndDate';
import styles from '../index.less';

export default function RightDetailCard({
  visible,
  onCancel,
  type,
  info,
  isDay,
  height,
}) {
  const [titleDetail, setTitleDetail] = useState({});
  const { date, productCode } = useSelector(
    (state) => state.asset360AssetLayout,
  );
  const [total, setTotal] = useState(0);
  const baseColunms = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (text, record, index) => index + 1,
    },
  ];
  if (!isDay) {
    baseColunms.push({
      title: '委托日期',
      dataIndex: 'busin_date',
      render: (text) => formatDate(text),
    });
  }
  baseColunms.push({
    title: '委托时间',
    dataIndex: 'etru_time',
    render: (text) =>
      text
        ? text?.toString()?.length === 6
          ? formatTime(text)
          : formatTime('0' + text)
        : '--',
  });
  const columns1 = [
    // {
    //   title: '证券名称',
    //   dataIndex: 'interName',
    //   render: (text) => text||'--',
    // },
    // {
    //   title: '证券内码',
    //   dataIndex: 'interCode',
    // },
    {
      title: '委托价格',
      dataIndex: 'etru_price',
      align: 'right',
      render: (text) => moneyFormat({ num: text, decimal: 2 }),
    },
    // {
    //   title: '委托数量',
    //   dataIndex: 'etru_qty',
    //   align: 'right',
    //   render: (text) => moneyFormat({ num: text, decimal: 0 }),
    // },
    {
      title: '平均成交价格',
      dataIndex: 'avg_match_price',
      align: 'right',
      render: (text) => moneyFormat({ num: text, decimal: 2 }),
    },
    {
      title: '成交金额',
      dataIndex: 'dealAmt',
      align: 'right',
      render: (text) => moneyFormat({ num: text, decimal: 2 }),
    },
    {
      title: '成交时间',
      dataIndex: 'deal_time',
      render: (text) =>
        text
          ? text?.toString()?.length === 6
            ? formatTime(text)
            : formatTime('0' + text)
          : '--',
    },
    {
      title: '委托/成交',
      dataIndex: 'qty_info',
      align: 'right',
    },
    {
      title: '状态',
      dataIndex: 'etru_status',
    },
  ];

  const columns2 = [
    {
      title: '成交时间',
      dataIndex: 'match_time',
      render: (text) =>
        text
          ? text?.toString()?.length === 6
            ? formatTime(text)
            : formatTime('0' + text)
          : '--',
    },
    {
      title: '成交价格',
      dataIndex: 'match_price',
      align: 'right',
      render: (text) => moneyFormat({ num: text, decimal: 2 }),
    },
    {
      title: '成交数量',
      dataIndex: 'match_qty',
      align: 'right',
      render: (text) => moneyFormat({ num: text, decimal: 0 }),
    },
  ];

  const getEData = async (e) => {
    setTableLoading(true);
    const res = await executeApi({
      serviceId: 'DD_API_ENTRUST_DETAIL',
      data: {
        businDate: moment(date).format('YYYYMMDD'),
        fundCode: productCode,
        ...info,
        pageSize: '5',
        page: e.toString(),
      },
    });
    setDataSource(res?.data?.resultList || []);
    setTotal(res?.data?.totalRecord);
    setTableLoading(false);
  };

  const [tableLoading, setTableLoading] = useState(false);

  const [dataSource, setDataSource] = useState([]);

  const [tradeVisible, setTradeVisible] = useState(false);

  const [index, setIndex] = useState('');

  const [tDataSource, setTDataSource] = useState([]);

  useEffect(() => {
    if (visible) {
      setTDataSource([]);
      setTradeVisible(false);
      getEData(1);
    }
  }, [visible, type, info]);

  useEffect(() => {
    if (visible && info.instNo && date) {
      executeApi({
        serviceId: 'DD_API_FUND_INST_ETRU_DEAL_STAT',
        data: {
          businDate: moment(date).format('YYYYMMDD'),
          instNo: info.instNo,
        },
      }).then((res) => {
        setTitleDetail(res?.data || {});
      });
    }
  }, [visible, info.instNo, date]);

  useEffect(() => {
    if (dataSource[index]?.etru_no) {
      executeApi({
        serviceId: 'DD_API_REALDEAL_DETAIL',
        data: {
          businDate: moment(date).format('YYYYMMDD'),
          pageSize: 10000,
          pageNum: 1,
          etruNo: dataSource[index]?.etru_no,
        },
      }).then((res) => {
        setTDataSource(res?.data?.resultList || []);
      });
    }
  }, [index, dataSource]);
  return (
    <>
      {visible && (
        <div className={styles.configs_right_card_content}>
          <div
            className="blank-card-asset"
            style={{ height, overflow: 'auto' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                marginBottom: 8,
              }}
            >
              <div style={{ display: 'flex' }}>
                <div className="important-title m-r-8">委托详情</div>
                <div>
                  <span className="m-r-8">
                    委托数量：{titleDetail?.ertuQty}
                  </span>
                  <span className="m-r-8">
                    委托金额：{titleDetail?.etruAmt}
                  </span>
                  <span className="m-r-8">
                    成交数量：{titleDetail?.matchQty}
                  </span>
                  <span>成交金额：{titleDetail?.matchAmt}</span>
                </div>
              </div>
              <CloseOutlined
                onClick={() => {
                  onCancel();
                  setDataSource([]);
                  // setTDataSource([]);
                }}
              />
            </div>
            <OverviewTable
              dataSource={dataSource}
              loading={tableLoading}
              pageSize={5}
              total={total}
              onPageChange={(current) => {
                getEData(current);
              }}
              columns={[...baseColunms, ...columns1]}
              onRow={(_record, recordIndex) => {
                return {
                  onClick: () => {
                    setIndex(recordIndex);
                    setTradeVisible(true);
                  }, // 点击行
                };
              }}
              rowClassName={(record, recordIndex) => {
                if (index === recordIndex) {
                  return styles.table_content;
                }
              }}
            />

            {tradeVisible ? (
              <div style={{ marginTop: 16 }}>
                <div className="important-title m-b-8">成交明细</div>
                <OverviewTable
                  dataSource={tDataSource}
                  pageSize={5}
                  total={tDataSource.length}
                  columns={columns2}
                  style={{ marginTop: 8 }}
                />
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
