import { PlusCircleFilled } from '@ant-design/icons';
import {
  addSecQuestion,
  querySecQuestionPage,
  querySecQuestionPool,
} from '@asset360/apis/stockAnalysis';
import { Button, Form, message, Pagination } from 'antd';
import { CustomForm, CustomTabs } from 'iblive-base';
import moment from 'moment';
import { useEffect, useState } from 'react';
import CustomModal from '../../../../../../components/CustomModal';
import StatusGroup from '../../../../../../components/StausList';
import QuoteList from '../../../../assetOverview/AssetInventory/views/RightDetailCard/Quotes';
import { statusOptions, tagsStatusOptions } from '../../const';
import QuestionList from '../QuestionList';
import styles from './index.less';
import TreeTransfer from './TreeTransfer';

const DrawerContent = ({ record = {}, tagList = [], refresh = () => {} }) => {
  const [activeKey, setActiveKey] = useState('item-2');
  const [showAskModal, setShowAskModal] = useState(false);
  const [targetKeys, setTargetKeys] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState('1');
  const [form] = Form.useForm();
  const [questionForm] = Form.useForm();
  const [questionList, setQuestionList] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const getQuestionList = () => {
    querySecQuestionPool().then((res) => {
      if (res?.code > 0) {
        const addKey = (list = [], parentKey = '') => {
          list.forEach((item, index) => {
            item.key = parentKey + '-' + (item.id || index);
            item.questionContent = item.questionContent || item.moduleName;
            if (item.questionPool?.length > 0) {
              addKey(item.questionPool, item.key);
            }
          });
        };
        let origin = res?.records || [];
        addKey(origin);
        setTreeData(origin);
      }
    });
  };
  /**
   * 刷新方法
   */
  const refreshFn = () => {
    refresh();
    getQuestionPage();
  };
  /**
   * 分页查询问题列表
   */
  const getQuestionPage = (current) => {
    const date = form.getFieldValue('date') || [];
    querySecQuestionPage({
      interCode: record.interCode,
      current: current || 1,
      paging: 1,
      pageSize: 5,
      status: form.getFieldValue('status') || [],
      tag: form.getFieldValue('tags') || [],
      startDate: date[0]?.format('YYYYMMDD'),
      endDate: date[1]?.format('YYYYMMDD'),
      sortField: 'createTime',
      sortDire: form.getFieldValue('sortDire'),
    }).then((res) => {
      if (res?.code > 0) {
        setCurrent(current || 1);
        setQuestionList(res?.records || []);
        setTotal(res?.totalRecord || 0);
      }
    });
  };
  useEffect(() => {
    getQuestionList();
  }, []);
  useEffect(() => {
    if (record?.interCode) {
      getQuestionPage();
    }
  }, [record]);
  /**
   * 新增问题
   */
  const handleSubmit = () => {
    questionForm.validateFields().then((values) => {
      if (activeQuestion === '1') {
        values.questionPoolIdList = (targetKeys || []).map((e) => {
          const list = (e || '').split('-');
          return list[list.length - 1];
        });
      }
      const post = {
        questionType: activeQuestion === '1' ? 'POOL' : 'CUSTOM',
        interCode: record.interCode,
        ...values,
      };
      addSecQuestion(post).then((res) => {
        if (res?.code > 0) {
          message.success(res?.msg || '新增问题成功');
          setShowAskModal(false);
          questionForm.resetFields();
          setTargetKeys([]);
          setActiveQuestion('1');
          getQuestionPage();
        }
      });
    });
  };
  /**
   * 提问弹框关闭方法
   */
  const handleCloseAskModal = () => {
    setShowAskModal(false);
    questionForm.resetFields();
    setTargetKeys([]);
    setActiveQuestion('1');
  };
  return (
    <div style={{ height: '100%', paddingRight: 8 }}>
      <div>
        <CustomTabs
          options={[
            { label: '研究跟踪', value: 'item-2' },
            { label: '证券信息', value: 'item-1' }, // 务必填写 key
          ]}
          activeKey={activeKey}
          onChange={(key) => {
            form.resetFields();
            setActiveKey(key);
          }}
        />
        <div
          className={styles.title}
        >{`${record.interCode} / ${record.secName}`}</div>
      </div>
      {activeKey === 'item-2' && (
        <>
          <CustomForm
            rowGutter={12}
            form={form}
            initialValues={{
              tags: tagsStatusOptions.map((e) => e.value),
              status: statusOptions.map((e) => e.value),
            }}
            config={[
              {
                name: 'tags',
                colProps: {
                  flex: '440px',
                },
                custom: (
                  <StatusGroup
                    onChange={() => {
                      getQuestionPage();
                    }}
                    options={tagsStatusOptions}
                  />
                ),
                label: '标签',
              },
              {
                name: 'status',
                label: '状态',
                colProps: {
                  flex: 1,
                },
                custom: (
                  <StatusGroup
                    onChange={() => {
                      getQuestionPage();
                    }}
                    options={statusOptions}
                  />
                ),
              },
            ]}
          />
          <CustomForm
            form={form}
            initialValues={{
              sortDire: 'DESC',
              date: [moment().startOf('month'), moment().endOf('month')],
            }}
            onValuesChange={() => {
              getQuestionPage();
            }}
            config={[
              {
                colProps: {
                  flex: '300px',
                },
                type: 'dateRange',
                name: 'date',
              },
              {
                type: 'select',
                label: '时间排序',
                name: 'sortDire',
                colProps: {
                  flex: '180px',
                },
                props: {
                  options: [
                    {
                      label: '最新',
                      value: 'DESC',
                    },
                    {
                      label: '最早',
                      value: 'ASC',
                    },
                  ],
                },
              },
              {
                colProps: {
                  flex: 1,
                },
                custom: (
                  <Button
                    type={'primary'}
                    style={{ float: 'right' }}
                    icon={<PlusCircleFilled />}
                    onClick={() => {
                      setShowAskModal(true);
                      refreshFn();
                    }}
                  >
                    提问
                  </Button>
                ),
              },
            ]}
          />
          <QuestionList refresh={refreshFn} mockQuestionList={questionList} />
          <Pagination
            style={{ marginTop: 8, textAlign: 'right' }}
            size="small"
            total={total}
            showSizeChanger
            showQuickJumper
            pageSize={5}
            current={current}
            onChange={(current) => {
              getQuestionPage(current);
            }}
            showTotal={(total) => `共${total}条`}
          />
        </>
      )}
      {activeKey === 'item-1' && (
        <div style={{ height: 'calc(100vh - 140px)', overflow: 'auto' }}>
          <QuoteList
            showTitle={false}
            visible={true}
            selectTreeKey={'gupiao'}
            interCode={record.interCode}
          />
        </div>
      )}
      <CustomModal
        needChangeSize={true}
        title="提问"
        width={'80vw'}
        visible={showAskModal}
        onCancel={handleCloseAskModal}
        footer={[
          <Button key="cancel" onClick={handleCloseAskModal}>
            取消
          </Button>,
          // activeQuestion === '2' ? (
          //   <Button key="confirm" onClick={() => {}}>
          //     添加到问题库
          //   </Button>
          // ) : null,
          <Button key="confirm" type="primary" onClick={handleSubmit}>
            确认
          </Button>,
        ].filter(Boolean)}
      >
        <CustomTabs
          options={[
            { label: '问题库', value: '1' }, // 务必填写 key
            { label: '自定义问题', value: '2' },
          ]}
          activeKey={activeQuestion}
          onChange={(key) => {
            setActiveQuestion(key);
          }}
        />
        {activeQuestion === '1' && (
          <TreeTransfer
            dataSource={treeData}
            targetKeys={targetKeys}
            onChange={(keys) => {
              setTargetKeys(keys);
            }}
          />
        )}
        {activeQuestion === '2' && (
          <div>
            <CustomForm
              form={questionForm}
              config={[
                {
                  type: 'textArea',
                  name: 'questionContent',
                  label: '问题',
                  span: 24,
                  options: [
                    {
                      rules: [{ required: true, message: '请输入问题' }],
                    },
                  ],
                  props: {
                    rows: 5,
                  },
                },
                {
                  type: 'input',
                  name: 'answerDirection',
                  label: '方向',
                  span: 24,
                },
                {
                  type: 'select',
                  name: 'tag',
                  label: '分类',
                  span: 24,
                  options: [
                    {
                      rules: [{ required: true, message: '请选择分类' }],
                    },
                  ],
                  props: {
                    options: tagList,
                  },
                },
              ]}
            />
          </div>
        )}
      </CustomModal>
    </div>
  );
};

export default DrawerContent;
