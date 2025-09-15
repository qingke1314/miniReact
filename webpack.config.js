const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 自动生成html，并将打包好的js引进
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin"); // 压缩优化js代码
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProduction ? "production" : "development", // 开发环境
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    clean: true, // 打包前清理dist
  },
  optimization: {
    minimize: isProduction,
    minimizer: isProduction
      ? [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ["console.log", "console.info", "console.warn"],
              dead_code: true,
              conditionals: true,
              evaluate: true,
              booleans: true,
              loops: true,
              unused: true,
              hoist_funs: true,
              keep_fargs: false,
              hoist_vars: true,
              if_return: true,
              join_vars: true,
              side_effects: false,
            },
            mangle: {
              properties: {
                regex: /^_/, // 混淆以 _ 开头的属性
              },
              toplevel: true, // 混淆顶级作用域
            },
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ]
      : [],
  },
  // 禁用 source map
  devtool: isProduction ? false : "eval-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    hot: true,
    port: 8888,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // 支持 .js 和 .jsx 文件
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(less)$/,
        use: [
          // 'style-loader', // 将编译和解析后的css注入<style />
          MiniCssExtractPlugin.loader, // 构建时生成独立的css文件，并自动在html中引入
          'css-loader', // 处理@import、url()
          'postcss-loader', // 处理css的postcss插件
          'less-loader', // 将less编译为css
        ],
      }
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"], // 自动解析这些扩展名
    alias: {
      react: path.resolve(__dirname, "MiniReact/packages/react"),
      'react-dom': path.resolve(__dirname, "MiniReact/packages/react-dom/index.js"),
      '@': path.resolve(__dirname, 'src'),
    },
  },
};
