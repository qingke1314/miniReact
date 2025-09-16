import { Tabs } from 'antd';
import styles from './OverviewTable/index.less';

export default ({ children, className, ...config }) => {
  return (
    <Tabs className={`${styles.overview_tabs} ${className}`} {...config}>
      {children}
    </Tabs>
  );
};
