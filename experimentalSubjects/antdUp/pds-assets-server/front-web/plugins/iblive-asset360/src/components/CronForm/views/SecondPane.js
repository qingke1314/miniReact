import CommonPaneItems from '../components/CommonPaneItems';
import { timeAry } from '../const';

export default ({ onChange, activeKey, defaultCron }) => {
  const onSecondChange = (second) => onChange('second', second);

  return (
    <CommonPaneItems
      activeKey={activeKey}
      defaultCron={defaultCron}
      unit="秒"
      min={0}
      max={59}
      options={timeAry}
      onChange={onSecondChange}
      multipleSelectLabel="具体秒数（可多选）"
    />
  );
};
