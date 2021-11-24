import getRouter from './utils'

const routers = [{
  name: 'index',
  path: '/',
  component: 'visitingRecord/index',
  meta: {
    keepAlive: true
  }
},
{
  name: 'detailsPage',
  path: '/detailsPage',
  component: 'visitingRecord/detailsPage'
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
