import Vue from 'vue'
import Router from 'vue-router'

import MapConfigPage from '@/pages/AlarmConfigPage/index'

Vue.use(Router)

export default new Router({
  //   mode: 'history',
  routes: [
    {
      path: '/',
      component: MapConfigPage
    }
  ]
})
