/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2022-10-17 16:13:47
 * @LastEditors: wenyiqian
 * @LastEditTime: 2025-01-09 10:29:25
 * @Description:
 */
import {
  CloseOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import { Modal } from 'antd';
import { useState } from 'react';
import styles from './index.less';

const CustomTitle = ({
  title,
  needChangeSize,
  isFullScreen,
  toggleFullScreen,
  closable,
  onCancel,
}) => {
  return (
    <>
      <span>{title}</span>

      {needChangeSize && (
        <>
          {isFullScreen ? (
            <FullscreenExitOutlined
              className={styles.full_screen_icon}
              onClick={toggleFullScreen}
            />
          ) : (
            <FullscreenOutlined
              className={styles.full_screen_icon}
              onClick={toggleFullScreen}
            />
          )}
        </>
      )}

      {closable && (
        <CloseOutlined className={styles.close_icon} onClick={onCancel} />
      )}
    </>
  );
};

// 固定大小宽度(未全皮时)
const CustomModal = ({
  children,
  size,
  needChangeSize = false,
  title,
  onCancel,
  className,
  bodyStyle = {},
  ...config
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const defaultWidth = size === 'big' ? '65vw' : '500px';
  return (
    <Modal
      title={
        <CustomTitle
          title={title}
          needChangeSize={needChangeSize}
          isFullScreen={isFullScreen}
          onCancel={() => onCancel && onCancel()}
          toggleFullScreen={() => setIsFullScreen((pre) => !pre)}
          closable={config?.closable ?? true}
        />
      }
      onCancel={onCancel}
      className={`${styles.custom_modal} ${
        isFullScreen ? styles.full_screen_modal : ''
      } ${className}`}
      width={defaultWidth}
      bodyStyle={{
        maxHeight: '60vh',
        overflow: 'auto',
        padding: 16,
        ...bodyStyle,
      }}
      closable={false}
      closeIcon={null}
      maskClosable={false}
      keyboard={false}
      {...config}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
