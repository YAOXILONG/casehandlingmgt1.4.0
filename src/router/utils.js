import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const createRoute = (routes) => {
  return routes.reduce((processedRoutes, currentRoute) => {
    processedRoutes.push(processRouteObj(currentRoute))
    return processedRoutes
  }, [])
}

const processRouteObj = ({ children, component, ...args }) => {
  return Object.assign({
    meta: {},
    props: {},
    // component: () => import(/* webpackInclude: /\.(js|vue)$/ */`@/pages/${component}`),
    component: resolve => require([`@/pages/${component}`], resolve),
    children: children ? createRoute(children) : []
  }, args)
}

const getRouter = (routes) => {
  const router = new Router({
    base: process.env.BASE_URL,
    routes: createRoute(routes)
  })
  router.beforeEach(async (to, form, next) => {
    // 防止死循环跳出
    if (to.path.indexOf('error') > -1) {
      next()
      return
    }

    next()
  })
  return router
}

export default getRouter
