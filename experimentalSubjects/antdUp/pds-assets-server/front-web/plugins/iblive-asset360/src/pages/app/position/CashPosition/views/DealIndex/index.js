import { LockOutlined } from '@ant-design/icons';
import { queryTradePositionForecastInfo } from '@asset360/apis/position';
import OperationColunm from '@asset360/components/OperationColunm';
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

export default forwardRef(
  (
    { headerRender, paramsForList, date, type, FOREAST_INDEX, setUpdateDate },
    ref,
  ) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [info, setInfo] = useState({});
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [overViewInfo, setOverViewInfo] = useState('');
    const tableWrapperRef = useRef();
    const tableWrapperHeight = useGetHeight(tableWrapperRef.current, 300);
    const tableHeight = tableWrapperHeight - 87;

    const getData = async () => {
      setLoading(true);
      const { headObjectCode, objectCode, parentObjectCode } = paramsForList;
      const res = await queryTradePositionForecastInfo({
        businDate: moment(date).format('yyyyMMDD'),
        fundCode:
          headObjectCode === 'fund_code' ? objectCode : parentObjectCode,
        astUnitId: headObjectCode === 'ast_unit_code' ? objectCode : undefined,
        type,
      });
      setData(res?.records?.filter((item) => item.code != '0'));
      setOverViewInfo(res?.records?.find((item) => item.code == '0'));
      setExpandedKeys(
        res?.records
          ?.filter((item) => item.code != '0')
          ?.map((item) => item.code),
      );
      setUpdateDate(moment().format('yyyy-MM-DD HH:mm:ss'));
      setLoading(false);
    };

    const columns = [
      {
        dataIndex: 'name',
        title: '项目',
        render: (text, record) => {
          let fontWeight = 500;
          if (record.indexLevel == '2' || !record.isPos) {
            fontWeight = 'bold';
          }

          return <span style={{ fontWeight }}>{text}</span>;
        },
      },
      {
        dataIndex: 't0Amount',
        title: '金额',
        align: 'right',
        render: (text, record) => {
          if (record.isPos) {
            const color =
              record.indexLevel == '1' ? 'var(--text-color)' : '#186df5';
            const fontWeight = record.indexLevel == '1' ? 500 : 'bold';
            return (
              <div style={{ display: 'flex', placeContent: 'flex-end' }}>
                <span style={{ color: color, fontWeight }}>
                  <NumberCel number={text}>
                    {moneyFormat({ num: text || 0, decimal: 2 })}
                  </NumberCel>
                </span>
                {record.t0AmountLocked ? (
                  <LockOutlined style={{ fontSize: 10, marginLeft: 2 }} />
                ) : null}
              </div>
            );
          }
          return null;
        },
      },
      {
        dataIndex: 'operation',
        title: '操作',
        align: 'center',
        render: (text, record) =>
          record.indexLevel == '1' ? (
            <OperationColunm
              showEdit={true}
              editFunc={() => {
                setEditVisible(true);
                setInfo(record);
              }}
            />
          ) : null,
      },
    ];

    useImperativeHandle(ref, () => ({
      getData,
    }));

    useEffect(() => {
      if (paramsForList) {
        getData();
      }
    }, [paramsForList, date, type]);

    return (
      <>
        {headerRender('dealIndex')}
        <div className={styles.deal_index_container} ref={tableWrapperRef}>
          <div className={styles.navigation_wrap}>
            {FOREAST_INDEX.find((item) => item.value == type)?.name}
            <div style={{ fontSize: 15, marginLeft: 12 }}>
              {overViewInfo?.t0Amount || overViewInfo?.t0Amount === 0 ? (
                <div>
                  <span
                    style={{
                      fontWeight: 'bold',
                      color: 'var(--text-color)',
                    }}
                  >
                    <NumberCel number={overViewInfo?.t0Amount}>
                      {moneyFormat({ num: overViewInfo?.t0Amount, decimal: 2 })}
                    </NumberCel>
                  </span>
                  （金额）
                </div>
              ) : null}
              {overViewInfo?.formulaZh ? (
                <div>{overViewInfo?.formulaZh}（公式）</div>
              ) : null}
            </div>
          </div>

          <CustomTableWithYScroll
            dataSource={data}
            rowKey="code"
            columns={columns}
            rowClassName={(record) => {
              if (!record.isPos) {
                return styles.dealindex_title;
              } else if (record.indexLevel == 2) {
                return styles.dealindex_indexLevel;
              }
            }}
            expandedRowKeys={expandedKeys}
            onExpandedRowsChange={(keys) => {
              setExpandedKeys(keys);
            }}
            loading={loading}
            pagination={false}
            height={tableHeight > 300 ? tableHeight : 300}
          />
        </div>
        <EditModal
          visible={editVisible}
          onCancel={() => {
            setEditVisible(false);
            setInfo({});
          }}
          updateData={getData}
          info={info}
          paramsForList={paramsForList}
          date={date}
        />
      </>
    );
  },
);
