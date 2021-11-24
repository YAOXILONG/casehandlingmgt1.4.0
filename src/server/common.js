import withAxios from './axios/withAxios'
// import moment from 'moment'

// const baseURL = process.env.NODE_ENV === 'production' ? `/${process.env.VUE_APP_CONTEXT}` : `/mock/${process.env.VUE_APP_CONTEXT}`

export const commonConfig = {
  // 查询部门
  'getDepartmentTree': {
    url: '/ui/common/getDepartmentTree.do',
    method: 'get'
  },
  // 分页查询用户
  'getUserPages': {
    url: '/ui/common/getUserPages.do',
    method: 'get'
  },
  'csrfToken': {
    url: '/csrfToken.do',
    method: 'get'
  },
  'getRsaPublicKey': {
    url: '/commonDevice/getRsaPublicKey.do',
    method: 'get'
  },
  // 获取办案区列表
  'findAuthUserPlaceList': {
    url: '/common/findAuthUserPlaceList.do',
    method: 'get'
  },
  // 获取办案部门
  'findAuthDeptList': {
    url: '/common/findAuthDeptList.do',
    method: 'get'
  },
  // 获取警员账号信息
  'findAuthUserList': {
    url: '/common/findAuthUserList.do',
    method: 'get'
  },
  // 数据字典获取 typeCodes=caseLevel&keys=1
  'inqDict': {
    url: '/common/inqDict.do',
    method: 'get'
  },
  // 文件上传
  'uploadFile': {
    url: '/common/uploadFile.do',
    method: 'post'
  },
  // base64文件上传
  'uploadbase64': {
    url: '/common/uploadbase64.do',
    method: 'post'
  },
  // 获取监控点参数
  'findCameraCaptureInfo': {
    url: '/common/findCameraCaptureInfo.do',
    method: 'get'
  },
  'findDrugCameraCaptureInfo': {
    url: '/common/findDrugCameraCaptureInfo.do',
    method: 'get'
  },
  // 获取未绑定的定位标签列表
  'getTagInfoList': {
    url: '/register/getTagInfoList.do',
    method: 'get'
  },
  // 获取入区人员列表
  'getRegisterInfoList': {
    url: '/register/getRegisterInfoList.do',
    method: 'get'
  },
  // 获取同案标记列表
  'getSameTagListAll': {
    url: '/register/getSameTagListAll.do',
    method: 'get'
  },
  // 获取案件列表
  'getCaseInfoList': {
    url: '/common/getCaseInfoList.do',
    method: 'get'
  },
  'findFileUrl': {
    url: '/common/findFileUrl.do',
    method: 'get'
  },
  // 绑定解绑标签
  'manageTag': {
    url: '/common/manageTag.do',
    method: 'post'
  },
  // 获取对应场所的设备
  'getPlaceDevice': {
    url: '/common/getPlaceDevice.do',
    method: 'get'
  },
  // 获取已绑定shouhuan
  'getUsedBandsList': {
    url: '/register/getUsedBandsList.do',
    method: 'get'
  },
  // shipin
  'playerParam': {
    url: '/common/player/param', //    locationCode
    method: 'post'
  },
  // 案件
  'getRelationCaseInfoList': { // String param,Integer start,Integer limit
    url: '/common/getRelationCaseInfoList.do',
    method: 'get'
  },
  // 案件关联
  'relationCaseInfo': { // String peopleCode,String caseNo
    url: '/common/relationCaseInfo.do',
    method: 'post'
  },
  // 查询centerurl
  'findNginxInfoVo': { // String peopleCode,String caseNo
    url: '/common/findNginxInfoVo.do',
    method: 'post'
  },
  // 校验是否有定位系统
  'getLocationAbility': { // String peopleCode,String caseNo
    url: '/common/getLocationAbility.do',
    method: 'get'
  },
  // 根据身份证号或人脸图片查询人员信息
  'compareFaceResult': { // Integer imageType,String image,String cardNo
    url: '/common/compareFaceResult.do',
    method: 'post'
  },
  // 获取系统时间
  'systemTime': {
    url: '/ui/localinterrogation/systemTime.do',
    method: 'get'
  },
  'getPublicKey': {
    url: '/ui/localinterrogation/publicKey.do',
    method: 'get'
  },
  'getCurrentUser': {
    url: '/ui/localinterrogation/currentUser.do',
    method: 'get'
  },
  'platPlayer': {
    url: '/common/player/param',
    method: 'post'
  },
  'multiLanguage': {
    url: '/multiLanguage.do',
    method: 'get'
  },
  'currLanguage': {
    url: '/currLanguage.do',
    method: 'get'
  },
  // 校验是否有统一定位系统
  'getUserLocationAbility': { // String peopleCode,String caseNo
    url: '/common/getUserLocationAbility.do',
    method: 'get'
  },
  queryPagePersons: {
    // url: '/common/queryPagePersons.do',
    url: '/common/queryPagePersons.do',
    method: 'get'
  },
  loadOrgTree: {
    url: '/common/loadOrgTree.do',
    method: 'get'
  },
  'getWatermark': {
    url: '/common/getWatermark.do',
    method: 'get'
  },
  'getAlarmTypeList':{
    url:'/common/getAlarmTypeList.do',
    method:'get'
  },
  'getPlaceAreas':{
    url:'/common/getPlaceAreas.do',
    method:'get'
  },
  'loadOrgPersonInfo': {
    url: '/common/loadOrgPersonInfo.do',
    method: 'post'
  },
  // 查询人员当前流程是否可做
  'getCaseAreaProcessConfig': {
    url: '/accompany/areaProcess/config/check.do',
    method: 'get'
  },
  // 获取审讯对象的审讯次数
  'getCount': {
    url: '/ui/localinterrogation/interrogation/count/{suspectCode}.do',
    method: 'get'
  },
}
export default withAxios(commonConfig)
