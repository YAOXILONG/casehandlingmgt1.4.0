import withAxios from './axios/withAxios'

import { commonConfig } from './common'

export const serverConfig = {
  ...commonConfig,
  'list': {
    url: '/list',
    method: 'get'
  }
}
export default withAxios(serverConfig)
