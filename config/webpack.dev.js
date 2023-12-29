const getStyleLoaders = (pre) => {
    return [
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
        pre
    ].filter(Boolean)
}
module.exports = {
    entry: '../src/main.js', // 指定webpack从哪里开始打包
    output: { // 指定webpack打包后的文件在哪里
        path: undefined,  // 开发模式会开启开发服务器,不需要打包到指定路径
        fileName: 'static/js/[name].js', // 输出的文件名
        chunkFileName: 'static/js/[name].chunk.js', // 开发中多余的chunk输出，比如通过import动态导入的chunk
        assetModuleFilename: 'static/media/[hash:10][ext][query]' // 输出静态资源目录
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
        ]
    },
    plugin: [ // 插件可以扩展webpack的功能，让webpack具有更强大的功能

    ],
    mode: 'development' // 模式用来指定当前的构建环境是：开发环境，生产环境还是测试环境
}