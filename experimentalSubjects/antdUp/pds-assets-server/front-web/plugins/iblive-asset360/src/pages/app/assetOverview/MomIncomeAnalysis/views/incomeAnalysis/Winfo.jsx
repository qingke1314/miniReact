import { CustomTableWithYScroll } from 'iblive-base';
import { moneyFormat } from 'iblive-base';
import { executeApi } from '@asset360/apis/appCommon';
import { useEffect, useState } from 'react';

const Winfo = ({ productCode }) => {
  const [info, setInfo] = useState([]);
  const [columns, setColumns] = useState([]);
  useEffect(() => {
    if (!productCode) {
      return;
    }
    executeApi({
      serviceId: 'DD_API_FUND_PROFIT_STAGE',
      data: {
        fundCode: productCode,
      },
    }).then((res) => {
      const columns = [
        {
          title: '维度',
          dataIndex: 'dimName',
        },
      ].concat(
        (res?.records || []).map((e) => {
          return {
            title: e.itemName,
            dataIndex: e.itemName,
            render: (text) => (
              <div style={{ height: 32, lineHeight: '32px' }}>
                {!isNaN(text)
                  ? moneyFormat({
                      num: text || 0,
                      decimal: 4,
                      needColor: true,
                    })
                  : '--'}
              </div>
            ),
            align: 'right',
          };
        }),
      );
      const tableData = (res?.records || []).reduce(
        (prev, e) => {
          prev[0][e.itemName] = e.profitRate;
          prev[1][e.itemName] = e.sharpeRate;
          prev[2][e.itemName] = e.informationRate;
          return prev;
        },
        [
          {
            dimName: '阶段收益(%)',
          },
          {
            dimName: '夏普比率(%)',
          },
          {
            dimName: '信息比率(%)',
          },
        ],
      );
      setColumns(columns);
      setInfo(tableData);
    });
  }, [productCode]);
  return (
    <CustomTableWithYScroll
      style={{ margin: '8px 8px 0 0' }}
      dataSource={info}
      height={460}
      columns={columns}
    />
  );
};

export default Winfo;
