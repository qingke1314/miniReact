/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2023-10-18 16:24:06
 * @LastEditTime: 2025-02-14 09:46:11
 * @LastEditors: guoxuan
 */

import CustomModal from '@asset360/components/CustomModal';
import { Descriptions, Tag } from 'antd-v5';
import moment from 'moment';

const DetailModal = ({ visible, onCancel, info = {}, columns, array }) => {
  return (
    <CustomModal
      title="详情"
      bodyStyle={{ maxHeight: '75vh' }}
      footer={null}
      visible={visible}
      onCancel={onCancel}
      maskClosable={false}
      width={'90vw'}
    >
      <Descriptions size="small" bordered>
        {columns.map((item) => {
          if (item.title !== '操作') {
            let value = '';
            if (item.title === '触警时间') {
              value = moment(info[item.dataIndex]).format(
                'YYYY-MM-DD HH:mm:ss',
              );
            } else if (item.title === '触警操作') {
              const object = array.find(
                (array) => array.code === info[item.dataIndex],
              );
              value = <Tag color={object?.color}>{object?.label}</Tag>;
            } else {
              value = info[item.dataIndex];
            }
            return (
              <Descriptions.Item label={item.title} key={item.dataIndex}>
                {value}
              </Descriptions.Item>
            );
          }
        })}
      </Descriptions>
    </CustomModal>
  );
};

export default DetailModal;
