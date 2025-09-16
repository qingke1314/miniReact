import { DeleteOutlined } from '@ant-design/icons';
import {
  delTemplate,
  instQuery,
  instUpdateTemplate,
  query,
  queryTemplate,
  updateTemplate,
} from '@asset360/apis/positionTemplate';
import save from '@asset360/assets/app/position/save.svg';
import { Col, message, Popconfirm, Row, Spin, Switch } from 'antd';
import { useEffect, useState } from 'react';
import InstCal from '../../components/InstCal';
import PositionButton from '../../components/PositionButton';
import PositionContent from '../../components/PositionCotent/PositionContent';
import PositionImg from '../../components/PositionImg';
import TradeCal from '../../components/TradeCal';
import { baseKeys } from '../../components/TradeCal/const';
import EditModal from './components/EditModal';
import TreeSelectModal from './components/TreeSelectModal';
let newRuleConfigList = [];
let newInstRuleConfigList = [];

const INIT_NODE = [
  {
    isLeaf: false,
    title: '交易维度',
    key: -1,
    selectable: false,
  },
  {
    isLeaf: false,
    title: '估值维度',
    key: -2,
    selectable: false,
  },
];

export default () => {
  const [tree, setTree] = useState([]);
  const [treeLoading, setTreeLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [tradeVisible, setTradeVisible] = useState(false);
  const [instVisible, setInstVisible] = useState(false);
  const [rules, setRules] = useState('');
  const [treeModalVisible, setTreeModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [TKey, setTKey] = useState('');
  const [node, setNode] = useState('');
  const [TName, setTName] = useState('');
  const [compositeKey, setCompositeKey] = useState('');
  const [indexData, setIndexData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const tradeArray = ['T', 'T+1', 'T+2', 'T+3'];
  const [expandedKeys, setExpandedKeys] = useState([-1, -2]);
  const [formulas, setFormulas] = useState([]);
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
  const [activeKey, setActiveKey] = useState('');

  useEffect(() => {
    setTradeVisible(false);
    setInstVisible(false);
  }, [node.templateId, activeKey]);

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
      const object = {
        conditions,
        formula,
      };
      findData(newData, values, object);
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
      const instObject = {
        conditions,
        formula,
        note,
      };
      findInstData(newData, values, instObject);
      setData(newData);
      setInstVisible(false);
    }
    setRules('');
    setTitle('');
    setTKey('');
    setTName('');
  };

  const updateTreeData = async () => {
    setTreeLoading(true);
    const res = await queryTemplate();
    const array =
      res?.records.map((item) => ({
        isLeaf: true,
        title: item.templateName,
        key: item.templateId,
        selectable: true,
        type: item.positionType,
      })) || [];
    const tradeArray = array.filter((item) => item.type == 'TRADE');
    const instArray = array.filter((item) => item.type != 'TRADE');
    INIT_NODE[0].children = tradeArray;
    INIT_NODE[1].children = instArray;
    setTree([...INIT_NODE]);
    setTreeLoading(false);
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

  const getData = async (object, type = activeKey) => {
    setData([]);
    setLoading(true);
    const fun = type == 'TRADE' ? query : instQuery;
    const res = await fun(object);
    if (res?.code > 0) {
      formatData(res);
    }
    setLoading(false);
  };

  // 选中显示节点
  const onSelectIndex = async (_, { selectedNodes }) => {
    const { key, type } = selectedNodes[0];
    const object = {
      templateId: key,
    };
    setActiveKey(type);
    setNode(object);
    getData(object, type);
  };

  useEffect(() => {
    updateTreeData();
  }, [activeKey]);

  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (activeKey == 'TRADE') {
      setColumns(tradeColumns);
    } else if (activeKey == 'GZ') {
      setColumns(instColumns);
    }
  }, [activeKey, data]);

  const baseColumns = [
    {
      dataIndex: 'name',
      title: '项目',
      render: (text, record) => (
        <span style={{ fontWeight: record.indexLevel == '1' ? '500' : 'bold' }}>
          {text}
        </span>
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

  return (
    <>
      <Spin spinning={loading}>
        <PositionContent
          columns={columns}
          tree={tree}
          setTree={setTree}
          onSelectIndex={onSelectIndex}
          setExpandedKeys={setExpandedKeys}
          expandedKeys={expandedKeys}
          treeLoading={treeLoading}
          updateTree={updateTreeData}
          func={() => {
            setModalVisible(true);
          }}
          selectIndex={node}
          data={data}
          header={
            <Row justify="end" gutter={8}>
              <Col>
                <Popconfirm
                  onConfirm={async () => {
                    const res = await delTemplate({
                      templateId: node.templateId,
                    });
                    if (res?.code > 0) {
                      message.success('删除成功');
                      setNode('');
                      updateTreeData();
                    }
                  }}
                  title="是否要删除该模板"
                >
                  <PositionButton text={'删除'} icon={<DeleteOutlined />} />
                </Popconfirm>
              </Col>
              <Col>
                <PositionButton
                  text={'关联模板与产品'}
                  icon={<PositionImg imgSrc={save} />}
                  func={() => {
                    setTreeModalVisible(true);
                  }}
                />
              </Col>
              <Col>
                <PositionButton
                  text={'保存'}
                  icon={<PositionImg imgSrc={save} />}
                  func={async () => {
                    setLoading(true);
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

                      const res = await updateTemplate({
                        ...node,
                        ruleConfigList,
                      });
                      if (res?.code > 0) {
                        message.success('保存成功');
                      }
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
                      const res = await instUpdateTemplate({
                        ...node,
                        ruleConfigList,
                      });
                      if (res?.code > 0) {
                        message.success('保存成功');
                      }
                      newRuleConfigList = [];
                    }
                    setLoading(false);
                  }}
                />
              </Col>
            </Row>
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
          }}
          callback={updateTreeData}
        />

        <TreeSelectModal
          visible={treeModalVisible}
          onCancel={() => {
            setTreeModalVisible(false);
          }}
          node={node}
        />
      </Spin>
    </>
  );
};
