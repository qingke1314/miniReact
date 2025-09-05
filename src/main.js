import MiniReact from "MiniReact";
import Home from "./pages/Home/index.jsx";

const container = document.getElementById("root");
function App() {
  console.log('render APP');
  return (
    <div>
      <h1>Hello, world!</h1>
      <Home />
    </div>
  );
}

MiniReact.render(<App />, container);
