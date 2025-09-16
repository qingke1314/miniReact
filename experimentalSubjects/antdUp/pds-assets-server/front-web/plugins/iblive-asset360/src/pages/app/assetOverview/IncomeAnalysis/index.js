import { Col, Form, Row, Spin } from 'antd-v5';
import { CustomForm } from 'iblive-base';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { invokeAPIIndex } from '../../../../apis/api';
import { setProductCode } from '../../../../store/assetLayoutSlice';
import { getMomentDateRanges, options } from './const.jsx';
import styles from './index.module.less';
import BigType from './views/BigType';
import BigTypePieChart from './views/BigTypePieChart';
import Compare from './views/Compare';
import CustomHead from './views/CustomHead';
// import EarningsChart from './views/EarningsChart';
import IncomeAnalysisEcharts from './views/IncomeAnalysisEcharts';
import IncomeLine from './views/incomeLine';
import Industry from './views/Industry';
import MultiDimensionalBarChart from './views/MultiDimensionalBarChart';
import MyCalendar from './views/MyCalendar';
import OperateInfo from './views/OperateInfo';
import StaticInfo from './views/StaticInfo';
import RightStaticInfo from './views/rightStaticInfo';
import AssetCard from './AssetCard';
// import StatsCard from './views/StatsCard';
import WinInfo from './views/WinInfo';

const IncomeAnalysis = () => {
  const [headForm] = Form.useForm(); // 头部表单
  const rangeType = Form.useWatch('rangeType', headForm); // 日期范围类型
  const validateDate = Form.useWatch('validateDate', headForm); // 日期类型为自定义时出现的自定义日期
  const [form] = Form.useForm(); // 左侧-更多筛选表单
  const { productCode } = useSelector((state) => state.asset360AssetLayout);
  const [assetData, setAssetData] = useState([]); // 左侧-资产数据
  const [leftSelect, setLeftSelect] = useState({}); // 左侧-已选的产品+缺省单元+组合集合
  const [assetType, setAssetType] = useState('GP'); // 左侧-资产大类
  const [loading, setLoading] = useState(false); // 左侧-loading
  const [conceptList, setConceptList] = useState([]); // 行业列表
  const [industryList, setIndustryList] = useState([]); // 概念列表
  const [bigTypeList, setBigTypeList] = useState([]); // 资产大类列表
  const [moreValues, setMoreValues] = useState({}); // 更多筛选表单的值
  const [calendarValue, setCalendarValue] = useState(moment()); // 日历图选中的日期
  const [selectedStock, setSelectedStock] = useState();
  const [staticInfo, setStaticInfo] = useState({
    income: 0,
    todayIncome: 0,
    excessIncomeRate: 0,
  });
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
   * 当产品、资产单元、组合变化时，获取行业、概念、盘子列表、资产大类列表
   */
  useEffect(() => {
    if (!productCode || !activeDateRange?.length) return;
    const post = {
      fundCode: productCode,
      startDate: activeDateRange?.[0]?.format('YYYYMMDD'),
      endDate: activeDateRange?.[1]?.format('YYYYMMDD'),
      astUnitId: activeSelect.astUnitId ? Number(activeSelect.astUnitId) : null,
      combiCode: activeSelect.combiCode || null,
    };
    invokeAPIIndex({
      serviceId: 'DD_API_FUND_ASSET_TYPE_INCOME',
      data: post,
    }).then((res) => {
      setBigTypeList(res?.records || []);
    });
    invokeAPIIndex({
      serviceId: 'DD_API_FUND_STOCK_DISTRIBUTION_OF_INVESTMENT_SCOPE',
      data: post,
    }).then((res) => {
      setConceptList(res?.data?.conceptList || []);
      setIndustryList(res?.data?.sectorList || []);
    });
  }, [
    productCode,
    activeSelect.astUnitId,
    activeSelect.combiCode,
    activeDateRange,
  ]);
  /**
   * 获取资产列表
   */
  const getAssetList = () => {
    setLoading(true);
    invokeAPIIndex({
      serviceId: 'DD_API_FUND_AST_UNIT_AND_COMBI_INCOME',
      data: {
        fundCode: productCode,
        startDate: activeDateRange?.[0]?.format('YYYYMMDD'),
        endDate: activeDateRange?.[1]?.format('YYYYMMDD'),
      },
    })
      .then((res) => {
        setStaticInfo({
          income: res?.data?.income,
          todayIncome: res?.data?.todayIncome,
          excessIncomeRate: res?.data?.excessIncomeRate,
        });
        setAssetData(res?.data?.assetUnitList || []);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (!productCode || !activeDateRange?.length) return;
    setLeftSelect({ [productCode]: '' });
    getAssetList();
  }, [productCode, activeDateRange]);
  /**
   * 选择左边已选的缺省单元+组合集合
   * 一级：缺省单元
   * 二级：组合
   * 一级不可取消选中，二级可以
   */
  const handleLeftSelect = (type, astUnitId, checked) => {
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
  };
  const defaultProps = {
    moreValues,
    validateDate,
    activeDateRange,
    activeSelect,
    productCode,
  };
  /**
   * 这个原本是用来切维度的，后来改到上面去了，这边隐藏了，现在又说要展示了，因为这里能看到收益，xxx
   */
  const showAmtAssetList = useMemo(() => {
    const key = Object.keys(leftSelect)?.[0];
    if (!key) return [];
    if (key === productCode) return assetData;
    return assetData.filter((e) => String(e.astUnitId) === key);
  }, [assetData, leftSelect, productCode]);
  return (
    <div className={`${styles.incomeAnalysis}`}>
      {/* 头部表单：产品+时间 */}
      <div className={styles.header}>
        <CustomHead
          onChangeFirst={(astUnitId, checked) => {
            handleLeftSelect('first', astUnitId, checked);
          }}
          onChangeSecond={(astUnitId, checkedIndex) => {
            handleLeftSelect('second', astUnitId, checkedIndex);
          }}
          initValue={productCode}
          assetData={assetData}
          productCode={productCode}
          setProductCode={(value) => {
            dispatch(setProductCode(value));
          }}
        />
        <CustomForm
          initialValues={{
            rangeType: 'ONE_MONTH',
            validateDate: getMomentDateRanges()['ONE_MONTH'],
          }}
          rowGutter={12}
          style={{ marginLeft: '8px' }}
          form={headForm}
          config={[
            {
              name: 'rangeType',
              type: 'radio',
              props: {
                options,
                optionType: 'button',
                buttonStyle: 'solid',
                onChange: (e) => {
                  const dateList = getMomentDateRanges()[e.target.value];
                  headForm.setFieldValue('validateDate', dateList);
                },
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
                onChange: (value) => {
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
              },
            },
          ]}
        />
      </div>
      {/* 内容，左侧-资产列表+更多筛选，右侧-详细图表 */}
      <div className={styles.incomeAnalysisContent}>
        <Spin style={{ height: '100%' }} spinning={loading}>
          <div className={styles.left}>
            <div
              onClick={() => {
                setLeftSelect({ [productCode]: '' });
              }}
              className={
                styles.productCard
                // Object.hasOwn(leftSelect, productCode) ? styles.active : ''
              }
            >
              <StaticInfo
                bigTypeList={bigTypeList}
                staticInfo={staticInfo}
                productCode={productCode}
              />
            </div>
            {showAmtAssetList.map((item) => {
              return (
                <AssetCard
                  key={item.astUnitId}
                  isChooseProduct={Object.hasOwn(leftSelect, productCode)}
                  assetData={item}
                />
              );
            })}
            <BigTypePieChart bigTypeList={bigTypeList} />
            <BigType
              onChange={setAssetType}
              assetType={assetType}
              bigTypeList={bigTypeList}
            />

            <div className={styles.moreFilter}>
              <div className="important-title">更多筛选</div>
              <CustomForm
                onValuesChange={(_, allValues) => {
                  setMoreValues(allValues);
                }}
                style={{ marginTop: 8 }}
                form={form}
                config={[
                  {
                    visible: industryList?.length,
                    label: '行业',
                    name: 'industryList',
                    custom: (props) => (
                      <Industry {...props} industryList={industryList} />
                    ),
                  },
                  {
                    visible: false,
                    label: '概念',
                    name: 'conceptList',
                    custom: (props) => (
                      <Industry {...props} industryList={conceptList} />
                    ),
                  },
                  {
                    label: '盘子',
                    name: 'marketValueTypeList',
                    custom: (props) => (
                      <Industry
                        {...props}
                        industryList={[
                          { name: '50亿以下', code: '1' },
                          { name: '50-100亿', code: '2' },
                          { name: '100-300亿', code: '3' },
                          { name: '300-500亿', code: '4' },
                          { name: '500-1000亿', code: '5' },
                          { name: '1000亿以上', code: '6' },
                        ]}
                      />
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </Spin>
        <div className={styles.rightContainer}>
          {/* {Object.hasOwn(leftSelect, productCode) && (
            <EarningsChart
              activeDateRange={activeDateRange}
              productCode={productCode}
            />
          )} */}
          <div style={{ marginBottom: 8 }} className={styles.blockCard}>
            <RightStaticInfo staticInfo={staticInfo} {...defaultProps} />
          </div>
          <div className={styles.blockCard}>
            <Row style={{ width: '100%' }} gutter={[12, 12]}>
              <Col span={14}>
                <IncomeLine {...defaultProps} />
              </Col>
              <Col span={10}>
                <WinInfo
                  {...defaultProps}
                  style={{ width: '100%', padding: '0 8px' }}
                />
              </Col>
            </Row>
          </div>
          <div className={styles.blockCard}>
            <MultiDimensionalBarChart {...defaultProps} />
          </div>
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--border-color-base)',
            }}
          >
            <div className={styles.right}>
              <MyCalendar
                {...defaultProps}
                rangeType={rangeType}
                calendarValue={calendarValue}
                setCalendarValue={setCalendarValue}
              />
            </div>
            <div className={styles.rightBottom}>
              <Compare {...defaultProps} />
            </div>
          </div>
          <div style={{ padding: 8 }}>
            <IncomeAnalysisEcharts
              calendarValue={calendarValue}
              selectedStock={selectedStock}
              setSelectedStock={setSelectedStock}
              {...defaultProps}
            />
            <br />
            <OperateInfo
              selectedStock={selectedStock}
              calendarValue={calendarValue}
              {...defaultProps}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeAnalysis;
