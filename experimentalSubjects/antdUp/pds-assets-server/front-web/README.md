# pds_front_plugin_demo

## 安装依赖
在front-web根目录下install
- [安装仓库地址](https://oss.apexsoft.com.cn/repository/react-native-group/)

## 脚本说明

1. 启动脚本 node版本小等16时删除 `set NODE_OPTIONS=--openssl-legacy-provider`
2. 插件打包版本
```
cd plugins/插件目录 && npm run build
```
3. 发布脚本 [发布仓库地址](https://oss.apexsoft.com.cn/repository/react-native-hosted/)
```
cd plugins/插件目录 && npm publish
```

## 插件内容
[package](./plugins/iblive-asset360/package.json)
```
"name": "iblive-demo", // 插件名称
"version": "0.0.1", // 插件版本
```

[插件路由](./plugins/iblive-asset360/src/common/routes.js)
