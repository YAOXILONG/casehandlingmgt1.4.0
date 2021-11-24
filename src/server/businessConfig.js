import withAxios from './axios/withAxios'

import { commonConfig } from './common'

export const serverConfig = {
  ...commonConfig,
  // 查询办案区业务配置
  'findBusinessInfoList': {
    url: '/business/findBusinessInfoList.do',
    method: 'get'
  },
  // 保存业务配置
  'saveBusinessInfo': {
    url: '/business/saveBusinessInfo.do',
    method: 'post'
  },
  // 查询办案区可关联区域
  'getPlaceAreas': {
    url: '/common/getPlaceAreas.do',
    method: 'get'
  }
}
export default withAxios(serverConfig)
