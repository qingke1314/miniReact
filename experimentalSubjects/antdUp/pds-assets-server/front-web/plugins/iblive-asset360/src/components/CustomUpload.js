/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2023-12-07 11:38:33
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-06-21 14:32:30
 * @Description: 补充了统一错误提示的上传组件，依赖antd的Upload
 */
import { getUserInfo, randomWord } from 'iblive-base';
import { SyncOutlined } from '@ant-design/icons';
import { notification, Upload } from 'antd-v5';
import axios from 'axios';
import { useRef } from 'react';

const customRequest = async (options) => {
  if (!options.action) {
    options.onError();
    return;
  }
  const prefix = INTERFACE_PREFIX ?? '';
  const headers = {
    ...(options.headers || {}),
    ficpToken: getUserInfo()?.userToken,
  };
  const formData = new FormData();
  formData.append(options.filename, options.file);
  Object.keys(options.data || {}).forEach((key) => {
    formData.append(key, options.data[key]);
  });
  try {
    const res = await axios({
      url: `${prefix}${options.action}`,
      headers,
      data: formData,
      method: options.method || 'POST',
      onUploadProgress: (evt) => {
        const percent = Math.floor((evt.loaded / evt.total) * 100);
        options.onProgress({
          percent,
        });
      },
    });
    options.onSuccess(res);
  } catch (err) {
    options.onError(err?.response?.data);
  }
};

export default ({
  beforeUpload,
  successCallback,
  errorCallback,
  children,
  ...config
}) => {
  const keyRef = useRef();
  return (
    <Upload
      beforeUpload={(file, fileList) => {
        keyRef.current = randomWord();
        if (beforeUpload) {
          return beforeUpload(file, fileList, keyRef.current);
        } else {
          notification.open({
            description: '即将开始导入，请稍候',
            key: keyRef.current,
            duration: 0,
            icon: <SyncOutlined spin className="primary" />,
          });
        }
      }}
      customRequest={customRequest}
      onChange={(info) => {
        if (info.file.status === 'uploading') {
          notification.info({
            description: `文件导入中，请耐心等待`,
            key: keyRef.current,
            icon: <SyncOutlined spin className="primary" />,
            duration: 0,
          });
        } else if (
          info.file.status === 'done' &&
          info.file.response?.data?.code === 1
        ) {
          notification.success({
            description: '导入成功',
            key: keyRef.current,
            duration: 0,
          });
          successCallback && successCallback();
        } else if (
          info.file.status === 'done' ||
          info.file.status === 'error'
        ) {
          const note = info.file.error?.note || info.file.response.data?.note;
          notification.error({
            description: note ? `导入失败：${note}` : '导入失败',
            key: keyRef.current,
            duration: 0,
          });
          errorCallback && errorCallback();
        }
      }}
      {...config}
    >
      {children}
    </Upload>
  );
};
