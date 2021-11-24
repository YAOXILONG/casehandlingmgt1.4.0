import withAxios from './axios/withAxios'

import { commonConfig } from './common'

export const serverConfig = {
  ...commonConfig,
  // 获取民警列表
  'getAccessPoliceInfoList': {
    url: '/police/getAccessPoliceInfoList.do',
    method: 'get'
  },
  // 获取民警详情
  'getAccessPoliceInfo': {
    url: '/police/getAccessPoliceInfo.do',
    method: 'get'
  },
  // 保存或编辑民警信息
  'saveOrUpdatePoliceInfo': {
    url: '/police/saveOrUpdatePoliceInfo.do',
    method: 'post'
  },
  // 删除民警信息
  'deletePoliceInfo': {
    url: '/police/deletePoliceInfo.do',
    method: 'post'
  },
  // 民警卡片绑定解绑
  'updatePoliceBindCard': {
    url: '/police/updatePoliceBindCard.do',
    method: 'post'
  },
  // 民警出区
  'policeLeaveInfo': {
    url: '/police/policeLeaveInfo.do',
    method: 'post'
  },
  // 获取已绑定标签
  'getUsedBandsList': {
    url: '/police/getUsedBandsList.do',
    method: 'get'
  },
  queryPagePersons: {
    url: '/common/queryPagePersons.do',
    method: 'get'
  }
}
export default withAxios(serverConfig)
