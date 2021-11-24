import withAxios from './axios/withAxios'

import {
  commonConfig
} from './common'

export const serverConfig = {
  ...commonConfig,
  // 保存审批配置
  'saveApprovalConfig': {
    url: '/apply/saveOrModifyApprovalConfig.do',
    method: 'post'
  },
  // 根据办案区编码获取办案区审批配置信息
  'getApproval': {
    url: '/apply/getApprovalConfig.do',
    method: 'get'
  }
}
export default withAxios(serverConfig)
