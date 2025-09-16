/* eslint-disable react/no-array-index-key */
/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-17 14:55:51
 * @LastEditTime: 2024-12-13 10:18:12
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 */
import { CloseOutlined, FormOutlined } from '@ant-design/icons';
import calculator from '@asset360/assets/app/position/calculator.svg';
import {
  Button,
  Col,
  Divider,
  Input,
  Menu,
  message,
  Modal,
  Row,
} from 'antd-v5';
import { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import ConditionModal from './components/ConditionModal';
import { baseKeys } from './const';
import styles from './index.less';
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
export default ({
  visible,
  onCancel,
  value,
  keyOfValue,
  indexData = [],
  onConfirm,
  TName,
  TKey,
  formulas,
}) => {
  const [rules, setRules] = useState([]);
  const [text, setText] = useState([]);
  const [keys, setkeys] = useState([]);
  const [compositeKeys, setCompositeKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState('');
  const [note, setNote] = useState();
  const [conditionInfo, setConditionInfo] = useState({
    visible: false,
    condition: '',
    index: '',
  });

  const onConditionConfirm = (trueValue, falseValue, formValue) => {
    const { index } = conditionInfo;
    const condition = rules
      .filter((rule) => rule.type == 'key')
      ?.find((rule) => rule.condition.index == index / 2)?.condition;
    rules
      .filter((rule) => rule.type == 'key')
      ?.map((rule) => {
        if (rule.condition?.index == index / 2) {
          let realTrueValue = '';
          let realFalseValue = '';
          trueValue.map((item) => {
            if (item.realValue) {
              realTrueValue = realTrueValue + item.realValue;
            } else {
              realTrueValue = realTrueValue + item.value;
            }
          });
          falseValue.map((item) => {
            if (item.realValue) {
              realFalseValue = realFalseValue + item.realValue;
            } else {
              realFalseValue = realFalseValue + item.value;
            }
          });
          rule.condition = {
            ...condition,
            ...formValue,
            trueValue: realTrueValue || 0,
            falseValue: realFalseValue || 0,
          };
        }
      });
  };

  const allIndexs = [];
  indexData.map((item) => {
    allIndexs.push(...item.indexs);
  });
  const modalRef = useRef(null);

  const getCompositeIndex = (value) => {
    const indexCompositeKeys = [];
    const initCompositeObject = indexData
      .find((item) => item.name == TName)
      ?.indexs.find((item) => item.indexLevel != '1');
    const compositeObjectArray = indexData
      .find((item) => item.name == value)
      ?.indexs.filter((item) => item.indexLevel != '1');
    if (compositeObjectArray.length > 0) {
      instArray.map((inst, index) => {
        compositeObjectArray.map((compositeObject) => {
          const { name, code, indexLevel, alias } = compositeObject;
          const realValue = `${code}[${index}]`;
          const instIndex = instArray.findIndex((inst) => inst.code == TKey);
          const instValue = `${initCompositeObject.code}[${instIndex}]`;
          if (realValue != instValue) {
            indexCompositeKeys.push({
              type: 'key',
              realValue,
              value: `${alias}${index}`,
              name: `${name}[${inst.label}]`,
              code,
              indexLevel,
            });
          }
        });
      });
    }
    return indexCompositeKeys;
  };

  useEffect(() => {
    if (visible) {
      const indexKeys = indexData
        .find((item) => item.name == TName)
        ?.indexs.filter((item) => item.indexLevel != '2')
        .map((item) => {
          const { name, code, indexLevel, alias } = item;
          const realValue = `${code}[0]`;
          return {
            type: 'key',
            value: alias,
            name,
            code,
            indexLevel,
            realValue,
          };
        });

      const indexCompositeKeys = getCompositeIndex(TName);
      const array = [];
      let valueStr = '';
      value
        .filter((item) => item)
        .map((item) => {
          const baseKey = baseKeys.find((key) => key.value == item);
          let object = '';
          if (item.match(/^.*[0-9]+.*$/) && item.match(/^.*[A-Z]+.*$/)) {
            const alias = item.slice(0, item.length - 1);
            object = allIndexs.find((index) =>
              Object.keys(index).find((key) => index[key] == alias),
            );
          } else {
            object = allIndexs.find((index) =>
              Object.keys(index).find((key) => index[key] == item),
            );
          }

          if (baseKey) {
            array.push(baseKey);
          } else if (object) {
            const { name, code, indexLevel } = object;
            const realValue = code;
            array.push({
              type: 'key',
              value: item,
              name,
              code,
              realValue,
              indexLevel,
            });
          }
          valueStr = valueStr + item;
        });
      const conditionIndex = instArray.findIndex((item) => item.code == TKey);
      const conditions = formulas?.[conditionIndex]?.conditions;
      array.map((item, index) => {
        if (item.type == 'key') {
          item.condition = conditions?.find(
            (condition) => condition.index == index / 2,
          );
        }
      });
      setNote(formulas?.[conditionIndex]?.note);
      setRules(array || []);
      setSelectedKey(TName);
      setkeys(indexKeys);
      setCompositeKeys(indexCompositeKeys);
    }
  }, [visible, value]);

  const [disabled, setDisabled] = useState(false);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);
  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  useEffect(() => {
    if (selectedKey) {
      const indexs =
        indexData.find((item) => item.name == selectedKey)?.indexs || [];
      const keys = indexs
        .filter((item) => item.indexLevel != '2')
        .map((item) => {
          const { name, code, indexLevel, alias } = item;
          const realValue = `${code}[0]`;
          return {
            type: 'key',
            value: alias,
            name,
            code,
            indexLevel,
            realValue,
          };
        });

      const indexCompositeKeys = getCompositeIndex(selectedKey);

      setkeys(keys);
      setCompositeKeys(indexCompositeKeys);
    }
  }, [selectedKey]);

  useEffect(() => {
    if (rules == 0) {
      setText([]);
    } else {
      let newText = [];
      rules?.map((item) => {
        if (item.type == 'key') {
          newText.push({
            value: `${item.name}`,
            indexLevel: item.indexLevel,
          });
        } else {
          newText.push({
            value: item.value,
          });
        }
      });
      setText(newText);
    }
  }, [rules]);

  return (
    <>
      <Modal
        destroyOnClose
        footer={
          <Row gutter={[8, 4]}>
            {baseKeys.map((item, index) => (
              <Col
                key={item.value}
                span={4}
                style={{ display: 'flex', justifyContent: 'end' }}
                offset={index == 0 ? 4 : 0}
              >
                <Button
                  style={{
                    width: '100%',
                    padding: 0,
                  }}
                  type={item.value == '确认' ? 'primary' : 'default'}
                  className={
                    item.value == '确认' ? '' : styles.calculatorButton
                  }
                  onClick={() => {
                    if (item.value == '删除') {
                      const array = [...rules];
                      array.pop();
                      setRules(array);
                    } else if (item.value == '确认') {
                      let result = true;
                      rules.map((item, index) => {
                        if (item.value != '+' && item.value != '-') {
                          if (index % 2 == 1) {
                            result = false;
                          }
                        } else {
                          if (index % 2 == 0) {
                            result = false;
                          }
                        }
                      });

                      if (rules.length % 2 != 1) {
                        result = false;
                      }
                      if (result) {
                        onConfirm(rules, note);
                      } else {
                        message.warning('公式格式有误，请重新输入');
                      }
                    } else if (item.value == '清空') {
                      setRules([]);
                      setNote();
                    } else {
                      const array = [...rules];
                      array.push(item);
                      setRules(array);
                    }
                  }}
                >
                  {item.value}
                </Button>
              </Col>
            ))}
          </Row>
        }
        visible={visible}
        maskClosable={false}
        ref={modalRef}
        closable={false}
        bodyStyle={{ padding: 0 }}
        width={'27vw'}
        wrapClassName={styles.calculator}
        mask={false}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <div
          style={{
            width: '100%',
            cursor: 'move',
          }}
          onMouseOver={() => {
            if (disabled) {
              setDisabled(false);
            }
          }}
          onMouseOut={() => {
            setDisabled(true);
          }}
          onFocus={() => {}}
          onBlur={() => {}}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#313131',
              padding: '4px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={calculator} />
              <span style={{ fontSize: '14px', marginLeft: 8 }}>
                {keyOfValue}
              </span>
            </div>
            <CloseOutlined
              onClick={() => {
                onCancel();
                setRules([]);
              }}
            />
          </div>
        </div>

        <div
          style={{
            padding: '8px',
            fontSize: 32,
            color: '#313131',
            fontWeight: 'bold',
            overflowWrap: 'breakWord',
          }}
        >
          {rules
            .map((item) => item.value)
            .toString()
            .replaceAll(',', ' ')}
        </div>
        <div
          style={{
            padding: '8px',
            fontSize: 14,
            color: '#707070',
            overflowWrap: 'breakWord',
          }}
        >
          {text.map((item, index) => {
            if (item.value != '+' && item.value != '-') {
              return (
                <>
                  <span style={{ marginLeft: index == 0 ? 0 : 2 }}>
                    {item.value}
                  </span>
                  <FormOutlined
                    style={{
                      color: '#108EE9',
                      fontSize: 10,
                      marginLeft: 2,
                    }}
                    onClick={() => {
                      const condition = rules
                        .filter((rule) => rule.type == 'key')
                        ?.find((rule) => rule.condition.index == index / 2)
                        ?.condition;
                      setConditionInfo({
                        visible: true,
                        condition,
                        index,
                      });
                    }}
                  />
                </>
              );
            } else {
              return (
                <span key={index} style={{ marginLeft: index == 0 ? 0 : 6 }}>
                  {item.value}
                </span>
              );
            }
          })}
        </div>
        <Divider style={{ margin: '8px 0' }} />
        <Row align="middle" style={{ margin: 8 }}>
          <Col className="important-text">公式描述：</Col>
          <Col flex={1}>
            <Input.TextArea
              autoSize
              allowClear
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Col>
        </Row>
        <div className={styles.calculatorMenus}>
          <Menu
            onClick={(e) => {
              setSelectedKey(e.key);
            }}
            selectedKeys={[selectedKey]}
            mode="horizontal"
            items={indexData.map((item) => {
              const name = item.name;
              return {
                label: item.name,
                key: name,
              };
            })}
          />
        </div>

        <div style={{ padding: '0px 8px 8px 8px' }}>
          {keys.length > 0 ? (
            <>
              <div style={{ color: '#313131' }}>原子项</div>
              <Row gutter={[8, 4]}>
                {keys.map((item) => (
                  <Col key={item.value} span={4}>
                    <Button
                      className={styles.calculatorButton}
                      onClick={() => {
                        const ruleArray = [...rules];
                        const index = ruleArray.filter(
                          (rule) => rule.type == 'key',
                        ).length;
                        item.condition = {
                          index,
                          object: `${item.realValue}`,
                        };
                        ruleArray.push(item);
                        setRules(ruleArray);
                      }}
                    >
                      {item.value}
                    </Button>
                  </Col>
                ))}
              </Row>
            </>
          ) : null}

          {compositeKeys.length > 0 ? (
            <>
              <div style={{ color: '#313131', marginTop: 8 }}>复合项</div>
              <Row gutter={[8, 4]}>
                {compositeKeys.map((item) => (
                  <Col key={item.value} span={4}>
                    <Button
                      className={styles.calculatorButton}
                      onClick={() => {
                        const ruleArray = [...rules];
                        const index = ruleArray.filter(
                          (rule) => rule.type == 'key',
                        ).length;
                        const realValue = `${item.code}[${item.value.slice(
                          item.value.length - 1,
                        )}]`;
                        item.condition = {
                          index,
                          object: realValue,
                        };
                        ruleArray.push(item);
                        setRules(ruleArray);
                      }}
                    >
                      {item.value}
                    </Button>
                  </Col>
                ))}
              </Row>
            </>
          ) : null}
        </div>

        <ConditionModal
          {...conditionInfo}
          indexData={indexData}
          onCancel={() => {
            setConditionInfo({
              visible: false,
              condition: '',
              index: '',
            });
          }}
          TName={TName}
          onConfirm={onConditionConfirm}
        />
      </Modal>
    </>
  );
};
