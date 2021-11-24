import withAxios from './axios/withAxios'

import { commonConfig } from './common'

export const serverConfig = {
  ...commonConfig,
  // 获取预约列表
  'findAppointInfoPage': {
    url: '/appoint/findAppointInfoPage.do',
    method: 'get'
  },
  // 保存预约信息
  'saveOrUpdateAppointInfo': {
    url: '/appoint/saveOrUpdateAppointInfo.do',
    method: 'post'
  },
  // 删除预约信息
  'delAppointInfo': {
    url: '/appoint/delAppointInfo.do',
    method: 'post'
  },
  // 获取预约详情
  'findAppointInfo': {
    url: '/appoint/findAppointInfo.do',
    method: 'get'
  }
}
export default withAxios(serverConfig)
