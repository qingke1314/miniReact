/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-12 16:28:06
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-26 09:34:36
 * @FilePath: \invest-index-server-front\src\pages\monitor\CashPosition\views\CashForecast\EditModal.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { getCalendarDetails } from '@asset360/apis/position';
import { Badge, Calendar } from 'antd-v5';
import { moneyFormat } from 'iblive-base';
import moment from 'moment';
import { useEffect, useState } from 'react';
import NumberCel from '../../../components/NumberCel';
import styles from '../../index.less';
import CalendarDetail from './CalendarDetail';

export default ({
  headerRender,
  paramsForList,
  date,
  setDate,
  setUpdateDate,
}) => {
  const [calendarDetailVisible, setCalendarDetailVisible] = useState(false);
  const [calendarData, setCalendarData] = useState([]);
  const [modalTableData, setModalTableData] = useState({
    tableData: [],
    date: '',
  });

  const closeDetailModal = () => setCalendarDetailVisible(false);

  const handleDetailModal = (tableData, date) => {
    setModalTableData({
      tableData: tableData,
      date: moment(date).format('YYYY-MM-DD'),
    });
    setCalendarDetailVisible(true);
  };

  const CalendarChange = (date) => {
    getCalendarData();
    setDate(date);
  };

  const dateCellRender = (value) => {
    //排除非当前月份日期
    if (calendarData.length == 0) return;
    //避免同一日出现两次
    if (moment(date).format('MM') != moment(value).format('MM'))
      // return <span>切换至当前月份查看</span>;
      return null;
    const listData = calendarData.filter(
      (item) => Number(item?.businDate.substr(-2)) === value.date(),
    );
    return (
      <div className={styles.cell_container}>
        {listData?.[0]?.capitalDetails?.length > 0 && (
          <Badge
            className={styles.message_count}
            count={listData?.[0]?.capitalDetails?.length}
          />
        )}
        {listData?.[0]?.capitalDetails?.map((item, index) =>
          index < 3 ? (
            <div
              className={styles.cell_wrap}
              onClick={() =>
                handleDetailModal(listData?.[0]?.capitalDetails, value)
              }
            >
              <Badge color={`rgb(79,195,255)`} />
              <span className={styles.cell_title}>
                {item.capitalName}&nbsp;
              </span>
              <NumberCel number={item.amount}>
                {moneyFormat({ num: item.amount })}
              </NumberCel>
            </div>
          ) : null,
        )}
        {/* 最多显示3条 */}
        {listData?.[0]?.capitalDetails?.length > 3 && (
          <span
            className={styles.cell_more}
            onClick={() =>
              handleDetailModal(listData?.[0]?.capitalDetails, value)
            }
          >
            查看全部
          </span>
        )}
      </div>
    );
  };

  const getCalendarData = async () => {
    const { headObjectCode, objectCode, parentObjectCode } = paramsForList;
    const res = await getCalendarDetails({
      month: moment(date).format('MM'),
      year: moment(date).format('yyyy'),
      fundCode: headObjectCode === 'fund_code' ? objectCode : parentObjectCode,
      astUnitId: headObjectCode === 'ast_unit_code' ? objectCode : undefined,
    });
    setCalendarData(res?.records);
    setUpdateDate(moment().format('yyyy-MM-DD HH:mm:ss'));
  };

  useEffect(() => {
    if (paramsForList) {
      getCalendarData();
    }
  }, [paramsForList, date]);

  return (
    <div>
      {headerRender('fundCalendar')}
      <div style={{ display: 'flex' }}>
        <div
          className={styles.fund_calendar}
          style={{
            width: calendarDetailVisible ? 'calc(100% - 400px)' : undefined,
          }}
        >
          <div style={{ overflow: 'auto', height: 'calc(100vh - 192px)' }}>
            <Calendar
              value={date}
              onPanelChange={CalendarChange}
              dateCellRender={dateCellRender}
              // validRange={[
              //   moment(date).startOf('month'),
              //   moment(date).endOf('month'),
              // ]}
            />
          </div>
        </div>
        {calendarDetailVisible && (
          <div
            className={styles.fund_calendar}
            style={{
              height: 'calc(100vh - 180px)',
              width: 390,
              marginLeft: 10,
            }}
          >
            <CalendarDetail
              visible={calendarDetailVisible}
              onCancel={closeDetailModal}
              modalTableData={modalTableData}
              setModalTableData={setModalTableData}
            />
          </div>
        )}
      </div>
    </div>
  );
};
