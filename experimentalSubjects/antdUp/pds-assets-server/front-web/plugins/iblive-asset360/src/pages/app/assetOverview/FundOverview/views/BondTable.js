import { executeApi } from '@asset360/apis/appCommon';
import OverviewTable from '@asset360/components/OverviewTable';
import { moneyFormat } from 'iblive-base';
import { sumBy } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import styles from '../index.less';

const columns = [
  {
    title: '序号',
    dataIndex: 'code',
    fixed: 'left',
    render: (text, record) =>
      record?.secTypeName === '合计' ? (
        <span style={{ color: 'var(--sider-hover-color)', fontWeight: 'bold' }}>
          {text}
        </span>
      ) : (
        text
      ),
  },
  {
    title: '债券品种',
    dataIndex: 'secTypeName',
    fixed: 'left',
    render: (text) =>
      text === '合计' ? (
        <span style={{ color: 'var(--sider-hover-color)', fontWeight: 'bold' }}>
          {text}
        </span>
      ) : (
        text
      ),
  },
  {
    title: '公允价值（元）',
    dataIndex: 'marketValue',
    align: 'right',
    render: (text) => moneyFormat({ num: text, unit: '' }),
  },
  {
    title: '占基金资产净值比例（%）',
    dataIndex: 'netAssetRatio',
    align: 'right',
    render: (text) => moneyFormat({ num: text, unit: '' }),
  },
];

const BondTable = ({ productCode }) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    const res = await executeApi({
      serviceId: 'DD_API_FUND_BOND_TYPE_ASSET',
      data: {
        fundCode: productCode,
        businDate: moment().format('YYYYMMDD'),
      },
    });
    setLoading(false);
    setData([
      ...(res?.records ?? []),
      {
        secTypeName: '合计',
        marketValue: sumBy(res?.records ?? [], 'marketValue'),
        netAssetRatio: sumBy(res?.records ?? [], 'netAssetRatio'),
      },
    ]);
  };

  useEffect(() => {
    if (productCode) {
      setLoading(true);
      getData();
    }
  }, [productCode]);

  return (
    <div className="blank-card-asset">
      <div className="important-title m-b-8">债券品种配置</div>
      <OverviewTable
        showTotal={false}
        pagination={false}
        dataSource={data}
        columns={columns}
        loading={loading}
        onRow={(record) =>
          record.secTypeName === '合计'
            ? { className: styles.selected_row }
            : {}
        }
      />
    </div>
  );
};
export default BondTable;
