import withAxios from './axios/withAxios'
import { commonConfig } from './common'

const serverConfig = {
  ...commonConfig,
  // 1.5.1分页获取入区人员列表
  'getRegisterInfoList': {
    url: '/register/getRegisterInfoList.do',
    method: 'get'
  },
  // 1.5.6获取物品登记信息
  'findGoods': {
    url: '/goods/findGoods.do',
    method: 'get'
  },
  // 1.5.3办案区储物柜列表
  'findCabinetListByRegisterId': {
    url: '/goods/findCabinetListByRegisterId.do',
    method: 'get'
  },
  // 1.5.5保存物品登记记录
  'saveStoreGoods': {
    url: '/goods/saveStoreGoods.do',
    method: 'post'
  },
  // 1.5.4物品柜结构信息返回
  'findCabinetStructurebyIndexCode': {
    url: '/goods/findCabinetStructurebyIndexCode.do',
    method: 'get'
  },
  // 1.5.7获取物品签字区域信息
  'findGoodsManagerInfo': {
    url: '/goods/findGoodsManagerInfo.do',
    method: 'get'
  },
  // 1.5.8暂存物品开柜操作
  'goodsStoreOpenDoor': {
    url: '/goods/goodsStoreOpenDoor.do',
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
  'exportGoodsInfo': {
    url: '/goods/exportGoodsInfo.do',
    method: 'post'
  }
}
export default withAxios(serverConfig)
