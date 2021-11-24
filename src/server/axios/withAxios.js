import axios from './index'

function isValidKey (key, obj) {
  return key in obj
}

const reg = new RegExp('[^{]+(?=})', 'g')
const withAxios = (serverConfig) => {
  const serviceMap = {}
  Object.keys(serverConfig).forEach((sConfig) => {
    const options = serverConfig[sConfig]
    serviceMap[sConfig] = (params, config) => {
      const key = options.method.toLowerCase() === 'get' ? 'params' : 'data'
      let url = options.url
      const dynamicParams = url.match(reg) || []
      dynamicParams.forEach((v) => {
        if (!isValidKey(v, params)) {
          throw Error('error，' + v + ' is not exit')
        }
        url = url.replace(`{${v}}`, params[v])
      })

      return axios.request({
        ...options,
        ...config,
        url,
        [key]: params
      })
    }
  })
  return serviceMap
}

export default withAxios
