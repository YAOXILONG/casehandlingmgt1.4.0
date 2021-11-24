export default {
  mounted () {
    window.addEventListener('message', this.dealMessage, false)
  },
  beforeDestroy () {
    window.removeEventListener('message', this.dealMessage, false)
  },
  methods: {
    dealMessage (e) {
      let data = e.data
      if (!data) {
        return
      }
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data)
        } catch (e) {
          data = {}
        }
      }
      if (data.hasOwnProperty('publish')) {
        console.log(data)
      }
    },
    // 发布
    postMessagePublish (type, data) {
      const params = {
        publish: type,
        data
      }
      top.postMessage(JSON.stringify(params), '*')
    },
    // 订阅
    postMessageSubscribe (type, data, flag = false) {
      const params = {
        subscribe: type,
        data,
        flag,
        origin: window.frameElement.id
      }
      top.postMessage(JSON.stringify(params), '*')
    },
    // 订阅
    postMessageUnSubscribe (type) {
      const params = {
        unSubscribe: type,
        origin: window.frameElement.id
      }
      top.postMessage(JSON.stringify(params), '*')
    }
  }
}
