import withAxios from './axios/withAxios'

import { commonConfig } from './common'

export const serverConfig = {
  ...commonConfig,
  // 查询LED状态配置
  'getLedConfig': {
    url: '/ledConfig/getLedConfig.do',
    method: 'get'
  },
  // 保存LED状态配置
  'saveLedConfig': {
    url: '/ledConfig/saveLedConfig.do',
    method: 'post'
  }
}
export default withAxios(serverConfig)
