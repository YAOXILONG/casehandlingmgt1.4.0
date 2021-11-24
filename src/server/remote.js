import withAxios from './axios/withAxios'

import {commonConfig} from './common'

export const serverConfig = {
  ...commonConfig,
  // 获取办案区
  'findArea': {
    url: '/ui/remoteinterrogation/findArea.do',
    method: 'get'
  },
  // 查询办案区的房间
  'pageRoom': {
    url: '/ui/remoteinterrogation/pageRoom.do',
    method: 'get'
  },
  // 查询房间视频预览信息
  'previewByroomIndexCode': {
    url: '/ui/remoteinterrogation/preview/{roomIndexCode}.do',
    method: 'get'
  },
  // 分离不分离
  'separateConfig': {
    url: '/ui/remoteinterrogation/separateConfig.do',
    method: 'get'
  },
  'getInterrogationInfoByindexCode': {
    url: '/ui/remoteinterrogation/interrogation/info/{indexCode}.do',
    method: 'get'
  },
  'findAllCase': {
    url: '/ui/remoteinterrogation/case/findAll.do',
    method: 'get'
  },
  'finaAllSuspect': {
    url: '/ui/remoteinterrogation/suspect/findAll.do',
    method: 'get'
  },
  'getDict': {
    url: '/ui/common/dict/{codes}.do',
    method: 'get'
  },
  'getDept': {
    url: '/ui/remoteinterrogation/dept/tree.do',
    method: 'get'
  },
  'getAllPerson': {
    url: '/ui/remoteinterrogation/person/tree.do',
    method: 'get'
  },
  // 添加案件
  'saveCase': {
    url: '/ui/remoteinterrogation/case/save.do',
    method: 'post'
  },
  // 添加对象
  'saveSuspect': {
    url: '/ui/remoteinterrogation/suspect/save.do',
    method: 'post'
  },
  // 获取默认案号
  'loadDefaultCaseNo': {
    url: '/ui/remoteinterrogation/case/loadDefaultCaseNo.do',
    method: 'get'
  },
  // 编辑 审讯信息
  'updateInterrogationByIndexCode': {
    url: '/ui/remoteinterrogation/interrogation/update/{indexCode}.do',
    method: 'post'
  },
  // 查询打印刻录一体机信息
  'findAccessService': {
    url: '/ui/remoteinterrogation/burn/findAccessService.do',
    method: 'get'
  },
  // 默认封面
  'loadDefaultDiskCover': {
    url: '/ui/remoteinterrogation/diskCover/loadDefault.do',
    method: 'get'
  },
  // 获取封面列表
  'getDiskCoverList': {
    url: '/ui/remoteinterrogation/diskCover/page.do',
    method: 'get'
  },
  // 开始审讯
  'startInterrogation': {
    url: '/ui/remoteinterrogation/interrogation/start/{roomIndexCode}.do',
    method: 'post'
  },
  // 结束审讯
  'stopInterrogation': {
    url: '/ui/remoteinterrogation/interrogation/stop/{indexCode}-{compel}.do',
    method: 'get'
  },
  // 获取远程房间
  'getRemoteRoomList': {
    url: '/ui/remoteinterrogation/auth/remoteRoom.do',
    method: 'get'
  },
  // 链接房间
  'linkroom': {
    url: '/ui/remoteinterrogation/{localRoomIndexCode}/conference/{remoteRoomIndexCode}/create.do',
    method: 'post'
  },
  'resetLink': {
    url: '/ui/remoteinterrogation/{localRoomIndexCode}/conference/restore.do',
    method: 'post'
  },
  'finishLink': {
    url: '/ui/remoteinterrogation/{localRoomIndexCode}/conference/finish.do',
    method: 'post'
  },
  // 获取审讯对象的审讯次数
  'getCount': {
    url: '/ui/remoteinterrogation/interrogation/count/{suspectCode}.do',
    method: 'get'
  },
  // 获取启动工具参数
  'getToolStartParam': {
    url: '/ui/remoteinterrogation/toolStartParam/note/{interrogationCode}.do',
    method: 'get'
  },
  // 获取房间刻录类型
  'getBurnType': {
    url: '/ui/remoteinterrogation/burn/burnType/{roomIndexCode}.do',
    method: 'get'
  },
  'loadInterrogatorLimit': {
    url: '/ui/remoteinterrogation/config/loadInterrogatorLimit.do',
    method: 'get'
  },
  'finishForce': {
    url: '/ui/remoteinterrogation/{localRoomIndexCode}/conference/finishForce.do',
    method: 'post'
  },
  'getBurnProgressList': {
    url: '/ui/remoteinterrogation/burn/progress/list/{indexCodes}.do',
    method: 'get'
  }
}
export default withAxios(serverConfig)
