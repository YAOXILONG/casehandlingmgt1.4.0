export default {
  data () {
    return {}
  },
  mounted () {
    this.startApp()
  },
  methods: {
    startApp () {
      let socketHost = window.location.protocol.indexOf('https') > -1
        ? 'wss://127.0.0.1:18001/WebS_Js'
        : 'ws://127.0.0.1:18000/WebS_Js'
      try {
        window.socketPlay = new WebSocket(socketHost)
        window.socketPlay.onopen = () => {
          // console.log(window.socketPlay.readyState) // 1成功，3关闭
          // 发送检测插件助手是否安装请求
          let jsonObj = '{"comment":{"commenttype":"checkapp", "context":"btoolsprotocol"}}'
          window.socketPlay.send(jsonObj)
        }
        window.socketPlay.onerror = () => {
          // 连接失败，通信中间件未安装
          this.$message.error('检测到您未安装插件助手')
        }
        window.socketPlay.onmessage = (data) => {
          let _data = JSON.parse(data.data)
          // console.log(_data)
          if (_data && _data.comment && _data.comment.commenttype === 'checkapp') {
            // 检测插件助手是否安装
            if (_data.comment.resultCode === '1') { // 已安装，启动读卡器，还是手动启动？
            } else {
              this.$message.error('检测到您未安装插件助手')
            }
          }
        }
        window.socketPlay.onclose = () => {
          // console.log(window.socketPlay.readyState)
          window.socketPlay = {}
          window.socketPlay.send = () => {
            this.$message.error('为了提供更好的系统操作体验，请点击下载并连接“插件助手”')
          }
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
