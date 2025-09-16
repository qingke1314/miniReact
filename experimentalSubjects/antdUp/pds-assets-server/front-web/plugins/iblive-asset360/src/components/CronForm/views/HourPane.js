import CommonPaneItems from '../components/CommonPaneItems';
import { hourAry } from '../const';

export default ({ onChange, activeKey, defaultCron }) => {
  const onHourChange = (hour) => onChange('hour', hour);

  return (
    <CommonPaneItems
      activeKey={activeKey}
      defaultCron={defaultCron}
      unit="小时"
      min={0}
      max={23}
      options={hourAry}
      onChange={onHourChange}
      multipleSelectLabel="具体时数（可多选）"
    />
  );
};
