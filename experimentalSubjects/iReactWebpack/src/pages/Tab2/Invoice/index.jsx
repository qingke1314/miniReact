import { useParams } from "react-router-dom";

const Invoice = () => {
  const { invoiceNumber } = useParams();
  return (
    <div>
      <h1>Invoice {invoiceNumber}</h1>
    </div>
  );
};

export default Invoice;
