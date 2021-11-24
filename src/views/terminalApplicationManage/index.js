import Vue from 'vue'
import HUI from 'hui'
import { Popover } from 'hui'
import moment from 'moment'
import VueClipboards from 'vue-clipboard2'
import '../../huiPro'
import initApp from '../../initApp'

import router from '../../router/terminalApplicationManage'
import App from './App'
import { MessageBox } from '../../components/message-box'

export const Bus = new Vue()
console.log(Popover)
Vue.use(HUI)
Vue.use(Popover)
Vue.use(VueClipboards)
Vue.prototype.$messagebox = function (result, title = '', showInfo = '') {
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
Vue.prototype.$moment = moment
let portalConfigCrumbs = window.localStorage.getItem('portal_config_crumbs')
Vue.prototype.$breadcrumb = portalConfigCrumbs ? portalConfigCrumbs.split('/') : []


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
