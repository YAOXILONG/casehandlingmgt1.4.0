import withAxios from './axios/withAxios'

import {
  commonConfig
} from './common'

export const serverConfig = {
  ...commonConfig,
  // 分页查询办案区入区申请记录
  'entryApplicaitionSearch': {
    url: '/apply/page/search.do',
    method: 'post'
  },
  // 根据办案区编码获取办案区审批配置信息
  'getApproval': {
    url: '/apply/getApprovalConfig.do',
    method: 'get'
  },
  // 作废入区申请记录
  'cancelEntryApplication': {
    url: '/apply/cancel.do',
    method: 'get'
  },
  // 删除入区申请记录
  'deleteEntryApplication': {
    url: '/apply/delete.do',
    method: 'get'
  },
  // 根据申请记录编码查询入区申请详细信息
  'getEntryApplication': {
    url: '/apply/get.do',
    method: 'get'
  },
  // 编辑入区申请记录
  'updateEntryApplication': {
    url: '/apply/modify/enter.do',
    method: 'post'
  },
  // 新增入区申请记录
  'addEntryApplication': {
    url: '/apply/add/enter.do',
    method: 'post'
  },
  // 查询权限
  'checkFunctionAuth': {
    url: '/common/checkFunctionAuth.do',
    method: 'get'
  },
  // 获取当前登录用户信息
  'loadPersonInfoByUserCode': {
    url: '/common/loadPersonInfoByUserCode.do',
    method: 'get'
  },
  //查询申请流转记录
  'applyCirculation': {
    url: '/apply/search/applyCirculation.do',
    method: 'get'
  },
  // 通过人脸照片或身份证号获取人员信息
  'compareFaceResult': {
    url: '/common/compareFaceResult.do',
    method: 'post'
  },
  'uploadFile': {
    url: '/common/uploadFileLimitSize.do',
    method: 'post'
  },
  getpoliceSituationInfoList: {
    url: '/policeSituation/getPoliceSituationInfoList.do',
    method: 'post'
  },
  queryPagePersons: {
    url: '/common/queryPagePersons.do',
    method: 'get'
  },
  // 保存人员登记记录
  'getPoliceInfoByPersonIndexCode': {
    url: '/police/getPoliceInfoByPersonIndexCode.do',
    method: 'get'
  },
}
export default withAxios(serverConfig)
