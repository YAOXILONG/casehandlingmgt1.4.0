import withAxios from './axios/withAxios'

import { commonConfig } from './common'

export const serverConfig = {
  ...commonConfig,
  // 获取人身检查信息
  'getBodyCheckVo': {
    url: '/body/getBodyCheckVo.do',
    method: 'get'
  },
  // 保存人身检查记录
  'saveOrUpdateBodyCheckInfo': {
    url: '/body/saveOrUpdateBodyCheckInfo.do',
    method: 'post'
  }
}
export default withAxios(serverConfig)
