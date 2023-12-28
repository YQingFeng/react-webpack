# 使用 webpack 从 0 开始搭建一个 react 项目

## 一. 配置 webpack5 大核心概念

    - 入口(entry)
        指定webpack从哪里开始打包
    - 输出(output)
        指定webpack打包后的文件在哪里
    - 加载器loader
        webpack只能处理js，json文件，其他资源需要借助loader才能解析
    - 插件(plugins)
        插件可以扩展webpack的功能，让webpack具有更强大的功能
    - 模式(mode)
        模式用来指定当前的构建环境是：开发环境，生产环境还是测试环境

1. 配置**入口(entry)** 和 **输出(output)**

```javascript
entry:'../src/main.js',
output:{
    path: undefined,  // 开发模式会开启开发服务器,不需要打包到指定路径
    fileName:'static/js/[name].js', // 输出的文件名
    chunkFileName:'static/js/[name].chunk.js', // 开发中多余的chunk输出，比如通过import动态导入的chunk
    assetModuleFilename: 'static/media/[hash:10][ext][query]' // 输出静态资源目录
},
```
