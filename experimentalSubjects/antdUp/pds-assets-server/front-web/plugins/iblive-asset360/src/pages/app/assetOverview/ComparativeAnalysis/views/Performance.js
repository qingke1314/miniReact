/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-11-20 08:56:11
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-11-21 14:26:35
 * @Description:
 */
import OverviewTable from '@asset360/components/OverviewTable';
import { moneyFormat } from 'iblive-base';
import { isNumber } from 'lodash';

const firstColWidth = 180;

const initColumn = {
  title: '阶段收益',
  dataIndex: 'item',
  width: firstColWidth,
};

const initData = [
  {
    item: '成立日期',
  },
  {
    item: '近1周',
  },
  {
    item: '近1月',
  },
  {
    item: '近3月',
  },
  {
    item: '近6月',
  },
  {
    item: '近1年',
  },
  {
    item: '近2年',
  },
  {
    item: '近3年',
  },
  {
    item: '近5年',
  },
  {
    item: '成立来',
  },
];

const data = [
  [
    '2021-06-16',
    -0.0957,
    -0.0459,
    -0.04,
    0.1201,
    -0.0951,
    -0.0665,
    -0.2182,
    -0.4013,
    ,
    -0.3771,
  ],
  [
    '2022-07-27',
    0.0733,
    -0.0002,
    0.0037,
    0.0398,
    0.0169,
    0.0723,
    0.1031,
    ,
    ,
    0.0959,
  ],
];
export default ({ productList }) => {
  const columns = [
    initColumn,
    ...(productList || []).map((item) => ({
      title: (
        <div style={{ textAlign: 'center' }}>
          <p>{item.fundCode}</p>
          <p>{item.fundName}</p>
        </div>
      ),
      dataIndex: item.fundCode,
      width: 200,
      align: 'right',
      render: (text, record, index) =>
        index < 1
          ? text
          : isNumber(text)
          ? text
            ? moneyFormat({ num: text * 100, unit: '%', needColor: true })
            : `0.00%`
          : '--',
    })),
  ];
  const dataSource = initData.map((item, index) => {
    const node = { ...item };
    productList.forEach(({ fundCode }, fundIndex) => {
      node[fundCode] = data[fundIndex][index];
    });
    return node;
  });
  return (
    <>
      <div className="important-title m-b-8">业绩表现</div>
      <div
        style={{
          width: firstColWidth + 2 + productList?.length * 200,
          maxWidth: '100%',
        }}
      >
        <OverviewTable
          showTotal={false}
          pagination={false}
          columns={columns}
          dataSource={dataSource}
        />
      </div>
    </>
  );
};
