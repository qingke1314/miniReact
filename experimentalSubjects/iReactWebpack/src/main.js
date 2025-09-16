import "@ant-design/v5-patch-for-react-19";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Tab1 from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import Invoice from "./pages/Tab2/Invoice";

import "./global.less";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="expenses" element={<Tab1 />} />
        <Route path="invoices" element={<Tab2 />}>
          <Route index element={<h1>Invoice List</h1>} />
          <Route path=":invoiceNumber" element={<Invoice />} />
        </Route>
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Route>
    </Routes>
  </HashRouter>
);
