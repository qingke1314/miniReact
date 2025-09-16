import CommonPaneItems from '../components/CommonPaneItems';
import { timeAry } from '../const';

export default ({ onChange, activeKey, defaultCron }) => {
  const onMinuteChange = (minute) => onChange('minute', minute);

  return (
    <CommonPaneItems
      activeKey={activeKey}
      defaultCron={defaultCron}
      unit="分钟"
      min={0}
      max={59}
      options={timeAry}
      onChange={onMinuteChange}
      multipleSelectLabel="具体分钟（可多选）"
    />
  );
};
