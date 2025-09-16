/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2023-12-19 13:55:12
 * @LastEditTime: 2024-10-21 09:43:20
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 */

import InfoEarlyWarningIcon from '@asset360/assets/base/infoEarlyWarningIcon.png';
import { Carousel } from 'antd';
import { getRealPath } from 'iblive-base';
import { history } from 'umi';
import styles from './components.less';

export default function Info({ dataSource }) {
  const handleRouteJump = () => {
    history.push(
      getRealPath('/APP/realTimePosition/positionOperation/positionEvents'),
    );
  };

  return (
    <div className={styles.info_early_warning_container}>
      <img src={InfoEarlyWarningIcon} />
      <Carousel autoplay={true} dots={false}>
        {dataSource.map((item, index) => (
          <div key={index}>
            <span onClick={handleRouteJump} className={styles.warning_content}>
              {item.content}
            </span>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
