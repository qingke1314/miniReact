import { moneyFormat } from 'iblive-base';
import moment from 'moment';

export const options = [
  { label: '今日', value: 'TODAY' },
  { label: '近1周', value: 'ONE_WEEK' },
  { label: '近1月', value: 'ONE_MONTH' },
  { label: '近3月', value: 'THREE_MONTH' },
  { label: '近6月', value: 'SIX_MONTH' },
  { label: '近1年', value: 'ONE_YEAR' },
  // { label: '近3年', value: 'THREE_YEAR' },
  // { label: '近5年', value: 'FIVE_YEAR' },
  { label: '成立以来', value: 'SINCE_FOUND' },
  { label: '自定义', value: 'FIXED_DATE' },
];

export const getMomentDateRanges = () => {
  const today = moment();
  return {
    TODAY: [moment(today), moment(today)],
    ONE_WEEK: [moment(today).subtract(1, 'weeks'), moment(today)],
    ONE_MONTH: [moment(today).subtract(1, 'months'), moment(today)],
    THREE_MONTH: [moment(today).subtract(3, 'months'), moment(today)],
    SIX_MONTH: [moment(today).subtract(6, 'months'), moment(today)],
    ONE_YEAR: [moment(today).subtract(1, 'years'), moment(today)],
    SINCE_FOUND: [moment('2015-01-01', 'YYYY-MM-DD'), moment(today)],
    //THREE_YEAR: [moment(today).subtract(3, 'years'), moment(today)],
    //FIVE_YEAR: [moment(today).subtract(5, 'years'), moment(today)],
    // 固定日期示例
    FIXED_DATE: [moment('2005-01-01', 'YYYY-MM-DD'), moment(today)],
  };
};

export function formatNumberWithUnit(num, props = {}) {
  if (!num) {
    return '--';
  }
  const parsedNum = parseFloat(num);
  const { decimal = 2, unit = '', needColor = true } = props;
  if (typeof num !== 'number' && typeof num !== 'string') {
    return num;
  }

  if (Number.isNaN(parsedNum) || !Number.isFinite(parsedNum)) {
    return num;
  }

  const absNum = Math.abs(parsedNum);
  const YI = 100000000;
  const WAN = 10000;
  const finalUnit = unit || (absNum >= YI ? '亿' : absNum >= WAN ? '万' : '');
  const finalNum =
    absNum >= YI ? parsedNum / YI : absNum >= WAN ? parsedNum / WAN : parsedNum;
  return moneyFormat({
    num: finalNum,
    decimal,
    unit: finalUnit,
    needColor,
  });
}

export const defaultStockList = [
  {
    name: '贵州茅台',
    value: 0,
  },
  {
    name: '腾讯控股',
    value: 0,
  },
  {
    name: '苹果公司',
    value: 0,
  },
  {
    name: '特斯拉',
    value: 0,
  },
  {
    name: '阿里巴巴',
    value: 0,
  },
  {
    name: '亚马逊',
    value: 0,
  },
  {
    name: '谷歌',
    value: 0,
  },
  {
    name: '宁德时代',
    value: 0,
  },
  {
    name: '工商银行',
    value: 0,
  },
  {
    name: '微软',
    value: 0,
  },
];

const initData = [
  {
    name: '测试产品',
    id: 'product1',
    children: [
      {
        name: '股票',
        id: 'product1-stock',
      },
      // {
      //   name: '债券',
      //   id: 'product1-bond',
      // },
      // {
      //   name: '基金',
      //   id: 'product1-fund',
      // },
      // {
      //   name: '期货',
      //   id: 'product1-future',
      // },
      // {
      //   name: '回购',
      //   id: 'product1-repo',
      // },
    ],
  },
];
const detailName = {
  'product1-future': [
    '黄金期货',
    '原油期货',
    '大豆期货',
    '铜期货',
    '铁矿石期货',
    '白银期货',
    '天然气期货',
    '玉米期货',
    '棉花期货',
    '白糖期货',
  ],
  'product1-stock': [
    '贵州茅台',
    '腾讯控股',
    '苹果公司',
    '特斯拉',
    '阿里巴巴',
    '微软',
    '亚马逊',
    '谷歌',
    '宁德时代',
    '工商银行',
  ],
  'product1-bond': [
    '21国债07',
    '22国开05',
    '20进出10',
    '19农发03',
    '18铁道债',
    '15地方债01',
    '17特别国债',
    '16企业债01',
    '14公司债02',
    '13可转债03',
  ],
  'product1-fund': [
    '华夏成长混合',
    '易方达消费行业',
    '嘉实沪深300ETF',
    '南方中证500ETF',
    '天弘余额宝货币',
    '富国天惠成长混合',
    '兴全合润分级',
    '汇添富价值精选',
    '广发稳健增长',
    '博时主题行业',
  ],
  'product1-repo': [
    '1天国债回购',
    '7天国债回购',
    '14天国债回购',
    '28天国债回购',
    '91天国债回购',
    '1天企业债回购',
    '7天企业债回购',
    '14天企业债回购',
    '28天企业债回购',
    '91天企业债回购',
  ],
};
const addItems = (source, originName, originId) => {
  const addList = new Array(10).fill();
  const Origin = addList.map((_, index) => {
    const item = defaultStockList[index];
    const randomValue = (Math.random() * 1000).toFixed(2);
    const randomWin = Math.random() - 0.5 > 0;
    item.value = randomWin ? randomValue : -randomValue;
    return {
      name: detailName[source.id][index],
      id: `${originId}-${index}`,
      value: randomValue,
      win: randomWin,
    };
  });
  source.children =
    //Origin;
    [
      {
        name: '盈利组',
        children: Origin.filter((item) => item.win),
      },
      {
        name: '亏损组',
        children: Origin.filter((item) => !item.win),
      },
    ];
};
initData[0].children.forEach((item) => {
  addItems(item, item.name, item.id);
});

const calculateMoney = (source) => {
  (source.children || []).forEach((item) => {
    calculateMoney(item);
  });
  const allMoney = source.children
    ? source.children.reduce((pre, cur) => {
        return pre + cur.value;
      }, 0)
    : source.value || 0;
  (source.children || []).forEach((item) => {
    item.rate = ((item.value / allMoney) * 100).toFixed(2);
  });
  source.value = source.children
    ? source.children.reduce((pre, cur) => {
        return cur.win > 0 ? pre + cur.value : pre - cur.value;
      }, 0)
    : source.value || 0;
  source.value = Number(source.value).toFixed(2);
  if (typeof source.win === 'undefined') {
    // 不是最底层，最底层patch过
    source.win = source.value > 0;
  }
  source.itemStyle = {
    // borderColor: source.win ? 'red' : 'green',
    // color: 'white', // 渐变颜色
    // opacity: 0.4,
    // curveness: 0.4,
    color: source.win ? '#fcecec' : '#d4f4ec',
    // borderColor: 'white',
    // backgroundColor: 'transparent', // 1. 图表区域透明
  };
  source.value = Math.abs(source.value); // .toFixed(2);
};

calculateMoney(initData[0]);

export default initData;

export const stockInfoTableData = [
  '贵州茅台',
  '腾讯控股',
  '苹果公司',
  '特斯拉',
  '阿里巴巴',
  '微软',
  '亚马逊',
  '谷歌',
  '宁德时代',
  '工商银行',
].map((item) => {
  return {
    code: item, // 假设name就是股票代码
    days: Math.floor(Math.random() * 200), // 随机生成持有天数
    marketValue: Math.floor(Math.random() * 1000000), // 使用treemap的value作为市值
    holdIncome: (Math.floor(Math.random() * 1000000) * 0.1).toFixed(2), // 模拟持有收益
    totalIncome: (Math.floor(Math.random() * 1000000) * 0.12).toFixed(2), // 模拟累计收益
    transactionFee: (Math.floor(Math.random() * 1000000) * 0.005).toFixed(2), // 模拟交易费用
    id: item,
  };
});

export const calendarType = {
  MONTH: 'month',
  YEAR: 'year',
  DECADE: 'decade',
};

class SelectTypeClass {
  constructor() {
    this.type = 'day';
  }
  set(type) {
    this.type = type;
  }
  get() {
    return this.type;
  }
}
export const selectType = new SelectTypeClass();

function transformArrayDynamic(inputArray) {
  // 存储原始值和索引的配对
  const indexedData = inputArray.map((e, index) => ({
    ...e,
    originalIndex: index,
  }));

  // 将数据分类并分别排序
  const negatives = indexedData
    .filter((item) => item.value < 0)
    .sort((a, b) => a.value - b.value); // 从小到大排序负数
  const zeros = indexedData.filter((item) => item.value === 0);
  const positives = indexedData
    .filter((item) => item.value > 0)
    .sort((a, b) => a.value - b.value); // 从小到大排序正数

  // 创建结果数组
  const resultArray = JSON.parse(JSON.stringify(inputArray));

  // 为负数生成目标值 (从最接近0的负数开始，递减 -10, -20, ...)
  // 注意：这里需要从排序后的负数数组的末尾开始赋值，因为目标值是 -10, -20...
  let negativeMultiplier = -1; // -10, -20, ...
  for (let i = negatives.length - 1; i >= 0; i--) {
    resultArray[negatives[i].originalIndex].lengthValue =
      negativeMultiplier * 10;
    negativeMultiplier--;
  }

  // 零值直接为 0
  zeros.forEach((item) => {
    resultArray[item.originalIndex].lengthValue = 0;
  });

  // 为正数生成目标值 (从最小的正数开始，递增 10, 20, ...)
  let positiveMultiplier = 1; // 10, 20, ...
  positives.forEach((item) => {
    resultArray[item.originalIndex].lengthValue = positiveMultiplier * 10;
    positiveMultiplier++;
  });

  return resultArray;
}

/**
 * 从一个股票队列（数组）中找出收益最高的五支和亏损最高的五支股票。
 * @param {Array<Object>} stocks - 股票对象的数组。每个对象应包含一个 'income' 属性（数值类型）。
 * @returns {Array<Object>} - 一个包含结果的新数组，按收益从小到大排列。如果总数少于或等于10支，则返回所有股票并排序。
 */
export function findTopAndBottomStocks(stocks, top = 5) {
  // 1. 检查输入是否为有效的数组
  if (!Array.isArray(stocks) || stocks.length === 0) {
    console.warn('输入的不是一个有效的股票数组。');
    return [];
  }

  // 2. 如果股票总数不足或刚好10支，直接排序并返回全部
  if (stocks.length <= top * 2 || !top) {
    // 使用 slice() 创建一个浅拷贝，避免修改原始数组
    return transformArrayDynamic(
      stocks.slice().sort((a, b) => a.value - b.value),
    );
  }
  // 3. 对股票数组的副本进行排序
  //    使用 a.income - b.income 会让数组按收益“从小到大”（亏损最多的在最前面，收益最高在最后面）排列
  const sortedStocks = [...stocks].sort((a, b) => a.value - b.value);
  // 4. 提取亏损最高的五支股票（即排序后的前五个元素）
  const topLosers = sortedStocks.slice(0, top);

  // 5. 提取收益最高的五支股票（即排序后的后五个元素）
  const topEarners = sortedStocks.slice(top * -1);

  // 6. 将两个数组合并成最终结果
  //    由于原数组已经排好序，这样合并后的结果自然也是从小到大排列的
  const result = [...topLosers, ...topEarners];

  return transformArrayDynamic(result);
}
