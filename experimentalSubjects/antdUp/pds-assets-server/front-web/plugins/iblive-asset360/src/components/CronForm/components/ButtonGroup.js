import { Button, Space } from 'antd-v5';

export default ({
  cron,
  onOk,
  onCancel,
  okText = '生成',
  cancleText = '取消',
}) => {
  return (
    <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
      <label>{cron}</label>
      <Button onClick={onOk} type="primary">
        {okText}
      </Button>
      <Button onClick={onCancel}>{cancleText}</Button>
    </Space>
  );
};
