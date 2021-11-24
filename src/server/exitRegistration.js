import withAxios from './axios/withAxios'
import {
  commonConfig
} from './common'
const serverConfig = {
  ...commonConfig,
  'getRegisterInfoList': {
    url: '/register/getRegisterInfoList.do',
    method: 'get'
  },
  'getGoodsManagerInfo': {
    url: '/register/getGoodsManagerInfo.do',
    method: 'post'
  },
  'deleteGoodsManagerInfo': {
    url: '/register/deleteGoodsManagerInfo.do',
    method: 'post'
  },
  'saveOrUpdateGoodsManagerInfo': {
    url: '/register/saveOrUpdateGoodsManagerInfo.do',
    method: 'post'
  },
  'exportRegisterInfo': {
    url: '/leave/exportRegisterInfo.do',
    method: 'post'
  },
  // 1.10.2临时出区登记
  'saveTemporaryLeaveInfo': {
    url: '/leave/saveTemporaryLeaveInfo.do',
    method: 'post'
  },
  // 1.10.3最终出区登记
  'saveFinalLeaveInfo': {
    url: '/leave/saveFinalLeaveInfo.do',
    method: 'post'
  },
  'getRegisterInfoVo': {
    url: '/register/getRegisterInfoVo.do',
    method: 'get'
  },
  'getNoBackGoodsList': {
    url: '/goods/getNoBackGoodsList.do',
    method: 'get'
  },
  // 根据办案区编码获取办案区审批配置信息
  'getApproval': {
    url: '/apply/getApprovalConfig.do',
    method: 'get'
  },
  // 分页查询办案区出区申请记录
  'exitApplicaitionSearch': {
    url: '/apply/page/search.do',
    method: 'post'
  },
}

export default withAxios(serverConfig)
