import Vue from 'vue'
import hui from 'hui'
import VueClipboards from 'vue-clipboard2'
import '../../huiPro' // equals to require('./huiPro')
import initApp from '../../initApp'

import App from './App'

Vue.use(hui)
Vue.use(VueClipboards)

initApp(Vue, App)
