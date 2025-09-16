import IncomeAnalysis from '../../IncomeAnalysisVirtual';
import styles from '../index.less';

const RightContent = ({ height }) => {
  // useEffect(() => {
  //   if (detailInfo && mockData[detailInfo?.key]) {
  //     form.setFieldsValue({
  //       fund: mockData[detailInfo.key].leftType,
  //       dimension: mockData[detailInfo.key].rightType,
  //     });
  //     setLeftCheckedKeys(mockData[detailInfo.key].leftCheckedKeys);
  //     setRightCheckedKeys(mockData[detailInfo.key].rightCheckedKeys);
  //   }
  // }, [detailInfo]);
  return (
    <div style={{ height }} className={styles.configs_right_content}>
      <IncomeAnalysis />
    </div>
  );
};

export default RightContent;
