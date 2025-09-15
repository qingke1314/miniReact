import { memo, useCallback, useState } from "react";

function MyComponent(props) {
  const [count, setCount] = useState(0);
  const handleCount = useCallback(() => {
    setCount((count) => count + 1);
  }, []);
  console.log("render memo Component");
  return (
    <div onClick={handleCount}>
      {props.text}
      {count}
    </div>
  );
}

// 只有 MyComponent 被 memo 包裹了，它才会在 props 不变时跳过 Render
export default memo(MyComponent);
