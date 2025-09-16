import { Col, Row } from 'antd-v5';
import { formatNumberWithUnit } from '../../const';
import styles from './index.less';

const getLabel = (value) => {
  switch (value) {
    case 'GP':
      return '股票';
    case 'ZQ':
      return '债券';
    case 'JJ':
      return '基金';
    case 'HG':
      return '回购';
    case 'QH':
      return '期货';
    case 'QT':
      return '其他';
    case 'CK':
      return '存款';
    default:
      return '';
  }
};
const BigType = ({ assetType, onChange, bigTypeList = [] }) => {
  return (
    <div className={styles.content}>
      <div className="important-title">资产大类</div>
      <Row className={styles.list} gutter={[12, 12]}>
        {bigTypeList.map((e) => {
          return (
            <Col span={8} key={e.assetType}>
              <div
                className={`${styles.item} ${
                  assetType === e.assetType ? styles.active : ''
                }`}
                onClick={() => onChange(e.assetType)}
              >
                <div className={styles.label}>{getLabel(e.assetType)}</div>
                <div>{formatNumberWithUnit(e.income)}</div>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default BigType;
