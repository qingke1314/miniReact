module.exports = {
  presets: [
    "@babel/preset-env",
    ["@babel/preset-react", {
      "runtime": "automatic"  // 启用自动运行时
    }]
  ],
};
