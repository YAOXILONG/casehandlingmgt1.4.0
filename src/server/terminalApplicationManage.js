import withAxios from './axios/withAxios'

import {commonConfig} from './common'

export const serverConfig = {
  ...commonConfig,
  // 安装包上传
  'upload': {
    url: '/accompany/package/upload.do',
    method: 'post'
  },
  // 安装包类型数据字典
  'typeEnum': {
    url: '/accompany/package/typeEnum.do',
    method: 'get'
  },
  // 分页查询安装包
  'pageQuery': {
    url: '/accompany/package/pageQuery.do',
    method: 'get'
  },
  // 删除安装包
  'delete': {
    url: '/accompany/package/delete.do',
    method: 'post'
  },
  // 下载安装包
  'download': {
    url: '/accompany/package/download.do',
    method: 'get'
  },
  // 安装包是否存在
  'checkPackageExist': {
    url: '/accompany/package/checkPackageExist.do',
    method: 'get'
  }

}
export default withAxios(serverConfig)
