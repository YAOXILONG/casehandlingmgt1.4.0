export default {
  data () {
    return {
      socketPlay: null
    }
  },
  mounted () {
  },
  methods: {
    startSocket ({ onopen, onerror, onmessage, onclose }, socketHost) {
      socketHost = socketHost || window.location.protocol.indexOf('https') > -1
        ? 'wss://127.0.0.1:18001/WebS_Js'
        : 'ws://127.0.0.1:18000/WebS_Js'
      try {
        this.socketPlay = new WebSocket(socketHost)
        this.socketPlay.onopen = () => {
          // 发送检测插件助手是否安装请求
          // let jsonObj = '{"comment":{"commenttype":"checkapp", "context":"btoolsprotocol"}}'
          // this.socketPlay.send(jsonObj)
          onopen && onopen()
        }
        this.socketPlay.onerror = () => {
          // 连接失败，通信中间件未安装
          onerror && onerror()
          // this.$message('连接插件助手失败')
        }
        this.socketPlay.onmessage = (data) => {
          let result
          if (typeof data === 'string') {
            result = JSON.parse(data)
          } else {
            result = data
          }
          console.log(result)
          onmessage && onmessage(result)
        }
        this.socketPlay.onclose = () => {
          onclose && onclose()
          this.socketPlay = null
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
