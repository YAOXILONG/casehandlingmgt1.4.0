import axios from 'axios'
import qs from 'querystring'

const serverURL = `/${process.env.VUE_APP_CONTEXT}`
const proxyURL = '/apis'
// const serverURL = '/'
// const proxyURL = '/mock'
const baseURL = process.env.NODE_ENV === 'production' ? serverURL : proxyURL + serverURL

const CONTENT_TYPE = 'Content-Type'
const urlencodedContentType = 'application/x-www-form-urlencoded;charset=utf-8'
const jsonContentType = 'application/json;charset=utf-8'

const timeout = 60000

const axiosOptions = {
  baseURL,
  timeout,
  headers: {
    get: { [CONTENT_TYPE]: urlencodedContentType },
    post: { [CONTENT_TYPE]: jsonContentType }
  },
  withCredentials: true,
  transformRequest: [
    (data) => {
      return JSON.stringify(data)
    }
  ],
  paramsSerializer (params) {
    return qs.stringify(params)
  },
  validateStatus () {
    return true
  },
  transformResponse: [(data) => {
    if (typeof data === 'string' && data[0] === '{') {
      try {
        data = JSON.parse(data)
      } catch (e) {
        console.log(e)
      }
    }
    return data
  }]
}

const service = axios.create(axiosOptions)

// 添加请求拦截器
service.interceptors.request.use((config) => {
  return config
}, (error) => {
  // 错误抛到业务代码
  console.log(JSON.stringify(error))
  error.data = {}
  error.data.code = 999
  return Promise.reject(error)
})

// 添加响应拦截器
service.interceptors.response.use((response) => {
  const status = response.status
  if (status < 200 || status >= 300) {
    if (typeof response.data === 'string') {
      response.data = { code: status }
    } else {
      response.data.code = status
    }
  }
  if (status === 403 || status === '403') {
    window.location.href = response.data.data.referer
    return
  }
  return response
}, (error) => {
  // 错误抛到业务代码
  console.log(JSON.stringify(error))
  error.response = {}
  error.response.data = {}
  error.response.data.code = '请求超时'
  return Promise.resolve(error.response)
})

export default service
