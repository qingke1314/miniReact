import styles from '../index.less';

export default ({ children, className, ...config }) => {
  return (
    <p className={`${styles.table_title} ${className}`} {...config}>
      {children}
    </p>
  );
};
