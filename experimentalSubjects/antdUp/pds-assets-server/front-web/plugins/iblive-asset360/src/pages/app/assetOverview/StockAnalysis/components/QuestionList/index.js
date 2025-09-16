import {
  answerQuestion,
  commentAnswer,
  removeQuestion,
  updateQuestion,
} from '@asset360/apis/stockAnalysis';
import { Button, Form, message, Popconfirm, Rate, Tag, Tooltip } from 'antd-v5';
import { CustomForm } from 'iblive-base';
import { useRef, useState } from 'react';
import ReactQuill from 'react-quill'; // 引入主元件
import 'react-quill/dist/quill.snow.css'; // 引入 Snow 主題的 CSS
import CustomCard from '../../../../../../components/CustomCard';
import CustomModal from '../../../../../../components/CustomModal';
import { tagList } from '../../const';
import styles from './index.less';

const showEdit = false;
const getColor = (code) => {
  if (code.includes('行业')) {
    return 'var(--orange-color)';
  }
  if (code.includes('估值')) {
    return 'var(--primary-color)';
  }
  if (code.includes('基本')) {
    return 'var(--green-color)';
  }
  return 'var(--green-color)';
};
const QuestionList = ({
  mockQuestionList = [],
  defaultShow = false,
  normalHeight = false,
  refresh = () => {},
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [responseItem, setResponseItem] = useState({});
  const [replyContent, setReplyContent] = useState('');
  const [showFullContent, setShowFullContent] = useState({});
  const [loading, setLoading] = useState(false);
  const [showFullRate, setShowFullRate] = useState({});
  const [commentForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const currentAnswerId = useRef(null);
  const editId = useRef(null);
  const handleReply = () => {
    // 这里可以处理提交逻辑，比如调用接口
    setLoading(true);
    answerQuestion({
      questionId: responseItem.questionId,
      answerContent: replyContent,
    })
      .then((res) => {
        if (res?.code > 0) {
          message.success('回复成功');
          setShowModal(false);
          setResponseItem({});
          setReplyContent('');
          refresh();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleComment = () => {
    // 这里可以处理提交逻辑，比如调用接口
    commentForm.validateFields().then((values) => {
      commentAnswer({
        answerId: currentAnswerId.current,
        score: values.score,
        commentContent: values.commentContent,
      }).then((res) => {
        if (res?.code > 0) {
          message.success('评价成功');
          setShowCommentModal(false);
          currentAnswerId.current = null;
          commentForm.resetFields();
          refresh();
        }
      });
    });
  };
  const handleEdit = () => {
    editForm.validateFields().then((values) => {
      updateQuestion({
        questionId: editId.current,
        ...values,
      }).then((res) => {
        if (res?.code > 0) {
          message.success('修改成功');
          setShowEditModal(false);
          editForm.resetFields();
          editId.current = null;
          refresh();
        }
      });
    });
  };
  const handleDeleteQuestion = (questionId) => {
    removeQuestion({ questionIdList: [questionId] }).then((res) => {
      if (res?.code > 0) {
        message.success('删除成功');
        refresh();
      }
    });
  };
  return (
    <div
      style={{
        maxHeight: normalHeight ? 'calc(100% - 30px)' : 'calc(100vh - 270px)',
        overflow: 'auto',
      }}
    >
      {mockQuestionList.map((item) => (
        <div className={styles.description} key={item.questionId}>
          <CustomCard
            style={{
              border: '1px solid var(--border-color-base)',
            }}
            bodyStyle={{
              padding: 12,
            }}
          >
            <div className={styles.flexContent}>
              <div className="important-title">{item.questionContent}</div>
              <div>
                {(item.tag || '').split(',').map((e) => (
                  <Tag color={getColor(e)}>{e}</Tag>
                ))}
              </div>
            </div>
            <div className={styles.question_direction}>
              <div className={styles.direction}>
                方向：{item.answerDirection || '-'}
              </div>
              <div>
                <span
                  className={styles.text}
                >{`${item.questionUser} ${item.questionTime}`}</span>
              </div>
            </div>
            <div>
              {(item.answerList || []).map((e) => (
                <div className={styles.responseItem} key={e.answerId}>
                  <div className={styles.question_direction}>
                    <Tooltip mouseEnterDelay={0.3} title="点击展开/收起">
                      <div
                        onClick={() => {
                          setShowFullContent((prev) => ({
                            ...prev,
                            [e.answerId]: !prev[e.answerId],
                          }));
                        }}
                        className={styles.preContent}
                      >{`答：${e.simpleAnswerContent}`}</div>
                    </Tooltip>
                    <div
                      className={styles.text}
                    >{`${e.answerUser} ${e.answerTime}`}</div>
                  </div>
                  {(showFullContent[e.answerId] || defaultShow) && (
                    <div style={{ width: '100%', overflow: 'auto' }}>
                      <div
                        dangerouslySetInnerHTML={{ __html: e.answerContent }}
                        className={styles.fullContent}
                      ></div>
                      <Button
                        type="link"
                        style={{ marginLeft: -8 }}
                        onClick={() => {
                          setShowFullContent((prev) => ({
                            ...prev,
                            [e.answerId]: !prev[e.answerId],
                          }));
                        }}
                      >
                        收起该回复
                      </Button>
                    </div>
                  )}
                  {e.commentList?.length > 0 && (
                    <>
                      <div
                        style={{
                          margin: '8px 0',
                          height: 1,
                          borderBottom: '1px solid var(--border-color-base)',
                        }}
                      />
                      {e.commentList.map((commentItem) => (
                        <div key={commentItem.commentId}>
                          <>
                            <div className={styles.flexContent}>
                              <Rate
                                disabled
                                style={{ fontSize: 14 }}
                                allowHalf
                                defaultValue={commentItem.score}
                              />
                              <div
                                className={styles.text}
                              >{`${commentItem.commentUser} ${commentItem.commentTime}`}</div>
                            </div>
                            <div className={styles.comment}>
                              <Tooltip
                                mouseEnterDelay={0.3}
                                title="点击展开/收起"
                              >
                                <span
                                  onClick={() => {
                                    setShowFullRate((prev) => ({
                                      ...prev,
                                      [commentItem.commentId]: !prev[
                                        commentItem.commentId
                                      ],
                                    }));
                                  }}
                                >
                                  评价：{commentItem.simpleCommentContent}
                                </span>
                              </Tooltip>
                            </div>
                            {(showFullRate[commentItem.commentId] ||
                              defaultShow) && (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: commentItem.commentContent,
                                }}
                                className={styles.fullContent}
                              ></div>
                            )}
                          </>
                        </div>
                      ))}
                    </>
                  )}
                  <div
                    style={{
                      margin: '8px 0',
                      height: 1,
                      borderBottom: '1px solid var(--border-color-base)',
                    }}
                  />
                  <Button
                    style={{ marginLeft: -8 }}
                    type="link"
                    onClick={() => {
                      setShowCommentModal(true);
                      currentAnswerId.current = e.answerId;
                    }}
                  >
                    去评价
                  </Button>
                </div>
              ))}
            </div>
            <Button
              style={{ marginLeft: -8 }}
              type="link"
              onClick={() => {
                setResponseItem(item);
                setShowModal(true);
              }}
            >
              回复
            </Button>
            {!(item.answerList?.length > 0) && showEdit && (
              <Button
                type="link"
                onClick={() => {
                  setShowEditModal(true);
                  editId.current = item.questionId;
                  editForm.setFieldsValue({
                    questionContent: item.questionContent,
                    answerDirection: item.answerDirection,
                    tag: item.tag,
                  });
                }}
              >
                修改
              </Button>
            )}
            <Popconfirm
              title="确定要删除吗？"
              onConfirm={() => handleDeleteQuestion(item.questionId)}
            >
              <Button danger type="link">
                删除
              </Button>
            </Popconfirm>
          </CustomCard>
        </div>
      ))}
      <CustomModal
        title="回复"
        width={'50vw'}
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={
          <>
            <Button key="close" onClick={() => setShowModal(false)}>
              关闭
            </Button>
            <Button
              loading={loading}
              key="submit"
              type="primary"
              onClick={handleReply}
            >
              回复
            </Button>
          </>
        }
      >
        <div>
          <div className={styles.flexContent}>
            <div
              style={{
                fontSize: 16,
                color: 'var(--text-color)',
              }}
              className="important-title"
            >
              {responseItem.questionContent}
            </div>
            <div>
              {(responseItem.tag || '').split(',').map((e) => (
                <Tag color={getColor(e)}>{e}</Tag>
              ))}
            </div>
          </div>
          <div className={styles.question_direction}>
            <div className={styles.direction}>
              方向：{responseItem.answerDirection || '-'}
            </div>
            <div>
              <span
                className={styles.text}
              >{`${responseItem.questionUser} ${responseItem.questionTime}`}</span>
            </div>
          </div>
          <div className={styles.editor} style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 8 }}>回复内容：</div>
            <ReactQuill
              theme="snow"
              value={replyContent}
              onChange={setReplyContent}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }], // 標題
                  ['bold', 'italic', 'underline', 'strike'], // 基本樣式
                  [{ list: 'ordered' }, { list: 'bullet' }], // 列表
                  [{ indent: '-1' }, { indent: '+1' }], // 縮排
                  // 以下是您需要的功能
                  [{ color: [] }, { background: [] }], // 文字顏色、背景顏色
                  [{ align: [] }], // 對齊方式
                  ['link'], // 連結、圖片 'image'
                  ['clean'], // 清除格式
                ],
              }} // 將自訂的 modules 傳入
              style={{ height: '300px', marginBottom: '4rem' }}
            />
          </div>
        </div>
      </CustomModal>
      <CustomModal
        title="评价"
        width={'50vw'}
        visible={showCommentModal}
        onCancel={() => {
          setShowCommentModal(false);
          currentAnswerId.current = null;
          commentForm.resetFields();
        }}
        onOk={handleComment}
      >
        <CustomForm
          form={commentForm}
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 22 }}
          config={[
            {
              name: 'score',
              label: '评分',
              span: 24,
              options: {
                rules: [{ required: true, message: '请评分' }],
              },
              custom: <Rate style={{ fontSize: 14 }} allowHalf />,
            },
            {
              name: 'commentContent',
              label: '评价内容',
              span: 24,
              type: 'textArea',
              options: {
                rules: [{ required: true, message: '请输入评价内容' }],
              },
              props: {
                rows: 5,
              },
            },
          ]}
        />
      </CustomModal>
      <CustomModal
        title="修改"
        width={'50vw'}
        visible={showEditModal}
        onOk={handleEdit}
        onCancel={() => {
          setShowEditModal(false);
          editForm.resetFields();
          editId.current = null;
        }}
      >
        <CustomForm
          form={editForm}
          labelCol={{
            flex: '60px',
          }}
          config={[
            {
              type: 'textArea',
              name: 'questionContent',
              label: '问题',
              span: 24,
              options: {
                rules: [{ required: true, message: '请输入问题' }],
              },
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
              options: {
                rules: [{ required: true, message: '请选择分类' }],
              },
              props: {
                options: tagList,
              },
            },
          ]}
        />
      </CustomModal>
    </div>
  );
};

export default QuestionList;
