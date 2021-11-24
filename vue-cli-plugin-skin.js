/**
 * 此文件用来替换node_moudels中的vue-cli-plugin-dolphin-theme模块中的index.js文件
 * 解决 ie 下icon-font在新打开tab页的情况下无法展示
 * 替换后将会将字体包直接打包进css中
 */
const webpack = require('webpack')
// const chalk = require('chalk')
const webpackConfig = require('vue-cli-plugin-dolphin-theme/libs/webpackConfig')
const proc = require('vue-cli-plugin-dolphin-theme/libs/proc')
const fs = require('fs')
const path = require('path')
const utils = require('vue-cli-plugin-dolphin-theme/libs/utils')

module.exports = (api) => {
  api.registerCommand('renderSkin', async (args) => {
    try {
      // 获取主题配置
      const options = await proc.getOptions(api)
      // 验证配置是否合格
      const { themes, widget, outputDir = './public/static/skin' } = await proc.validOptions(options)
      // 获取主题文件夹绝对路径
      const themeDir = path.join(api.getCwd(), outputDir)
      // 如果已经有了皮肤数据，先清空
      fs.access(themeDir, fs.constants.R_OK, async (err) => {
        // 删除原有文件夹
        if (!err) await utils.removeDirSync(themeDir)

        // 基本webpack配置
        const commonWebpackConfig = webpackConfig.getCommonWebpackConfig(api)
        // 循环渲染各主题皮肤
        for (const theme of themes) {
          let configObj = Object.assign({}, commonWebpackConfig, webpackConfig.getThemeWebpackConfig(api, widget, theme, outputDir))
          configObj.module.rules[2].use[0].options.limit = 140000
          webpack(
            // Object.assign({}, commonWebpackConfig, webpackConfig.getThemeWebpackConfig(api, widget, theme, outputDir)),
            configObj,
            (err, stats) => {
              if (err) throw err
              proc.done(stats, theme, widget)
            }
          )
        }
      })
    } catch (error) {
      console.error(error)
    }
  })
}
