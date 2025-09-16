import { Form, Select, TimePicker } from 'antd';
import { useEffect } from 'react';
import { dateAry, dayAry } from '../const';
import { cormToForm, formToCron } from '../utils/handleFastSettingChange';

const typeAry = ['天', '周', '月'];
export default ({ setCron, defaultValue }) => {
  const [form] = Form.useForm();
  const onValuesChange = (_, values) => {
    setCron(formToCron(values));
  };
  useEffect(() => {
    if (defaultValue.tab1) {
      form.resetFields();
      form.setFieldsValue(cormToForm(defaultValue.tab1) || {});
    }
  }, [defaultValue]);
  return (
    <>
      <Form
        form={form}
        labelCol={{ flex: '7em' }}
        onValuesChange={onValuesChange}
      >
        <Form.Item name="type" label="类型">
          <Select style={{ width: 200 }}>
            {typeAry.map((item, index) => (
              <Select.Option key={item} value={index}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          shouldUpdate={(prevValue, curValue) =>
            prevValue.type !== curValue.type
          }
          noStyle
        >
          {({ getFieldValue }) => {
            const type = getFieldValue('type');
            return type === 0 ? (
              <Form.Item label="时间点" name="timePoint">
                <TimePicker />
              </Form.Item>
            ) : type === 1 ? (
              <>
                <Form.Item label="指定（可多选）" name="dayPoint">
                  <Select mode="multiple" style={{ width: 200 }}>
                    {dayAry.map((item, index) => (
                      <Select.Option key={item} value={index + 1}>
                        星期{item}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="时间点" name="dayTimePoint">
                  <TimePicker />
                </Form.Item>
              </>
            ) : type === 2 ? (
              <>
                <Form.Item label="指定（可多选）" name="datePoint">
                  <Select style={{ width: 200 }} mode="multiple">
                    {dateAry.map((item) => (
                      <Select.Option key={item} value={item}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="时间点" name="dateTimePoint">
                  <TimePicker />
                </Form.Item>
              </>
            ) : null;
          }}
        </Form.Item>
      </Form>
    </>
  );
};
