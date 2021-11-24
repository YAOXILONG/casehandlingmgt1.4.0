
import getRouter from './utils'

const routers = [
  {
    name: 'index',
    path: '/',
    component: 'DrugAbuseDetection',
    meta: {
      keepAlive: true // 需要缓存
    }
  },
  {
    path: '/error/:type',
    name: 'Error',
    component: 'Error' // 注意提供ErrorPage组件内的多语言翻译
  },
  {
    path: '*',
    redirect: '/'
  },
  {
    path: '/drugAbuseDetection',
    name: 'drugAbuseDetection',
    component: 'DrugAbuseDetection/drugAbuseDetection'
  }
]
export default getRouter(routers)
