import {
  Cascader,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Switch,
  TimePicker,
  TreeSelect,
} from 'antd';
import { Fragment, memo } from 'react';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

/**
 * 通用表单项组件
 */
function EditForm({
  form,
  config = [],
  colon = true,
  sort,
  rowGutter,
  ...formProps
}) {
  const createItem = (type, props = {}, render = null) => {
    let El;
    let defaultProps = {};
    switch (type) {
      case 'input':
        El = Input;
        break;
      case 'textArea':
        El = TextArea;
        defaultProps = { autoSize: { minRows: 3, maxRows: 50 } };
        break;
      case 'number':
        El = InputNumber;
        break;
      case 'radio':
        El = RadioGroup;
        break;
      case 'checkbox':
        El = CheckboxGroup;
        break;
      case 'select':
        El = Select;
        break;
      case 'searchSelect':
        El = Select.AutoComplete;
        break;
      case 'date':
        El = DatePicker;
        break;
      case 'dateRange':
        El = DatePicker.RangePicker;
        break;
      case 'time':
        El = TimePicker;
        break;
      case 'switch':
        El = Switch;
        break;
      case 'tree':
        El = Cascader;
        break;
      case 'treeSelect':
        El = TreeSelect;
        break;
      case 'render':
        return render;
      default:
        break;
    }
    if (El) {
      return <El {...defaultProps} {...props} />;
    }
  };
  const sortConfig = sort ? config.sort(sort) : config;
  return (
    <Form form={form} colon={colon} {...formProps}>
      <Row gutter={rowGutter}>
        {sortConfig.map(
          (
            {
              type,
              label,
              name,
              render,
              options,
              props,
              custom,
              tips,
              visible = true,
              extra,
              affix,
              itemProps,
              span,
              affixSpan,
              style = {},
              showStilly,
            },
            index,
          ) => {
            if (!visible && !showStilly) return null;
            if (!visible && showStilly)
              return <Col key={name || index} span={span || 24}></Col>;
            const _custom = typeof custom == 'function' ? custom() : custom;
            const _extra = typeof extra == 'function' ? extra() : extra;
            const _affix = typeof affix == 'function' ? affix() : affix;
            return (
              <Fragment key={name || index}>
                <Col span={span}>
                  <FormItem
                    label={
                      label ? (
                        <>
                          {label}
                          {tips && (
                            <span style={{ margin: '0 10px', float: 'right' }}>
                              {tips}
                            </span>
                          )}
                        </>
                      ) : null
                    }
                    required={options?.rules?.some((rule) => rule.required)}
                    style={{ position: 'relative', ...style }}
                    extra={_extra}
                    name={name}
                    {...options}
                    {...itemProps}
                  >
                    {_custom || createItem(type, props, render)}
                  </FormItem>
                </Col>
                <Col span={affixSpan || 0}>{_affix}</Col>
              </Fragment>
            );
          },
        )}
      </Row>
    </Form>
  );
}

export default memo(EditForm);
