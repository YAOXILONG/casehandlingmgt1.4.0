import withAxios from './axios/withAxios'

import {
  commonConfig
} from './common'

export const serverConfig = {
  ...commonConfig,
  // 分页查询办案区入区申请记录
  'getStandingBookPage': {
    url: '/inspection/getStandingBookPage.do',
    method: 'get'
  },
  // 根据办案区编码获取办案区审批配置信息
  'getInspectionInfoList': {
    url: '/inspection/getInspectionInfoList.do',
    method: 'get'
  },

}
export default withAxios(serverConfig)
