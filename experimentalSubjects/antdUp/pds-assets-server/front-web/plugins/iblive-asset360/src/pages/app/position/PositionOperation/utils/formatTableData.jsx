export const formatTableData = (data) => {
  const tableData = [];
  data.map((item) => {
    const { name, isTitle } = item;
    tableData.push(
      {
        name,
        isTitle,
      },
      ...item.indexs,
    );
  });
  return tableData;
};
