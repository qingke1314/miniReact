/*
 * @Author: guoxuan
 * @Date: 2025-02-17 14:12:37
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-17 15:21:24
 * @Description: 
 */
const cashFilterTree = (tree, filterFun) => {
  let newTree = [];
  newTree = tree.map((item) => {
    let obj;
    if (filterFun(item)) {
      obj = item;
    } else if (item.children?.length) {
      obj = {
        ...item,
        children: cashFilterTree(item.children, filterFun),
      };
      if (obj.children?.length < 1) obj = undefined;
    }
    return obj;
  });

  newTree = newTree.filter((item) => item);
  return newTree;
};

export default (tree = [], filterFun) => {
  const newTree = cashFilterTree(tree, filterFun);
  return newTree;
};
