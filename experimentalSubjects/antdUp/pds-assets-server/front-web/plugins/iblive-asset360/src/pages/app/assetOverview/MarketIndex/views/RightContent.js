import { Empty } from 'antd-v5';
import DetailInfo from './DetailInfo';
import TrendInfo from './TrendInfo';

export default ({ selectedMarket, marketList }) => {
  return selectedMarket ? (
    <>
      <TrendInfo selectedMarket={selectedMarket} marketList={marketList} />
      <DetailInfo selectedMarket={selectedMarket} />
    </>
  ) : (
    <Empty className="p-t-32" />
  );
};
