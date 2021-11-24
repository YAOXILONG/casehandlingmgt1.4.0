import withAxios from './axios/withAxios'

import { commonConfig } from './common'

export const serverConfig = {
  ...commonConfig,
  // 分页查询警情记录
  'getPoliceSituationInfoList': {
    url: '/policeSituation/getPoliceSituationInfoList.do',
    method: 'post'
  },
  // 根据警情编号查询警情记录
  'findByPoliceSituationNo': {
    url: '/policeSituation/findByPoliceSituationNo.do',
    method: 'get'
  },
  // 保存警情记录
  'savePoliceSituation': {
    url: '/policeSituation/savePoliceSituation.do',
    method: 'post'
  },
  // 删除警情记录
  'delPoliceSituation': {
    url: '/policeSituation/delPoliceSituation.do ',
    method: 'post'
  },
  // 获取警情编号
  'loadDefaultPoliceSituationNo': {
    url: '/policeSituation/loadDefaultPoliceSituationNo.do ',
    method: 'get'
  },
  // 获取警员、部门信息
  'queryPagePersons': {
    url: '/common/queryPagePersons.do',
    method: 'get'
  },
  // 是否管理员权限显示删除操作
  'isAdmin': {
    url: '/common/checkIsAdmin.do',
    method: 'get'
  },
}
export default withAxios(serverConfig)
