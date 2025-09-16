import { getCashManualDetail } from '@asset360/apis/position';
import { useGetHeight } from 'iblive-base';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import PositionTable from '../../../components/PositionTable';
import styles from '../../index.less';

const pageSize = 15;
export default ({ paramsForList, date }) => {
  const [updateTime, setUpdateTime] = useState('xxxx-xx-xx xx:xx:xx');
  const [data, setData] = useState();
  const [columns, setColumns] = useState();
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  const tableWrapperRef = useRef();
  const tableWrapperHeight = useGetHeight(tableWrapperRef.current, 300, 8);

  const getInfo = async () => {
    if (!paramsForList) return;
    setCurrent(1);
    setLoading(true);
    const { headObjectCode, objectCode, parentObjectCode } = paramsForList;
    const res = await getCashManualDetail({
      fundCode: headObjectCode === 'fund_code' ? objectCode : parentObjectCode,
      astUnitId: headObjectCode === 'ast_unit_code' ? objectCode : undefined,
      businDate: date ? date.format('YYYYMMDD') : undefined,
    });
    setLoading(false);
    setColumns(
      (res?.data?.header || []).map((item) => ({
        title: item.title,
        dataIndex: item.key,
      })),
    );
    setData(res?.data?.dataList || []);
    setUpdateTime(moment().format('YYYY-MM-DD HH:mm:ss'));
  };

  useEffect(() => {
    getInfo();
  }, [paramsForList, date]);

  return (
    <>
      <div className="m-t-8 m-b-8">
        <span className={styles.comm_label}>手工资金管理明细</span>
        <span className={styles.comm_update_date}>更新时间: {updateTime}</span>
      </div>
      <div
        ref={tableWrapperRef}
        className={styles.custom_fund_details}
        style={{ height: tableWrapperHeight }}
      >
        <PositionTable
          style={{ marginTop: 5 }}
          pageSize={pageSize}
          dataSource={data}
          loading={loading}
          columns={columns}
          current={current}
          total={data?.length}
          height={Math.max(
            data?.length > pageSize
              ? tableWrapperHeight - 48
              : tableWrapperHeight - 8,
            300,
          )}
          onPageChange={setCurrent}
        />
      </div>
    </>
  );
};
