/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-11 09:43:05
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 * @LastEditTime: 2025-01-03 14:33:59
 * @FilePath: \invest-index-server-front\src\pages\monitor\CashPosition\views\ConfigTabs.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { getCashMonitoring } from '@asset360/apis/position';
import { Col, Row } from 'antd-v5';
import { CustomTable, moneyFormat, useGetHeight } from 'iblive-base';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import NumberCel from '../../../components/NumberCel';
import styles from '../../index.less';
// import DetailModal from './DetailModal';

// const pageSize = 3;
const indexPageSize = 5;
export default ({ headerRender, paramsForList, date, setUpdateDate }) => {
  const wrapperRef = useRef();
  const warpperHeight = useGetHeight(wrapperRef.current, 300, 8);
  // const [tableLoading, setTableLoading] = useState(false);
  // const [detailModalParam, setDetailModalParam] = useState({});
  const [settlementPosition, setSettlementPosition] = useState({
    caBeginAmt: 0,
    t0InstAvailAmt: 0,
    t0RealDealAvailAmt: 0,
    t1InstAvailAmt: 0,
    t1RealDealAvailAmt: 0,
    fundCashRto: 0,
    manualFroAmt: 0,
    manualUnfroAmt: 0,
  });
  // const [detailModalVisible, setDetailModalVisible] = useState(false);
  // const [tableData, setTableData] = useState([]);
  const [indexTableLoading, setIndexTableLoading] = useState(false);
  const [indexTableData, setIndexTableData] = useState([]);

  // const textRender = (textObj) => {
  //   const text = textObj?.eventData?.amount || 0;
  //   if (text == 0) {
  //     return <span>0</span>;
  //   } else if (text > 0) {
  //     return (
  //       <span
  //         style={{ cursor: 'pointer' }}
  //         onClick={() => handleDetailModal(textObj)}
  //       >
  //         {moneyFormat({ num: text, decimal: 2 })}&nbsp;足额
  //       </span>
  //     );
  //   } else {
  //     return (
  //       <span
  //         style={{ color: 'red', cursor: 'pointer' }}
  //         onClick={() => handleDetailModal(textObj)}
  //       >
  //         {moneyFormat({ num: text, decimal: 2 })}&nbsp;欠额
  //         <span className={styles.pending_tag}>待处理</span>
  //       </span>
  //     );
  //   }
  // };

  // const columns = [
  //   {
  //     title: '交易所场内清算款',
  //     dataIndex: 'clearingFundOnExchange',
  //     align: 'right',
  //     render: (textObj) => textRender(textObj),
  //   },
  //   {
  //     title: '港股通资金清算',
  //     dataIndex: 'clearingAssetOnHKStock',
  //     align: 'right',
  //     render: (textObj) => textRender(textObj),
  //   },
  //   {
  //     title: '网下新股缴款',
  //     dataIndex: 'newStockPaymentOffline',
  //     align: 'right',
  //     render: (textObj) => textRender(textObj),
  //   },
  //   {
  //     title: '净赎回缴款',
  //     dataIndex: 'netRedeemedPayment',
  //     align: 'right',
  //     render: (textObj) => textRender(textObj),
  //   },
  // ];

  const indexTextRender = (text) => {
    return (
      <NumberCel number={text}>
        {moneyFormat({ num: text, decimal: 2 })}
      </NumberCel>
    );
  };

  const indexColumns = [
    {
      title: '指标项',
      dataIndex: 'name',
      width: 300,
    },
    {
      title: 'T日',
      dataIndex: 't0',
      align: 'right',
      render: (text) => indexTextRender(text),
    },
    {
      title: 'T+1日',
      dataIndex: 't1',
      align: 'right',
      render: (text) => indexTextRender(text),
    },
    {
      title: 'T+2日',
      dataIndex: 't2',
      align: 'right',
      render: (text) => indexTextRender(text),
    },
    {
      title: 'T+3日',
      dataIndex: 't3',
      align: 'right',
      render: (text) => indexTextRender(text),
    },
  ];

  // const closeEditModal = () => setDetailModalVisible(false);

  // const handleDetailModal = (record) => {
  //   const column =
  //     record?.basicInfo?.header.map((item) => {
  //       return { ...item, dataIndex: item.key };
  //     }) || [];
  //   const tableData = record?.eventExt || [];
  //   setDetailModalParam({
  //     column,
  //     tableData,
  //   });
  //   setDetailModalVisible(true);
  // };

  const getData = async () => {
    const { headObjectCode, objectCode, parentObjectCode } = paramsForList;
    // setTableLoading(true);
    setIndexTableLoading(true);
    const res = await getCashMonitoring({
      businessDate: moment(date).format('yyyyMMDD'),
      fundCode: headObjectCode === 'fund_code' ? objectCode : parentObjectCode,
      astId: headObjectCode === 'ast_unit_code' ? objectCode : undefined,
    });
    const data = res?.data;
    setSettlementPosition(data?.settlementPosition?.eventData); //交收头寸总览
    setIndexTableData(data?.monitorPositionItems); //监控指标项

    // setTableData([
    //   {
    //     clearingFundOnExchange: data?.clearingFundOnExchange,
    //     clearingAssetOnHKStock: data?.clearingAssetOnHKStock,
    //     newStockPaymentOffline: data?.newStockPaymentOffline,
    //     netRedeemedPayment: data?.netRedeemedPayment,
    //   },
    // ]); //清算头寸监控
    setUpdateDate(moment().format('yyyy-MM-DD HH:mm:ss'));
    // setTableLoading(false);
    setIndexTableLoading(false);
  };

  useEffect(() => {
    if (paramsForList) {
      getData();
    }
  }, [paramsForList, date]);

  return (
    <div className={styles.cash_monitoring_main}>
      {headerRender('cashMonitoring')}

      <div style={{ height: warpperHeight, overflow: 'auto' }} ref={wrapperRef}>
        <div
          className={styles.comm_table_container}
          style={{ marginBottom: 14 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className={styles.comm_title}>
              交收头寸总览
              <span className={styles.secondaryTitle}>（实时）</span>
            </span>
            <span className={styles.secondaryTitle}>单位: 元</span>
          </div>
          <Row gutter={16} style={{ marginTop: 20 }}>
            <Col span={3}>
              <p className={styles.value}>
                <NumberCel number={settlementPosition?.caBeginAmt}>
                  {moneyFormat({
                    num: settlementPosition?.caBeginAmt,
                    decimal: 2,
                  })}
                </NumberCel>
              </p>
              <p className={styles.description}>托管户日初余额</p>
            </Col>
            <Col span={3}>
              <p className={styles.value}>
                <NumberCel number={settlementPosition?.t0InstAvailAmt}>
                  {moneyFormat({
                    num: settlementPosition?.t0InstAvailAmt,
                    decimal: 2,
                  })}
                </NumberCel>
              </p>
              <p className={styles.description}>T0指令可用</p>
            </Col>
            <Col span={3}>
              <p className={styles.value}>
                <NumberCel number={settlementPosition?.t0RealDealAvailAmt}>
                  {moneyFormat({
                    num: settlementPosition?.t0RealDealAvailAmt,
                    decimal: 2,
                  })}
                </NumberCel>
              </p>
              <p className={styles.description}>t0交易可用</p>
            </Col>
            <Col span={3}>
              <p className={styles.value}>
                <NumberCel number={settlementPosition?.t1InstAvailAmt}>
                  {moneyFormat({
                    num: settlementPosition?.t1InstAvailAmt,
                    decimal: 2,
                  })}
                </NumberCel>
              </p>
              <p className={styles.description}>t1指令可用</p>
            </Col>
            <Col span={3}>
              <p className={styles.value}>
                <NumberCel number={settlementPosition?.t1RealDealAvailAmt}>
                  {moneyFormat({
                    num: settlementPosition?.t1RealDealAvailAmt,
                    decimal: 2,
                  })}
                </NumberCel>
              </p>
              <p className={styles.description}>t1交易可用</p>
            </Col>
            <Col span={3}>
              <p className={styles.value}>
                <NumberCel number={settlementPosition?.fundCashRto}>
                  {settlementPosition?.fundCashRto || '-'}
                </NumberCel>
              </p>
              <p className={styles.description}>组合现金比例</p>
            </Col>
            <Col span={3}>
              <p className={styles.value}>
                <NumberCel number={settlementPosition?.manualFroAmt}>
                  {moneyFormat({
                    num: settlementPosition?.manualFroAmt,
                    decimal: 2,
                  })}
                </NumberCel>
              </p>
              <p className={styles.description}>手工冻结总金额</p>
            </Col>
            <Col span={3}>
              <p className={styles.value}>
                <NumberCel number={settlementPosition?.manualUnfroAmt}>
                  {moneyFormat({
                    num: settlementPosition?.manualUnfroAmt,
                    decimal: 2,
                  })}
                </NumberCel>
              </p>
              <p className={styles.description}>手工解冻总金额</p>
            </Col>
          </Row>
        </div>

        {/* <div
          className={styles.comm_table_container}
          style={{ marginBottom: 14 }}
        >
          <div style={{ marginBottom: 20 }}>
            <span className={styles.comm_title}>
              清算头寸监控{' '}
              <span className={styles.secondaryTitle}>（日初）</span>
            </span>
          </div>
          <CustomTable
            pageSize={pageSize}
            bordered={false}
            dataSource={tableData}
            loading={tableLoading}
            columns={columns}
          />
        </div> */}

        <div className={styles.comm_table_container}>
          <div style={{ marginBottom: 20 }}>
            <span className={styles.comm_title}>监控指标项</span>
          </div>
          <CustomTable
            pageSize={indexPageSize}
            bordered={false}
            dataSource={indexTableData}
            loading={indexTableLoading}
            columns={indexColumns}
          />
        </div>
      </div>
      {/* <DetailModal
        visible={detailModalVisible}
        onCancel={closeEditModal}
        detailModalParam={detailModalParam}
      /> */}
    </div>
  );
};
