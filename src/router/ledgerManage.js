
import getRouter from './utils'

const routers = [
  {
    name: 'index',
    path: '/',
    component: 'LedgerManage/index',
    meta: {
      keepAlive: true
    }
  },
  {
    name: 'ledgerManage',
    path: '/ledgerManage',
    component: 'LedgerManage/ledgerManage'
  },
  {
    name: 'record',
    path: '/record',
    component: 'LedgerManage/record'
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