/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-07-16 10:05:56
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 * @LastEditTime: 2024-10-17 10:00:56
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\AssetInventory\views\ReceivableHandleModal.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import CustomModal from '@asset360/components/CustomModal';
import PositionTable from '@asset360/components/PositionTable';
import { Button } from 'antd-v5';
import { getFormatDate, moneyFormat } from 'iblive-base';
import { useEffect, useState } from 'react';

const pageSize = 8;
export default function R({
  visible,
  onCancel,
  receivableTableRecord,
  selectTreeKey,
}) {
  const [tableData, setTableData] = useState();
  const [tableLoading, setTableLoading] = useState(false);

  const column = [
    {
      title: '流水序号',
      dataIndex: 'seqNo',
    },
    {
      title: '发生日期',
      dataIndex: 'occurDate',
      render: (text) => getFormatDate(text),
    },
    {
      title: '发生时间',
      dataIndex: 'occurTime',
    },
    {
      title: '款项名称',
      dataIndex: 'itemName',
    },
    {
      title: '资产单元序号',
      dataIndex: 'astUnitId',
    },
    {
      title: '组合代码',
      dataIndex: 'combiCode',
    },
    {
      title: '资金发生额',
      dataIndex: 'occurAmount',
      render: (text) => moneyFormat({ num: text }),
      align: 'right',
    },
    {
      title: '交易费用',
      dataIndex: 'tradeFee',
      render: (text) => moneyFormat({ num: text }),
      align: 'right',
    },
    {
      title: '证券内码',
      dataIndex: 'interCode',
    },
    {
      title: '资金方向',
      dataIndex: 'tradeDirection',
    },
    {
      title: '币种',
      dataIndex: 'crrcNo',
    },
    // {
    //   title: '状态',
    //   dataIndex: 'status',
    // },
  ];

  useEffect(() => {
    if (visible && receivableTableRecord) {
      setTableLoading(true);
      setTableData(receivableTableRecord?.detail || []);
      setTableLoading(false);
    } else {
      setTableData([]);
    }
  }, [visible]);

  return (
    <CustomModal
      title={`${selectTreeKey === 'yingshou' ? '应收' : '应付'}明细`}
      visible={visible}
      onCancel={onCancel}
      size="big"
      needChangeSize
      footer={<Button onClick={onCancel}>关闭</Button>}
    >
      <PositionTable
        dataSource={tableData}
        loading={tableLoading}
        columns={column}
        height={450}
        pageSize={pageSize}
      />
    </CustomModal>
  );
}
