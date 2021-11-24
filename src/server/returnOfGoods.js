import withAxios from './axios/withAxios'
import { commonConfig } from './common'
const serverConfig = {
  ...commonConfig,
  // 1.9.1分页获取入区人员列表
  'getRegisterInfoList': {
    url: '/register/getRegisterInfoList.do',
    method: 'get'
  },
  // 1.9.2获取物品归还信息
  'findGoods': {
    url: '/goods/findGoods.do',
    method: 'get'
  },
  // 1.9.3获取领取人签字区域信息
  'findGoodsManagerInfo': {
    url: '/goods/findGoodsManagerInfo.do',
    method: 'get'
  },
  // 1.9.4保存物品归还记录
  'saveBackGoods': {
    url: '/goods/saveBackGoods.do',
    method: 'post'
  },
  // 1.9.5归还物品开柜操作
  'goodsBackOpenDoor': {
    url: '/goods/goodsBackOpenDoor.do',
    method: 'get'
  },
  // 获取人员信息
  'findRegisterInfo': {
    url: '/register/findRegisterInfo.do',
    method: 'get'
  },
  'findCameraCaptureInfo': {
    url: '/common/findCameraCaptureInfo.do',
    method: 'get'
  },
  getCabinetType:{
    url:'/goods/getCabinetType.do',
    method:'get'
  }
}
export default withAxios(serverConfig)
