import { moneyFormat } from 'iblive-base';

export function moneyFormatWidthAutoUnit(num, options) {
  if (!num || isNaN(Number(num))) return '--';

  let unit = '';
  let formattedNum = num;

  if (Math.abs(num) >= 1e8) {
    unit = '亿';
    formattedNum = num / 1e8;
  } else if (Math.abs(num) >= 1e4) {
    unit = '万';
    formattedNum = num / 1e4;
  }

  return moneyFormat({ num: formattedNum, decimal: 2, unit, ...options });
}

export const colorList = [
  '#5B8FF9', // 蓝色
  '#F6BD16', // 黄色
  '#7262FD', // 紫色
  '#78D3F8', // 浅蓝
  '#96AEFE', // 浅紫
  '#C670D9', // 浅紫
  '#F6903D', // 橙色
  '#F08BB4', // 粉色
];
