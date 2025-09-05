import { useState } from "react";
import Count from '@/pages/Count/index';

let idCounter = 4;
const initialItems = [
  { id: 1, text: 'Item 1' },
  { id: 2, text: 'Item 2' },
  { id: 3, text: 'Item 3' },
  { id: 4, text: 'Item 4' },
];

function App() {
  const [items, setItems] = useState(initialItems);

  const shuffle = () => {
    setItems(prev => [...prev].sort(() => Math.random() - 0.5));
  };
  const addToTop = () => {
    const newItem = { id: ++idCounter, text: `New Item ${idCounter}` };
    setItems(prev => [newItem, ...prev]);
  };
  const removeFromMiddle = () => {
    if (items.length <= 2) return;
    const middleIndex = Math.floor(items.length / 2);
    setItems(prev => prev.filter((_, i) => i !== middleIndex));
  };
  const reverse = () => {
    setItems(prev => [...prev].reverse());
  }
  return <div>
    <h1>Advanced List Test</h1>
    <div>
      <button onClick={shuffle}>🔀 Shuffle</button>
      <button onClick={addToTop}>➕ Add to Top</button>
      <button onClick={removeFromMiddle}>➖ Remove from Middle</button>
      <button onClick={reverse}>🔁 Reverse</button>
    </div>
    <div>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </div>
    <Count text="hello" />
  </div>
}

export default App;
