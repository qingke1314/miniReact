/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-09-26 08:51:49
 * @LastEditTime: 2024-10-08 23:17:11
 * @LastEditors: chenzongjun chenzongjun@apexsoft.com.cn
 */
/*
  含有统一标题样式的card
*/
import { Card } from 'antd-v5';
import CustomTitle from './CustomTitle';

const CustomCard = ({
  children,
  title,
  style,
  bodyStyle,
  topicColor = '',
  ...props
}) => {
  return (
    <Card
      size="small"
      title={title && <CustomTitle title={title} />}
      style={{
        boxShadow: '0 0 4px 0 rgba(96, 96, 96, 0.2)',
        borderColor: topicColor,
        background: `${topicColor}12`,
        ...style,
      }}
      bodyStyle={{ padding: 16, ...(bodyStyle || {}) }}
      {...props}
    >
      {children}
    </Card>
  );
};

export default CustomCard;
