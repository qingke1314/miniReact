import { Progress } from 'antd';

const Person = ({ allPerson, data = [] }) => {
  const colorList = [
    '#1890FF',
    '#FF4D4F',
    '#FF7A00',
    '#FFC100',
    '#FF9900',
    '#FF6600',
    '#FF3300',
    '#FF0000',
  ];
  return (
    <div>
      <div style={{ marginTop: -8 }} className="important-title">
        基金管理人
      </div>
      <div style={{ marginTop: 16 }}>
        {(data || []).map((e, i) => {
          return (
            <div style={{ marginBottom: 12 }} key={e.name}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div>{e.name}</div>
                <div>
                  {e.num}
                  {e.name === '平均每人管理产品数' ? '只' : '人'}
                </div>
              </div>
              {i !== data.length - 1 && (
                <Progress
                  strokeWidth={18}
                  strokeColor={colorList[i]}
                  percent={(e.num / allPerson) * 100}
                  showInfo={false}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Person;
