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
  // 对出入区申请进行同意、退回操作
  'submitApproval': {
    url: '/apply/approve.do',
    method: 'post'
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
    url: '/apply/entry/update.do',
    method: 'post'
  },
  //根据申请编码查询审批记录
  'approvalSearch': {
    url: '/approval/search.do',
    method: 'post'
  },
  // 新增入区申请记录
  'addEntryApplication': {
    url: '/apply/entry/add.do',
    method: 'post'
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
  // 保存人员登记记录
  'getPoliceInfoByPersonIndexCode': {
    url: '/police/getPoliceInfoByPersonIndexCode.do',
    method: 'get'
  },
  // 根据申请记录编码查询出区申请详细信息
  'getExitApplication': {
    url: '/apply/get.do',
    method: 'get'
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
}
export default withAxios(serverConfig)
