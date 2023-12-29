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

[代码示例](https://github.com/YQingFeng/react-webpack/blob/main/config/webpack.dev.js#L2-L8)

## 二. 配置**入口(entry)** 和 **输出(output)**

```javascript
entry:'../src/main.js',
output:{
    path: undefined,  // 开发模式会开启开发服务器,不需要打包到指定路径
    fileName:'static/js/[name].js', // 输出的文件名
    chunkFileName:'static/js/[name].chunk.js', // 开发中多余的chunk输出，比如通过import动态导入的chunk
    assetModuleFilename: 'static/media/[hash:10][ext][query]' // 输出静态资源目录
},
```

[代码示例](https://github.com/YQingFeng/react-webpack/blob/main/config/webpack.dev.js#L2-L8)

## 配置 loader 处理资源(js,样式文件，静态资源文件)

### 1. 处理 css 资源

```javascript
{
    test: /\.css$/, //test检测文件类型
    use: [
        'style-loader', // 将编译好的css样式通过创建style标签的方式添加到html文件中
        'css-loader', // 将css资源编译成commonJS模块的js中
        {
            loader:'postcss-loader', // 解决样式兼容问题，需要兼容的程度看package.json中browserslist的配置
            options:{
                postcssOptions:{
                    plugin:['postcss-preset-env'] // 通过该插件能解决大多数样式兼容问题
                }
            }
        }
    ]
}

// 在package.json文件中配置postcss-loader处理样式兼容的程度
"browserslist": [
    "last 2 version", // 兼容最近的2个版本
    "> 1%", // 覆盖99%的浏览器
    "not dead" // 排除弃用的版本
]
```

### 2. 处理其他样式预处理文件(less,sass,scss,stylus)

```javascript
// 处理less文件
{
    test: /\.less$/, //test检测文件类型
    use: [
        'style-loader', // 将编译好的css样式通过创建style标签的方式添加到html文件中
        'css-loader', // 将css资源编译成commonJS模块的js中
        {
            loader:'postcss-loader', // 解决样式兼容问题，需要兼容的程度看package.json中browserslist的配置
            options:{
                postcssOptions:{
                    plugin:['postcss-preset-env'] // 通过该插件能解决大多数样式兼容问题
                }
            }
        },
        'less-loader' // 将less文件编译成css文件
    ]
},
// 处理sass文件
{
    test: /\.s[ac]ss$/, //test检测文件类型
    use: [
        'style-loader', // 将编译好的css样式通过创建style标签的方式添加到html文件中
        'css-loader', // 将css资源编译成commonJS模块的js中
        {
            loader:'postcss-loader', // 解决样式兼容问题，需要兼容的程度看package.json中browserslist的配置
            options:{
                postcssOptions:{
                    plugin:['postcss-preset-env'] // 通过该插件能解决大多数样式兼容问题
                }
            }
        },
        'sass-loader' // 将sass文件编译成css文件
    ]
},
// 处理stylus文件
{
    test: /\.styl$/, //test检测文件类型
    use: [
        'style-loader', // 将编译好的css样式通过创建style标签的方式添加到html文件中
        'css-loader', // 将css资源编译成commonJS模块的js中
        {
            loader:'postcss-loader', // 解决样式兼容问题，需要兼容的程度看package.json中browserslist的配置
            options:{
                postcssOptions:{
                    plugin:['postcss-preset-env'] // 通过该插件能解决大多数样式兼容问题
                }
            }
        },
        'stylus-loader' // 将stylus文件编译成css文件
    ]
}
```

### 3.抽离样式 loader，封装到自定义 loader 中

```javascript
const getStyleLoaders = (pre) => {
  return [
    "style-loader", // 将编译好的css样式通过创建style标签的方式添加到html文件中
    "css-loader", // 将css资源编译成commonJS模块的js中
    {
      loader: "postcss-loader", // 解决样式兼容问题，需要兼容的程度看package.json中browserslist的配置
      options: {
        postcssOptions: {
          plugin: ["postcss-preset-env"], // 通过该插件能解决大多数样式兼容问题
        },
      },
    },
    pre,
  ].filter(Boolean);
};
```
