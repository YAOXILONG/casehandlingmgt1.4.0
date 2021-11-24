import withAxios from './axios/withAxios'

import { commonConfig } from './common'

export const serverConfig = {
  ...commonConfig,
  // 获取报警列表
  'findAlarmInfoPage': {
    url: '/alarmInfo/findAlarmInfoPage.do',
    method: 'post'
  }
}
export default withAxios(serverConfig)
