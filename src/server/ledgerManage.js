import withAxios from './axios/withAxios'
import { commonConfig } from './common'

const serverConfig = {
  ...commonConfig,
  // 1.9.1分页获取入区人员列表
  'getRegisterInfoList': {
    url: '/register/getRegisterInfoList.do',
    method: 'get'
  },
  'getGoodsManagerInfo': {
    url: '/register/getRegisterInfoList.do',
    method: 'post'
  },
  // 获取人员信息
  'findRegisterInfos': {
    url: '/register/findRegisterInfo.do',
    method: 'get'
  },
  //  1.12.1人员基本情况
  'findRegisterInfo': {
    url: '/book/findRegisterInfo.do',
    method: 'get'
  },
  // 1.12.2人身检查记录
  'findBodyCheckInfo': {
    url: '/book/findBodyCheckInfo.do',
    method: 'get'
  },
  // 1.12.3随身财物检查记录
  'findGoodCheckInfo': {
    url: '/book/findGoodCheckInfo.do',
    method: 'get'
  },
  // 1.12.4信息采集记录
  'findCollectedInfo': {
    url: '/book/findCollectedInfo.do',
    method: 'get'
  },
  // 1.12.5吸毒检测记录
  'findDrugCheckInfo': {
    url: '/book/findDrugCheckInfo.do',
    method: 'get'
  },
  // 1.12.6活动记录
  'findActiveInfo': {
    url: '/book/findActiveInfo.do',
    method: 'get'
  },
  // 1.12.5吸毒检测记录
  'findLeaveAreaInfo': {
    url: '/book/findLeaveAreaInfo.do',
    method: 'get'
  },
  // 定位轨迹
  'findIndoorPersonUrl': {
    url: '/book/findIndoorPersonUrl.do',
    method: 'get'
  },
  // 导出登记表
  'exportRegisterInfo': {
    url: '/leave/exportRegisterInfo.do',
    method: 'post'
  },
  // 定位轨迹
  'downLoadPersonTrackVideo': {
    url: '/book/downLoadPersonTrackVideo.do',
    method: 'get'
  },
  // 获取导出录像列表
  'playBackActiveInfoVideo': {
    url: '/book/playBackActiveInfoVideo.do',
    method: 'get'
  },
  // 获取导出录像url
  'downVideo': {
    url: '/book/downVideo.do',
    method: 'get'
  },
  'findRegisterFinishInfo': {
    url: '/book/findRegisterFinishInfo.do',
    method: 'get'
  },

  // 获取封面列表
  'getDiskCoverList': {
    url: '/burn/diskCover/page.do',
    method: 'get'
  },
  // 查询打印刻录一体机信息
  'findAccessService': {
    url: '/burn/findAccessService.do',
    method: 'get'
  },
  // 查询打印刻录一体机信息
  'findAllAccessService': {
    url: '/burn/findAllAccessService.do',
    method: 'get'
  },
  // 默认封面
  'loadDefaultDiskCover': {
    url: '/burn/diskCover/loadDefault.do',
    method: 'get'
  },
  'getPublicKey': {
    url: '/burn/publicKey.do',
    method: 'get'
  },
  // 开启事后刻录
  'startBurning': {
    url: '/burn/startBurning.do',
    method: 'post'
  },
  // 删除人员信息
  'delRegisterInfo': {
    url: '/register/delRegisterInfo.do',
    method: 'post'
  },
  // 是否显示删除按钮
  'showBtn': {
    url: '/common/checkIsAdmin.do',
    method: 'get'
  },
  exportDrugMsgInfo: {
    url: '/drug/exportDrugMsgInfo.do',
    method: 'post'
  }
}
export default withAxios(serverConfig)
