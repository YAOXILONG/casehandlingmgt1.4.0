/*
 * @Description: 
 * @Version: 1.3
 * @Autor: jinxiaoxu
 * @Date: 2021-05-12 11:02:16
 * @LastEditors: jinxiaoxu
 * @LastEditTime: 2021-05-12 15:32:19
 */
import getRouter from './utils'

const routers = [
  {
    name: 'index',
    path: '/',
    component: 'accessControlAuthConfig'
  }
]
export default getRouter(routers)
