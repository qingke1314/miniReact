import { CloseOutlined } from '@ant-design/icons';
import { querySecQuestionPage } from '@asset360/apis/stockAnalysis';
import { Form } from 'antd-v5';
import { CustomForm, CustomTableWithYScroll } from 'iblive-base';
import React, { useEffect, useState } from 'react';
import QuestionList from '../StockAnalysis/components/QuestionList';
import { tagList } from '../StockAnalysis/const';
import { getColumns } from './const';
import styles from './index.less';

const StockResponse = () => {
  const [form] = Form.useForm();
  const [selectedRow, setSelectedRow] = useState(null);
  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [questionList, setQuestionList] = useState([]);
  /**
   * 分页查询问题列表
   */
  const getQuestionPage = (current = 1) => {
    querySecQuestionPage({
      current,
      paging: 1,
      pageSize: 5,
    }).then((res) => {
      if (res?.code > 0) {
        setCurrent(current || 1);
        const origin = res?.records || [];
        origin.forEach((item) => {
          item.key = item.questionId;
          // item.answerList = [];
          if (item.answerList?.length > 0) {
            item.answerList = item.answerList.map((e) => {
              return {
                ...e,
                secCode: item.secCode,
                secName: item.secName,
                questionContent: item.questionContent,
                key: item.questionId + '-' + e.answerId,
              };
            });
          }
        });
        setQuestionList(origin);
        if (selectedRow) {
          setSelectedRow(
            origin.find((e) => e.questionId === selectedRow.questionId),
          );
        }
        setTotal(res?.totalRecord || 0);
      }
    });
  };
  useEffect(() => {
    getQuestionPage();
    setCurrent(1);
  }, []);
  const onChangePage = (current) => {
    getQuestionPage(current);
  };
  /**
   * 查看
   */
  const handleView = (record) => {
    setSelectedRow(record);
  };
  /**
   * 关闭
   */
  const handleClose = () => {
    setSelectedRow(null);
  };
  return (
    <div className={styles.content} id="content_container">
      <div style={{ flex: 1, overflowX: 'hidden', overflowY: 'auto' }}>
        <CustomForm
          form={form}
          rowGutter={12}
          config={[
            {
              type: 'input',
              name: 'key',
              label: '股票代码',
              colProps: {
                flex: '280px',
              },
            },
            {
              type: 'select',
              name: 'status',
              label: '状态',
              props: {
                style: {
                  width: '220px',
                },
                options: tagList,
              },
              options: [
                {
                  label: '研究中',
                  value: '1',
                },
                {
                  label: '已回复',
                  value: '2',
                },
                {
                  label: '已点评',
                  value: '3',
                },
              ],
            },
          ]}
        ></CustomForm>
        <CustomTableWithYScroll
          height={'calc(100% - 100px)'}
          columns={getColumns(handleView)}
          dataSource={questionList}
          childrenColumnName={'answerList'}
          rowKey="questionId"
          indentSize={30}
          // rowSelection={{
          //   selectedRowKeys,
          //   onChange: setSelectedRowKeys,
          // }}
          pagination={{
            hideOnSinglePage: true,
            showSizeChanger: false,
            // simple: true,
            position: ['bottomRight'],
            pageSize: 10,
            total,
            current,
            onChange: onChangePage,
            style: {
              '--current_input_width': `${`${current || 0}`.length * 14 + 4}px`,
            },
          }}
        />
      </div>
      {selectedRow && (
        <div
          style={{
            marginLeft: 8,
            borderLeft: '1px solid var(--border-color-base)',
            width: 800,
            paddingLeft: 8,
          }}
        >
          <div
            style={{
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div className="important-title">
              {selectedRow.secName + '/' + selectedRow.secCode}
            </div>
            <CloseOutlined
              onClick={handleClose}
              style={{ color: 'var(--primary-color)', cursor: 'point' }}
            />
          </div>
          <QuestionList
            defaultShow
            refresh={() => {
              getQuestionPage(current);
            }}
            normalHeight
            mockQuestionList={selectedRow ? [selectedRow] : []}
          />
        </div>
      )}
    </div>
  );
};

export default StockResponse;
