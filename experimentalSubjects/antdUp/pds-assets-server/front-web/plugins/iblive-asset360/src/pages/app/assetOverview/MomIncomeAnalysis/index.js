import { Affix, Col, Form, Row } from 'antd-v5';
import { CustomForm } from 'iblive-base';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { invokeAPIIndex } from '../../../../apis/api';
import { setProductCode } from '../../../../store/assetLayoutSlice';
import { getMomentDateRanges, options } from './const.jsx';
import styles from './index.module.less';
import BigTypePieChart from './views/BigTypePieChart';
import SmallMChart from './views/SmallMChart/index.js';
import CustomHead from './views/CustomHead';
import IncomeLine from './views/incomeLine';
import MultiDimensionalBarChart from './views/MultiDimensionalBarChart';
// import StaticInfo from './views/StaticInfo';
import WinInfo from './views/WinInfo';
import IncomeAnalysisChart from './views/incomeAnalysis/index.jsx';
import IncomeFlow from './views/IncomeFlow';
import FeeDetail from './views/FeeDetail';
import FeeDetailTable from './views/FeeDetailTable';
import RightStaticInfo from './views/rightStaticInfo';
import ProductTurnoverRate from './views/IncomeLine/index.js';

const IncomeAnalysis = () => {
  // 25.09.10 小m占比数据，供费用详情计算展示
  const [smallAssetData, setSmallAssetData] = useState([]);
  const contentRef = useRef(null);
  const [headForm] = Form.useForm(); // 头部表单
  const rangeType = Form.useWatch('rangeType', headForm); // 日期范围类型
  const validateDate = Form.useWatch('validateDate', headForm); // 日期类型为自定义时出现的自定义日期
  const { productCode } = useSelector((state) => state.asset360AssetLayout);
  const [assetData, setAssetData] = useState([]); // 左侧-资产数据
  const [leftSelect, setLeftSelect] = useState({}); // 左侧-已选的产品+缺省单元+组合集合
  // const [staticInfo, setStaticInfo] = useState({
  //   income: 0,
  //   todayIncome: 0,
  //   excessIncomeRate: 0,
  // });
  const dispatch = useDispatch();

  /**
   * 根据日期范围类型和约束日期获取当前选中的日期范围
   */
  const activeDateRange = useMemo(() => {
    if (rangeType === 'FIXED_DATE') {
      return validateDate;
    } else {
      return getMomentDateRanges()[rangeType];
    }
  }, [rangeType, validateDate]);

  /**
   * 根据leftSelect获取当前选中的资产组合
   */
  const activeSelect = useMemo(() => {
    const keys = Object.keys(leftSelect);
    const activeAstUnitId = keys.filter((e) => e !== productCode)?.[0] || '';
    return {
      astUnitId: activeAstUnitId,
      combiCode: leftSelect[activeAstUnitId],
    };
  }, [leftSelect, productCode]);

  /**
   * 获取资产列表
   */
  const getAssetList = () => {
    invokeAPIIndex({
      serviceId: 'DD_API_FUND_AST_UNIT_AND_COMBI_INCOME',
      data: {
        fundCode: productCode,
        startDate: activeDateRange?.[0]?.format('YYYYMMDD'),
        endDate: activeDateRange?.[1]?.format('YYYYMMDD'),
      },
    })
      .then((res) => {
        // setStaticInfo({
        //   income: res?.data?.income,
        //   todayIncome: res?.data?.todayIncome,
        //   excessIncomeRate: res?.data?.excessIncomeRate,
        // });
        setAssetData(res?.data?.assetUnitList || []);
      })
      .finally(() => {});
  };

  useEffect(() => {
    if (!productCode) return;
    setLeftSelect({ [productCode]: '' });
  }, [productCode]);

  useEffect(() => {
    if (!productCode || !activeDateRange?.length) return;
    getAssetList();
  }, [productCode, activeDateRange]);

  /**
   * 选择左边已选的缺省单元+组合集合
   * 一级：缺省单元
   * 二级：组合
   * 一级不可取消选中，二级可以
   */
  const handleLeftSelect = useCallback(
    (type, astUnitId, checked) => {
      if (!checked) {
        if (type === 'first') {
          if (!astUnitId) {
            setLeftSelect({
              [productCode]: '',
            });
          } else {
            setLeftSelect({
              [astUnitId]: '',
            });
          }
        } else if (type === 'second') {
          setLeftSelect((prev) => {
            return {
              ...prev,
              [astUnitId]: '',
            };
          });
        }
        return;
      } else {
        if (type === 'second') {
          setLeftSelect({
            [astUnitId]: checked,
          });
        }
      }
    },
    [productCode],
  );

  // const onProductCardClick = useCallback(() => {
  //   setLeftSelect({ [productCode]: '' });
  // }, [productCode]);

  const onRangeTypeChange = useCallback(
    (e) => {
      const dateList = getMomentDateRanges()[e.target.value];
      headForm.setFieldValue('validateDate', dateList);
    },
    [headForm],
  );

  const onValidateDateChange = useCallback(
    (value) => {
      const ranges = getMomentDateRanges();
      let selected = false;
      Object.keys(ranges).forEach((key) => {
        if (value === ranges[key]) {
          selected = true;
          headForm.setFieldValue('rangeType', key);
        }
      });
      if (!selected) {
        headForm.setFieldValue('rangeType', 'FIXED_DATE');
      }
    },
    [headForm],
  );

  const onChangeFirst = useCallback(
    (astUnitId, checked) => {
      handleLeftSelect('first', astUnitId, checked);
    },
    [handleLeftSelect],
  );

  const onChangeSecond = useCallback(
    (astUnitId, checkedIndex) => {
      handleLeftSelect('second', astUnitId, checkedIndex);
    },
    [handleLeftSelect],
  );

  const handleSetProductCode = useCallback(
    (value) => {
      dispatch(setProductCode(value));
    },
    [dispatch],
  );

  const defaultProps = useMemo(() => {
    return {
      validateDate,
      activeDateRange,
      activeSelect,
      productCode,
    };
  }, [validateDate, activeDateRange, activeSelect, productCode]);

  return (
    <div className={`${styles.incomeAnalysis}`}>
      {/* 头部表单：产品+时间 */}
      <div className={styles.header}>
        <CustomHead
          onChangeFirst={onChangeFirst}
          onChangeSecond={onChangeSecond}
          assetData={assetData}
          productCode={productCode}
          initValue={productCode}
          setProductCode={handleSetProductCode}
        />
        <CustomForm
          initialValues={{
            rangeType: 'ONE_MONTH',
            validateDate: getMomentDateRanges()['ONE_MONTH'],
          }}
          rowGutter={12}
          form={headForm}
          config={[
            {
              name: 'rangeType',
              type: 'radio',
              props: {
                options,
                optionType: 'button',
                buttonStyle: 'solid',
                onChange: onRangeTypeChange,
              },
            },
            {
              visible: rangeType === 'FIXED_DATE',
              type: 'dateRange',
              name: 'validateDate',
              label: '约束日期',
              props: {
                allowClear: false,
                style: { width: '100%' },
                onChange: onValidateDateChange,
              },
            },
          ]}
        />
      </div>
      {/* 内容，左侧-资产列表+更多筛选，右侧-详细图表 */}
      <div ref={contentRef} className={styles.incomeAnalysisContent}>
        <div className={styles.left}>
          {/* <div onClick={onProductCardClick} className={styles.productCard}>
              <StaticInfo staticInfo={staticInfo} productCode={productCode} />
            </div> */}
          <BigTypePieChart productCode={productCode} />
          <SmallMChart
            setSmallAssetData={setSmallAssetData}
            {...defaultProps}
          />
          <FeeDetail {...defaultProps} smallAssetData={smallAssetData} />
          <div className={styles.blockCard}>
            <MultiDimensionalBarChart assetData={assetData} />
          </div>
        </div>
        <Affix offsetTop={1} target={() => contentRef.current}>
          <div className={styles.middle}></div>
        </Affix>
        <div id="rightContainer" className={styles.rightContainer}>
          <RightStaticInfo {...defaultProps} />
          <IncomeAnalysisChart
            activeDateRange={activeDateRange}
            activeSelect={activeSelect}
            productCode={productCode}
          />
          <div className={styles.paddingBlockCard}>
            <Row style={{ width: '100%' }} gutter={[12, 12]}>
              <Col span={12}>
                <div className={styles.blockCard}>
                  {/* 账户收益 */}
                  <IncomeLine {...defaultProps} />
                </div>
              </Col>
              <Col span={12}>
                <WinInfo
                  {...defaultProps}
                  style={{ width: '100%', padding: '0 8px' }}
                />
              </Col>
              <Col span={24}>
                <div className={styles.blockCard}>
                  {/* 产品换手率 */}
                  <ProductTurnoverRate {...defaultProps} />
                </div>
              </Col>
            </Row>
          </div>
          <div className={styles.paddingBlockCard}>
            {/* 出入金 */}
            <IncomeFlow {...defaultProps} />
          </div>
          <div className={styles.paddingBlockCard}>
            {/* 费用详情 */}
            <FeeDetailTable {...defaultProps} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeAnalysis;
