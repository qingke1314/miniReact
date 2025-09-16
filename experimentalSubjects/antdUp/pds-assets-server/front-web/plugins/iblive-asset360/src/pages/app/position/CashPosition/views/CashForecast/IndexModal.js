/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-12 16:28:06
 * @LastEditors: guoxuan guoxuan@apexsoft.com.cn
 * @LastEditTime: 2024-07-26 15:19:06
 * @FilePath: \invest-index-server-front\src\pages\monitor\CashPosition\views\CashForecast\EditModal.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { executeIndex } from '@asset360/apis/position';
import CodeEditor from '@asset360/components/CodeEditor';
import CustomModal from '@asset360/components/CustomModal';
import { Button, Spin } from 'antd';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import styles from '../../index.less';

export default ({
  visible,
  onCancel,
  paramsForList,
  date,
  tableRecord,
  updateTable,
  positionLink,
}) => {
  const [indexModalLoading, setIndexModalLoading] = useState(false);
  const editorRef = useRef(); // 调用结果
  const editorRefLog = useRef(); // 调用日志

  const getIndexInfo = async () => {
    setIndexModalLoading(true);
    const { headObjectCode, objectCode, parentObjectCode } = paramsForList;
    const res = await executeIndex({
      businDate: moment(date).format('yyyyMMDD'),
      fundCode: headObjectCode === 'fund_code' ? objectCode : parentObjectCode,
      astUnitId: headObjectCode === 'ast_unit_code' ? objectCode : undefined,
      positionId: tableRecord?.positionId,
      positionLink,
      indexType: 'POSITION',
    });
    if (res?.code === 1) {
      const result = res?.data?.result
        ? JSON.stringify(
            JSON.parse(JSON.parse(res?.data?.result)?.indexResult),
            null,
            2,
          )
        : null;
      setResult(result);
      setResultLog(res?.data?.failCause);
    } else {
      setResult('');
      setResultLog('');
    }

    setIndexModalLoading(false);
  };

  const setResult = (code) =>
    editorRef.current && editorRef.current.setCode(code);

  const setResultLog = (code) =>
    editorRefLog.current && editorRefLog.current.setCode(code);

  useEffect(() => {
    if (visible && tableRecord?.positionId) {
      getIndexInfo();
    } else {
      setResult('');
      setResultLog('');
    }
  }, [visible, tableRecord]);

  return (
    <CustomModal
      title={'调用指标'}
      visible={visible}
      width={'70vw'}
      afterClose={updateTable}
      onCancel={onCancel}
      footer={<Button onClick={onCancel}>关闭</Button>}
    >
      <p className="m-b-8">运行结果</p>
      <div style={{ flex: '1 1 200px', height: 500, display: 'flex' }}>
        <Spin
          spinning={indexModalLoading}
          wrapperClassName={styles.code_editor_spin}
        >
          <div style={{ width: '50%' }}>
            <CodeEditor language="json" ref={editorRef} readOnly />
          </div>
          <div style={{ width: '50%' }}>
            <CodeEditor language="log" ref={editorRefLog} readOnly />
          </div>
        </Spin>
      </div>
    </CustomModal>
  );
};
