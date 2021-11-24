import getRouter from './utils'

const routers = [
  {
    name: 'index',
    path: '/',
    component: 'PersonalCheck/index',
    meta: {
      keepAlive: true
    }
  },
  {
    name: 'addEdit',
    path: '/addEdit',
    component: 'PersonalCheck/addEdit'
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
