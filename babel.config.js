module.exports = {
  presets: [
    "@babel/preset-env",
    [
      "@babel/preset-react", // 处理 React 代码
      {
        // 关键：将运行时设置为 'automatic'
        runtime: "automatic",
        // 关键：告诉 Babel 从哪里导入 jsx, jsxs 函数
        importSource: "react",
      },
    ],
  ],
};
