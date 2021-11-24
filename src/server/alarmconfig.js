/*
 * @Description: 
 * @Version: 1.3
 * @Autor: jinxiaoxu
 * @Date: 2021-05-14 14:49:12
 * @LastEditors: jinxiaoxu
 * @LastEditTime: 2021-05-18 10:24:38
 */
import withAxios from './axios/withAxios'
import { commonConfig } from './common'

const serverConfig = {
  ...commonConfig,
  'queryAll': { // 获取告警列表
    url: '/alarmConfig/findConfigByAreaIndexCode.do',
    method: 'get'
  },
  'queyByType': { // 查询告警类型配置
    url: '/alarmConfig/getAlarmConfig.do',
    method: 'get'
  },
  'getCameraByPage': { //获取监控点信息
    url: '/alarmConfig/camera/page.do',
    method: 'post'
  },
  'queryDetailList': { // 获取区域超限、区域入侵区域列表   获取区域超限、区域入侵区域已经配置的区域列表
    url: '/config/alarmConfig/queryDetailList.do',
    method: 'post'
  },
  'queryFreeAreaList': {// 获取区域超限、区域入侵区域可配置区域列表
    url: '/config/alarmConfig/queryFreeAreaList.do',
    method: 'post'
  },
  'save': { // 保存告警配置
    url: '/alarmConfig/saveOrUpdateAlarmConfig.do',
    method: 'post'
  },
  'saveDetail': { // 保存区域超限区域
    url: '/config/alarmConfig/saveDetail.do',
    method: 'post'
  },
  'delete': { // 删除区域
    url: '/config/alarmConfig/delete.do',
    method: 'post'
  },
  // ================
  'queryArea': { // 区域
    url: '/config/alarmConfig/queryArea.do',
    method: 'post'
  },
  'queryAreaList': { // 区域
    url: '/config/alarmConfig/queryAreaList.do',
    method: 'post'
  },
  'queyById': { // 区域
    url: '/config/alarmConfig/queyById.do',
    method: 'post'
  }
}
export default withAxios(serverConfig)
