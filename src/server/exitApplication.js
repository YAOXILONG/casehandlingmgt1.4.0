import withAxios from './axios/withAxios'

import {
  commonConfig
} from './common'

export const serverConfig = {
  ...commonConfig,
  // 分页查询办案区出区申请记录
  'exitApplicaitionSearch': {
    url: '/apply/page/search.do',
    method: 'post'
  },
  // 作废出区申请记录
  'cancelExitApplication': {
    url: '/apply/cancel.do',
    method: 'get'
  },
  // 根据办案区编码获取办案区审批配置信息
  'getApproval': {
    url: '/apply/getApprovalConfig.do',
    method: 'get'
  },
  // 删除出区申请记录
  'deleteExitApplication': {
    url: '/apply/delete.do',
    method: 'get'
  },
  // 根据申请记录编码查询出区申请详细信息
  'getExitApplication': {
    url: '/apply/get.do',
    method: 'get'
  },
  // 编辑出区申请记录
  'updateExitApplication': {
    url: '/apply/modify/leave.do',
    method: 'post'
  },
  // 新增出区申请记录
  'addExitApplication': {
    url: '/apply/add/leave.do',
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
  // 是否显示删除按钮
  'showBtn': {
    url: '/common/checkIsAdmin.do',
    method: 'get'
  },
  // 查询可选择出区对象列表
  'searchRegisterInfoForLeaveApply': {
    url: '/apply/searchRegisterInfoForLeaveApply.do',
    method: 'post'
  },

}
export default withAxios(serverConfig)
