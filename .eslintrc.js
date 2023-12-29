module.exports = {
    // 继承Eslint官方规则
    // extends: ['eslint:recommended'],

    // 因为搭建的是react项目，这里继承react官方的价差规则
    extends: ['react-app'],
    parserOptions: {
        babelOptions: {
            preset: [
                // 解决页面报错的问题
                ['babel-preset-react-app', false]
                ['babel-preset-react-app/prod']
            ]
        }
    },
    // env: {
    //     node: true, //启用node中全局变量
    //     browser: true, //启用浏览器中全局变量
    // },
    // parserOptions: {
    //     ecmaVersion: 6,
    //     sourceType: 'module',
    // },
    rules: {
        'no-unused-vars': 1,
        'no-var': 2, // 不能使用var定义变量
    }
};