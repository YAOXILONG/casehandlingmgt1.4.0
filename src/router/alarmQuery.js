
import getRouter from './utils'

const routers = [
  {
    name: 'index',
    path: '/',
    component: 'alarmQuery/index',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/error/:type',
    name: 'Error',
    component: 'Error' // 注意提供ErrorPage组件内的多语言翻译
  },
  {
    name: 'detailPage',
    path: '/detailPage',
    component: 'alarmQuery/detailPage'
  },
  {
    path: '*',
    redirect: '/'
  }
]
export default getRouter(routers)


