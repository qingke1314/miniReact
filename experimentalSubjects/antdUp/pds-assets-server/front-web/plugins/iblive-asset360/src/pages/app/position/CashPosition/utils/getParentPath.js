// 统一类型下获取父级路径
const getPathArray = (parentKey, map) => {
  const path = [];
  const parent = map[parentKey];
  if (parent) {
    path.unshift(...getPathArray(parent.parentKey, map), parent.title);
  }
  return path;
};

export default (node, treeList) => {
  const map = {};
  (treeList || []).forEach((item) => {
    map[item.key] = item;
  });
  return `${getPathArray(node?.parentKey, map).join(' / ')} / ${node?.title}`;
};
