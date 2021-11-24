/*
 * @Description: 
 * @Version: 1.3
 * @Autor: jinxiaoxu
 * @Date: 2021-01-12 10:17:06
 * @LastEditors: jinxiaoxu
 * @LastEditTime: 2021-01-12 11:00:08
 */
const path = require('path')
const glob = require('glob')

const getFile = (globPath, pathDir) => {
  const files = glob.sync(globPath)
  let entries = {}

  for (let file of files) {
    let entry = file
    let dirname = path.dirname(entry)
    let extname = path.extname(entry)
    let basename = path.basename(entry, extname)
    let pathname = path.join(dirname, basename)
    pathname = pathDir ? pathname.replace(pathDir, '') : pathname
    entries[pathname] = entry
  }
  return entries
}
const htmls = getFile('./src/views/**/*.html', 'src\\views\\')

const htmlsKeys = Object.keys(htmls)
if (!htmlsKeys.length) {
  console.log('你需要在/src/view下创建工程入口')
  process.exit(1)
}

module.exports.getEntries = () => {
  console.log('context: ' + process.env.VUE_APP_CONTEXT)
  console.log('buildList:')
  const entries = {}
  console.log(htmls, '===============')
  for (let key in htmls) {
    let _key = key.split('\\')[0]
    console.log('>>>>> ' + _key)
    entries[_key] = {
      // page 的入口
      entry: htmls[key].replace('.html', '.js'),
      // 模板来源
      template: path.resolve(htmls[key]),
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      // title: 'Index Page',
      javascript: true,
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', _key]
    }
    // 在 dist/index.html 的输出
    entries[_key].filename = _key + '.html'
  }
  // console.log('entriesentriesentries', entries)
  return entries
}
