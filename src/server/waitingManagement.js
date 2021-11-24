/* eslint-disable no-tabs */
import withAxios from './axios/withAxios'
import { commonConfig } from './common'

const serverConfig = {
  ...commonConfig,
  'findWaitRoomInfo': {
    url: '/wait/findWaitRoomInfo.do',
    method: 'get'
  },
  // 1.8.1	候问室列表展示
  'findWaitRoomInfoList': {
    url: '/wait/findWaitRoomInfoList.do',
    method: 'get'
  },
  // 1.8.2	查询未分配到候问室的在区登记人员
  'findNotAssignedWaitRoomRegisterInfoList': {
    url: '/register/findNotAssignedWaitRoomRegisterInfoList.do',
    method: 'get'
  },
  // 1.8.3	人员分配至候问室
  'assignedWaitRoom': {
    url: '/wait/assignedWaitRoom.do',
    method: 'post'
  },
  // 1.8.4候问室已分配的人员列表
  'findInWaitRoomRegisterInfoList': {
    url: '/register/findInWaitRoomRegisterInfoList.do',
    method: 'get'
  },
  // 1.8.5候问室人员离开
  'leaveWaitRoom': {
    url: '/wait/leaveWaitRoom.do',
    method: 'post'
  },
  'checkAssignedWaitRoom': {
    url: '/wait/checkAssignedWaitRoom.do',
    method: 'post'
  },
  'findWaitRoomCameraInfo': {
    url: '/wait/findWaitRoomCameraInfo.do',
    method: 'get'
  },
  'assignedWaitRoomByLocationCode': {
    url: '/wait/assignedWaitRoomByLocationCode.do',
    method: 'post'
  }
}
export default withAxios(serverConfig)
