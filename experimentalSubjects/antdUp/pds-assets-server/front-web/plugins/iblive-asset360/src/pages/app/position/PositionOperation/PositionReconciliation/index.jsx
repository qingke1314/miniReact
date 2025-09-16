import { UploadOutlined } from '@ant-design/icons';
import { getFundTreeByAuth } from '@asset360/apis/position';
import { queryPositionCompareInfo } from '@asset360/apis/PositionReconciliation';
import { Col, DatePicker, Form, Input, Row, Spin } from 'antd-v5';
import { desensitization, moneyFormat, requestUtils } from 'iblive-base';
import moment from 'moment';
import { useEffect, useState } from 'react';
import PositionButton from '../../components/PositionButton';
import PositionContent from '../../components/PositionCotent/PositionContent';
import PositionSelect from '../../components/PositionSelect';

const INIT_NODE = [
  {
    isLeaf: false,
    title: '公募',
    key: -1,
    selectable: false,
  },
  {
    isLeaf: false,
    title: '私募',
    key: -2,
    selectable: false,
  },
];
export default () => {
  const { DownloadFile } = requestUtils;
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(false);
  const [treeLoading, setTreeLoading] = useState(false);
  const [data, setData] = useState([]);
  const [node, setNode] = useState('');
  const [form] = Form.useForm();
  const [expandedKeys, setExpandedKeys] = useState([-1, -2]);
  const formatData = (array) => {
    if (array?.length > 0) {
      return array.map((item) => ({
        ...item,
        children: formatData(item.children),
      }));
    } else {
      return null;
    }
  };

  const getData = async (object) => {
    setLoading(true);
    const { businDate, compareResult, positionName } = form.getFieldsValue();
    const params = {
      ...object,
      businDate: moment(businDate).format('YYYYMMDD'),
      compareResult,
      positionName,
    };

    const res = await queryPositionCompareInfo(params);
    if (res?.code > 0) {
      setData(formatData(res?.records || []));
    }
    setLoading(false);
  };

  // 选中显示节点
  const onSelectIndex = (_, { selectedNodes }) => {
    form.resetFields();
    const { parentKey, isLeaf, key } = selectedNodes[0];
    const object = {};
    if (isLeaf) {
      object.fundCode = parentKey;
      object.astUnitId = key;
    } else {
      object.fundCode = key;
    }
    setNode(object);
    getData(object);
  };

  const udateTreeData = async () => {
    setTreeLoading(true);
    const res = await getFundTreeByAuth();
    const array =
      res?.records.map((item) => ({
        isLeaf: false,
        title: `${desensitization(item.objectCode)} ${desensitization(
          item.objectName,
        )}`,
        key: item.objectCode,
        selectable: true,
        parentKey: item.parentKey,
        children: item.childrenObjects?.map((child) => ({
          isLeaf: true,
          title: `${desensitization(item.objectName)}`,
          key: child.objectCode,
          selectable: true,
          parentKey: child.parentKey,
          fundCode: item.objectCode,
          fundName: item.objectName,
        })),
      })) || [];
    const array1 = array.filter((item) => item.parentKey == 1);
    const array2 = array.filter((item) => item.parentKey == 2);
    INIT_NODE[0].children = [...array1];
    INIT_NODE[1].children = [...array2];
    setTree(INIT_NODE);
    setTreeLoading(false);
  };

  useEffect(() => {
    udateTreeData();
  }, []);

  const digital = (text) => {
    const needColor = text >= '' ? false : true;
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {text !== '' && text !== null
          ? moneyFormat({ num: text, decimal: 2, needColor })
          : '--'}
      </div>
    );
  };

  const result = (text) => {
    const color = !text ? undefined : '#ef5350';
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', color }}>
        {text === 0
          ? '一致'
          : text
          ? moneyFormat({ num: text, decimal: 2 })
          : '--'}
      </div>
    );
  };
  const columns = [
    {
      dataIndex: 'name',
      title: '项目',
    },
    {
      dataIndex: 'systemData',
      title: '系统数据',
      align: 'center',
      children: [
        {
          dataIndex: 'iborAmtT0',
          title: 'T0金额',
          align: 'center',
          render: (text, record) => (record?.isPos ? digital(text) : null),
        },
      ],
    },
    {
      dataIndex: 'financialData',
      title: '财务数据',
      align: 'center',
      children: [
        {
          dataIndex: 'accountCode',
          title: '财务科目',
          align: 'center',
          render: (text, record) => (record?.isPos ? text || '--' : null),
        },
        {
          dataIndex: 'faAmtT0',
          title: '科目结果',
          align: 'center',
          render: (text, record) => (record?.isPos ? digital(text) : null),
        },
        {
          dataIndex: 'iborSubFaAmt',
          title: '结果差值',
          align: 'center',
          render: (text, record) => (record?.isPos ? result(text) : null),
        },
      ],
    },
    {
      dataIndex: 'O32Data',
      title: 'O32数据',
      align: 'center',
      children: [
        {
          dataIndex: 'o32AmtT0',
          title: 'T0金额',
          align: 'center',
          render: (text, record) => (record?.isPos ? digital(text) : null),
        },
        {
          dataIndex: 'iborSubO32Amt',
          title: '结果差值',
          align: 'center',
          render: (text, record) => (record?.isPos ? result(text) : null),
        },
      ],
    },
  ];
  return (
    <Spin spinning={loading}>
      <PositionContent
        columns={columns}
        tree={tree}
        setTree={setTree}
        treeLoading={treeLoading}
        setExpandedKeys={setExpandedKeys}
        expandedKeys={expandedKeys}
        updateTree={udateTreeData}
        data={data}
        onSelectIndex={onSelectIndex}
        selectIndex={node}
        header={
          <Row justify="space-between" align="middle">
            <Col>
              <Form
                form={form}
                style={{ alignItems: 'center' }}
                onValuesChange={() => {
                  getData(node);
                }}
              >
                <Row gutter={8}>
                  <Col>
                    <Form.Item
                      name="businDate"
                      style={{ marginBottom: 0 }}
                      initialValue={moment()}
                    >
                      <DatePicker
                        style={{ height: 28 }}
                        placeholder={'对账日期'}
                        allowClear={false}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item name="compareResult" style={{ marginBottom: 0 }}>
                      <PositionSelect
                        options={[
                          { label: '一致', value: 1 },
                          { label: '不一致', value: 2 },
                        ]}
                        text={'比对结果'}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item name="positionName" style={{ marginBottom: 0 }}>
                      <Input
                        allowClear
                        size="small"
                        placeholder="核对项目"
                        style={{ height: 28, width: 200 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>

            <Col>
              <PositionButton
                text={'导出'}
                func={async () => {
                  const {
                    businDate,
                    compareResult,
                    positionName,
                  } = form.getFieldsValue();
                  const params = {
                    ...node,
                    businDate: moment(businDate).format('YYYYMMDD'),
                    compareResult,
                    positionName,
                  };

                  DownloadFile('/pds/position/compare/exportPositionForecast', {
                    method: 'GET',
                    params: {
                      ...params,
                    },
                  });
                }}
                icon={
                  <UploadOutlined
                    style={{ height: 12, width: 12, marginRight: -2 }}
                  />
                }
              />
            </Col>
          </Row>
        }
      />
    </Spin>
  );
};
