/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2023-11-16 17:58:53
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-06-14 17:41:13
 * @Description:
 */
// 应用场景
export const APPLY_SCEEN = [
  { value: 'BEFOREHAND', label: '事前' },
  { value: 'INTERIM', label: '事中' },
  { value: 'AFTERWARDS', label: '事后' },
];
// 作用范围
export const RISK_RANGE = [
  { value: 'INSTRUCTION', label: '指令' },
  { value: 'STATIC', label: '静态' },
];
// 比较方向
export const COMPARE_DIRECTION = [
  { value: 'GREATER_THAN', label: '大于' },
  { value: 'GREATER_THAN_OR_EQUALS', label: '大等于' },
  { value: 'LESS_THAN', label: '小于' },
  { value: 'LESS_THAN_OR_EQUALS', label: '小等于' },
  { value: 'EQUALS', label: '等于' },
  { value: 'NOT_EQUALS', label: '不等于' },
];

// 触发场景
export const TRIGGER_SCENE = [
  { value: 'SCHEDULE', label: '调度' },
  { value: 'INSTRUCTION', label: '指令' },
  { value: 'MANUAL', label: '手动执行' },
];

// 比较单位
export const COMPARE_UNIT = [
  { value: 'PERCENT', label: '百分比', unit: '%' },
  { value: 'YUAN', label: '元', unit: '元' },
  { value: 'TEN_THOUSAND_YUAN', label: '万元', unit: '万元' },
  { value: 'DAYS', label: '天', unit: '天' },
  { value: 'NUMBER', label: '个', unit: '个' },
  { value: 'TEN_THOUSAND_SHARES', label: '万股', unit: '万股' },
  { value: 'BOARD_LOT', label: '手', unit: '手' },
  { value: 'YEAR', label: '年', unit: '年' },
];
// 触值操作
export const TRIGGER_LEVEL = [
  { value: 'COMPLIANCE', label: '合规' },
  { value: 'AUDIT', label: '送审' },
  { value: 'WARN', label: '警告' },
  { value: 'FORBID', label: '禁止' },
];
// 风险等级
export const RISK_LEVEL = [
  { value: 'POLICY', label: '政策性' },
  { value: 'CONTRACT', label: '契约性' },
  { value: 'COMPANY', label: '公司内部' },
];
// 控制类型
export const CONTROL_TYPE = [
  { value: 'SINGLE', label: '单基金控制' },
  { value: 'MULTI', label: '多基金联合' },
  { value: 'SINGLE_GROUP', label: '单基金组控制' },
];
// 逻辑类型
export const LOGIC_TYPE = [
  { value: 'AND', label: '并且' },
  { value: 'OR', label: '或者' },
  { value: 'NOT', label: '排除' },
];
