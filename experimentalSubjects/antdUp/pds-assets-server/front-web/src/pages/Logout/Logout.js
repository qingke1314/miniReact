/*
 * @Author: wenyiqian
 * @Date: 2025-01-08 15:41:59
 * @LastEditors: wenyiqian
 * @LastEditTime: 2025-01-21 16:21:32
 * @Description: desc
 */
import { message, Spin } from 'antd';
import { clearUserInfo, getUserInfo } from 'iblive-base';
import useMount from 'react-use/esm/useMount';
import { history } from 'umi';
import { loginOut } from '../../apis/user';

// const { clearUserInfo, getUserInfo } = requestUtils;

function Logout() {
  useMount(async () => {
    try {
      const userAcc = getUserInfo()?.userAcc;
      await loginOut(userAcc);
    } catch (error) {
      message.error(error.message);
    }
    clearUserInfo();
    history.push('/login');
  });

  return <Spin spinning />;
}

export default Logout;
