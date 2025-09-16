/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-07-01 17:25:45
 * @LastEditTime: 2024-11-15 10:26:06
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 */
import { InfoCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { getFundTreeByAuth } from '@asset360/apis/position';
import {
  init,
  instInit,
  instQuery,
  instUpdate,
  query,
  updateRule,
} from '@asset360/apis/positionRules';
import {
  instQuery as instQueryById,
  query as queryById,
  queryTemplate,
} from '@asset360/apis/positionTemplate';
import save from '@asset360/assets/app/position/save.svg';
import saveTemple from '@asset360/assets/app/position/saveTemple.svg';
import { Col, message, Popconfirm, Row, Spin, Switch, Tabs } from 'antd';
import { desensitization } from 'iblive-base';
import { useEffect, useState } from 'react';
import InstCal from '../../components/InstCal';
import PositionButton from '../../components/PositionButton';
import PositionContent from '../../components/PositionCotent/PositionContent';
import PositionImg from '../../components/PositionImg';
import PositionSelect from '../../components/PositionSelect';
import TradeCal from '../../components/TradeCal';
import { baseKeys } from '../../components/TradeCal/const';
import DeliveryModal from './components/DeliveryModal';
import EditModal from './components/EditModal';
import styles from './index.less';
let newRuleConfigList = [];
let newInstRuleConfigList = [];
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
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(false);
  const [treeLoading, setTreeLoading] = useState(false);
  const [tradeVisible, setTradeVisible] = useState(false);
  const [instVisible, setInstVisible] = useState(false);
  const [compositeKey, setCompositeKey] = useState('');
  const [rules, setRules] = useState('');
  const [expandedKeys, setExpandedKeys] = useState([-1, -2]);
  const [title, setTitle] = useState('');
  const [TKey, setTKey] = useState('');
  const [TName, setTName] = useState('');
  const [data, setData] = useState([]);
  const [node, setNode] = useState('');
  const [temple, setTemple] = useState('');
  const [indexData, setIndexData] = useState([]);
  const [info, setInfo] = useState({});
  const [temples, setTemples] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const tradeArray = ['T', 'T+1', 'T+2', 'T+3'];
  const instArray = [
    {
      code: 'instAvailT0',
      label: 'T+0指令可用',
    },
    {
      code: 'instAvailT1',
      label: 'T+1指令可用',
    },
    {
      code: 'cashAvailT0',
      label: 'T+0可用头寸',
    },
    {
      code: 'cashAvailT1',
      label: 'T+1可用头寸',
    },
  ];
  const [modalVisible, setModalVisible] = useState(false);
  const [activeKey, setActiveKey] = useState('TRADE');
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  useEffect(() => {
    setTradeVisible(false);
    setInstVisible(false);
  }, [node.fundCode, activeKey]);

  const findData = (data, values, object) => {
    if (data?.length > 0) {
      data.map((item) => {
        if (item.name == title && item.isPos) {
          tradeArray.map((key, index) => {
            if (key == TKey) {
              if (item.indexLevel == 2) {
                item[TKey] = `${item.alias}${index}`;
              }
              if (item.aliasFormulaList) {
                item.aliasFormulaList[index] = values;
              } else {
                item.aliasFormulaList = [];
                item.aliasFormulaList[index] = values;
              }
              if (item.formulas) {
                item.formulas[index] = object;
              } else {
                item.formulas = [];
                item.formulas[index] = object;
              }
            }
          });
        } else {
          findData(item.children, values, object);
        }
      });
    }
  };

  const findInstData = (data, values, object) => {
    if (data?.length > 0) {
      data.map((item) => {
        if (item.name == title && item.isPos) {
          instArray.map((inst, index) => {
            if (inst.code == TKey) {
              if (item.aliasFormulaList) {
                item.aliasFormulaList[index] = values;
              } else {
                item.aliasFormulaList = [];
                item.aliasFormulaList[index] = values;
              }
              if (item.formulas) {
                item.formulas[index] = object;
              } else {
                item.formulas = [];
                item.formulas[index] = object;
              }
            }
          });
        } else {
          findInstData(item.children, values, object);
        }
      });
    }
  };
  const onConfirm = (values, note) => {
    const newData = [...data];
    const conditions = [];
    let formula = '';
    if (activeKey == 'GZ') {
      values
        .map((item) => {
          if (item.condition) {
            conditions.push(item.condition);
            formula = formula + item.condition.object;
          } else {
            formula = formula + item.value;
          }
        })
        .toString()
        .replaceAll(',', '');
      findData(newData, values, {
        conditions,
        formula,
      });
      setData(newData);
      setTradeVisible(false);
    } else {
      values
        .map((item) => {
          if (item.condition) {
            conditions.push(item.condition);
            formula = formula + item.condition.object;
          } else {
            formula = formula + item.value;
          }
        })
        .toString()
        .replaceAll(',', '');
      findInstData(newData, values, {
        conditions,
        formula,
        note,
      });
      setData(newData);
      setInstVisible(false);
    }
    setRules('');
    setTitle('');
    setTKey('');
    setTName('');
  };

  const returnSwitch = (text, record, inst) => {
    return (
      <Switch
        checkedChildren="启动"
        unCheckedChildren="禁用"
        checked={text}
        style={{ background: text ? '#20D08C' : '#EF5350' }}
        onChange={(e) => {
          const newData = [...data];
          const enable = (array) => {
            if (array?.length > 0) {
              array.map((item) => {
                if (item.alias == record.alias) {
                  item[inst.code] = e;
                } else {
                  enable(item.children);
                }
              });
            }
          };
          enable(newData);
          setData(newData);
        }}
      />
    );
  };
  const getData = async (object) => {
    setData([]);
    setLoading(true);
    const fun = activeKey == 'TRADE' ? query : instQuery;
    const res = await fun(object);
    if (res?.code > 0) {
      formatData(res);
      setTemple(res?.data?.templateId);
    }
    setLoading(false);
  };

  const initData = (array) => {
    const result = [];
    const map = {};
    // 不改变原数组
    const data = array.map((item) => ({ ...item }));
    data.forEach((item) => {
      const { id } = item;
      map[id] = item;
    });
    data.forEach((item) => {
      const { parentId } = item;
      const parent = map[parentId];
      if (parent) {
        (parent.children || (parent.children = [])).push(item);
      } else {
        result.push(item);
      }
    });
    return result;
  };

  const formatData = (res) => {
    const ruleConfigList = res?.data?.ruleConfigList || res?.records;
    const childrenArray = ruleConfigList.filter((item) => item.isPos) || [];
    const parentArray = ruleConfigList.filter((item) => !item.isPos) || [];
    parentArray.map((item) => {
      const children = childrenArray.filter(
        (child) => child.parentId == item.id,
      );
      item.indexs = children.map((child) => {
        child.parentTitle = item.name;
        if (child.aliasFormulaList) {
          tradeArray.map((key, index) => {
            if (child.aliasFormulaList[index]) {
              child[key] = `${child.alias}${index}`;
            }
          });
        }
        return child;
      });
    });
    setIndexData(parentArray);
    setData(initData(ruleConfigList));
  };

  const getRuleConfigList = (data) => {
    if (data?.length > 0) {
      data.map((item) => {
        newRuleConfigList.push(item);
        getRuleConfigList(item.children);
      });
    }
  };

  const getInstRuleConfigList = (data) => {
    if (data?.length > 0) {
      data.map((item) => {
        newInstRuleConfigList.push(item);
        getInstRuleConfigList(item.children);
      });
    }
  };

  // 选中显示节点
  const onSelectIndex = (_, { selectedNodes }) => {
    const { fundCode, isLeaf, key, fundName } = selectedNodes[0];
    const object = {};
    if (isLeaf) {
      object.fundCode = fundCode;
      object.fundName = fundName;
      object.astUnitId = key;
    } else {
      object.fundCode = key;
      object.fundName = fundName;
    }
    setNode(object);
    getData(object);
  };

  const updateTreeData = async () => {
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
        fundName: item.objectName,
        children: item.childrenObjects?.map((child) => ({
          isLeaf: true,
          title: `${desensitization(item.objectName)}`,
          key: child.objectCode,
          selectable: true,
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

  const queryAllTemples = async () => {
    const res = await queryTemplate({
      positionType: activeKey,
    });
    setTemples(res?.records);
  };

  useEffect(() => {
    updateTreeData();
  }, []);

  useEffect(() => {
    queryAllTemples();
  }, [activeKey]);

  const [columns, setColumns] = useState([]);

  const baseColumns = [
    {
      dataIndex: 'name',
      title: '项目',
      render: (text, record) => (
        <div style={{ display: 'flex' }}>
          <span
            style={{ fontWeight: record.indexLevel == '1' ? '500' : 'bold' }}
          >
            {text}
          </span>
          {record.isDiff && record.isPos ? (
            <InfoCircleOutlined
              style={{ fontSize: 10, marginLeft: 2 }}
              title="独有配置"
            />
          ) : null}
        </div>
      ),
    },
    {
      dataIndex: 'alias',
      title: '别名',
      align: 'center',
      render: (text, record) => {
        if (record.isPos) {
          return text;
        }
        return null;
      },
    },
  ];

  const instColumns = [
    ...baseColumns,
    ...tradeArray.map((item, index) => {
      return {
        dataIndex: item,
        title: `${item}日`,
        align: 'center',
        width: '125px',
        render: (text, record) => {
          if (record.isPos) {
            let textValueArray = record?.aliasFormulaList[index];
            let textValue = '';
            if (Array.isArray(textValueArray)) {
              textValueArray.map((item) => {
                textValue = textValue + item.value;
              });
            } else {
              textValue = textValueArray;
            }
            return (
              <a
                onClick={() => {
                  const keyArray = [];
                  let key = '';
                  const textArray = textValue?.split('');
                  textArray?.map((item, index) => {
                    if (!baseKeys.find((key) => key.value == item)) {
                      key = key + item;
                    } else {
                      keyArray.push(key);
                      keyArray.push(item);
                      key = '';
                    }
                    if (index == textArray.length - 1) {
                      keyArray.push(key);
                      key = '';
                    }
                  });
                  setTKey(item);
                  setTName(record?.parentTitle);
                  if (record.indexLevel == '2') {
                    setCompositeKey(text);
                  } else {
                    setCompositeKey('');
                  }
                  setTradeVisible(true);
                  setRules(keyArray);
                  setTitle(record?.name);
                  setFormulas(record?.formulas);
                }}
                style={{
                  color: record?.indexLevel == 2 ? '#f0be36' : '',
                  width: '115px',
                  display: 'block',

                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
                title={textValue}
              >
                {textValue || '编辑'}
              </a>
            );
          }
        },
      };
    }),
    {
      dataIndex: 'indexLevel',
      title: '指标层级',
      align: 'center',
      render: (text, record) => {
        if (record.isPos) {
          return (
            <span
              style={{ color: text == 2 ? '#F8734B' : '', fontWeight: '500' }}
            >
              {text == 2 ? '复合项' : '原子项'}
            </span>
          );
        }
      },
    },
    {
      dataIndex: 'status',
      title: '是否启用',
      align: 'center',
      render: (text, record) => {
        if (record.isPos) {
          return (
            <Switch
              checkedChildren="启动"
              unCheckedChildren="禁用"
              checked={text == '1'}
              style={{ background: text == '1' ? '#20D08C' : '#EF5350' }}
              onChange={(e) => {
                const newData = [...data];
                const enable = (array) => {
                  if (array?.length > 0) {
                    array.map((item) => {
                      if (item.name == record.name) {
                        item.status = e ? '1' : '0';
                      } else {
                        enable(item.children);
                      }
                    });
                  }
                };
                enable(newData);
                setData(newData);
              }}
            />
          );
        }
      },
    },
  ];

  const tradeColumns = [
    ...baseColumns,
    ...instArray.map((inst, index) => {
      return {
        dataIndex: inst.code,
        title: inst.label,
        align: 'center',
        render: (text, record) => {
          if (record.isPos) {
            if (record.indexLevel == 2) {
              let textValueArray = record?.aliasFormulaList[index];
              let textValue = '';
              if (Array.isArray(textValueArray)) {
                textValueArray.map((item) => {
                  textValue = textValue + item.value;
                });
              } else {
                const array = textValueArray?.split('');
                if (array) {
                  array.map((item, index) => {
                    if (item != '+' || item != '-') {
                      if (item.match(/^.*[0-9]+.*$/)) {
                        if (array[index - 1].match(/^.*[A-Z]+.*$/)) {
                          textValue = textValue + item;
                        }
                      } else {
                        textValue = textValue + item;
                      }
                    } else {
                      textValue = textValue + item;
                    }
                  });
                }
              }
              return (
                <div>
                  <a
                    onClick={() => {
                      const keyArray = [];
                      let key = '';
                      const textArray = textValue?.split('');
                      textArray?.map((item, index) => {
                        if (!baseKeys.find((key) => key.value == item)) {
                          key = key + item;
                        } else {
                          keyArray.push(key);
                          keyArray.push(item);
                          key = '';
                        }
                        if (index == textArray.length - 1) {
                          keyArray.push(key);
                          key = '';
                        }
                      });
                      setTKey(inst.code);
                      setTName(record?.parentTitle);
                      setCompositeKey(text);
                      setInstVisible(true);
                      setRules(keyArray);
                      setTitle(record?.name);
                      setFormulas(record?.formulas);
                    }}
                    style={{
                      color: record?.indexLevel == 2 ? '#f0be36' : '',
                      width: '115px',
                      display: 'block',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      marginBottom: 2,
                    }}
                    title={textValue}
                  >
                    {textValue || '编辑'}
                  </a>
                  {returnSwitch(text, record, inst)}
                </div>
              );
            } else {
              return returnSwitch(text, record, inst);
            }
          }
        },
      };
    }),
    {
      dataIndex: 'indexLevel',
      title: '指标层级',
      align: 'center',
      render: (text, record) => {
        if (record.isPos) {
          return (
            <span
              style={{ color: text == 2 ? '#F8734B' : '', fontWeight: '500' }}
            >
              {text == 2 ? '复合项' : '原子项'}
            </span>
          );
        }
      },
    },
  ];

  const recoverData = async () => {
    setData([]);
    setLoading(true);
    const fun = activeKey == 'TRADE' ? init : instInit;
    const res = await fun(node);
    if (res?.code > 0) {
      getData(node);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeKey == 'TRADE') {
      setColumns(tradeColumns);
    } else if (activeKey == 'GZ') {
      setColumns(instColumns);
    }
  }, [activeKey, data]);

  useEffect(() => {
    if (node) {
      getData(node);
    }
  }, [activeKey]);

  return (
    <>
      <Spin spinning={loading}>
        <PositionContent
          columns={columns}
          tree={tree}
          setTree={setTree}
          treeLoading={treeLoading}
          expandedKeys={expandedKeys}
          setExpandedKeys={setExpandedKeys}
          updateTree={updateTreeData}
          data={data}
          onSelectIndex={onSelectIndex}
          selectIndex={node}
          header={
            <Tabs
              onChange={(e) => {
                setActiveKey(e);
              }}
              activeKey={activeKey}
              className={styles.rule_tabs}
              tabBarExtraContent={
                <Row justify="end" gutter={8}>
                  <Col>
                    <PositionSelect
                      text={'模板选择'}
                      style={{ minWidth: 150 }}
                      options={temples}
                      value={temple}
                      fieldNames={{
                        label: 'templateName',
                        value: 'templateId',
                      }}
                      onSelect={async (e) => {
                        setData([]);
                        setLoading(true);
                        const fun =
                          activeKey == 'TRADE' ? queryById : instQueryById;
                        const res = await fun({
                          templateId: e,
                        });
                        setTemple(e);
                        formatData(res);
                        setLoading(false);
                      }}
                      onClear={async () => {
                        setData([]);
                        setTemple('');
                        setLoading(true);
                        const fun = activeKey == 'TRADE' ? query : instQuery;
                        const res = await fun(node);
                        if (res?.code > 0) {
                          formatData(res);
                        }
                        setLoading(false);
                      }}
                    />
                  </Col>

                  <Col>
                    <PositionButton
                      text={'保存至模板'}
                      icon={<PositionImg imgSrc={saveTemple} />}
                      func={() => {
                        if (activeKey == 'TRADE') {
                          getInstRuleConfigList(data);
                          const ruleConfigList = newInstRuleConfigList
                            .filter((item) => item.isPos)
                            .map((item) => {
                              const {
                                indexLevel,
                                id,
                                name,
                                code,
                                formulas,
                                cashAvailT0,
                                cashAvailT1,
                                instAvailT0,
                                instAvailT1,
                              } = item;
                              return {
                                indexLevel,
                                formulas,
                                positionId: id || code,
                                positionName: name,
                                cashAvailT0,
                                cashAvailT1,
                                instAvailT0,
                                instAvailT1,
                              };
                            });
                          setInfo({
                            fundCode: node.fundCode,
                            ruleConfigList,
                          });
                          newInstRuleConfigList = [];
                        } else {
                          getRuleConfigList(data);
                          const ruleConfigList = newRuleConfigList
                            .filter((item) => item.isPos)
                            .map((item) => {
                              const {
                                status,
                                indexLevel,
                                id,
                                name,
                                code,
                                formulas,
                              } = item;
                              return {
                                status,
                                indexLevel,
                                formulas,
                                positionId: id || code,
                                positionName: name,
                              };
                            });
                          setInfo({
                            fundCode: node.fundCode,
                            ruleConfigList,
                          });
                          newRuleConfigList = [];
                        }
                        setModalVisible(true);
                      }}
                    />
                  </Col>

                  <Col>
                    <Popconfirm
                      title="是否要初始化当前规则配置"
                      okText="是"
                      cancelText="否"
                      onConfirm={() => {
                        recoverData();
                      }}
                    >
                      <PositionButton
                        text={'初始化'}
                        icon={<RedoOutlined spin={loading} />}
                      />
                    </Popconfirm>
                  </Col>

                  <Col>
                    <PositionButton
                      text={'保存'}
                      icon={<PositionImg imgSrc={save} />}
                      func={async () => {
                        setLoading(true);
                        if (activeKey == 'TRADE') {
                          getRuleConfigList(data);
                          const ruleConfigList = newRuleConfigList
                            .filter((item) => item.isPos)
                            .map((item) => {
                              const {
                                indexLevel,
                                id,
                                name,
                                code,
                                formulas,
                                cashAvailT0,
                                cashAvailT1,
                                instAvailT0,
                                instAvailT1,
                              } = item;
                              return {
                                indexLevel,
                                formulas,
                                positionId: id || code,
                                positionName: name,
                                cashAvailT0,
                                cashAvailT1,
                                instAvailT0,
                                instAvailT1,
                              };
                            });

                          const res = await updateRule({
                            ...node,
                            ruleConfigList,
                            templateId: temple,
                          });
                          if (res?.code > 0) {
                            message.success('保存成功');
                          }
                          newRuleConfigList = [];
                        } else {
                          getInstRuleConfigList(data);
                          const ruleConfigList = newInstRuleConfigList
                            .filter((item) => item.isPos)
                            .map((item) => {
                              const {
                                status,
                                indexLevel,
                                id,
                                name,
                                code,
                                formulas,
                              } = item;
                              return {
                                status,
                                indexLevel,
                                formulas,
                                positionId: id || code,
                                positionName: name,
                              };
                            });
                          const res = await instUpdate({
                            ...node,
                            ruleConfigList,
                            templateId: temple,
                          });
                          if (res?.code > 0) {
                            message.success('保存成功');
                          }
                          newInstRuleConfigList = [];
                        }
                        setLoading(false);
                      }}
                    />
                  </Col>
                  <Col>
                    <PositionButton
                      text="申赎管理"
                      func={() => setShowDeliveryModal(true)}
                    />
                  </Col>
                </Row>
              }
            >
              <Tabs.TabPane tab="交易维度" key={'TRADE'} />
              <Tabs.TabPane tab="估值维度" key={'GZ'} />
            </Tabs>
          }
        />
        <TradeCal
          visible={tradeVisible}
          onCancel={() => {
            setTradeVisible(false);
          }}
          value={rules}
          keyOfValue={title}
          TKey={TKey}
          TName={TName}
          indexData={indexData}
          onConfirm={onConfirm}
          compositeKey={compositeKey}
          formulas={formulas}
        />

        <InstCal
          visible={instVisible}
          onCancel={() => {
            setInstVisible(false);
          }}
          value={rules}
          keyOfValue={title}
          TName={TName}
          TKey={TKey}
          indexData={indexData}
          onConfirm={onConfirm}
          compositeKey={compositeKey}
          formulas={formulas}
        />

        <EditModal
          visible={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setInfo({});
          }}
          info={info}
          activeKey={activeKey}
        />
        {/* 交收配置 */}
        <DeliveryModal
          visible={showDeliveryModal}
          fundCode={node.fundCode}
          fundName={node.fundName}
          onCancel={() => setShowDeliveryModal(false)}
        />
      </Spin>
    </>
  );
};
