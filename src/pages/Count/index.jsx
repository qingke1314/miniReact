import { memo } from 'react'; 

function MyComponent(props) {
  console.log('render memo Component');
  return <div>{props.text}1</div>;
}

// 只有 MyComponent 被 memo 包裹了，它才会在 props 不变时跳过 Render
export default memo(MyComponent);