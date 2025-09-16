import React from 'react';
import { Drawer } from 'antd-v5';
import styles from './index.less';
import globalStyles from '../../layouts/global.less';

const CustomDrawer = ({ children, ...props }) => {
  return (
    <Drawer {...props}>
      <div
        className={`${styles.drawer_body} ${globalStyles.global_layout} ${props?.className}`}
      >
        {children}
      </div>
    </Drawer>
  );
};

export default CustomDrawer;
