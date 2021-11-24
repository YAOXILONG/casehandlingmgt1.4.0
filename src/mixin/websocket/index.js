import SockJS from 'sockjs-client'
import Stomp from './stomp'
import axios from '../../server/axios/index'

class StompClient {
  constructor () {
    this.socket = null
    this.timer = null
    this.subscribeList = {}
    this.waitSubscribeList = {}
    this.flag = false // 连接标志
  }

  init (url) {
    this.connection(url)
    // 断开重连机制,尝试发送消息,捕获异常发生时重连
    this.timer = setInterval(() => {
      let that = this
      try {
        that.stompClient.send('test')
      } catch (err) {
        console.log('断线: ' + err)
        this.flag = false
        that.connection()
      }
    }, 20000)
  }

  connection (url) {
    const protocol = window.location.protocol.indexOf('https') > -1 ? `https://` : `http://`
    const host = window.location.host
    if (!url) throw Error('stomp初始化需要出入url')
    const context = url
    this.socket = new SockJS(`${protocol}${host}${context}`)
    this.stompClient = Stomp.over(this.socket)
    // 定义客户端的认证信息,按需求配置
    const headers = {
      'X-CSRF-TOKEN': axios.defaults.headers.post['X-CSRF-TOKEN']
    }
    console.log('初始化stomp')
    // 向服务器发起websocket连接
    this.stompClient.connect(headers, () => {
      this.flag = true
      const connect = Object.keys(this.waitSubscribeList)

      connect.forEach((v) => {
        const { url, cb, headers } = this.waitSubscribeList[v]
        this.subscribeList[url] = this.stompClient.subscribe(url, (rs) => {
          if (rs.body) {
            let data = {}
            try {
              data = JSON.parse(rs.body)
            } catch (e) {
              console.log(e)
            }
            cb(data)
          } else {
            console.warn(rs)
          }
        }, headers)
      })
      this.waitSubscribeList = {}
    }, (err) => {
      this.flag = false
      // 连接发生错误时的处理函数
      console.log(`失败:${err}`)
    })
  }

  disconnect () {
    if (this.stompClient) {
      this.flag = false
      this.stompClient.disconnect()
    }
  }

  subscribe (url, cb, headers = {}) {
    if (!this.subscribeList[url]) {
      if (this.flag) {
        this.subscribeList[url] = this.stompClient.subscribe(url, (rs) => {
          if (rs.body) {
            let data = {}
            try {
              data = JSON.parse(rs.body)
            } catch (e) {
              console.log(e)
            }
            cb(data)
          } else {
            console.warn(rs)
          }
        }, headers)
      } else {
        this.waitSubscribeList[url] = {
          url, cb, headers
        }
      }
    }
  }

  unsubscribe (url) {
    if (this.subscribeList[url]) {
      this.subscribeList[url].unsubscribe()
      this.subscribeList[url] = null
    }
  }

  send (url, data, headers = {}) {
    this.stompClient.send(url, headers, JSON.stringify(data))
  }
}

export default StompClient
