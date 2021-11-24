import getRouter from './utils'

const routers = [
  {
    name: 'index',
    path: '/',
    component: 'PoliceManagement/index',
    meta: {
      keepAlive: true
    }
  },
  {
    name: 'addEdit',
    path: '/addEdit',
    component: 'PoliceManagement/addEdit'
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
