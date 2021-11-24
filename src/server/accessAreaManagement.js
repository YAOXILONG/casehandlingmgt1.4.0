import withAxios from './axios/withAxios'

import { commonConfig } from './common'

export const serverConfig = {
  ...commonConfig,
  // 获取办案区概况信息
  'findLocalInterrogationRoomList': {
    url: '/allocation/findLocalInterrogationRoomList.do',
    method: 'get'
  },
  'findStatisticsInfo': {
    url: '/allocation/findStatisticsInfo.do',
    method: 'get'
  },
  // 获取分配室弹框数据
  'findAllocationSuspectInfoList': {
    url: '/allocation/findAllocationSuspectInfoList.do',
    method: 'get'
  },
  // 数据字典（性别和人员类型）
  'getDictionaries': {
    url: '/common/inqDict.do',
    method: 'get'
  },
  // 分配审讯室
  'allocationRoom': {
    url: '/allocation/allocationRoom.do',
    method: 'post'
  },
  // 取消分配室
  'cancelAllocationRoom': {
    url: '/allocation/cancelAllocationRoom.do',
    method: 'post'
  }
}
export default withAxios(serverConfig)
