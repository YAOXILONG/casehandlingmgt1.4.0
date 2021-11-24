/*
 * @Description: 
 * @Version: 1.3
 * @Autor: jinxiaoxu
 * @Date: 2020-08-12 16:18:43
 * @LastEditors: jinxiaoxu
 * @LastEditTime: 2020-12-09 15:50:18
 */
import withAxios from './axios/withAxios'

import {
  commonConfig
} from './common'

export const serverConfig = {
  ...commonConfig,
  // 删除人员信息
  'delRegisterInfo': {
    url: '/register/delRegisterInfo.do',
    method: 'post'
  },
  // 获取入区人员信息
  'getRegisterInfoVo': {
    url: '/register/getRegisterInfoVo.do',
    method: 'get'
  },
  // 获取人员库列表
  'getSupectsInfoList': {
    url: '/register/getSupectsInfoList.do',
    method: 'get'
  },
  // 查看临时出区人员列表
  'getTemporaryRegisterInfoList': {
    url: '/register/getTemporaryRegisterInfoList.do',
    method: 'get'
  },
  // 临时出区人员回区确认
  'updateRegisterBackInfo': {
    url: '/register/updateRegisterBackInfo.do',
    method: 'post'
  },
  // 保存人员登记记录
  'saveOrUpdateRegisterInfo': {
    url: '/register/saveOrUpdateRegisterInfo.do',
    method: 'post'
  },
  // 保存人员登记记录
  'getPoliceInfoByPersonIndexCode': {
    url: '/police/getPoliceInfoByPersonIndexCode.do',
    method: 'get'
  },
  // 获取已绑定手环
  'getUsedBandsList': {
    url: '/register/getUsedBandsList.do',
    method: 'get'
  },
  // 获取已绑定手环
  'getRegisterInfoListForLocation': {
    url: '/register/getRegisterInfoListForLocation.do',
    method: 'get'
  },
  // 通过人脸照片或身份证号获取人员信息
  'compareFaceResult': {
    url: '/common/compareFaceResult.do',
    method: 'post'
  },
  // 获取是否支持智能检测
  'getFaceServerType': {
    url: '/common/getFaceServerType.do',
    method: 'get'
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
  // 根据办案区编码获取办案区审批配置信息
  'getApproval': {
    url: '/apply/getApprovalConfig.do',
    method: 'get'
  },
  // 分页查询办案区入区申请记录
  'entryApplicaitionSearch': {
    url: '/apply/page/search.do',
    method: 'post'
  },
  // 根据申请记录编码查询入区申请详细信息
  'getEntryApplication': {
    url: '/apply/get.do',
    method: 'get'
  },
}
export default withAxios(serverConfig)
