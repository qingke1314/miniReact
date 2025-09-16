import { Tag } from 'antd';
const Industry = ({
  value,
  onChange,
  industryList = [],
  fieldsMap = {
    code: 'code',
    name: 'name',
  },
}) => {
  return (
    <div>
      {industryList.map((item) => {
        return (
          <Tag
            color={
              value && value?.includes(item[fieldsMap.code]) ? 'processing' : ''
            }
            style={{ marginBottom: 8, cursor: 'pointer' }}
            key={item[fieldsMap.code]}
            onClick={() => {
              if (value && value?.includes(item[fieldsMap.code])) {
                onChange(value.filter((v) => v !== item[fieldsMap.code]));
              } else {
                onChange([...(value || []), item[fieldsMap.code]]);
              }
            }}
          >
            {item[fieldsMap.name]}
          </Tag>
        );
      })}
    </div>
  );
};

export default Industry;
