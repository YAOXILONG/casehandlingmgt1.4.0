
import Vue from 'vue'
import hui from 'hui'
import VueClipboards from 'vue-clipboard2'
import '../../huiPro' // equals to require('./huiPro')
import initApp from '../../initApp'
import router from '../../router/register'
import App from './App'
import { MessageBox } from '../../components/message-box'

Vue.use(hui)
Vue.use(VueClipboards)

Vue.prototype.$messagebox = function (result, title = '', showInfo = '') {
  console.log(result)
  const datas = {
    data: {
      title: title,
      serviceErrorCode: result.data.serviceErrorCode,
      code: result.data.code,
      showInfo: showInfo,
      callChain: result.headers.traceid,
      msg: this.$t(result.data.code) || '调用服务失败'
    }
  }
  MessageBox(datas)
}

// 全局混合，对面包屑的多语言进行处理
Vue.mixin({
  computed: {
    i18nBreadcrumb () {
      if (this.breadcrumbObj && Array.isArray(this.$store.state.userInfo.breadcrumb[this.breadcrumbObj.menuCode])) {
        let breadcrumbList = this.$store.state.userInfo.breadcrumb[this.breadcrumbObj.menuCode]
        return breadcrumbList.map(item => ({
          title: item
        })).concat(this.breadcrumbObj.content ? this.breadcrumbObj.content.map(bd => ({
          title: this.$t ? this.$t(bd) : bd
        })) : [])
      } else {
        return []
      }
    }
  }
})

initApp(Vue, App, router)
