/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-12 16:28:06
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 * @LastEditTime: 2024-07-04 10:32:07
 * @FilePath: \invest-index-server-front\src\pages\monitor\CashPosition\views\CashForecast\EditModal.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import CustomModal from '@asset360/components/CustomModal';
import { Button } from 'antd';
import { CustomTable } from 'iblive-base';
import { useEffect, useState } from 'react';

const pageSize = 9;
export default ({ visible, onCancel, detailModalParam }) => {
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (visible) {
      const { column, tableData } = detailModalParam;
      setTableLoading(true);
      setTableData(tableData);
      setColumns(column);
      setTableLoading(false);
    } else {
      setTableData([]);
      setColumns([]);
    }
  }, [visible]);

  return (
    <CustomModal
      title={'查看明细'}
      visible={visible}
      width={'70%'}
      bodyStyle={{ minHeight: '55vh' }}
      onCancel={onCancel}
      footer={<Button onClick={onCancel}>关闭</Button>}
    >
      <CustomTable
        pageSize={pageSize}
        bordered={false}
        dataSource={tableData}
        loading={tableLoading}
        columns={columns}
      />
    </CustomModal>
  );
};
