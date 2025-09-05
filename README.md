# 手写 useState Hook 实现

这是一个从零开始手写的 React useState Hook 实现，帮助理解 React Hooks 的工作原理。

## 📁 文件结构

```
.
├── useState.js     # useState 核心实现
├── index.html      # 浏览器测试页面
└── README.md       # 说明文档
```

## 🔧 核心实现原理

### 1. 状态存储
```javascript
let currentStateIndex = 0;  // 当前状态索引
let states = [];            // 状态数组
let setters = [];           // setter 函数数组
```

### 2. useState 函数
```javascript
function useState(initialValue) {
  const index = currentStateIndex;
  
  // 初始化状态
  if (states[index] === undefined) {
    states[index] = initialValue;
  }
  
  // 创建 setState 函数
  const setState = (newValue) => {
    if (typeof newValue === 'function') {
      states[index] = newValue(states[index]);
    } else {
      states[index] = newValue;
    }
    render(); // 触发重新渲染
  };
  
  currentStateIndex++;
  return [states[index], setState];
}
```

### 3. 关键特性

- **状态持久化**: 使用全局数组存储状态
- **索引管理**: 通过索引确保每个 useState 调用对应正确的状态
- **函数式更新**: 支持传入函数来更新状态
- **重新渲染**: 状态更新时触发组件重新渲染

## 🚀 使用方法

### Node.js 环境
```bash
node useState.js
```

### 浏览器环境
1. 启动本地服务器:
   ```bash
   python3 -m http.server 8080
   ```
2. 打开浏览器访问: `http://localhost:8080`

## 🎯 功能演示

### 基本用法
```javascript
function MyComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('张三');
  const [isVisible, setIsVisible] = useState(true);
  
  return {
    increment: () => setCount(count + 1),
    decrement: () => setCount(prev => prev - 1),
    changeName: (newName) => setName(newName),
    toggleVisibility: () => setIsVisible(!isVisible)
  };
}
```

### 支持的更新方式
1. **直接赋值**: `setState(newValue)`
2. **函数式更新**: `setState(prevValue => prevValue + 1)`

## 🌟 浏览器测试功能

- 📊 **实时状态显示**: 查看当前所有状态值
- 🔢 **计数器操作**: 增加、减少、重置计数
- 📝 **名称管理**: 手动输入或随机生成名称
- 👁️ **可见性切换**: 布尔值状态切换
- 🔄 **批量操作**: 一次性更新多个状态
- 📝 **控制台输出**: 实时查看状态变化日志

## 🔍 实现细节

### 状态索引管理
- 每次组件渲染时重置 `currentStateIndex` 为 0
- 每个 `useState` 调用递增索引
- 确保状态与 Hook 调用顺序一致

### 重新渲染机制
- 状态更新时调用 `render()` 函数
- 重置索引并重新执行组件函数
- 模拟 React 的重新渲染过程

### 函数式更新支持
- 检测 `newValue` 是否为函数
- 如果是函数，传入当前状态值并使用返回值
- 支持基于前一个状态的更新

## ⚠️ 注意事项

1. **Hook 调用顺序**: 必须保持 useState 调用顺序一致
2. **条件调用**: 不能在条件语句中调用 useState
3. **循环调用**: 不能在循环中调用 useState
4. **嵌套函数**: 不能在嵌套函数中调用 useState

## 🎓 学习价值

通过这个实现可以学习到:
- React Hooks 的基本工作原理
- 状态管理的实现方式
- 闭包在状态管理中的应用
- 函数式编程的思想
- 组件重新渲染的机制

## 🔗 扩展思考

- 如何实现 useEffect?
- 如何处理异步状态更新?
- 如何优化性能避免不必要的重新渲染?
- 如何实现状态的批量更新?

---

这个实现虽然简化了很多细节，但核心思想与 React 的实际实现是一致的，有助于深入理解 React Hooks 的工作机制。