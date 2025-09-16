/*
  带有篮色标志的标题
*/
import styles from './index.less';
import PropTypes from 'prop-types';

const CustomTitle = ({ title, className }) => {
  return <p className={`${styles.custom_title} ${className}`}>{title}</p>;
};

CustomTitle.propTypes = {
  title: PropTypes.string.isRequired,
};
export default CustomTitle;
