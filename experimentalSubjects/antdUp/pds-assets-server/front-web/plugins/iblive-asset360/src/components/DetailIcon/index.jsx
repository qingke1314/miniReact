import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { infoMap } from './const';

const DetailIcon = ({ type = 'total', marginLeft = 4, marginRight = 0 }) => {
  return (
    <div
      style={{
        marginLeft,
        marginRight,
        cursor: 'pointer',
        display: 'inline-block',
      }}
    >
      <Tooltip
        color="var(--background-color)"
        title={
          <div style={{ color: 'var(--text-color)' }}>
            {(infoMap[type] || []).map((item) => (
              <div key={item.label}>
                <span style={{ color: 'var(--primary-color)' }}>
                  {item.label}：
                </span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        }
      >
        <QuestionCircleOutlined
          style={{
            color: 'var(--primary-color)',
          }}
        />
      </Tooltip>
    </div>
  );
};

export default DetailIcon;
