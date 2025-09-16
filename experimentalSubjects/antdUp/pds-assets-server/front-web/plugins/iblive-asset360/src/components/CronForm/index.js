import { Button, Col, Modal, Row, Tabs } from 'antd';
import { useState } from 'react';
import { cormToForm } from './utils/handleFastSettingChange';
import FastSettingPane from './views/FastSettingPane';
import ItemByItemSettingPane from './views/ItemByItemSettingPane';
import PropTypes from 'prop-types';

const { TabPane } = Tabs;
const CronForm = ({ onOk, value, title = '生成Cron' }) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [cron, setCron] = useState('* * * * * ?');
  const [defaultValue, setDefaultValue] = useState({});
  // 回显内容
  const EchoFun = () => {
    if (value !== cron) {
      let newCron = value ?? '* * * * * ?';
      setCron(newCron);
      if (!value || cormToForm(newCron)) {
        setActiveTab('1');
        setDefaultValue({ tab1: newCron });
      } else {
        setActiveTab('2');
        setDefaultValue({ tab2: newCron });
      }
    }
  };
  const onTabChange = (tab) => {
    setActiveTab(tab);
    setCron('* * * * * ?');
    setDefaultValue({ [`tab${tab}`]: '* * * * * ?' });
  };
  const toggle = () =>
    setOpen((pre) => {
      if (!pre) {
        // 打开弹窗
        EchoFun();
      }
      return !pre;
    });
  const onConfirm = () => onOk && onOk(cron, toggle);

  return (
    <>
      <Button onClick={toggle} type="primary">
        {title}
      </Button>
      <Modal
        visible={open}
        width={800}
        footer={
          <Row justify="end" align="middle" gutter={8}>
            <Col>
              <label>{cron}</label>
            </Col>
            <Col>
              <Button type="primary" onClick={onConfirm}>
                生成
              </Button>
            </Col>
          </Row>
        }
        onCancel={toggle}
        maskClosable={false}
      >
        <Tabs activeKey={activeTab} onChange={onTabChange}>
          <TabPane tab="快捷选择" key="1">
            <FastSettingPane setCron={setCron} defaultValue={defaultValue} />
          </TabPane>
          <TabPane tab="详细选择" key="2">
            <ItemByItemSettingPane
              setPropsCron={setCron}
              activeTab={activeTab}
              defaultValue={defaultValue}
            />
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
};

CronForm.propTypes = {
  onOk: PropTypes.func,
  value: PropTypes.string,
  title: PropTypes.string,
};

export default CronForm;
