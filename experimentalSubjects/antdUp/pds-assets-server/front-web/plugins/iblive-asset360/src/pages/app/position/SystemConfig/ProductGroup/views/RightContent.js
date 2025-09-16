/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2025-02-18 13:54:53
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2025-02-19 09:55:15
 * @Description:
 */
import { Button, Col, Empty, Form, Input, Modal, Row, Space } from 'antd';
import {
  CustomTableWithYScroll,
  desensitization,
  useGetHeight,
  useTable,
} from 'iblive-base';
import { useEffect, useRef, useState } from 'react';
import { queryFundTypeInfo } from '../../../../../../apis/positionCommon';
import { findGroupFundPage } from '../../../../../../apis/positionFund';
import { batchRemoveProduct } from '../../../../../../apis/positionFundGroup';
import styles from '../index.less';
import ImportModal from './ImportModal';
const pageSize = 15;

export default ({ selectedNode }) => {
  const [form] = Form.useForm();
  const searchValue = useRef();
  const [fundTypeObj, setFundTypeObj] = useState();
  const [importVisible, setImportVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState();
  const [list, { total, current, loading }, updateList] = useTable(
    async ({ current }) => {
      setSelectedRowKeys();
      if (selectedNode?.key === undefined) return;
      const res = await findGroupFundPage({
        pageSize,
        pageNumber: current,
        groupCode: selectedNode?.key,
        ...(searchValue.current || {}),
      });
      return res;
    },
    pageSize,
  );
  const tableWrapperRef = useRef();
  const tableWrapperHeight = useGetHeight(tableWrapperRef.current, 300, 16);
  const tableHeight = Math.max(
    total > pageSize ? tableWrapperHeight - 56 : tableWrapperHeight,
    300,
  );

  const columns = [
    {
      title: '产品代码',
      dataIndex: 'fundCode',
      render: (text) => desensitization(text),
    },
    {
      title: '产品名称',
      dataIndex: 'fundFn',
      render: (text) => desensitization(text),
    },
    {
      title: '产品简称',
      dataIndex: 'fundName',
      render: (text) => desensitization(text),
    },
    {
      title: '产品类型',
      dataIndex: 'fundType',
      render: (text) => fundTypeObj?.[text] ?? text,
    },
    {
      title: '投资类型',
      dataIndex: 'fundInvestType',
    },
    {
      title: '成立日期',
      dataIndex: 'openDate',
    },
  ];

  const onSearch = () => {
    const values = form.getFieldsValue();
    searchValue.current = values;
    updateList(1);
  };

  const onBatchDelete = () => {
    Modal.confirm({
      title: '批量删除',
      content: `是否批量删除${selectedRowKeys?.length}项产品?`,
      onOk: async () => {
        setDeleteLoading(true);
        const res = await batchRemoveProduct({
          fundCodeList: selectedRowKeys,
          groupId: selectedNode?.id,
        });
        if (res?.code === 1) {
          onChangePage(current);
        }
        setDeleteLoading(false);
      },
    });
  };

  const onChangePage = ({ current }) => {
    updateList(current);
  };

  const getFundTypeList = async () => {
    const res = await queryFundTypeInfo();
    setFundTypeObj(
      (res?.records || []).reduce((obj, cur) => {
        obj[cur.code] = cur.name;
        return obj;
      }, {}),
    );
  };

  useEffect(() => {
    form.resetFields();
    searchValue.current = undefined;

    updateList(1);
  }, [selectedNode?.key]);
  useEffect(() => {
    getFundTypeList();
  }, []);
  return (
    <>
      {selectedNode?.key ? (
        <div className={styles.right_content}>
          <Form form={form}>
            <Row justify="space-between" className="m-b-8">
              <Col>
                <Row gutter={8}>
                  <Col>
                    <Form.Item
                      name="fundCode"
                      label="产品代码"
                      style={{ marginBottom: 0 }}
                    >
                      <Input allowClear />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name="fundName"
                      label="产品简称"
                      style={{ marginBottom: 0 }}
                    >
                      <Input allowClear />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Button type="primary" loading={loading} onClick={onSearch}>
                      查询
                    </Button>
                  </Col>
                </Row>
              </Col>
              {selectedNode?.key !== '-1' && (
                <Col>
                  <Space>
                    <Button
                      type="primary"
                      onClick={() => {
                        setImportVisible(true);
                      }}
                    >
                      批量导入
                    </Button>
                    <Button
                      type="primary"
                      danger
                      disabled={!selectedRowKeys?.length}
                      loading={deleteLoading}
                      onClick={onBatchDelete}
                    >
                      批量删除
                    </Button>
                  </Space>
                </Col>
              )}
            </Row>
          </Form>
          <div ref={tableWrapperRef}>
            <CustomTableWithYScroll
              loading={loading}
              dataSource={list}
              total={total}
              pageSize={pageSize}
              current={current}
              onChange={onChangePage}
              rowSelection={
                selectedNode?.key !== '-1'
                  ? {
                      selectedRowKeys,
                      onChange: setSelectedRowKeys,
                    }
                  : undefined
              }
              columns={columns}
              height={tableHeight}
              rowKey="fundCode"
            />
          </div>
        </div>
      ) : (
        <Empty className="p-t-32" description="请选择对应分组" />
      )}
      {/* 批量导入 */}
      <ImportModal
        visible={importVisible}
        groupId={selectedNode?.id}
        fundTypeObj={fundTypeObj}
        callback={() => onChangePage(current)}
        onCancel={() => setImportVisible(false)}
      />
    </>
  );
};
