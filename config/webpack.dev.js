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
                test: '/\.css$/', //test检测文件类型
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
        ]
    },
    plugin: [ // 插件可以扩展webpack的功能，让webpack具有更强大的功能

    ],
    mode: 'development' // 模式用来指定当前的构建环境是：开发环境，生产环境还是测试环境
}