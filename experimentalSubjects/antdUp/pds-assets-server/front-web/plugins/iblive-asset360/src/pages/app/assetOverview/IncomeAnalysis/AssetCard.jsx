import { useEffect, useState } from 'react';
import CustomCard from '../../../../components/CustomCard';
import { formatNumberWithUnit } from './const';
import styles from './index.module.less';

const AssetCard = ({
  onChangeFirst = () => {},
  onChangeSecond = () => {},
  assetData,
  activeIndex,
  isChooseProduct,
}) => {
  const [activeAsset, setActiveAsset] = useState('');
  useEffect(() => {
    if (activeIndex !== assetData.astUnitId) {
      setActiveAsset('');
    }
  }, [activeIndex]);
  return (
    <CustomCard
      className={`${styles.leftItem} ${
        assetData.astUnitId === activeIndex && !activeAsset ? styles.active : ''
      } ${isChooseProduct ? styles.productActive : ''}`}
      onClick={(event) => {
        event.stopPropagation();
        setActiveAsset('');
        onChangeFirst(assetData.astUnitId, activeIndex === assetData.astUnitId);
      }}
    >
      <div className={styles.assetInfo}>
        <div className={'important-title'}>{assetData.astUnitName}</div>
        <div>
          总盈亏：
          {formatNumberWithUnit(assetData?.income)}
        </div>
      </div>
      <div className={styles.combiListContainer}>
        {/* <div className={styles.combiList}>组合列表：</div> */}
        <div>
          {(assetData?.combiList || []).map((item) => {
            return (
              <div
                onClick={(event) => {
                  event.stopPropagation();
                  // setActiveAsset(
                  //   activeAsset === item.combiCode ? '' : item.combiCode,
                  // );
                  onChangeSecond(
                    assetData.astUnitId,
                    activeAsset === item.combiCode ? '' : item.combiCode,
                  );
                }}
                className={`${styles.secondItem} ${
                  activeAsset === item.combiCode ? styles.secondActive : ''
                }`}
                key={item.combiCode}
              >
                <div className={styles.combiName}>
                  {item.combiName || '默认组合'}
                </div>
                <div>
                  <span
                    style={{
                      width: 80,
                      display: 'inline-block',
                    }}
                  >
                    {formatNumberWithUnit(item.income)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CustomCard>
  );
};

export default AssetCard;
