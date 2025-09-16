import styles from './index.less';

export default ({ imgSrc = '' }) => (
  <img src={imgSrc} className={styles.position_img} />
);
