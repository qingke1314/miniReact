/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-12 16:28:06
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 * @LastEditTime: 2024-12-05 14:52:22
 * @FilePath: \invest-index-server-front\src\pages\monitor\CashPosition\views\CashForecast\EditModal.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { moneyFormat } from 'iblive-base';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useEffect } from 'react';
import NumberCel from '../../../components/NumberCel';
import PositionTable from '../../../components/PositionTable';
import styles from '../../index.less';

const pageSize = 15;
export default ({ visible, modalTableData, setModalTableData, onCancel }) => {
  const columns = [
    {
      title: '资金名称',
      dataIndex: 'capitalName',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      align: 'right',
      render: (text) => (
        <NumberCel number={text}>{moneyFormat({ num: text })}</NumberCel>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];

  useEffect(() => {
    if (!visible) {
      setModalTableData({});
    }
  }, [visible]);

  return (
    <div>
      <div className="important-title m-b-8 m-t-8">{'资金业务详情'}</div>
      <span className={styles.close_time}>{modalTableData?.date}</span>
      <Button onClick={() => onCancel()} className={styles.close_detail_icon}>
        <CloseOutlined />
      </Button>
      <PositionTable
        pageSize={pageSize}
        dataSource={modalTableData?.tableData || []}
        columns={columns}
      />
    </div>
  );
};
