import getRouter from './utils'

const routers = [{
    name: 'index',
    path: '/',
    component: 'EntryApplication/index',
    meta: {
      keepAlive: true
    }
  },
  {
    name: 'addEdit',
    path: '/addEdit',
    component: 'EntryApplication/addEdit'
  },
  {
    name: 'detailsPage',
    path: '/detailsPage',
    component: 'EntryApplication/detailsPage'
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
