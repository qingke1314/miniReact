/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-01-02 09:01:11
 * @LastEditTime: 2024-01-05 10:16:37
 * @LastEditors: chenzongjun chenzongjun@apexsoft.com.cn
 */
import { Popconfirm, Space } from 'antd';

export default ({
  deleteFunc,
  editFunc,
  detailFunc,
  customButton,
  showEdit = false,
  showDetail = false,
  showDelete = false,
  deleteDisabled = false,
  detailDisabled = false,
  editDisabled = false,
  title = '是否删除该项',
}) => {
  return (
    <Space>
      {showEdit && (
        <a onClick={editDisabled ? null : editFunc} disabled={editDisabled}>
          编辑
        </a>
      )}

      {showDetail && (
        <a
          onClick={detailDisabled ? null : detailFunc}
          disabled={detailDisabled}
        >
          详情
        </a>
      )}
      {showDelete && (
        <Popconfirm
          placement="top"
          title={title}
          okText="是"
          cancelText="否"
          onConfirm={deleteDisabled ? null : deleteFunc}
          disabled={deleteDisabled}
        >
          <a
            style={{ color: deleteDisabled ? '' : '#D04040' }}
            disabled={deleteDisabled}
          >
            删除
          </a>
        </Popconfirm>
      )}
      {customButton}
    </Space>
  );
};
