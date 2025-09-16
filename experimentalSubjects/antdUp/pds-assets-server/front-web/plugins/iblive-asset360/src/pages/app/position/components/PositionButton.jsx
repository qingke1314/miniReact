import { Button } from 'antd-v5';
import styles from './index.less';
export default ({ func, text, ...config }) => {
  return (
    <Button
      type="default"
      size="small"
      className={styles.position_button}
      onClick={func}
      {...config}
    >
      {text}
    </Button>
  );
};
