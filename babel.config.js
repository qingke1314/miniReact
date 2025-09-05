module.exports = {
  presets: [
    "@babel/preset-env", // 将最新的js语法转换为向旧兼容的版本
    // 只要你的项目有jsx，你就需要这个预设帮你转译，所有react项目都需要这玩意
    [
      "@babel/preset-react", // 将jsx转换为js
      {
        pragma: "MiniReact.createElement", // 使用我自己的jsx转换函数
      },
    ],
  ],
};
