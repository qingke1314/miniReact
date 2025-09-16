/* eslint-disable react/no-array-index-key */
/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-17 14:55:51
 * @LastEditTime: 2024-10-30 16:30:16
 * @LastEditors: chenzongjun chenzongjun@apexsoft.com.cn
 */
import { CloseOutlined } from '@ant-design/icons';
import calculator from '@asset360/assets/app/position/calculator.svg';
import {
  Button,
  Col,
  Form,
  InputNumber,
  Menu,
  message,
  Modal,
  Row,
} from 'antd';
import { useEffect, useState } from 'react';
import PositionSelect from '../../PositionSelect';
import { baseKeys } from '../const';
import styles from '../index.less';

export default function ConditionModal({
  visible,
  onCancel,
  condition = {},
  indexData = [],
  onConfirm,
  TName,
}) {
  const [form] = Form.useForm();
  const [keys, setkeys] = useState([]);
  const [compositeKeys, setCompositeKeys] = useState([]);
  const [trueValue, setTrueValue] = useState([]);
  const [falseValue, setFalseValue] = useState([]);
  const [focus, setFocus] = useState('');

  const getCompositeIndex = (value) => {
    const indexCompositeKeys = [];
    const compositeObjectArray = indexData
      .find((item) => item.name == value)
      ?.indexs.filter((item) => item.indexLevel != '1');
    if (compositeObjectArray.length > 0) {
      instArray.map((inst, index) => {
        compositeObjectArray.map((compositeObject) => {
          const { name, code, indexLevel, alias } = compositeObject;
          const realValue = `${code}[${index}]`;
          if (realValue != condition?.object) {
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

  const returnStr = (text) => {
    const array = text.split('');
    let newStr = '';
    array.map((item, index) => {
      if (item.match(/^.*[0-9]+.*$/)) {
        if (array[index - 1].match(/^.*[A-Z]+.*$/)) {
          newStr = newStr + item;
        }
      } else {
        newStr = newStr + item;
      }
    });
    return newStr;
  };
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
  const allIndexs = [];
  indexData.map((item) => {
    allIndexs.push(...item.indexs);
  });

  const formatData = (values) => {
    const valueArray = values?.split('');
    let valueStr = '';
    const array = [];
    let index = '';
    valueArray?.map((value, valueIndex) => {
      if (value != '-' && value != '+') {
        valueStr = valueStr + value;
        if (value == '[') {
          index = valueArray[valueIndex + 1];
        }
      }
      if (value == '-' || value == '+' || valueIndex == valueArray.length - 1) {
        const indexObject = allIndexs.find(
          (record) => `${record.code}[${index}]` == valueStr,
        );
        const { code, name, indexLevel, alias } = indexObject;
        array.push({
          type: 'key',
          realValue: valueStr,
          value: `${alias}${index}`,
          name,
          code,
          indexLevel,
        });
        if (value == '-' || value == '+') {
          array.push({
            value: value,
            type: 'base',
          });
        }
        valueStr = '';
        index = '';
      }
    });
    return array;
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
      setSelectedKey(TName);
      setkeys(indexKeys);
      setCompositeKeys(indexCompositeKeys);
      const { compare, value } = condition;
      form.setFieldsValue({
        compare,
        value,
      });
      if (condition.falseValue === '0' || !condition.falseValue) {
        setFalseValue([]);
      } else {
        setFalseValue(formatData(condition.falseValue));
      }
      if (!condition.trueValue || condition.trueValue === '0') {
        setTrueValue([]);
      } else {
        setTrueValue(formatData(condition.trueValue));
      }
    }
  }, [visible]);

  const [selectedKey, setSelectedKey] = useState('');

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

  const isValid = (rules) => {
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

    if (rules.length != 0 && rules.length % 2 != 1) {
      result = false;
    }
    return result;
  };

  const closeModal = () => {
    onCancel();
    form.resetFields();
    setFocus('');
    setTrueValue([]);
    setFalseValue([]);
  };

  return (
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
                className={item.value == '确认' ? '' : styles.calculatorButton}
                onClick={() => {
                  if (item.value == '删除') {
                    if (focus == 'trueValue') {
                      const array = [...trueValue];
                      array.pop();
                      setTrueValue(array);
                    } else if (focus == 'falseValue') {
                      const array = [...falseValue];
                      array.pop();
                      setFalseValue(array);
                    }
                  } else if (item.value == '确认') {
                    let trueResult = isValid(trueValue);
                    let falseResult = isValid(falseValue);
                    if (trueResult && falseResult) {
                      onConfirm(trueValue, falseValue, form.getFieldsValue());
                      closeModal();
                    } else {
                      message.warning('公式格式有误，请重新输入');
                    }
                  } else if (item.value == '清空') {
                    if (focus == 'trueValue') {
                      setTrueValue([]);
                    } else if (focus == 'falseValue') {
                      setFalseValue([]);
                    }
                  } else {
                    if (focus == 'trueValue') {
                      const valueArray = [...trueValue];
                      valueArray.push(item);
                      setTrueValue(valueArray);
                    } else if (focus == 'falseValue') {
                      const valueArray = [...falseValue];
                      valueArray.push(item);
                      setFalseValue(valueArray);
                    }
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
      closable={false}
      bodyStyle={{ padding: 0 }}
      width={'27vw'}
      wrapClassName={styles.calculator}
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
          <span style={{ fontSize: '14px', marginLeft: 8 }}>{'条件判断'}</span>
        </div>
        <CloseOutlined onClick={closeModal} />
      </div>
      <Form form={form}>
        <div
          style={{ display: 'flex', alignItems: 'center', padding: '0px 8px' }}
        >
          <span>当值</span>
          <Form.Item style={{ marginBottom: 0, marginLeft: 8 }} name="compare">
            <PositionSelect
              text="比较方向"
              style={{ width: 100 }}
              options={[
                {
                  value: '>',
                  label: '大于',
                },
                {
                  value: '<',
                  label: '小于',
                },
                {
                  value: '>=',
                  label: '大于等于',
                },
                {
                  value: '<=',
                  label: '小于等于',
                },
                {
                  value: '==',
                  label: '等于',
                },
                {
                  value: '!=',
                  label: '不等于',
                },
              ]}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginLeft: 8 }} name="value">
            <InputNumber
              placeholder="比较值"
              className={styles.calculatorInputNumber}
            />
          </Form.Item>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', padding: 8 }}>
          <span>则为:</span>
          <span
            style={{
              color: '#313131',
              marginLeft: 4,
              fontWeight: 'bold',
              padding: '0px 4px',
              border: '1px solid #f0f0f0',
              width: '82%',
              minHeight: 28,
              alignContent: 'center',
            }}
          >
            {returnStr(
              trueValue
                .map((item) => item.value)
                .toString()
                .replaceAll(',', ' '),
            )}
          </span>
          <a
            style={{ marginLeft: 4 }}
            onClick={() => {
              if (focus == 'trueValue') {
                setFocus('');
              } else {
                setFocus('trueValue');
              }
            }}
          >
            {focus == 'trueValue' ? '保存' : '编辑'}
          </a>
        </div>
        <div
          style={{ display: 'flex', alignItems: 'center', padding: '0px 8px' }}
        >
          <span>否则:</span>
          <span
            style={{
              color: '#313131',
              marginLeft: 4,
              fontWeight: 'bold',
              padding: '0px 4px',
              border: '1px solid #f0f0f0',
              width: '82%',
              minHeight: 28,
              alignContent: 'center',
            }}
          >
            {returnStr(
              falseValue
                .map((item) => item.value)
                .toString()
                .replaceAll(',', ' '),
            )}
          </span>
          <a
            style={{ marginLeft: 4 }}
            onClick={() => {
              if (focus == 'falseValue') {
                setFocus('');
              } else {
                setFocus('falseValue');
              }
            }}
          >
            {focus == 'falseValue' ? '保存' : '编辑'}
          </a>
        </div>
      </Form>
      {focus ? (
        <div style={{ color: '#313131', padding: '8px' }}>
          {focus == 'falseValue' ? '编辑否定项中...' : '编辑确定项中...'}
        </div>
      ) : null}
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
                      if (focus == 'trueValue') {
                        const valueArray = [...trueValue];
                        valueArray.push(item);
                        setTrueValue(valueArray);
                      } else if (focus == 'falseValue') {
                        const valueArray = [...falseValue];
                        valueArray.push(item);
                        setFalseValue(valueArray);
                      }
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
                      if (focus == 'trueValue') {
                        const valueArray = [...trueValue];
                        valueArray.push(item);
                        setTrueValue(valueArray);
                      } else if (focus == 'falseValue') {
                        const valueArray = [...falseValue];
                        valueArray.push(item);
                        setFalseValue(valueArray);
                      }
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
  );
}
