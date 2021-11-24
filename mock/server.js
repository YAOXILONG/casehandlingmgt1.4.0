const jsonServer = require('json-server')
const server = jsonServer.create()

// Support middleware
const middleware = jsonServer.defaults()
server.use(middleware)

// Add this before server.use(router)
server.use(jsonServer.rewriter({
  '/csrfToken.do*': '/csrfTokendo',
  '/currLanguage.do*': '/currLanguagedo',
  '/multiLanguage.do*': '/multiLanguagedo',
  '/ui/common/skinInfo.do': '/skinInfo',
  '/ui/videoBackupChannelConfig/getDetainTree.do': '/getTree',
  '/ui/videoBackupChannelConfig/pageVideoBackChannelConfig.do*': '/getList',
  '/ui/videoBackupChannelConfig/getRoomType.do': '/getRoomType',
  '/ui/videoBackupChannelConfig/deleteVideBackChannelConfig.do': '/doneSuccess',
  '/ui/videoBackupChannelConfig/saveVideoBackChannelConfig.do': '/doneSuccess',
  '/ui/videoBackupChannelConfig/copyVideobackChannelConfig.do': '/doneSuccess',
  '/ui/videoBackupChannelConfig/findRoomChannelConfig.do*': '/findRoomChannelConfig',
  '/ui/detainConfigDocument/tree.do': '/docTree',
  '/ui/detainConfigDocument/*/load.do*': '/loadDocTree',
  '/ui/detainConfigDocument/*/deletion.do*': '/deletion',
  '/ui/detainConfigDocument/getDefaultCode.do*': '/getDefaultCode',
  '/ui/detainConfigDocument/checkCodeExist.do*': '/checkCodeExist',
  '/ui/detainConfigDocument/save.do': '/save',
  '/ui/detainConfigDocument/modify.do': '/modify'

}))

// 支持加载多个db文件
// const _ = require('underscore');
const path = require('path')
const fs = require('fs')
const mockDir = path.join(__dirname, 'data')
const base = {}
const files = fs.readdirSync(mockDir)
files.forEach((file) => {
  Object.assign(base, require(path.resolve(mockDir, file)))
})
const _base = Object.assign({}, base)
const router = jsonServer.router(base)

server.use(router)

// 返回自定义格式数据
router.render = (req, res) => {
  let data = _base[req.url.replace('/', '')]
  res.jsonp(data)
}

server.listen(9396, () => {
  console.log('JSON Server is running on 9396')
})
