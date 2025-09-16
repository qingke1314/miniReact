/* eslint-disable react/no-array-index-key */
/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-17 14:55:51
 * @LastEditTime: 2024-08-01 16:53:54
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
  TKey,
  TName,
}) {
  const [form] = Form.useForm();
  const [keys, setkeys] = useState([]);
  const [compositeKeys, setCompositeKeys] = useState([]);
  const [trueValue, setTrueValue] = useState([]);
  const [falseValue, setFalseValue] = useState([]);
  const [focus, setFocus] = useState('');

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
        ?.indexs.filter((item) => item.indexLevel != '1' && item[TKey])
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
      setSelectedKey(`${TName}_${TKey}`);
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
        ?.filter((item) => item.indexLevel != '1' && item[newTKey])
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
            {trueValue
              .map((item) => item.value)
              .toString()
              .replaceAll(',', ' ')}
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
            {falseValue
              .map((item) => item.value)
              .toString()
              .replaceAll(',', ' ')}
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
