/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2025-01-22 17:40:45
 * @LastEditors: wenyiqian
 * @LastEditTime: 2025-03-31 16:32:21
 * @Description:
 */
import { isNil } from 'lodash';
import CustomInputNumber from './CustomInputNumber';

const QtyInput = ({ initValue: unit = 1, maxQty, ...config }) => {
  return (
    <CustomInputNumber
      min={0}
      {...(maxQty !== -1 && !isNil(maxQty)
        ? {
            placeholder: `可用数量：${
              unit === 1 ? maxQty : Math.floor(maxQty / unit)
            }`,
          }
        : {})}
      controls
      addonAfter={'股'}
      precision={0}
      step={100}
      {...config}
    />
  );
};
export default QtyInput;
