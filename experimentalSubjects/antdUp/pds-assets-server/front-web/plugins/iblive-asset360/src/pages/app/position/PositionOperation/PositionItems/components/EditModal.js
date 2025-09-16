/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-14 12:54:31
 * @LastEditTime: 2024-11-21 17:02:48
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 */

import { getAllDept } from '@asset360/apis/dept';
import { getAllFundTree } from '@asset360/apis/position';
import {
  savePositionItem,
  updatePositionItem,
} from '@asset360/apis/positionItem';
import CronForm from '@asset360/components/CronForm';
import CustomButtonGroup from '@asset360/components/CustomButtonGroup';
import CustomModal from '@asset360/components/CustomModal';
import {
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  TreeSelect,
} from 'antd';
import { useEffect, useState } from 'react';

export default ({
  types = [],
  callback,
  visible,
  onCancel,
  info = {},
  positionType,
}) => {
  const [form] = Form.useForm();
  const [depts, setDepts] = useState([]);
  const [funds, setFunds] = useState([]);

  const getDept = async () => {
    const res = await getAllDept();
    setDepts(res?.records || []);
  };

  const getFundTree = async () => {
    const res = await getAllFundTree();
    setFunds(res?.records || []);
  };

  const [executeCron, setexecuteCron] = useState('');

  const changeCron = (cron, closeModal) => {
    setexecuteCron(cron);
    form.setFields([{ name: 'executeCron', value: cron }]);
    return closeModal && closeModal();
  };

  useEffect(() => {
    if (visible) {
      if (info.id) {
        form.setFieldsValue({ ...info });
        setexecuteCron(info?.executeCron);
      }
      getDept();
      getFundTree();
    }
  }, [visible]);

  return (
    <CustomModal
      title={info.id ? '编辑头寸项' : '新增头寸项'}
      width="55vw"
      footer={
        <CustomButtonGroup
          onConfirm={() => {
            form.validateFields().then(async (values) => {
              const func = info.id ? updatePositionItem : savePositionItem;
              const object = {
                id: info.id,
                positionIndexCode: values.code,
                ...values,
                code: info.code || values.code,
                positionType,
              };
              const res = await func(object);
              if (res?.code === 1) {
                message.success(`${info.id ? '更新' : '新增'}成功`);
                onCancel();
                callback();
              }
            });
          }}
          onCancel={onCancel}
        />
      }
      visible={visible}
      onCancel={onCancel}
      maskClosable={false}
      afterClose={() => {
        form.resetFields();
      }}
      destroyOnClose
    >
      <Form
        form={form}
        style={{ alignItems: 'center' }}
        labelAlign="right"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
      >
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item name="indexLevel" label="指标层级" initialValue={1}>
              <Select
                options={[
                  {
                    label: '原子项',
                    value: 1,
                  },
                  {
                    label: '复合项',
                    value: 2,
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: '头寸项名称不能为空' }]}
              label={'头寸项名称'}
            >
              <Input allowClear />
            </Form.Item>
          </Col>

          <Form.Item
            shouldUpdate={(prevValue, curValue) =>
              prevValue.indexLevel !== curValue.indexLevel
            }
            noStyle
          >
            {({ getFieldValue }) => {
              const indexLevel = getFieldValue('indexLevel');
              if (indexLevel == 2) {
                return (
                  <Col span={12}>
                    <Form.Item
                      name="code"
                      label="头寸项代码"
                      rules={[{ required: true, message: '头寸项不能为空' }]}
                    >
                      <Input allowClear />
                    </Form.Item>
                  </Col>
                );
              }
              return (
                <Col span={12}>
                  <Form.Item
                    name="positionIndexCode"
                    rules={[{ required: true, message: '指标代码不能为空' }]}
                    label={'指标代码'}
                  >
                    <Input disabled={info.id} allowClear />
                  </Form.Item>
                </Col>
              );
            }}
          </Form.Item>

          <Col span={12}>
            <Form.Item
              name="businessType"
              rules={[{ required: true, message: '业务类别不能为空' }]}
              label={'业务类别'}
            >
              <TreeSelect
                treeData={types}
                showSearch
                filterTreeNode={(inputValue, node) =>
                  node.title?.indexOf(inputValue) > -1
                }
              />
            </Form.Item>
          </Col>

          {info?.id ? null : (
            <>
              <Col span={12}>
                <Form.Item
                  name="allProductUse"
                  label="使用范围"
                  initialValue={0}
                >
                  <Select
                    options={[
                      {
                        label: '全产品',
                        value: 0,
                      },
                      {
                        label: '指定产品',
                        value: 1,
                      },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Form.Item
                shouldUpdate={(prevValue, curValue) =>
                  prevValue.allProductUse !== curValue.allProductUse
                }
                noStyle
              >
                {({ getFieldValue }) => {
                  const allProductUse = getFieldValue('allProductUse');
                  if (allProductUse == 1) {
                    return (
                      <Col span={12}>
                        <Form.Item
                          label="产品代码"
                          name="fundCodes"
                          rules={[
                            { required: true, message: '产品代码不能为空' },
                          ]}
                        >
                          <Select
                            options={funds}
                            fieldNames={{
                              label: 'objectName',
                              value: 'objectCode',
                            }}
                            mode={'multiple'}
                          />
                        </Form.Item>
                      </Col>
                    );
                  }
                  return null;
                }}
              </Form.Item>

              <Col span={12}>
                <Form.Item name="deptId" label="权限部门">
                  <Select
                    options={depts}
                    fieldNames={{
                      label: 'deptName',
                      value: 'deptId',
                    }}
                    产品代码
                  />
                </Form.Item>
              </Col>
            </>
          )}

          <Form.Item
            shouldUpdate={(prevValue, curValue) =>
              prevValue.indexLevel !== curValue.indexLevel
            }
            noStyle
          >
            {({ getFieldValue }) => {
              const indexLevel = getFieldValue('indexLevel');
              if (indexLevel == 1) {
                return (
                  <>
                    <Col span={12}>
                      <Form.Item
                        name="tradeDetailIndexCode"
                        label="交易明细指标代码"
                      >
                        <Input allowClear />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item name="financeIndexCode" label="财务指标代码">
                        <Input allowClear />
                      </Form.Item>
                    </Col>
                  </>
                );
              }
              return null;
            }}
          </Form.Item>

          <Col span={12}>
            <Form.Item name="sequence" label="头寸项顺序" initialValue={0}>
              <InputNumber allowClear min={0} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="status" label="状态" initialValue={1}>
              <Select
                options={[
                  {
                    label: '有效',
                    value: 1,
                  },
                  {
                    label: '无效',
                    value: 0,
                  },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="remarks" label="备注">
              <Input allowClear />
            </Form.Item>
          </Col>
          <Form.Item
            shouldUpdate={(prevValue, curValue) =>
              prevValue.indexLevel !== curValue.indexLevel
            }
            noStyle
          >
            {({ getFieldValue }) => {
              const indexLevel = getFieldValue('indexLevel');
              return (
                indexLevel === 1 && (
                  <>
                    <Col span={10}>
                      <Form.Item
                        name="executeCron"
                        label="cron表达式"
                        wrapperCol={{ span: 14 }}
                        labelCol={{ span: 10 }}
                      >
                        <Input
                          allowClear
                          onChange={(e) => {
                            setexecuteCron(e.target.value);
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <CronForm
                        onOk={changeCron}
                        value={executeCron}
                        title="配置"
                      />
                    </Col>
                  </>
                )
              );
            }}
          </Form.Item>
        </Row>
      </Form>
    </CustomModal>
  );
};
