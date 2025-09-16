/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2023-06-09 11:13:28
 * @LastEditTime: 2023-06-15 14:52:26
 * @LastEditors: chenzongjun chenzongjun@apexsoft.com.cn
 */
/*
  带有篮色标志的标题
*/
import PropTypes from 'prop-types';
import styles from './index.less';

const ApexTitle = ({ title, className, style }) => {
  return (
    <p
      className={`${styles.apex_title} ${className}`}
      style={{ marginLeft: -8, ...style }}
    >
      {title}
    </p>
  );
};

ApexTitle.propTypes = {
  title: PropTypes.string.isRequired,
};
export default ApexTitle;
