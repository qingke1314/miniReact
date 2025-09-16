/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-06-17 10:42:58
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2025-02-19 10:42:31
 * @Description:
 */
import {
  getAllFundTree,
  getPositionAuthByUserAcc,
  getPositionRoleList,
  updatePositionAuth,
} from '@asset360/apis/position';
import CustomButtonGroup from '@asset360/components/CustomButtonGroup';
import CustomModal from '@asset360/components/CustomModal';
import {
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Switch,
  TreeSelect,
} from 'antd';
import { securityUtils } from 'iblive-base';
import { useEffect, useRef, useState } from 'react';
import { queryGroupTree } from '../../../../../../apis/positionFundGroup';
const { encrypt } = securityUtils;

/**
 * @description: 产品权限树
 * @param {*} tree
 * @return {*}
 */
const formatFundTree = (tree = []) => {
  const formatedTree = [];
  tree.forEach((item) => {
    formatedTree.push({
      value: `${item.headObjectCode}_${item.objectCode}`, // 不同类型code有可能重复
      label: item.objectName,
      headObjectCode: item.headObjectCode,
      objectCode: item.objectCode,
      children: item.childrenObjects?.length
        ? formatFundTree(item.childrenObjects)
        : null,
    });
  });
  return formatedTree;
};
/**
 * @description: 过滤保存参数authList
 * @param {*} tree
 * @param {*} filterObj
 * @return {*}
 */
const filterTree = (tree = [], filterObj = {}) => {
  let newTree = [];
  newTree = tree.map((item) => {
    let obj;
    if (item.children && item.children.length > 0) {
      const childrenObjects = filterTree(item.children, filterObj);
      if (childrenObjects?.length) {
        obj = {
          headObjectCode: item.headObjectCode,
          objectCode: item.objectCode,
          childrenObjects,
        };
      }
    } else if (filterObj[item.value]) {
      obj = {
        headObjectCode: item.headObjectCode,
        objectCode: item.objectCode,
        childrenObjects: null,
      };
    }
    return obj;
  });
  newTree = newTree.filter((item) => item);
  return newTree;
};
/**
 * @description: 按树形格式authList
 * @param {*} tree
 * @param {*} filterObj
 * @return {*}
 */
const formatAuthListParam = (authList = [], formatedTree = []) => {
  const obj = {};
  authList.forEach((key) => {
    obj[key] = true;
  });
  const tree = filterTree(formatedTree, obj);
  return tree;
};
const getAuthListFromTree = (tree) => {
  const list = [];
  (tree ?? []).forEach((item) => {
    const { headObjectCode, objectCode, childrenObjects } = item;
    const key = `${headObjectCode}_${objectCode}`;
    if (childrenObjects?.length) {
      list.push(...getAuthListFromTree(childrenObjects));
    } else {
      list.push(key);
    }
  });
  return list;
};

export default function EditModal({ visible, userAcc, onCancel, callback }) {
  const [roleList, setRoleList] = useState([]); // 角色列表
  const [fundTree, setFundTree] = useState([]); // 产品Tree
  const [isNewPassword, setIsNewPassword] = useState(true);
  const oldPassword = useRef();
  const [form] = Form.useForm();
  const [productGroupList, setProductGroupList] = useState();

  const getRoleList = async () => {
    const res = await getPositionRoleList();
    setRoleList(res?.records || []);
  };

  const getFundTree = async () => {
    const res = await getAllFundTree();
    setFundTree(formatFundTree(res?.records || []));
  };

  const getUserInfo = async () => {
    const res = await getPositionAuthByUserAcc({ userAcc });
    const info = res?.data || {};
    if (info.password) {
      oldPassword.current = info.password;
      setIsNewPassword(false);
    }
    form.setFieldsValue({
      ...info,
      editPosition: !!info.editPosition,
      authList: getAuthListFromTree(info.authList),
      password: info.password ? '旧密码已加密' : undefined,
    });
  };

  const onConfirm = (setLoading) => {
    form.validateFields().then(async (values) => {
      setLoading(true);
      const params = {
        ...values,
        editPosition: values.editPosition ? 1 : 0,
        authList: formatAuthListParam(values.authList, fundTree),
        password: isNewPassword
          ? encrypt(values.password)
          : oldPassword.current,
      };
      const res = await updatePositionAuth(params);
      if (res?.code === 1) {
        message.success('用户权限保存成功');
        onCancel();
        callback();
      }
      setLoading(false);
    });
  };

  const onValuesChange = (changeValues) => {
    const changeKeys = Object.keys(changeValues);
    if (changeKeys.includes('editPosition')) {
      setIsNewPassword(true);
      form.setFields([
        {
          name: 'password',
          value: undefined,
        },
      ]);
    } else if (changeKeys.includes('password')) {
      if (!isNewPassword) {
        setIsNewPassword(true);
        form.setFields([
          {
            name: 'password',
            value: undefined,
          },
        ]);
      }
    }
  };

  const afterClose = () => {
    form.resetFields();
    setIsNewPassword(true);
  };

  const getProductGroup = async () => {
    const res = await queryGroupTree();
    setProductGroupList(res?.records);
  };

  useEffect(() => {
    if (visible) {
      getUserInfo();
    }
  }, [visible]);

  useEffect(() => {
    getRoleList();
    getFundTree();
    getProductGroup();
  }, []);

  return (
    <CustomModal
      visible={visible}
      onCancel={onCancel}
      size="big"
      title="编辑用户权限"
      afterClose={afterClose}
      footer={<CustomButtonGroup onCancel={onCancel} onConfirm={onConfirm} />}
    >
      <Form form={form} onValuesChange={onValuesChange}>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item name="userAcc" label="账号" required>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="userName" label="用户名称" required>
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="roleCode" label="用户岗位">
              <Select
                options={roleList}
                fieldNames={{ label: 'name', value: 'code' }}
              />
            </Form.Item>
          </Col>
          <Form.Item
            noStyle
            shouldUpdate={(pre, cur) => pre.roleCode !== cur.roleCode}
          >
            {({ getFieldValue }) =>
              getFieldValue('roleCode') !== 'MANAGER' ? (
                <Col span={12}>
                  <Form.Item
                    name="groupCode"
                    label="产品组"
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
              ) : (
                <Col span={12} />
              )
            }
          </Form.Item>

          <Col span={12}>
            <Form.Item
              name="editPosition"
              label="修改头寸项权限"
              valuePropName="checked"
              required
            >
              <Switch checkedChildren="开启" unCheckedChildren="关闭" />
            </Form.Item>
          </Col>
          <Form.Item
            noStyle
            shouldUpdate={(pre, cur) => pre.editPosition !== cur.editPosition}
          >
            {({ getFieldValue }) =>
              getFieldValue('editPosition') ? (
                <Col span={12}>
                  <Form.Item
                    name="password"
                    label="修改头寸密码"
                    rules={[
                      { required: true, message: '修改头寸密码不能为空' },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>
              ) : (
                <Col span={12} />
              )
            }
          </Form.Item>

          <Col span={24}>
            <Form.Item name="remarks" label="备注">
              <Input.TextArea autoSize />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </CustomModal>
  );
}
