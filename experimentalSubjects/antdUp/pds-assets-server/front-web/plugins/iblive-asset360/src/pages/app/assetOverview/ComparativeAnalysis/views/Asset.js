/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-11-14 14:43:38
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-11-21 14:41:14
 * @Description:
 */
import OverviewTable from '@asset360/components/OverviewTable';
import { moneyFormat } from 'iblive-base';
import { isNumber } from 'lodash';

const firstColWidth = 180;

const initColumn_1 = {
  title: '资产',
  dataIndex: 'item',
  width: firstColWidth,
};
const initColumn_2 = {
  title: '行业配置',
  dataIndex: 'item',
  width: firstColWidth,
};
const initColumn_3 = {
  title: '前10大持仓',
  dataIndex: 'item',
  width: firstColWidth,
  render: (text, record, index) => index + 1,
};
const initColumn_4 = {
  title: '前5大债券',
  dataIndex: 'item',
  width: firstColWidth,
  render: (text, record, index) => index + 1,
};

export default ({ productList }) => {
  const columns_1 = [
    initColumn_1,
    ...(productList || []).map((item) => ({
      title: (
        <div style={{ textAlign: 'center' }}>
          <p>{item.fundCode}</p>
          <p>{item.fundName}</p>
        </div>
      ),
      dataIndex: item.fundCode,
      align: 'right',
      width: 200,
      render: (text, record, index) =>
        index < 1
          ? moneyFormat({ num: text })
          : isNumber(text)
          ? text
            ? moneyFormat({ num: text * 100, unit: '%', needColor: true })
            : `0.00%`
          : '--',
    })),
  ];
  const columns_2 = [
    initColumn_2,
    ...(productList || []).map((item) => ({
      dataIndex: item.fundCode,
      align: 'right',
      width: 200,
      render: (text) =>
        isNumber(text)
          ? text
            ? moneyFormat({ num: text * 100, unit: '%', needColor: true })
            : `0.00%`
          : '--',
    })),
  ];
  const columns_3 = [
    initColumn_3,
    ...(productList || []).map((item) => ({
      dataIndex: item.fundCode,
      align: 'right',
      width: 200,
      render: (text) => {
        const { stock, percent } = text || {};
        return stock ? (
          <div style={{ textAlign: 'right' }}>
            <p>{stock}</p>
            <p>{moneyFormat({ num: percent * 100, unit: '%' })}</p>
          </div>
        ) : null;
      },
    })),
  ];
  const columns_4 = [
    initColumn_4,
    ...(productList || []).map((item) => ({
      dataIndex: item.fundCode,
      align: 'right',
      width: 200,
      render: (text) => {
        const { stock, percent } = text || {};
        return stock ? (
          <div style={{ textAlign: 'right' }}>
            <p>{stock}</p>
            <p>{moneyFormat({ num: percent * 100, unit: '%' })}</p>
          </div>
        ) : (
          '--'
        );
      },
    })),
  ];

  const initData_1 = [
    {
      item: '份额规模（亿份）',
      [productList[0].fundCode]: 1.32,
      [productList[1].fundCode]: 19.11,
    },
    {
      item: '股票占净比',
      [productList[0].fundCode]: 0.9401,
      [productList[1].fundCode]: 0.2009,
    },
    {
      item: '债券占净比',
      [productList[0].fundCode]: 0.0091,
      [productList[1].fundCode]: 0.8249,
    },
    {
      item: '现金占净比',
      [productList[0].fundCode]: 0.0581,
      [productList[1].fundCode]: 0.0184,
    },
    {
      item: '前10持股集中度',
      [productList[0].fundCode]: 0.467,
      [productList[1].fundCode]: 0.1094,
    },
  ];

  const initData_2 = [
    {
      item: '制造业',
      [productList[0].fundCode]: 0.5655,
      [productList[1].fundCode]: 0.0685,
    },
    {
      item: '金融业',
      [productList[0].fundCode]: 0.0307,
      [productList[1].fundCode]: '',
    },
    {
      item: '房地产业',
      [productList[0].fundCode]: 0.075,
      [productList[1].fundCode]: 0.0108,
    },
    {
      item: '信息技术业',
      [productList[0].fundCode]: '',
      [productList[1].fundCode]: '',
    },
    {
      item: '农林牧渔业',
      [productList[0].fundCode]: 0.0708,
      [productList[1].fundCode]: '',
    },
    {
      item: '采掘业',
      [productList[0].fundCode]: 0.1578,
      [productList[1].fundCode]: 0.0312,
    },
    {
      item: '批发零售业',
      [productList[0].fundCode]: '',
      [productList[1].fundCode]: '',
    },
    {
      item: '交通运输业',
      [productList[0].fundCode]: 0.007,
      [productList[1].fundCode]: 0.0041,
    },
    {
      item: '建筑业',
      [productList[0].fundCode]: '',
      [productList[1].fundCode]: '',
    },
    {
      item: '社会服务业',
      [productList[0].fundCode]: '',
      [productList[1].fundCode]: '',
    },
  ];
  const initData_3 = [
    {
      [productList[0].fundCode]: {
        stock: '澜起科技',
        percent: 0.0638,
      },
      [productList[1].fundCode]: {
        stock: '中煤能源',
        percent: 0.0166,
      },
    },
    {
      [productList[0].fundCode]: {
        stock: '洛阳钼业',
        percent: 0.0606,
      },
      [productList[1].fundCode]: {
        stock: '中国海洋石油',
        percent: 0.0128,
      },
    },
    {
      [productList[0].fundCode]: {
        stock: '宁德时代',
        percent: 0.0585,
      },
      [productList[1].fundCode]: {
        stock: '株冶集团',
        percent: 0.012,
      },
    },
    {
      [productList[0].fundCode]: {
        stock: '紫金矿业',
        percent: 0.0512,
      },
      [productList[1].fundCode]: {
        stock: '紫金矿业',
        percent: 0.0113,
      },
    },
    {
      [productList[0].fundCode]: {
        stock: '牧原股份',
        percent: 0.043,
      },
      [productList[1].fundCode]: {
        stock: '招商蛇口',
        percent: 0.0108,
      },
    },
    {
      [productList[0].fundCode]: {
        stock: '阳光电源',
        percent: 0.0422,
      },
      [productList[1].fundCode]: {
        stock: '宁德时代',
        percent: 0.0106,
      },
    },
    {
      [productList[0].fundCode]: {
        stock: '新易盛',
        percent: 0.042,
      },
      [productList[1].fundCode]: {
        stock: '中信股份',
        percent: 0.0096,
      },
    },
    {
      [productList[0].fundCode]: {
        stock: '中际旭创',
        percent: 0.0381,
      },
      [productList[1].fundCode]: {
        stock: '广深铁路股份',
        percent: 0.0093,
      },
    },
    {
      [productList[0].fundCode]: {
        stock: '森麒麟',
        percent: 0.0354,
      },
      [productList[1].fundCode]: {
        stock: '陕西煤业',
        percent: 0.0091,
      },
    },
    {
      [productList[0].fundCode]: {
        stock: '滨江集团',
        percent: 0.0322,
      },
      [productList[1].fundCode]: {
        stock: '淮北矿业',
        percent: 0.0073,
      },
    },
  ];
  const initData_4 = [
    {
      [productList[0].fundCode]: {
        stock: '睿创转债',
        percent: 0.0091,
      },
      [productList[1].fundCode]: {
        stock: '22光大银行',
        percent: 0.0586,
      },
    },
    {
      [productList[1].fundCode]: {
        stock: '22杭州银行债0',
        percent: 0.0429,
      },
    },
    {
      [productList[1].fundCode]: {
        stock: '20中国银行永续',
        percent: 0.0364,
      },
    },
    {
      [productList[1].fundCode]: {
        stock: '20邮储银行永续',
        percent: 0.0329,
      },
    },
    {
      [productList[1].fundCode]: {
        stock: '22中国银行小微',
        percent: 0.0289,
      },
    },
  ];
  return (
    <>
      <div className="important-title m-b-8">资产配置比较</div>
      <div
        style={{
          width: firstColWidth + 2 + productList?.length * 200,
          maxWidth: '100%',
        }}
      >
        <OverviewTable
          showTotal={false}
          pagination={false}
          columns={columns_1}
          dataSource={initData_1}
        />
      </div>
      <div
        style={{
          width: firstColWidth + 2 + productList?.length * 200,
          maxWidth: '100%',
        }}
      >
        <OverviewTable
          showTotal={false}
          pagination={false}
          columns={columns_2}
          dataSource={initData_2}
        />
      </div>
      <div
        style={{
          width: firstColWidth + 2 + productList?.length * 200,
          maxWidth: '100%',
        }}
      >
        <OverviewTable
          showTotal={false}
          pagination={false}
          columns={columns_3}
          dataSource={initData_3}
        />
      </div>
      <div
        style={{
          width: firstColWidth + 2 + productList?.length * 200,
          maxWidth: '100%',
        }}
      >
        <OverviewTable
          showTotal={false}
          pagination={false}
          columns={columns_4}
          dataSource={initData_4}
        />
      </div>
    </>
  );
};
