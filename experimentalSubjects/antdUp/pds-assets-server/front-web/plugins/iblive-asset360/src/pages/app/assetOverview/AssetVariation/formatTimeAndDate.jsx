/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2023-05-11 10:34:21
 * @LastEditTime: 2023-05-11 10:40:30
 * @LastEditors: chenzongjun chenzongjun@apexsoft.com.cn
 */

export const formatTime = (time) => {
  if (time) {
    const timeStr = time.toString();
    return (
      timeStr.substring(0, 2) +
      ':' +
      timeStr.substring(2, 4) +
      ':' +
      timeStr.substring(4, 6)
    );
  }
};

export const formatDate = (date) => {
  if (date) {
    const dateStr = date.toString();
    return (
      dateStr.substring(0, 4) +
      '-' +
      dateStr.substring(4, 6) +
      '-' +
      dateStr.substring(6, 8)
    );
  }
};
