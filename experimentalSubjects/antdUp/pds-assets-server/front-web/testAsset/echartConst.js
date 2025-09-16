const initData = [
  {
    name: '测试产品',
    id: 'product1',
    children: [
      {
        name: '股票',
        id: 'product1-stock',
      },
      {
        name: '债券',
        id: 'product1-bond',
      },
      {
        name: '基金',
        id: 'product1-fund',
      },
      {
        name: '期货',
        id: 'product1-future',
      },
      {
        name: '回购',
        id: 'product1-repo',
      },
      {
        name: '存款',
        id: 'product1-deposit',
      },
      {
        name: '其他',
        id: 'product1-other',
      },
    ],
  },
];

const addItems = (source, originName, originId) => {
  const addList = new Array(100).fill();
  source.children = addList.map((_, index) => {
    return {
      name: `${originName}-证券${index}`,
      id: `${originId}-${index}`,
      value: Math.random() * 1000,
      win: Math.random() - 0.4 > 0,
    };
  });
};
initData[0].children.forEach((item) => {
  addItems(item, item.name, item.id);
});

const calculateMoney = (source) => {
  (source.children || []).forEach((item) => {
    calculateMoney(item);
  });
  source.value = source.children
    ? source.children.reduce((pre, cur) => {
        return cur.win > 0 ? pre + cur.value : pre - cur.value;
      }, 0)
    : source.value || 0;
  if (typeof source.win === 'undefined') {
    // 不是最底层，最底层patch过
    source.win = source.value > 0;
  }
  source.itemStyle = {
    color: source.win ? 'red' : 'green',
    borderColor: 'black',
  };
  source.value = Math.abs(source.value);
};

calculateMoney(initData[0]);

export default initData;
