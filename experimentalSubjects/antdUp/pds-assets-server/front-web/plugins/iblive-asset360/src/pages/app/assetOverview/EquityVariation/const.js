/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-07-16 10:46:43
 * @LastEditTime: 2024-07-18 20:18:03
 * @LastEditors: chenzongjun chenzongjun@apexsoft.com.cn
 */
export const instStatus = {
  1: '有效',
  2: '已修改',
  3: '已撤销',
  4: '已暂停',
  5: '审批拒绝',
  6: '分发拒绝',
  7: '指令录入',
  8: '分仓失败',
  9: '草稿指令',
  a: '临时下达',
  b: '临时修改',
  c: '撤消失败',
  d: '风控临时指令',
  e: '草稿生效',
};

export const instType = {
  1: '个股',
  2: '组合',
  3: '个股批量',
  4: '组合批量',
};

export const etruStatus = {
  1: '未执行',
  2: '部分执行',
  3: '完成',
};

export const matchStatus = {
  1: '未执行',
  2: '部分执行',
  3: '完成',
};

export const targetType = {
  1: '绝对数量',
  2: '绝对金额',
  3: '持仓数量比例',
  4: '净值比例',
  5: 'ETF篮子',
  6: '单元净值比例',
  7: '可用金额比例',
  8: '可用标准券比例',
  9: '资产配置市值比例',
};

export const detailEtruStatus = {
  1: '未报',
  2: '待报',
  3: '正报',
  4: '已报',
  5: '废单',
  6: '部成',
  7: '已成',
  8: '部撤',
  9: '已撤',
  a: '待撤',
  b: '未审批',
  c: '审批拒绝',
  d: '未审批即撤销',
  A: '未撤',
  B: '待撤',
  C: '正撤',
  D: '撤认',
  E: '撤废',
  F: '已撤',
};

export const secDire = {
  0: '不变',
  1: '增加证券',
  2: '减少证券',
};

export const cashDire = {
  '-1': '流出',
  1: '流入',
};

export const investType = {
  1: '固收类',
  2: '权益类',
  3: '衍生品',
  4: '其他',
};

export const assetType = {
  1: '现金资产',
  2: '股票资产',
  3: '债券资产',
  4: '基金资产',
  5: '回购资产',
  6: '非资产',
  7: '权证资产',
  8: '其他资产',
  9: '期货盈亏',
  D: '信用衍生品资产',
};
