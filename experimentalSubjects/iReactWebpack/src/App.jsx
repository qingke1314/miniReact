import { Link, Outlet } from "react-router-dom";
import { invoices } from "@/utils/menu";
import { ConfigProvider, theme, Button } from "antd";
import { useState } from "react";

const App = () => {
  const [primary, setPrimary] = useState("black");
  return (
    <ConfigProvider
      theme={{
        token: {
          algorithm: theme.darkAlgorithm,
          colorPrimary: primary,
        },
      }}
    >
      <Button
        onClick={() => setPrimary(primary === "black" ? "#0070f3" : "black")}
      >
        切换主题
      </Button>
      <div style={{ display: "flex" }}>
        <nav
          style={{
            borderRight: "solid 1px",
            padding: "1rem",
          }}
        >
          {invoices.map((invoice) => (
            <Link
              style={{ display: "block", margin: "1rem 0" }}
              to={`/invoices/${invoice.number}`}
              key={invoice.number}
            >
              {invoice.name}
            </Link>
          ))}
        </nav>
        <div>
          <Outlet />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default App;
