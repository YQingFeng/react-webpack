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

## 配置 loader 和 plugin 处理资源(js,样式文件，静态资源文件)

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

### 4. 处理图片资源

```javascript
// 处理图片资源
// file-loader 将文件发送到输出目录,并且其路径将被注入到 bundle 中
// url-loader 当文件小于设定的limit时可以返回一个Data Url内联到 bundle 中
// 这两个loader已经内置到webpack,我们只需要激活就行
{
    test: /\.(jpe?g|png|gif|webp|svg)$/, //test检测文件类型
    type: 'asset',
    parser: {
        // 将资源大小小于该数值的图片转base64，内联到bundle中
        // 优点：减少请求数量
        // 缺点：体积会更大
        dataUrlCondition: {
            maxSize: 10 * 1024
        },
        generator: {
            // 输出图片名称
            // hash:10 图片名称hash取前10位
            filename: 'static/images/[hash:10][ext][query]'
        }
    }
},
```

### 5. 处理其他静态资源

```javascript
// 处理字体图标文件
// 处理其他资源，将资源直接输出到对应的文件
{
    test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
    type: 'asset/resource',  // asset可转base64,asset/resource直接输出文件到指定目录
    generator: {
        // 输出图片名称
        // hash:10 图片名称hash取前10位
        filename: 'static/media/[hash:10][ext][query]'
    }
},
```

### 6. 处理 js 文件

6.1 使用 eslint 对代码进行检查

```javascript
[
  // 插件可以扩展webpack的功能，让webpack具有更强大的功能
  new EslintWebpackPlugin({
    context: path.resolve(__dirname, "../src"), // 检测哪些文件
    exclude: "node_module", // 不检查node_module包文件
    cache: true, // 开启缓存
    cacheLocation: path.resolve(
      __dirname,
      "../node_modules/.cache/ceslintcache"
    ), // 缓存文件的存放位置
  }),
],
  // 根目录下生成.eslintrc文件，配置检查规则
  (module.exports = {
    // 因为搭建的是react项目，这里继承react官方的价差规则
    extends: ["react-app"],
    parserOptions: {
      babelOptions: {
        preset: [
          // 解决页面报错的问题
          ["babel-preset-react-app", false]，
          ["babel-preset-react-app/prod"],
        ],
      },
    },
  });
```

6.1 使用 babel-loader 对代码编译

```javascript
{
    test: /\.jsx?$/,
    include: path.resolve(__dirname, '..src'),
    loader: 'babel-loader',
    options: {
        cacheDirectory: true,   // 开启babel缓存
        cacheCompression: false,  // 关闭缓存文件压缩
    }
}
```

### 7. 处理 html 文件

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 使用HtmlWebpackPlugin插件处理html文件，将html模版文件copy到dist目录
new HtmlWebpackPlugin({
  template: path.resolve(__dirname, "../public/index.html"),
});
```

### 8. 开发模式开启开发服务器

```javascript
{
    devServer: {
        host: 'localhost',
        port: 3000,
        open: true,
        hot: true,
    }
}
```

## 项目优化

### 1. 提升开发体验 - 当代码报错时追踪到源码位置

```javascript
// 在webpack.config.js中配置devtool: 'cheap-module-source-map'
// 开发模式推荐cheap-module-source-map，优点：打包编译速度快，只包含行映射，缺点：没有列映射
// 生产模式推荐source-map，优点：映射准确，提供源代码文件和行数，打包编译速度更慢
```

### 2. 提升打包构建速度 - 激活 js 的 HotModuleReplacement(HMR)热模块替换

```javascript
// style-loader中已经配置HMR
// 如何开启js HMR
// 1. npm install -D @pmmmwh/react-refresh-webpack-plugin react-refresh
// 2. 设置devServer.hot为true
// 3. 使用插件
{
    test: /\.[jt]sx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
        },
      },
    ],
},
// 4. 在plugin激活ReactRefreshWebpackPlugin插件
new ReactRefreshWebpackPlugin()
```
