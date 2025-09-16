import StockBar from '../stockBar';

const MultiDimensionalBarChart = ({ assetData = [] }) => {
  return (
    <div
      style={{
        width: '100%',
        border: '1px solid var(--border-color-base)',
        padding: '0 8px',
        marginTop: 8,
      }}
    >
      <StockBar
        stockData={assetData.map((e) => ({
          name: e.astUnitName,
          value: e.income,
        }))}
      />
    </div>
  );
};

export default MultiDimensionalBarChart;
