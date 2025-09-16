/* eslint-disable react/no-array-index-key */
/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-17 14:55:51
 * @LastEditTime: 2024-12-13 09:55:21
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 */
import { CloseOutlined, FormOutlined } from '@ant-design/icons';
import calculator from '@asset360/assets/app/position/calculator.svg';
import { Button, Col, Menu, message, Modal, Row } from 'antd';
import { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import ConditionModal from './components/ConditionModal';
import { baseKeys, tObject } from './const';
import styles from './index.less';

export default function T({
  visible,
  onCancel,
  value,
  keyOfValue,
  indexData = [],
  onConfirm,
  TKey,
  TName,
  compositeKey,
  formulas,
}) {
  const [rules, setRules] = useState([]);
  const [text, setText] = useState([]);
  const [keys, setkeys] = useState([]);
  const [compositeKeys, setCompositeKeys] = useState([]);
  const [conditionInfo, setConditionInfo] = useState({
    visible: false,
    condition: '',
    index: '',
  });
  const TIndex = {
    T: 0,
    'T+1': 1,
    'T+2': 2,
    'T+3': 3,
  };

  const allIndexs = [];
  indexData.map((item) => {
    allIndexs.push(...item.indexs);
  });
  const modalRef = useRef(null);

  useEffect(() => {
    if (visible) {
      const indexKeys = indexData
        .find((item) => item.name == TName)
        ?.indexs.filter((item) => item.indexLevel != '2')
        .map((item) => {
          const { name, code, indexLevel } = item;
          const realValue = `${code}[${TIndex[TKey]}]`;
          return {
            type: 'key',
            realValue,
            value: item[TKey],
            name,
            code,
            indexLevel,
          };
        });

      const indexCompositeKeys = indexData
        .find((item) => item.name == TName)
        ?.indexs.filter(
          (item) =>
            item.indexLevel != '1' && item[TKey] && item[TKey] != compositeKey,
        )
        .map((item) => {
          const { name, code, indexLevel } = item;
          const realValue = `${code}[${TIndex[TKey]}]`;
          return {
            type: 'key',
            realValue,
            value: item[TKey],
            name,
            code,
            indexLevel,
          };
        });
      const array = [];
      let valueStr = '';
      value
        .filter((item) => item)
        .map((item) => {
          const baseKey = baseKeys.find((key) => key.value == item);
          const object = allIndexs.find((index) =>
            Object.keys(index).find((key) => index[key] == item),
          );
          if (baseKey) {
            array.push(baseKey);
          } else if (object) {
            const { name, code, indexLevel } = object;
            const realValue = `${code}[${TIndex[TKey]}]`;
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
      const conditionIndex = TKey.split('+')[1] || 0;
      const conditions = formulas?.[conditionIndex]?.conditions;
      array.map((item, index) => {
        if (item.type == 'key') {
          item.condition = conditions?.find(
            (condition) => condition.index == index / 2,
          ) || {
            index,
            object: item.realValue,
          };
        }
      });
      setRules(array || []);
      setSelectedKey(`${TName}_${TKey}`);
      setkeys(indexKeys);
      setCompositeKeys(indexCompositeKeys);
    }
  }, [visible, value]);

  const [selectedKey, setSelectedKey] = useState('');

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
      const newTKey = selectedKey.split('_')[1];
      const newName = selectedKey.split('_')[0];
      const indexs =
        indexData.find((item) => item.name == newName)?.indexs || [];
      const keys = indexs
        .filter((item) => item.indexLevel != '2')
        .map((item) => {
          const { name, code, indexLevel } = item;
          const realValue = `${code}[${TIndex[newTKey]}]`;
          return {
            type: 'key',
            value: item[newTKey],
            realValue,
            name,
            code,
            indexLevel,
          };
        });
      const indexCompositeKeys = indexs
        ?.filter(
          (item) =>
            item.indexLevel != '1' &&
            item[newTKey] &&
            item[newTKey] != compositeKey,
        )
        .map((item) => {
          const { name, code, indexLevel } = item;
          const realValue = `${code}[${TIndex[newTKey]}]`;
          return {
            type: 'key',
            value: item[newTKey],
            realValue,
            name,
            code,
            indexLevel,
          };
        });
      setkeys(keys);
      setCompositeKeys(indexCompositeKeys);
    }
  }, [selectedKey]);

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

  useEffect(() => {
    if (rules == 0) {
      setText([]);
    } else {
      let newText = [];
      rules?.map((item) => {
        if (item.type == 'key') {
          const tKey = item.value.slice(item.value.length - 1);
          newText.push({
            value: `${item.name}[${tObject[tKey]}]`,
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
                        onConfirm(rules);
                      } else {
                        message.warning('公式格式有误，请重新输入');
                      }
                    } else if (item.value == '清空') {
                      setRules([]);
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
                  {item.indexLevel == '1' ? (
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
                  ) : null}
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

        <div className={styles.calculatorMenus}>
          <Menu
            onClick={(e) => {
              setSelectedKey(e.key);
            }}
            triggerSubMenuAction="click"
            selectedKeys={[selectedKey]}
            mode="horizontal"
            items={indexData.map((item) => {
              const name = item.name;
              return {
                label: item.name,
                key: name,
                children: [
                  { label: 'T日', key: `${name}_T` },
                  {
                    label: 'T+1日',
                    key: `${name}_T+1`,
                  },
                  { label: 'T+2日', key: `${name}_T+2` },
                  { label: 'T+3日', key: `${name}_T+3` },
                ],
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
      </Modal>

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
        TKey={TKey}
        TName={TName}
        onConfirm={onConditionConfirm}
      />
    </>
  );
}
