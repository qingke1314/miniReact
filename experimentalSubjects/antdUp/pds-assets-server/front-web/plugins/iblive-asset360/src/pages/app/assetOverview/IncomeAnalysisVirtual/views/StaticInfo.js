import { moneyFormat } from 'iblive-base';
import styles from './index.module.less';

const StaticInfo = ({ activeIndex, onChange, staticInfo }) => {
  return (
    <div className={styles.staticInfo}>
      <div
        onClick={onChange}
        className={`${styles.statistical_information} ${
          activeIndex ? styles.active : ''
        }`}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            marginTop: 8,
            fontSize: 13,
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 'bold',
            }}
          >
            区间总盈亏：
            {moneyFormat({
              num: staticInfo?.income,
              needColor: true,
            })}
          </div>
          {/* <div style={{ display: 'flex', gap: 12 }}>
            <div>
              当日盈亏：
              {moneyFormat({
                num: staticInfo?.todayIncome,
                needColor: true,
              })}
            </div>
            <div>
              超额收益：
              {moneyFormat({
                num: staticInfo?.excessIncomeRate?.toFixed(2),
                unit: '%',
                needColor: true,
              })}
            </div>
          </div> */}
          {/* <div>
            万分收益：
            {moneyFormat({
              num: yearRadio * 100,
              unit: '%',
              needColor: true,
              sign: yearRadio > 0 ? '+' : '',
            })}
          </div>
          <div>七日年化收益率：5.05%</div>
          <div> 净资产： 500万</div> */}
        </div>
      </div>
    </div>
  );
};

export default StaticInfo;
