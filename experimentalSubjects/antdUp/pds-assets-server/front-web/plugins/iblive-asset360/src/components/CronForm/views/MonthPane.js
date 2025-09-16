import CommonPaneItems from '../components/CommonPaneItems';
import { monthAry } from '../const';

export default ({ onChange, activeKey, defaultCron }) => {
  const onMonthChange = (month) => onChange('month', month);

  return (
    <CommonPaneItems
      activeKey={activeKey}
      defaultCron={defaultCron}
      unit="月"
      min={1}
      max={12}
      options={monthAry}
      onChange={onMonthChange}
      multipleSelectLabel="具体月份（可多选）"
    />
  );
};
