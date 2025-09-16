import React from 'react';
import styles from './index.less';

const PerformanceAnalysis = () => {
  return (
    <div className={styles.iframe_container}>
      <iframe
        src={
          'http://192.168.195.235:1081/webapp/bar/main/attribution/list?menuItemKey=ATTRIBUTION'
        }
        width="100%"
        height="100%"
        allowFullScreen
      />
    </div>
  );
};

export default PerformanceAnalysis;
