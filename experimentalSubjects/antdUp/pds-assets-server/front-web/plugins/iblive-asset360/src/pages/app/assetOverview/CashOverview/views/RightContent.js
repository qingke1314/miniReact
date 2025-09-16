/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-10-22 14:25:42
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-14 10:19:34
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\CashOverview\views\RightContent.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  DealIndexContent,
  FundCalendarContent,
  SingleProductContent,
} from 'iblive-position';
import { useSelector } from 'react-redux';

export default ({ activedKey }) => {
  const { date, productCode } = useSelector(
    (state) => state.asset360AssetLayout,
  );

  return (
    <>
      {activedKey === 'forecastedStatement' ? (
        <SingleProductContent readOnly fundCode={productCode} astUnitId={-1} />
      ) : activedKey === 'dealDetailDrawer' ? (
        <DealIndexContent
          readOnly
          fundCode={productCode}
          astUnitId={-1}
          date={date}
        />
      ) : activedKey === 'fundCalendar' ? (
        <FundCalendarContent readOnly fundCode={productCode} astUnitId={-1} />
      ) : null}
    </>
  );
};
