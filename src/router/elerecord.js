
import getRouter from './utils'

const routers = [
  {
    name: 'index',
    path: '/',
    component: 'EleRecordPage',
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
    path: '*',
    redirect: '/'
  },
  {
    path: '/addtrialwithrecord',
    name: 'addtrialwithrecord',
    component: 'AddTrialWithRecordPage/index'
  },
  {
    path: '/addtrialwithoutrecord',
    name: 'addtrialwithoutrecord',
    component: 'AddTrialWithoutRecordPage/index'
  }
]
export default getRouter(routers)
