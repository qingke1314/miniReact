const path = require("path");
const isProduction = process.env.NODE_ENV === "production";
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: isProduction ? "production" : "development",
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    clean: true,
  },
  optimization: {
    minimize: isProduction,
    minimizer: isProduction
      ? [
          new TerserPlugin({
            terserOptions: {
              format: {
                comments: false, // 移除注释
              },
              compress: {
                drop_console: true,
                drop_debugger: true,
                dead_code: true, // 移除未使用的代码
              },
            },
          }),
        ]
      : [],
  },
  devtool: isProduction ? false : "eval-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin({
      // 提取css为独立文件
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].[contenthash].css",
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"), // 静态文件目录
    },
    hot: true,
    port: 8888,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(less)$/,
        use: [
          MiniCssExtractPlugin.loader, // 构建时生成独立的css文件，并自动在html中引入
          "css-loader", // 处理@import、url()
          "postcss-loader", // 处理css的postcss插件
          "less-loader", // 将less编译为css
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
};
