import { executeApi } from '@asset360/apis/appCommon';
import OverviewTable from '@asset360/components/OverviewTable';
import { Col, DatePicker, Form, Radio, Row, Select, Space } from 'antd-v5';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const HistoryAnalysis = ({
  selectTreeKey,
  productCode,
  height,
  columnsObj,
  unit,
  setUnit,
  combinationList,
  combination,
  setCombination,
}) => {
  const { astUnitId } = useSelector((state) => state.asset360AssetLayout);
  const [tableData, setTableData] = useState();
  const [tableLoading, setTableLoading] = useState(false);
  const [searchForm] = Form.useForm();
  let historyColumnsObj = cloneDeep(columnsObj);
  // const [columns, setColumns] = useState();

  const handleTableUpdate = async () => {
    setTableLoading(true);
    let serviceId;
    switch (selectTreeKey) {
      case 'gupiao':
        serviceId = 'DD_API_MUTUAL_STOCK_ANALYSIS_INTRADAY';
        break;
      case 'zhaiquan':
        serviceId = 'DD_API_MUTUAL_BOND_ANALYSIS_INTRADAY';
        break;
      case 'jijinlicai':
        serviceId = 'DD_API_MUTUAL_TOT_ASSET_ANALYSIS_INTRADAY';
        break;
      case 'huigou':
        serviceId = 'DD_API_MUTUAL_REPO_ANALYSIS_INTRADAY';
        break;
      case 'qihuo':
        serviceId = 'DD_API_MUTUAL_FUTURES_ANALYSIS_INTRADAY';
        break;
      case 'qiquan':
        serviceId = 'DD_API_MUTUAL_OPTIONS_ANALYSIS_INTRADAY';
        break;
      case 'qita':
        serviceId = 'DD_API_MUTUAL_OTHER_ANALYSIS_INTRADAY';
        break;
      case 'cunkuan':
        serviceId = 'DD_API_MUTUAL_BOND_ANALYSIS_INTRADAY';
        break;
      default:
        break;
    }
    const { businDate } = searchForm.getFieldsValue();
    const res = await executeApi({
      serviceId,
      data: {
        fundCode: productCode,
        astUnitId,
        businDate: moment(businDate).format('yyyyMMDD'),
        combiCode: combination ?? null,
      },
    });
    //过滤掉持仓数量为0数据
    const data = res?.records?.filter((item) => item.currentQty !== 0) || [];
    setTableData(data);
    setTableLoading(false);
  };

  const disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  useEffect(() => {
    handleTableUpdate();
  }, [selectTreeKey, productCode, combination, astUnitId]);

  return (
    <div style={{ padding: '0 8px' }}>
      <Form form={searchForm}>
        <Row gutter={8} justify="space-between" className="m-b-8">
          <Col flex={1}>
            <Space>
              <Space align="center">
                <span style={{ color: 'var(--important-text-color)' }}>
                  组合:
                </span>
                <Select
                  style={{ minWidth: 200 }}
                  options={combinationList}
                  allowClear
                  value={combination}
                  onChange={setCombination}
                />
              </Space>
              <Form.Item
                name="businDate"
                style={{ marginBottom: 0 }}
                label="查询日期"
                initialValue={moment().subtract(1, 'days')}
              >
                <DatePicker
                  allowClear={false}
                  disabledDate={disabledDate}
                  onChange={handleTableUpdate}
                />
              </Form.Item>
            </Space>
          </Col>
          <Col>
            <Space>
              单位 :
              <Radio.Group
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                optionType="button"
                buttonStyle="solid"
              >
                <Radio value={1}>元</Radio>
                <Radio value={10000}>万</Radio>
                <Radio value={100000000}>亿</Radio>
              </Radio.Group>
            </Space>
          </Col>
        </Row>
      </Form>
      <OverviewTable
        dataSource={tableData}
        loading={tableLoading}
        columns={
          historyColumnsObj[
            ['qihuo', 'qita', 'qiquan']?.includes(selectTreeKey)
              ? 'qihuo'
              : ['yingshou', 'yingfu']?.includes(selectTreeKey)
              ? 'yingshou'
              : selectTreeKey
          ]
        }
        pagination={false}
        height={`calc(${height}px - 155px )`}
      />
    </div>
  );
};

export default HistoryAnalysis;
