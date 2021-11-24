import withAxios from './axios/withAxios'
import { commonConfig } from './common'
const serverConfig = {
  ...commonConfig,
  // 1.7.1分页获取入区人员列表
  'getRegisterInfoList': {
    url: '/register/getRegisterInfoList.do',
    method: 'get'
  },
  // 1.7.2获取吸毒检测信息
  'getDrugCheckVo': {
    url: '/drug/getDrugCheckVo.do',
    method: 'get'
  },
  // 1.7.3保存吸毒检测记录
  'saveOrUpdateDrugCheckInfo': {
    url: '/drug/saveOrUpdateDrugCheckInfo.do',
    method: 'post'
  },
  'getDrugRoomByAreaCode': {
    url: '/drug/getDrugRoomByAreaCode.do',
    method: 'get'
  },
  exportDrugMsgInfo: {
    url: '/drug/exportDrugMsgInfo.do',
    method: 'post'
  },
  // 导出吸毒检测表
  exportDrugInfo: {
    url: '/drug/exportDrugMsgInfo.do',
    method: 'post'
  },
  // 导出尿液提取笔录
  exportUrineInfo: {
    url: '/drug/exportUrineInfo.do',
    method: 'post'
  }
}
export default withAxios(serverConfig)
