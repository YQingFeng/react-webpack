const path = require('path')
const EslintWebpackPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin'); 生产模式去掉HMR功能
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require('terser-webpack-plugin')

const getStyleLoaders = (pre) => {
    return [
        MiniCssExtractPlugin.loader, // 将编译好的css样式通过创建style标签的方式添加到html文件中
        'css-loader', // 将css资源编译成commonJS模块的js中
        {
            loader:'postcss-loader', // 解决样式兼容问题，需要兼容的程度看package.json中browserslist的配置
            options:{
                postcssOptions:{
                    plugin:['postcss-preset-env'] // 通过该插件能解决大多数样式兼容问题
                }
            }
        },
        pre
    ].filter(Boolean)
}
module.exports = {
    entry: './src/main.js', // 指定webpack从哪里开始打包
    output: { // 指定webpack打包后的文件在哪里
        path: path.resolve(__dirname, ".../dist"),  // 开发模式会开启开发服务器,不需要打包到指定路径
        filename: 'static/js/[name].[contenthash:10].js', // 输出的文件名
        chunkFilename: 'static/js/[name].[contenthash:10].chunk.js', // 开发中多余的chunk输出，比如通过import动态导入的chunk
        assetModuleFilename: 'static/media/[hash:10][ext][query]', // 输出静态资源目录
        clean: true,
    },
    module: { // webpack只能处理js，json文件，其他资源需要借助loader才能解析
        rules: [
            // 处理css文件
            {
                test: /\.css$/, //test检测文件类型
                use: getStyleLoaders()
            },
            // 处理less文件
            {
                test: /\.less$/, //test检测文件类型
                use: getStyleLoaders('less-loader')
            },
            // 处理sass文件
            {
                test: /\.s[ac]ss$/, //test检测文件类型
                use: getStyleLoaders('sass-loader')
            },
            // 处理stylus文件
            {
                test: /\.styl$/, //test检测文件类型
                use: getStyleLoaders('stylus-loader')
            },

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
            // 处理js文件
            // 处理方式：
                // 1. 配置Eslint对代码进行检查
                // 2. 使用babel对代码进行转换
            {
                test: /\.(js|jsx)$/,
                include: path.resolve(__dirname, '../src'),
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,   // 开启babel缓存
                    cacheCompression: false,  // 关闭缓存文件压缩
                    // plugins: [require.resolve('react-refresh/babel')], 生产模式去掉HMR功能
                }
            },
        ]
    },
    plugins: [ // 插件可以扩展webpack的功能，让webpack具有更强大的功能
        new EslintWebpackPlugin({
            context: path.resolve(__dirname, '../src'), // 检测哪些文件
            // include: path.resolve(__dirname, '../src'), // 检测哪些文件
            exclude: 'node_module', // 不检查node_module包文件
            cache: true, // 开启缓存
            cacheLocation: path.resolve(__dirname, '../node_modules/.cache/ceslintcache') // 缓存文件的存放位置
        }),
        // 处理html文件，将html模版文件copy到dist目录
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html')
        }),
        // 激活ReactRefreshWebpackPlugin插件，js开启HMR
        // new ReactRefreshWebpackPlugin(), 生产模式去掉HMR功能
        // 提取css文件，并输出到对应目录
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:10].css',
            chunkFilename: 'static/css/[name].[contenthash:10]..chunk.css',
        })

    ],
    mode: 'production', // 模式用来指定当前的构建环境是：开发环境，生产环境还是测试环境
    devtool: 'cheap-module-source-map', // 开发过程中当代码报错时追踪到打包编译后的文件，而不是源代码，添加devtool可追踪到报错在源码的位置
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: {
            name: entrypoint => `runtime~${entrypoint.name}.js`
        },
        minimizer: [
            // CssMinimizerPlugin压缩生成的css文件
            new CssMinimizerPlugin(),
            // 压缩js代码
            new TerserWebpackPlugin()
        ]
    },
    // webpack解析模块加载选项
    resolve: {
        // 自动补全文件扩展名
        extensions: ['.jsx', '.js', '.json']
    },
}