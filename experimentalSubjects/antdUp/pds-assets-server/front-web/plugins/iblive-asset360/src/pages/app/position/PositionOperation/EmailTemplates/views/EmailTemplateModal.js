/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-06-19 09:40:42
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2025-02-19 10:42:40
 * @Description:
 */
import { getAllFundTree } from '@asset360/apis/position';
import {
  saveEmailTemplate,
  updateEmailTemplate,
} from '@asset360/apis/positionEmailTemplate';
import { getAllUsers } from '@asset360/apis/user';
import CronForm from '@asset360/components/CronForm';
import CustomButtonGroup from '@asset360/components/CustomButtonGroup';
import CustomModal from '@asset360/components/CustomModal';
import { Boot } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
  TreeSelect,
} from 'antd-v5';
import { useEffect, useState } from 'react';
import { queryGroupTree } from '../../../../../../apis/positionFundGroup';
import { WARN_LEVEL } from '../../PositionEvents/CONST';
import PlaceholderMenu from './PlaceholderMenu';

const initContent = '<p>请输入模板内容</p>';

const PlaceholderMenuConf = {
  key: 'placeholderMenu', // 定义 menu key ：要保证唯一、不重复（重要）
  factory() {
    return new PlaceholderMenu(); // 把 `YourMenuClass` 替换为你菜单的 class
  },
};

const productTypeList = [
  {
    label: '全部产品',
    value: 'ALL_FUND',
  },
  {
    label: '产品组',
    value: 'FUND_GROUP',
  },
  {
    label: '特定产品',
    value: 'FUND',
  },
];

const CONDITIONS = [
  {
    label: '大于',
    value: '>',
  },
  {
    label: '小于',
    value: '<',
  },
  {
    label: '大于等于',
    value: '>=',
  },
  {
    label: '小于等于',
    value: '<=',
  },
  {
    label: '等于',
    value: '==',
  },
];

Boot.registerMenu(PlaceholderMenuConf);

export default ({ visible, record, onCancel, callback }) => {
  const [form] = Form.useForm();
  const [editor, setEditor] = useState(null);
  const [html, setHtml] = useState(initContent);
  const [userList, setUserList] = useState(); // 用户list
  const [productList, setProductList] = useState(); // 产品list
  const [executeCron, setexecuteCron] = useState('');
  const [productGroupList, setProductGroupList] = useState();

  const afterClose = () => {
    form.resetFields();
  };

  const changeCron = (cron, closeModal) => {
    setexecuteCron(cron);
    form.setFields([{ name: 'executeCron', value: cron }]);
    return closeModal && closeModal();
  };

  const getUserList = async () => {
    const res = await getAllUsers();
    setUserList(res?.records || []);
  };

  const getProductList = async () => {
    const res = await getAllFundTree();
    const data =
      res?.records?.map((item) => ({
        ...item,
        showName: `${item?.objectCode} ${item?.objectName}`,
      })) || [];
    setProductList(data);
  };

  const onConfirm = () => {
    form.validateFields().then(async (values) => {
      const fun = record?.id ? updateEmailTemplate : saveEmailTemplate;
      const reg = /\<table\s/g;
      const content = (html || '').replace(reg, '<table border=1 '); // 给表格添加边
      const res = await fun({
        ...values,
        content,
        id: record?.id,
      });
      if (res?.code === 1) {
        message.success('模板保存成功');
        callback();
        onCancel();
      }
    });
  };

  const getProductGroup = async () => {
    const res = await queryGroupTree();
    setProductGroupList(res?.records);
  };

  useEffect(() => {
    if (visible) {
      if (record) {
        form.setFieldsValue(record);
        setHtml(record.content);
      } else {
        setHtml(initContent);
      }
    }
  }, [visible]);

  useEffect(() => {
    getUserList();
    getProductList();
    getProductGroup();
  }, []);

  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);
  return (
    <CustomModal
      title="警告模板"
      size="big"
      visible={visible}
      onCancel={onCancel}
      footer={<CustomButtonGroup onCancel={onCancel} onConfirm={onConfirm} />}
      needChangeSize
      afterClose={afterClose}
    >
      <Form
        form={form}
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        labelCol={{ flex: '6em' }}
      >
        <Row>
          <Col span={20}>
            <Form.Item
              label="模板名称"
              name="name"
              rules={[{ required: true, message: '模板名称不能为空' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={20}>
            <Form.Item
              label="邮件标题"
              name="title"
              rules={[{ required: true, message: '邮件标题不能为空' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={20}>
            <Form.Item
              className="m-t-8"
              label="密送人"
              name="recipientEmailsOfCc"
            >
              <Select
                mode="multiple"
                options={userList}
                showSearch
                optionFilterProp="userName"
                allowClear
                fieldNames={{ label: 'userName', value: 'userAcc' }}
                maxTagCount="responsive"
              />
            </Form.Item>
          </Col>
          <Col span={20}>
            <Form.Item
              className="m-t-8"
              label="抄送人"
              name="recipientEmailsOfBcc"
            >
              <Select
                mode="multiple"
                options={userList}
                showSearch
                optionFilterProp="userName"
                allowClear
                fieldNames={{ label: 'userName', value: 'userAcc' }}
                maxTagCount="responsive"
              />
            </Form.Item>
          </Col>
          <Col span={20}>
            <Form.Item
              className="m-t-8"
              label="产品范围"
              name="productType"
              initialValue="ALL_FUND"
              rules={[{ required: true, message: '产品范围不能为空' }]}
            >
              <Select options={productTypeList} allowClear />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              noStyle
              shouldUpdate={(pre, cur) => pre.productType !== cur.productType}
            >
              {({ getFieldValue }) => {
                const productType = getFieldValue('productType');
                return productType === 'FUND' ? (
                  <Row gutter={8}>
                    <Col span={20}>
                      <Form.Item
                        className="m-t-8"
                        label="关联产品"
                        name="productCodes"
                        rules={[
                          { required: true, message: '关联产品不能为空' },
                        ]}
                      >
                        <Select
                          mode="multiple"
                          maxTagCount="responsive"
                          options={productList}
                          showSearch
                          fieldNames={{
                            label: 'showName',
                            value: 'objectCode',
                          }}
                          getPopupContainer={(trigger) => trigger.parentElement}
                          filterOption={(inputValue, node) =>
                            `${node.objectCode || ''}`.indexOf(inputValue) >
                              -1 ||
                            `${node.objectName || ''}`.indexOf(inputValue) > -1
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        noStyle
                        shouldUpdate={(pre, cur) =>
                          pre.productCodes !== cur.productCodes
                        }
                      >
                        {({ getFieldValue }) => {
                          const productCodes = getFieldValue('productCodes');
                          const needClear =
                            productCodes?.length === productList?.length &&
                            productCodes?.length;
                          const text = needClear ? '清空' : '全选';
                          const fun = needClear
                            ? () =>
                                form.setFields([
                                  { name: 'productCodes', value: undefined },
                                ])
                            : () =>
                                form.setFields([
                                  {
                                    name: 'productCodes',
                                    value: (productList || []).map(
                                      (item) => item.objectCode,
                                    ),
                                  },
                                ]);
                          return (
                            <Button type="dashed" onClick={fun}>
                              {text}
                            </Button>
                          );
                        }}
                      </Form.Item>
                    </Col>
                  </Row>
                ) : productType === 'FUND_GROUP' ? (
                  <>
                    <Col span={20}>
                      <Form.Item
                        label="产品组"
                        name="groupCode"
                        rules={[{ required: true, message: '产品组不能为空' }]}
                      >
                        <TreeSelect
                          allowClear
                          showSearch
                          treeDefaultExpandAll
                          treeData={productGroupList}
                          treeNodeFilterProp="name"
                          fieldNames={{
                            value: 'code',
                            label: 'name',
                            children: 'children',
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </>
                ) : null;
              }}
            </Form.Item>
          </Col>
          <Col span={18}>
            <Form.Item
              name="executeCron"
              label="执行Cron"
              rules={[{ required: true, message: '执行Cron不能为空' }]}
            >
              <Input
                allowClear
                onChange={(e) => {
                  setexecuteCron(e.target.value);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={2} style={{ padding: '0px 8px' }}>
            <CronForm onOk={changeCron} value={executeCron} title="配置" />
          </Col>
          <Col span={4}>
            <Form.Item
              label=""
              name="tradeDayExec"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>仅交易日执行</Checkbox>
            </Form.Item>
          </Col>
          <Col span={20}>
            <Form.Item
              name="status"
              label="状态"
              initialValue={1}
              rules={[{ required: true, message: '状态不能为空' }]}
            >
              <Radio.Group buttonStyle="solid">
                <Radio value={1}>有效</Radio>
                <Radio value={0}>无效</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={20}>
            <Form.Item
              label="预警级别"
              name="warnLevel"
              rules={[{ required: true, message: '预警级别不能为空' }]}
            >
              <Select options={WARN_LEVEL} />
            </Form.Item>
          </Col>
          <Col span={20}>
            <Form.Item
              label="预警指标"
              name="indexCode"
              rules={[{ required: true, message: '预警指标不能为空' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={20}>
            <Form.Item
              label="结果类型"
              name="resultType"
              rules={[{ required: true, message: '结果类型不能为空' }]}
            >
              <Select>
                <Select.Option key="LIST" value="LIST">
                  列表
                </Select.Option>
                <Select.Option key="VALUE" value="VALUE">
                  单值
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={20}>
            <Form.Item
              noStyle
              shouldUpdate={(pre, cur) => pre.resultType !== cur.resultType}
            >
              {({ getFieldValue }) => {
                const resultType = getFieldValue('resultType');
                return (
                  resultType === 'VALUE' && (
                    <>
                      <Col span={20}>
                        <Form.Item
                          label="阈值参数"
                          name="paramsCode"
                          rules={[
                            { required: true, message: '阈值参数不能为空' },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={20}>
                        <Form.Item
                          label="判断条件"
                          name="conditions"
                          rules={[
                            { required: true, message: '判断条件不能为空' },
                          ]}
                        >
                          <Select options={CONDITIONS} showSearch />
                        </Form.Item>
                      </Col>
                    </>
                  )
                );
              }}
            </Form.Item>
          </Col>
          <Col span={20}>
            <Form.Item label="备注" name="remarks">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <div
          style={{
            border: '1px solid var(--background-color-table-border)',
            flex: 1,
            height: 0,
          }}
        >
          <Toolbar
            editor={editor}
            defaultConfig={{
              excludeKeys: ['group-video'],
              insertKeys: {
                index: 32,
                keys: ['placeholderMenu'],
              },
            }}
            mode="default"
            style={{
              borderBottom: '1px solid var(--background-color-table-border)',
            }}
          />
          <Editor
            value={html}
            onCreated={setEditor}
            onChange={(editor) => setHtml(editor.getHtml())}
            mode="default"
            style={{ minHeight: '200px' }}
          />
        </div>
      </Form>
    </CustomModal>
  );
};
