/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-14 12:54:31
 * @LastEditTime: 2025-02-25 20:11:34
 * @LastEditors: guoxuan
 */

import { LockOutlined } from '@ant-design/icons';
import { queryTradePositionForecastInfo } from '@asset360/apis/position';
import CustomModal from '@asset360/components/CustomModal';
import OperationColunm from '@asset360/components/OperationColunm';
import { CustomTableWithYScroll, moneyFormat } from 'iblive-base';
import moment from 'moment';
import { useEffect, useState } from 'react';
import NumberCel from '../../components/NumberCel';
import styles from '../index.less';
import TradeEditModal from './TradeEditModal';
export default ({
  visible,
  onCancel,
  title,
  type,
  astUnitId,
  fundCode,
  updateDate,
}) => {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [editVisible, setEditVisible] = useState(false);

  const [info, setInfo] = useState({});

  const [expandedKeys, setExpandedKeys] = useState([]);

  const [overViewInfo, setOverViewInfo] = useState('');

  const queryData = async () => {
    setLoading(true);
    const res = await queryTradePositionForecastInfo({
      businDate: moment(updateDate).format('YYYYMMDD'),
      fundCode,
      type,
      astUnitId,
    });
    setData(res?.records?.filter((item) => item.code != '0'));
    setOverViewInfo(res?.records?.find((item) => item.code == '0'));
    setExpandedKeys(
      res?.records
        ?.filter((item) => item.code != '0')
        ?.map((item) => item.code),
    );
    setLoading(false);
  };

  useEffect(() => {
    if (visible) {
      queryData();
    }
  }, [visible]);

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
              <span style={{ color, fontWeight }}>
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

  return (
    <>
      <CustomModal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {title}
            <div style={{ fontSize: 12, marginLeft: 8 }}>
              {overViewInfo?.t0Amount || overViewInfo?.t0Amount === 0 ? (
                <div>
                  <span
                    style={{
                      fontWeight: 'bold',
                      color:
                        overViewInfo?.t0Amount >= 0
                          ? 'var(--text-color)'
                          : '#ef5350',
                    }}
                  >
                    {moneyFormat({ num: overViewInfo?.t0Amount, decimal: 2 })}
                  </span>
                  （金额）
                </div>
              ) : null}
              {overViewInfo?.formulaZh ? (
                <div>{overViewInfo?.formulaZh}（公式）</div>
              ) : null}
              {overViewInfo?.formulaNote ? (
                <div>{overViewInfo?.formulaNote}</div>
              ) : null}
            </div>
          </div>
        }
        width="55vw"
        footer={null}
        visible={visible}
        onCancel={onCancel}
        maskClosable={false}
        style={{ top: 30 }}
        bodyStyle={{ maxHeight: '80vh' }}
        destroyOnClose
      >
        <CustomTableWithYScroll
          dataSource={data}
          rowKey="code"
          columns={columns}
          rowClassName={(record) => {
            if (!record.isPos) {
              return styles.title;
            } else if (record.indexLevel == 2) {
              return styles.indexLevel;
            }
          }}
          expandedRowKeys={expandedKeys}
          onExpandedRowsChange={(keys) => {
            setExpandedKeys(keys);
          }}
          loading={loading}
          pagination={false}
          height={'75vh'}
        />
      </CustomModal>

      <TradeEditModal
        visible={editVisible}
        onCancel={() => {
          setEditVisible(false);
          setInfo({});
        }}
        updateData={queryData}
        info={info}
        fundCode={fundCode}
        businDate={updateDate}
      />
    </>
  );
};
