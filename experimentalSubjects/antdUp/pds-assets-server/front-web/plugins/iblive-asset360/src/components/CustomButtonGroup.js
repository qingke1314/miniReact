/*
 * @Author: wenyiqian
 * @Date: 2025-01-08 11:48:45
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2025-02-18 18:03:24
 * @Description: desc
 */
/*
  全局统一的按钮组（删除、关闭、保存），带有按钮loading
*/
import { Button, Popconfirm, Space } from 'antd-v5';
import PropTypes from 'prop-types';
import { useState } from 'react';

const CustomButtonGroup = ({
  onConfirm,
  onCancel,
  onDelete,
  showDelete = false,
  deleteText = '确认删除',
  confirmLabel = '保存',
  cancelLabel = '关闭',
  confirmConfig = {},
  cancelConfig = {},
}) => {
  const [saving, setSaving] = useState(false);
  const [deleting, setDelting] = useState(false);
  const handleConfirm = async () => {
    await onConfirm(setSaving);
  };
  const handleDelete = async () => {
    await onDelete(setDelting);
  };
  return (
    <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
      {showDelete && (
        <Popconfirm
          title={deleteText}
          okText="确认"
          cancelText="取消"
          onConfirm={handleDelete}
          {...cancelConfig}
        >
          <Button type="primary" danger loading={deleting} disabled={saving}>
            删除
          </Button>
        </Popconfirm>
      )}
      <Button onClick={onCancel} disabled={saving || deleting}>
        {cancelLabel}
      </Button>
      <Button
        onClick={handleConfirm}
        type="primary"
        loading={saving}
        disabled={deleting}
        {...confirmConfig}
      >
        {confirmLabel}
      </Button>
    </Space>
  );
};

CustomButtonGroup.propTypes = {
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  showDelete: PropTypes.bool,
  deleteText: PropTypes.string,
  confirmLabel: PropTypes.string,
};

export default CustomButtonGroup;
