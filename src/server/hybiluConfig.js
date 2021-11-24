import withAxios from './axios/withAxios'

import {
  commonConfig
} from './common'

export const serverConfig = {
  ...commonConfig,
  // 保存慧眼笔录配置
  'saveBiluConfig': {
    url: '/ui/localinterrogation/note/saveBiluConfig.do',
    method: 'post'
  },
  // 获取慧眼笔录配置
  'getBiluConfig': {
    url: '/ui/localinterrogation/note/getBiluConfig.do',
    method: 'get'
  }
}
export default withAxios(serverConfig)
