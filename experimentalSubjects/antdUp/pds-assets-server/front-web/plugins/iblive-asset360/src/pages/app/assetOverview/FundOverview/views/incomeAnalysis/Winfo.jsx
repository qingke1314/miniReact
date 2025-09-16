import { CustomTableWithYScroll } from 'iblive-base';
import { moneyFormat } from 'iblive-base';
import { executeApi } from '@asset360/apis/appCommon';
import { useEffect, useState } from 'react';

const Winfo = ({ productCode }) => {
  const [info, setInfo] = useState([]);
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
      setInfo(res?.records || []);
    });
  }, [productCode]);
  return (
    <div>
      <CustomTableWithYScroll
        style={{ marginRight: 8 }}
        dataSource={info}
        height={360}
        columns={[
          {
            title: '时间',
            dataIndex: 'itemName',
          },
          {
            title: '阶段盈亏(%)',
            dataIndex: 'profitRate',
            render: (text) => (
              <div style={{ height: 32, lineHeight: '32px' }}>
                {moneyFormat({
                  num: (text || 0) * 100,
                  decimal: 4,
                  needColor: true,
                })}
              </div>
            ),
            align: 'right',
          },
        ]}
      />
    </div>
  );
};

export default Winfo;
