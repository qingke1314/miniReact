import { CustomForm } from 'iblive-base';
import { useEffect } from 'react';
import { Form } from 'antd';

const CustomHead = ({ assetData = [], onChangeFirst }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      astUnitId: '',
    });
  }, [assetData]);
  return (
    <div>
      <CustomForm
        initialValues={{
          astUnitId: '',
        }}
        config={[
          {
            type: 'radio',
            name: 'astUnitId',
            props: {
              options: [
                {
                  label: '全部',
                  value: '',
                },
              ].concat(
                assetData.map((e) => ({
                  label: e.astUnitName,
                  value: e.astUnitId,
                })),
              ),
              optionType: 'button',
              buttonStyle: 'solid',
              onChange: (v) => {
                onChangeFirst(v.target.value);
              },
            },
          },
        ]}
      />
    </div>
  );
};
export default CustomHead;
