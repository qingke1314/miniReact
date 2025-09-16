import { Tabs } from 'antd-v5';
import styles from './OverviewTable/index.less';

export default ({ children, className, ...config }) => {
  return (
    <Tabs className={`${styles.overview_tabs} ${className}`} {...config}>
      {children}
    </Tabs>
  );
};
