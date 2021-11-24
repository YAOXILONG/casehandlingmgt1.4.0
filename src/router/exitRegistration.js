
import getRouter from './utils'

const routers = [
  {
    name: 'index',
    path: '/',
    component: 'ExitRegistration/index',
    meta: {
      keepAlive: true
    }
  },
  {
    name: 'exitRegistration',
    path: '/exitRegistration',
    component: 'ExitRegistration/exitRegistration'
  },
  {
    path: '/error/:type',
    name: 'Error',
    component: 'Error' // 注意提供ErrorPage组件内的多语言翻译
  },
  {
    path: '*',
    redirect: '/'
  }
]
export default getRouter(routers)