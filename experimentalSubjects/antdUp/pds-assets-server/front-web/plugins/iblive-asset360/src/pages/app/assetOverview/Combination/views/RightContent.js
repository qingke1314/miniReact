import { DownOutlined } from '@ant-design/icons';
import { executeApi } from '@asset360/apis/appCommon';
import {
  handleAddHold,
  handleCopyHold,
  handleQueryAllFundWithReal,
  handleRemoveHold,
} from '@asset360/apis/asset360';
import CustomButtonGroup from '@asset360/components/CustomButtonGroup';
import CustomInputNumber from '@asset360/components/CustomInputNumber';
import CustomModal from '@asset360/components/CustomModal';
import CustomTree from '@asset360/components/CustomTree';
import QtyInput from '@asset360/components/QtyInput';
import { Button, Form, message, Popconfirm } from 'antd-v5';
import {
  CustomForm,
  CustomSecSelector,
  CustomTableWithYScroll,
  moneyFormat,
} from 'iblive-base';
import moment from 'moment';
import { useEffect, useState } from 'react';
import styles from '../index.less';

const INIT_TREE_NODE = [
  {
    isLeaf: false,
    title: '全部产品',
    key: '-1',
    level: 'root',
    // icon: <GroupIconUnderTree />,
    icon: null,
  },
];
const RightContent = ({ height, detailInfo }) => {
  const [form] = Form.useForm();
  const [selectedTreeList, setSelectedTreeList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [copyVisible, setCopyVisible] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [tree, setTree] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const onCancel = () => {
    setVisible(false);
  };

  /**
   * 建仓确认
   * @param {} setLoading 建仓弹框按钮loading方法
   */
  const onConfirm = async (setLoading) => {
    const values = await form.validateFields();
    setLoading(true);
    handleAddHold({
      ...values,
      astUnitId: detailInfo.astUnitId,
      businDate: moment().format('YYYYMMDD'),
      combiCode: detailInfo.combiCode,
      fundCode: detailInfo.fundCode,
    })
      .then((res) => {
        if (res?.code > 0) {
          message.success('添加成功');
          setVisible(false);
          getTableData();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getTableData = () => {
    if (!detailInfo?.fundCode) {
      setTableData([]);
      return;
    }
    const { astUnitId, combiCode, fundCode } = detailInfo;
    executeApi({
      serviceId: 'DD_API_MUTUAL_STOCK_ANALYSIS_INTRADAY',
      data: {
        fundCode,
        astUnitId,
        combiCode,
      },
    }).then((res) => {
      if (res?.code > 0) {
        setTableData(res.records || []);
      }
    });
  };

  useEffect(() => {
    getTableData();
  }, [detailInfo]);

  const onCopyCancel = () => {
    setSelectedTreeList([]);
    setCopyVisible(false);
  };

  /**
   * 复制持仓确定
   */
  const onCopy = async (setLoading) => {
    if (selectedTreeList?.length < 1) {
      message.error('请选择持仓');
      return;
    }
    const selectedItem = selectedTreeList[0];
    const {
      astUnitId: fromAstUnitId,
      fundCode: fromFundCode,
      combiCode: fromCombiCode,
    } = selectedItem;
    const {
      astUnitId: toAstUnitId,
      fundCode: toFundCode,
      combiCode: toCombiCode,
    } = detailInfo;
    setLoading(true);
    handleCopyHold({
      fromAstUnitId,
      toAstUnitId,
      fromFundCode,
      toFundCode,
      fromCombiCode,
      toCombiCode,
    })
      .then((res) => {
        if (res?.code > 0) {
          message.success('复制成功');
          setCopyVisible(false);
          getTableData();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!copyVisible) {
      return;
    }
    handleQueryAllFundWithReal({}).then((res) => {
      if (res?.code > 0) {
        let expandList = ['-1'];
        const treeData = (res.records || []).map((e) => {
          expandList.push(e.fundCode);
          return {
            fundName: e.fundName,
            fundCode: e.fundCode,
            isLeaf: false,
            title: e.fundName,
            key: e.fundCode,
            parentKey: '-1',
            icon: null,
            level: 'fund',
            children: (e.assetList || []).map((o) => {
              o.combiList && expandList.push(o.astUnitId);
              return {
                level: 'astUnit',
                isLeaf: false,
                title: o.astUnitName,
                key: o.astUnitId,
                parentKey: e.fundCode,
                icon: null,
                astUnitName: o.astUnitName,
                astUnitId: o.astUnitId,
                fundCode: e.fundCode,
                children: o.combiList
                  ? o.combiList.map((p) => {
                      return {
                        astUnitName: o.astUnitName,
                        astUnitId: o.astUnitId,
                        fundCode: e.fundCode,
                        combiName: p.combiName,
                        combiCode: p.combiCode,
                        level: 'combi',
                        isLeaf: true,
                        title: p.combiName,
                        key: p.combiCode,
                        parentKey: o.astUnitId,
                      };
                    })
                  : null,
              };
            }),
          };
        });
        setExpandedKeys(expandList);
        setTree([
          {
            ...INIT_TREE_NODE[0],
            children: treeData,
          },
        ]);
      }
    });
  }, [copyVisible]);

  /**
   * 复制持仓按钮点击事件
   */
  const handleClickCopyBtn = () => {
    setBtnLoading(true);
    handleQueryAllFundWithReal({})
      .then((res) => {
        if (res?.code > 0) {
          let expandList = ['-1'];
          const treeData = (res.records || []).map((e) => {
            expandList.push(e.fundCode);
            return {
              fundName: e.fundName,
              fundCode: e.fundCode,
              isLeaf: false,
              title: e.fundName,
              key: e.fundCode,
              parentKey: '-1',
              icon: null,
              level: 'fund',
              children: (e.assetList || []).map((o) => {
                o.combiList && expandList.push(o.astUnitId);
                return {
                  level: 'astUnit',
                  isLeaf: false,
                  title: o.astUnitName,
                  key: o.astUnitId,
                  parentKey: e.fundCode,
                  icon: null,
                  astUnitName: o.astUnitName,
                  astUnitId: o.astUnitId,
                  fundCode: e.fundCode,
                  children: o.combiList
                    ? o.combiList.map((p) => {
                        return {
                          astUnitName: o.astUnitName,
                          astUnitId: o.astUnitId,
                          fundCode: e.fundCode,
                          combiName: p.combiName,
                          combiCode: p.combiCode,
                          level: 'combi',
                          isLeaf: true,
                          title: p.combiName,
                          key: p.combiCode,
                          parentKey: o.astUnitId,
                        };
                      })
                    : null,
                };
              }),
            };
          });
          setExpandedKeys(expandList);
          setTree([
            {
              ...INIT_TREE_NODE[0],
              children: treeData,
            },
          ]);
          setCopyVisible(true);
        }
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };

  const handleDelete = () => {
    if (selectedKeys.length < 1) {
      message.error('请选择持仓');
      return;
    }
    const { astUnitId, fundCode, combiCode } = detailInfo;
    const selected = tableData.find((e) => selectedKeys.includes(e.interCode));
    if (!selected) return;
    const { interCode, lastPrice: price } = selected;
    handleRemoveHold({
      astUnitId,
      fundCode,
      combiCode,
      interCode,
      price,
    }).then((res) => {
      if (res?.code > 0) {
        message.success('删除成功');
        setSelectedKeys([]);
        getTableData();
      }
    });
  };
  return (
    <div className={styles.configs_right_content}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <CustomForm
          form={form}
          config={[
            {
              label: '证券内码/名称',
              name: 'secCode',
              type: 'input',
              rules: [{ required: true, message: '请输入证券内码/名称' }],
            },
          ]}
        />
        <div>
          {detailInfo?.fundCode && (
            <>
              <Button
                loading={btnLoading}
                onClick={handleClickCopyBtn}
                type="primary"
              >
                复制持仓
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => setVisible(true)}
                type="primary"
              >
                添加持仓
              </Button>
              <Popconfirm
                title="确定要删除吗？"
                placement="topRight"
                onConfirm={() => {
                  handleDelete();
                }}
              >
                <Button style={{ marginLeft: 8 }} type="primary" danger>
                  删除
                </Button>
              </Popconfirm>
            </>
          )}
        </div>
      </div>
      <CustomTableWithYScroll
        columns={[
          {
            title: '证券内码',
            dataIndex: 'interCode',
            key: 'interCode',
          },
          {
            title: '证券名称',
            dataIndex: 'secName',
            key: 'secName',
          },
          {
            title: '现价',
            dataIndex: 'lastPrice',
            key: 'lastPrice',
            align: 'right',
            render: (text) =>
              moneyFormat({
                num: text,
                decimal: 2,
              }),
          },
          {
            title: '数量',
            dataIndex: 'sellNum',
            key: 'sellNum',
            align: 'right',
          },
          {
            title: '市值',
            dataIndex: 'actualErngins',
            key: 'actualErngins',
            align: 'right',
            render: (text) =>
              moneyFormat({
                num: text,
                decimal: 2,
              }),
          },
        ]}
        rowKey={'interCode'}
        dataSource={tableData}
        loading={false}
        pagination={false}
        height={`calc(${height}px - 225px )`}
        rowSelection={{
          selectedKeys,
          onChange: setSelectedKeys,
        }}
      />
      <CustomModal
        title={'添加持仓'}
        visible={visible}
        footer={
          <CustomButtonGroup
            confirmLabel={'添加'}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        }
        onCancel={onCancel}
        width={600}
      >
        <CustomForm
          labelCol={{ flex: '80px' }}
          form={form}
          config={[
            {
              label: '标的代码',
              name: 'interCode',
              options: {
                rules: [{ required: true, message: '请选择标的代码' }],
              },
              custom: (
                <CustomSecSelector
                  dispatchOnChangeWithCache
                  cacheKey={`combination_stock_add`}
                  assetType={'GP'}
                  mode="single"
                  allowClear
                  onChange={(_code, info) => {
                    form.setFieldValue('price', info.lastPrice);
                  }}
                />
              ),
            },
            {
              name: 'qty',
              options: {
                rules: [{ required: true, message: '请输入目标数量' }],
              },
              label: '目标数量',
              custom: (
                <QtyInput
                  style={{ width: 'calc(100% - 30px)' }}
                  onChange={(value) => {
                    if (value && form.getFieldValue('price')) {
                      form.setFieldValue(
                        'amt',
                        value * form.getFieldValue('price'),
                      );
                    }
                  }}
                />
              ),
            },
            {
              label: '买入价格',
              name: 'price',
              options: {
                rules: [{ required: true, message: '请输入买入价格' }],
              },
              custom: (
                <CustomInputNumber
                  style={{ width: '100%' }}
                  onChange={(value) => {
                    if (value && form.getFieldValue('qty')) {
                      form.setFieldValue(
                        'amt',
                        value * form.getFieldValue('qty'),
                      );
                    }
                  }}
                  precision={2}
                  addonAfter={'元'}
                />
              ),
            },
            {
              label: '预估金额',
              name: 'amt',
              custom: (
                <CustomInputNumber
                  style={{ width: '100%' }}
                  precision={2}
                  addonAfter={'元'}
                  disabled
                />
              ),
            },
          ].map((e) => ({ ...e, span: 24 }))}
        />
      </CustomModal>
      <CustomModal
        title={'复制持仓'}
        visible={copyVisible}
        footer={
          <CustomButtonGroup
            confirmLabel={'确定'}
            onCancel={onCopyCancel}
            onConfirm={onCopy}
          />
        }
        onCancel={onCopyCancel}
        width={600}
      >
        <CustomTree
          height={300}
          treeData={tree}
          blockNode
          icon={null}
          selectedKeys={(selectedTreeList || []).map((e) => e.key)}
          defaultExpandAll
          onSelect={(_keys, { selectedNodes }) => {
            setSelectedTreeList(selectedNodes);
          }}
          expandAction={false}
          expandedKeys={expandedKeys}
          onExpand={(e) => {
            setExpandedKeys(e);
          }}
          switcherIcon={<DownOutlined />}
        />
      </CustomModal>
    </div>
  );
};

export default RightContent;
