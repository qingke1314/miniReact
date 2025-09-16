import { executeApi } from '@asset360/apis/appCommon';
import { Form } from 'antd';
import { useGetHeight } from 'iblive-base';
import { useEffect, useRef, useState } from 'react';
import styles from '../index.less';
import Overview from './Overview';
import TableContent from './TableContent';

export default ({ productCode, time, parentRef }) => {
  const [info, setInfo] = useState({ records: [], tradeDetails: [] });
  const [loading, setLoading] = useState(false);
  const [checkbox, setCheckbox] = useState(true);
  const [dataType, setDataType] = useState('TOTAL');

  const [searchForm] = Form.useForm();
  const contentRef = useRef();
  const height = useGetHeight(contentRef.current, 100, 18, parentRef?.current);

  const queryInfo = async (isNeedLoading = true) => {
    isNeedLoading && setLoading(true);
    const { secCodeOrName } = searchForm.getFieldsValue();

    try {
      const res = await executeApi({
        serviceId: 'DD_API_FUND_OPERATE_PROFIT',
        data: {
          fundCode: productCode,
          startDate: time?.[0] ? time[0].format('YYYYMMDD') : undefined,
          endDate: time?.[1] ? time[1].format('YYYYMMDD') : undefined,
          interCodeOrName: secCodeOrName,
        },
      });
      const filteredRecords = checkbox
        ? res?.records || []
        : (res?.records || []).filter((record) => record.currentQty !== 0);

      const data = {
        records: filteredRecords,
      };

      setInfo(data);
    } catch (error) {
      console.error('API请求失败:', error);
    } finally {
      isNeedLoading && setLoading(false);
    }
  };

  useEffect(() => {
    queryInfo();
  }, [productCode, time, checkbox]);

  return (
    <div className={styles.stock_main} ref={contentRef}>
      <Overview info={info} loading={loading} />
      <TableContent
        info={info}
        loading={loading}
        searchForm={searchForm}
        productCode={productCode}
        queryInfo={queryInfo}
        time={time}
        height={height}
        checkbox={checkbox}
        setCheckbox={setCheckbox}
        dataType={dataType}
        setDataType={setDataType}
      />
    </div>
  );
};
