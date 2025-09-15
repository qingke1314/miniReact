// 渲染器从 'react-dom' 包导入
import ReactDOM from 'react-dom';
import Home from "./pages/Home/index.jsx";
import './index.css';

const container = document.getElementById("root");

// 使用新的 createRoot API
const root = ReactDOM.createRoot(container);
root.render(<Home />);