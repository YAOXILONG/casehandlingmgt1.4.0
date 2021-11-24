import withAxios from './axios/withAxios'

import { commonConfig } from './common'

export const serverConfig = {
  ...commonConfig,
  // 保存或修改采集信息
  'saveOrUpdateCollectedInfo': {
    url: '/collected/saveOrUpdateCollectedInfo.do',
    method: 'post'
  },
  // 获取采集信息
  'getCollectedVo': {
    url: '/collected/getCollectedVo.do',
    method: 'get'
  }
}
export default withAxios(serverConfig)
