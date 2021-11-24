import withAxios from './axios/withAxios'

import { commonConfig } from './common'

export const serverConfig = {
  ...commonConfig,
  // 获取办案区
  'findArea': {
    url: '/ui/localinterrogation/findArea.do',
    method: 'get'
  },
  // 查询办案区的房间
  'pageRoom': {
    url: '/ui/localinterrogation/pageRoom.do',
    method: 'get'
  },
  // 查询房间视频预览信息
  'previewByroomIndexCode': {
    url: '/ui/localinterrogation/preview/{roomIndexCode}.do',
    method: 'get'
  },
  // 分离不分离
  'separateConfig': {
    url: '/ui/localinterrogation/separateConfig.do',
    method: 'get'
  },
  'getInterrogationInfoByindexCode': {
    url: '/ui/localinterrogation/interrogation/info/{indexCode}.do',
    method: 'get'
  },
  'findAllCase': {
    url: '/ui/localinterrogation/case/findAll.do',
    method: 'get'
  },
  'findAllPage': {
    url: '/ui/localinterrogation/case/findAllPage.do',
    method: 'get'
  },
  'finaAllSuspect': {
    url: '/ui/localinterrogation/suspect/findAll.do',
    method: 'get'
  },
  'getDept': {
    url: '/ui/localinterrogation/dept/tree.do',
    method: 'get'
  },
  'getAllPerson': {
    url: '/ui/localinterrogation/person/tree.do',
    method: 'get'
  },
  // 添加案件
  'saveCase': {
    url: '/ui/localinterrogation/case/save.do',
    method: 'post'
  },
  // 添加对象
  'saveSuspect': {
    url: '/ui/localinterrogation/suspect/save.do',
    method: 'post'
  },
  // 获取默认案号
  'loadDefaultCaseNo': {
    url: '/ui/localinterrogation/case/loadDefaultCaseNo.do',
    method: 'get'
  },
  // 编辑 审讯信息
  'updateInterrogationByIndexCode': {
    url: '/ui/localinterrogation/interrogation/update/{indexCode}.do',
    method: 'post'
  },
  // 查询打印刻录一体机信息
  'findAccessService': {
    url: '/ui/localinterrogation/burn/findAccessService.do',
    method: 'get'
  },
  // 查询打印刻录一体机信息
  'findAllAccessService': {
    url: '/ui/localinterrogation/burn/findAllAccessService.do',
    method: 'get'
  },
  // 默认封面
  'loadDefaultDiskCover': {
    url: '/ui/localinterrogation/diskCover/loadDefault.do',
    method: 'get'
  },
  // 获取封面列表
  'getDiskCoverList': {
    url: '/ui/localinterrogation/diskCover/page.do',
    method: 'get'
  },
  // 开始审讯
  'startInterrogation': {
    url: '/ui/localinterrogation/interrogation/start/{roomIndexCode}.do',
    method: 'post'
  },
  // 结束审讯
  'stopInterrogation': {
    url: '/ui/localinterrogation/interrogation/stop/{indexCode}-{compel}.do',
    method: 'get'
  },
  // 获取审讯对象的审讯次数
  'getCount': {
    url: '/ui/localinterrogation/interrogation/count/{suspectCode}.do',
    method: 'get'
  },
  // 获取房间刻录类型
  'getBurnType': {
    url: '/ui/localinterrogation/burn/burnType/{roomIndexCode}.do',
    method: 'get'
  },
  // 获取启动工具参数
  'getToolStartParam': {
    url: '/ui/localinterrogation/toolStartParam/note/{interrogationCode}.do',
    method: 'get'
  },
  'loadInterrogatorLimit': {
    url: '/ui/localinterrogation/config/loadInterrogatorLimit.do',
    method: 'get'
  },
  'getBurnProgressList': {
    url: '/ui/localinterrogation/burn/progress/list/{indexCodes}.do',
    method: 'get'
  },
  'getDict': {
    url: '/common/inqDict.do',
    method: 'get'
  },
  // 已分配信息
  'getAllocated': {
    url: '/ui/localinterrogation/room/info/{roomIndexCode}.do',
    method: 'get'
  },
  getWebSocketRoomInterrogation:{
    url:'ui/localinterrogation/getRoomInterrogation.do',
    method:'get'
  },
  // 获取慧眼笔录配置
  'getBiluConfig': {
    url: '/ui/localinterrogation/note/getBiluConfig.do',
    method: 'get'
  },
  // 下载笔录文件
  'downloadBilu': {
    url: '/ui/localinterrogation/note/downloadBilu.do',
    method: 'get'
  },
}
export default withAxios(serverConfig)
