import ReconnectingWebSocket from '../mixin/reconnecting-websocket'

export default {
  data () {
    return {
      socket: ''
    }
  },
  mounted () {
    window.setTimeout(() => {
      this.startApp()
    }, 5000)
  },
  methods: {
    messageHandle (message) {
      console.log('未处理ws消息')
      console.log(message)
    },
    startApp () {
      const host = window.location.host
      // const host = '10.19.132.84'
      let socketHost = window.location.protocol.indexOf('https') > -1
        ? `wss://${host}/casehandlingmgt/websocket/interrogtion/message`
        : `ws://${host}/casehandlingmgt/websocket/interrogtion/message`
      try {
        this.socket = new ReconnectingWebSocket(socketHost)
        this.socket.onopen = function () {
        }
        this.socket.onerror = () => {
          this.$message.error('websocket启动失败')
        }
        this.socket.onmessage = (data) => {
          let _data = JSON.parse(data.data)
          if (_data.code === '403') {
            window.location.reload()
            return
          }
          this.messageHandle(_data)
        }
        this.socket.onclose = function () {
          // this.socket = null
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
