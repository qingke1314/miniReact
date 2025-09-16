import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  addToPool,
  queryPage,
  queryPoolPage,
  querySecQuestionTag,
  querySector,
  removeFromPool,
} from '@asset360/apis/stockAnalysis';
import { Button, Col, Form, message, Popconfirm, Radio, Row } from 'antd-v5';
import { CustomForm, CustomTableWithYScroll } from 'iblive-base';
import React, { useCallback, useEffect, useState } from 'react';
import DrawerContent from './components/DrawerContent';
import { columns, tabList } from './const';
import styles from './index.less';

const StockAnalysis = () => {
  const [poolType, setPoolType] = useState('market');
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [current, setCurrent] = useState(1);
  const [clickRowId, setClickRowId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [poolLoading, setPoolLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [tagList, setTagList] = useState([]);
  const [sectorList, setSectorList] = useState([]);
  const getDataSource = (curCurrent, type) => {
    setLoading(true);
    form.validateFields().then((values) => {
      const fetchApi =
        (type || poolType) === 'market' ? queryPage : queryPoolPage;
      fetchApi({
        current: curCurrent || current,
        pageSize: 15,
        ...values,
      })
        .then((res) => {
          if (res?.code > 0) {
            setTotal(res?.totalRecord || 0);
            setDataSource(res?.records || []);
            if (
              !clickRowId ||
              !(res?.records || []).find((e) => e.interCode === clickRowId)
            ) {
              setClickRowId(res?.records?.[0]?.interCode);
            }
            setCurrent(curCurrent || current);
          } else {
            message.error(res?.msg);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const onChangePage = (current) => {
    getDataSource(current);
  };

  const handleRowClick = useCallback((record) => {
    setClickRowId(record.interCode);
  }, []);

  const handleAddToPool = () => {
    if (selectedRowKeys.length === 0) {
      message.error('请选择股票');
      return;
    }
    setPoolLoading(true);
    addToPool({
      interCodeList: selectedRowKeys,
    })
      .then((res) => {
        if (res?.code > 0) {
          setSelectedRowKeys([]);
          message.success(res?.msg || '加入研究池成功');
          getDataSource(1, 'market');
        }
      })
      .finally(() => {
        setPoolLoading(false);
      });
  };

  const handleDelete = () => {
    setPoolLoading(true);
    removeFromPool({
      interCodeList: selectedRowKeys,
    })
      .then((res) => {
        if (res?.code > 0) {
          message.success(res?.msg || '从研究池删除成功');
          getDataSource(1, 'analysis');
          setSelectedRowKeys([]);
        }
      })
      .finally(() => {
        setPoolLoading(false);
      });
  };

  useEffect(() => {
    getDataSource();
    querySector().then((res) => {
      if (res?.code > 0) {
        setSectorList(res?.records || []);
      }
    });
    querySecQuestionTag().then((res) => {
      if (res?.code > 0) {
        setTagList(res?.records || []);
      }
    });
  }, []);

  return (
    <div className={styles.content} id="content_container">
      <Row style={{ height: '100%' }} gutter={12}>
        <Col
          style={{
            padding: '8px 8px 8px 16px',
            borderRight: '1px solid var(--border-color-base)',
          }}
          span={8}
        >
          <Radio.Group
            value={poolType}
            onChange={(e) => {
              form.resetFields();
              setSelectedRowKeys([]);
              setPoolType(e.target.value);
              getDataSource(1, e.target.value);
            }}
            optionType="button"
            buttonStyle="solid"
            options={tabList}
          ></Radio.Group>
          <CustomForm
            style={{ margin: '8px 0' }}
            form={form}
            rowGutter={12}
            onValuesChange={(changedValues, allValues) => {
              getDataSource();
            }}
            config={[
              {
                visible: poolType === 'market',
                type: 'select',
                name: 'marketCode',
                label: '市场',
                span: 12,
                props: {
                  allowClear: true,
                  options: [
                    { label: '上交所', value: 'XSHG' },
                    { label: '深交所', value: 'XSHE' },
                  ],
                },
              },
              {
                visible: poolType === 'market',
                type: 'select',
                name: 'sector',
                label: '行业',
                span: 12,
                props: {
                  allowClear: true,
                  options: sectorList,
                  fieldNames: {
                    label: 'name',
                    value: 'code',
                  },
                },
              },
              {
                type: 'input',
                name: 'secCodeOrName',
                label: '股票代码/名称',
                colProps: {
                  flex: 1,
                },
                // props: {
                //   onPressEnter: () => {
                //     getDataSource();
                //   },
                // },
              },
              {
                custom: (
                  <>
                    {poolType === 'market' && (
                      <Button
                        onClick={handleAddToPool}
                        style={{ float: 'right' }}
                        icon={<PlusOutlined />}
                        type="primary"
                        loading={poolLoading}
                      >
                        加入研究池
                      </Button>
                    )}
                    {poolType === 'analysis' && (
                      <Popconfirm
                        title="确定要删除吗？"
                        onConfirm={handleDelete}
                      >
                        <Button
                          style={{ float: 'right' }}
                          icon={<DeleteOutlined />}
                          type="danger"
                          loading={poolLoading}
                        >
                          从研究池删除
                        </Button>
                      </Popconfirm>
                    )}
                  </>
                ),
                colProps: {
                  flex: '100px',
                },
              },
            ]}
          />
          <CustomTableWithYScroll
            loading={loading}
            height={'calc(100vh - 240px)'}
            columns={columns}
            dataSource={dataSource}
            rowKey="interCode"
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
            rowClassName={(record) =>
              record.interCode === clickRowId ? styles.activeRow : ''
            }
            pagination={{
              hideOnSinglePage: false,
              showSizeChanger: false,
              // simple: true,
              position: ['bottomRight'],
              pageSize: 15,
              total,
              current,
              onChange: (current) => {
                onChangePage(current);
              },
              style: {
                '--current_input_width': `${
                  `${current || 0}`.length * 14 + 4
                }px`,
              },
            }}
          />
        </Col>
        <Col span={16}>
          <DrawerContent
            refresh={getDataSource}
            record={dataSource.find((item) => item.interCode === clickRowId)}
            tagList={tagList}
          />
        </Col>
      </Row>
    </div>
  );
};

export default StockAnalysis;
