/*
 * @Description: 
 * @Version: 1.3
 * @Autor: jinxiaoxu
 * @Date: 2021-01-12 10:17:06
 * @LastEditors: jinxiaoxu
 * @LastEditTime: 2021-01-12 10:54:45
 */
const xlsx = require('node-xlsx')
const fs = require('fs')
const list = xlsx.parse('src/i18n/lang.xlsx')

const langs = [...list[0].data[0]]
langs.splice(0, 1)

langs.forEach((lang, i) => {
  const result = {}

  list.forEach((sheet) => {
    const _sheetData = [...sheet.data]
    _sheetData.splice(0, 1)
    // console.log(123, _sheetData)
    _sheetData.forEach((v) => {
      result[v[0]] = v[i + 1]
    })
  })
  fs.mkdir(`public/static/i18n/${lang}`, (err) => {

    if (!err) {
      writeFile(`public/static/i18n/${lang}/index.json`, JSON.stringify(result))
    }
  })
})

function writeFile (fileName, data) {
  fs.writeFile(fileName, data, 'utf-8', complete)

  function complete (err) {
    if (!err) {
      console.log('文件生成成功')
    }
  }
}
