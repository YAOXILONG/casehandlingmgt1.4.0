import withAxios from './axios/withAxios'

import {
  commonConfig
} from './common'

export const serverConfig = {
  ...commonConfig,
  // 查询办案区流程配置
  'getCaseAreaProcessConfig': {
    url: 'accompany/areaProcess/config/getAreaProcessConfig.do',
    method: 'get'
  },
  // 保存办案区流程配置
  'saveBusinessInfo': {
    url: 'accompany/areaProcess/config/saveAreaProcessConfig.do',
    method: 'post'
  }
}
export default withAxios(serverConfig)
