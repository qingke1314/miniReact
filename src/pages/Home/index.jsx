import { useState } from "react";
import Count from "@/pages/Count/index";
import * as styles from "./index.module.less";

let idCounter = 4;
const initialItems = [
  { id: 1, text: "Item 1" },
  { id: 2, text: "Item 2" },
  { id: 3, text: "Item 3" },
  { id: 4, text: "Item 4" },
];

function App() {
  const [items, setItems] = useState(initialItems);
  // 定义按钮样式变量
  const buttonClass =
    "bg-[#0070f3] text-white px-4 py-2 rounded-md cursor-pointer";

  const shuffle = () => {
    setItems((prev) => [...prev].sort(() => Math.random() - 0.5));
  };
  const addToTop = () => {
    const newItem = { id: ++idCounter, text: `New Item ${idCounter}` };
    setItems((prev) => [newItem, ...prev]);
  };
  const removeFromMiddle = () => {
    if (items.length <= 2) return;
    const middleIndex = Math.floor(items.length / 2);
    setItems((prev) => prev.filter((_, i) => i !== middleIndex));
  };
  const reverse = () => {
    setItems((prev) => [...prev].reverse());
  };
  return (
    <div>
      <h1>Advanced List Test</h1>
      <div className="flex justify-center items-center gap-4">
        <button className={buttonClass} onClick={shuffle}>
          🔀 Shuffle
        </button>
        <button className={buttonClass} onClick={addToTop}>
          ➕ Add to Top
        </button>
        <button className={buttonClass} onClick={removeFromMiddle}>
          ➖ Remove from Middle
        </button>
        <button className={buttonClass} onClick={reverse}>
          🔁 Reverse
        </button>
      </div>
      <div>
        <ul className="list-disc list-inside">
          {items.map((item) => (
            <li key={item.id}>{item.text}</li>
          ))}
        </ul>
      </div>
      <Count key="a-stable-unique-key-for-count" text="hello" />
    </div>
  );
}

export default App;
