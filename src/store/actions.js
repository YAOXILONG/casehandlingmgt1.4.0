// 默认easyMock生成的文件在src/api/template下
// import { apiGetUserInfoGetAPI as getUserInfo } from '@/api/template'
import * as types from './mutation-types'
export default {
  async setUserInfo (context) {
    // userInfo模拟数据，真实开发环境中可以去掉，使用接口获取
    let data = {
      'languageId': 'zh_CN',
      'skin': 'redblack',
      'breadcrumb': {
        '001': ['欢迎']
      },
      'code': [
        `${process.env.VUE_APP_CONTEXT}_001`
      ]
    }
    // let { data } = await getUserInfo({ noMsg: true })
    context.commit(types.SET_USER_INFO, data)
    return {
      userInfo: data
    }
  }
}
