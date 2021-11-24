/*
 * @Description: 
 * @Version: 1.3
 * @Autor: jinxiaoxu
 * @Date: 2021-05-12 11:02:08
 * @LastEditors: jinxiaoxu
 * @LastEditTime: 2021-05-13 10:37:53
 */
import withAxios from './axios/withAxios'

import {commonConfig} from './common'

export const serverConfig = {
  ...commonConfig,
  'loadCaseProcessConfig': {
    url: '/accompany/caseProcess/config/loadCaseProcessConfig.do',
    method: 'get'
  },
  'typeEnum': {
    url: '/accompany/caseProcess/config/typeEnum.do',
    method: 'get'
  },
  'saveCaseProcessConfig': {
    url: '/accompany/caseProcess/config/saveCaseProcessConfig.do',
    method: 'post'
  }
}
export default withAxios(serverConfig)
