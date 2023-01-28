//引入包
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
// webpack中所有的配置信息都应该写在moudule.exports中
module.exports = {
  //入口文件
  entry: "./src/index.ts",
  devtool: 'source-map',
  //指定打包文件所在目录
  output: {
    //指定打包文件的目录
    path: path.resolve(__dirname, 'dist'),
    // 打包后文件的文件名字 
    filename: "bundle.js",
    //每一次都完全删除dist然后重新生成
    clean: true,

    // environment: { 加了这个设置就可以不生成箭头函数
    //   arrowFunction:false
    // }
  },
  // 指定webpack打包时要的模块
  module: {
    // 指定要加载的规则
    rules: [
      //指定ts文件处理
      {
        // test指定的是规则生效的文件
        test: /\.ts$/,
        // 要使用的loader
        use: [
          //配置babel
          {
            // 指定加载器
            loader: "babel-loader",
            // 配置babel
            options: {
              // 指定预定义环境
              presets: [
                [
                  // 指定环境的插件
                  "@babel/preset-env",
                  // 配置信息
                  {
                    // 要兼容的目标浏览器
                    targets: {
                      "firefox": "99",
                      "ie": "10"
                    },
                    // 指定corejs的版本
                    "corejs": "3",
                    //使用corejs的方式"usage"表示按需加载
                    "useBuiltIns": "usage"
                  }
                ]
              ]
            }
          },
          'ts-loader'
        ],
        // 要排除的文件
        exclude: /node_modules/
      },
      //指定less文件处理
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          {
            // 和babel那一块很像 这个就像babel把css变成兼容旧版本的代码
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      browsers: 'last 2 versions'
                    }
                  ]
                ]
              }
            }
          },
          "less-loader"
        ]
      },
    ]
  },
  // devtool: false
  // 如果使用development模式和production有不一样 在development模式下使用devtool也不一样

  // 配置webpack插件
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ],

  resolve: {
    //告诉编译器以ts和js结尾的文件的都可以作为模块被引入
    extensions: ['.ts', '.js']
  }
}