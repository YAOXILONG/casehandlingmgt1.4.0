/*
 * @Description: 
 * @Version: 1.3
 * @Autor: jinxiaoxu
 * @Date: 2021-05-12 15:30:18
 * @LastEditors: jinxiaoxu
 * @LastEditTime: 2021-05-13 14:32:26
 */
import withAxios from './axios/withAxios'

import {commonConfig} from './common'

export const serverConfig = {
  ...commonConfig,
  
  'getDoorAccessConfig': {
    url: '/doorAccessConfig/getDoorAccessConfig.do',
    method: 'get'
  },
  'saveOrUpdateDoorAccessConfig': {
    url: '/doorAccessConfig/saveOrUpdateDoorAccessConfig.do',
    method: 'post'
  }

}
export default withAxios(serverConfig)
