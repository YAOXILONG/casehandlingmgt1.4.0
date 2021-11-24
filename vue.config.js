/*
 * @Description: 
 * @Version: 1.3
 * @Autor: jinxiaoxu
 * @Date: 2021-05-10 19:33:23
 * @LastEditors: jinxiaoxu
 * @LastEditTime: 2021-05-14 16:08:51
 */
const webpack = require('webpack')
const path = require('path');
const getEntries = require('./bin/entries').getEntries
const proxy = require('./bin/proxy')
const entries = getEntries()
module.exports = {
  pages: entries,
  publicPath: `/${process.env.VUE_APP_CONTEXT}`,
  assetsDir: process.env.VUE_APP_ASSETS,
  runtimeCompiler: true,
  parallel: require('os').cpus().length > 1,
  // productionSourceMap: false,
  // 默认babel-loader会忽略node_modules中的文件
  // 但是dolphin-plugin-tools用了es6的语法, 配置对其显示转译
  // 配合babel sourceType: 'unambiguous'来使用 https://github.com/babel/babel/issues/9187,
  transpileDependencies: [
    'dolphin-plugin-tools',
    /@hui-pro/,
    'hui',
    'client-container'
  ],
  configureWebpack: {
    plugins: [
      new webpack.DllReferencePlugin({
        context: process.cwd(),
        manifest: require('./public/vendor/vendor-manifest.json')
      })
    ]
  },
  chainWebpack: config => {
    config.module.rule('fonts').use('url-loader').loader('url-loader').tap(options => {
      options.limit = 81920
      return options
    })
    config.resolve.alias.set('./vue-cli-plugin-dolphin-theme/libs/rules.js', path.resolve(__dirname, 'src/assets/rules.js'))

  },
  // 用于开发环境下与后端联调
  // 如有需要, 还可以配合easy-proxy进行使用
  devServer: {
    open: true, // 配置自动启动浏览器
    proxy: {
      '/mock/*': {
        target: 'http://localhost:9396',
        pathRewrite: {
          [`/mock/${process.env.VUE_APP_CONTEXT}`]: ''
        }
      },
      ...proxy
    }
  }
}
