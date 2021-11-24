<template>
  <watermarkContent>
    <div class="waitingManagementIndexPage">
      <div class="mainContent">
        <Layout>
          <Header :height="148">
            <todayHandlingAreaGeneralSituation ref="todayHandlingAreaGeneralSituation"
                                               :params-search="paramsSearch"></todayHandlingAreaGeneralSituation>
          </Header>
          <Main class="waitingManagementIndexList">
            <div class="waitingManagementTitle">
              <span>候问室</span>
              <el-button type="primary"
                         style="margin: 8px 8px;"
                         v-show="checkPlace"
                         @click="autodistribu">
                自动分配
              </el-button>
            </div>
            <FilterSearchBox>
              <FilterSearchItem>
                <div class="item-lable">
                  办案区
                </div>
                <div class="item-input">
                  <el-select v-model="searchForm.areaCode"
                             placeholder="请选择办案区"
                             @change="changeData">
                    <el-option v-for="(item, index) in authAreaList"
                               :key="index"
                               :label="item.areaName"
                               :value="item.areaIndexCode"></el-option>
                  </el-select>
                </div>
              </FilterSearchItem>
              <FilterSearchItem>
                <div class="item-lable">
                  房间名称
                </div>
                <div class="item-input">
                  <el-input v-model="searchForm.name"
                            placeholder="请输入"
                            :maxlength="64"></el-input>
                </div>
              </FilterSearchItem>
              <FilterSearchItem :is-btn="true">
                <el-button type="primary"
                           @click="handleSearch">
                  查询
                </el-button>
                <el-button @click="handleReset">
                  重置
                </el-button>
              </FilterSearchItem>
            </FilterSearchBox>
            <FilterSearchContent>
              <div class="waitingDataBox"
                   v-show="(waitRoomInfoList && waitRoomInfoList.length)">
                <el-scrollbar wrap-class="scrollbarWrap"
                              view-class="scrollbarView"
                              ref="scrollbar">
                  <div class="waitingManagementIndexMain">
                    <waitingCard :wait-room-info-list="waitRoomInfoList"
                                 :inq-dicts="inqDicts"
                                 :check-place="checkPlace"
                                 @updateList="findWaitRoomInfoList"></waitingCard>
                    <!-- :waiting-room-type-map="waitingRoomTypeMap" -->
                  </div>
                </el-scrollbar>
              </div>
              <div class="noWaitingDataBox"
                   v-show="!(waitRoomInfoList && waitRoomInfoList.length)">
                <img src="../../assets/image/empty.png"
                     alt />
              </div>
            </FilterSearchContent>
          </Main>
        </Layout>
      </div>
      <el-dialog title="自动分配"
                 :visible.sync="dialogVisible"
                 :area="[400,200]">
        <div v-if="showdistriburoomtext === 1">
          <div>{{ `有合适的候问室，是否将${peopleName}分配到${roomName}？` }}</div>
        </div>
        <div v-else-if="showdistriburoomtext === 2">
          <div>{{ `是否将${peopleName}分配到${roomName}？` }}</div>
          <div>存在以下风险：校验结果（如：有异性人员）</div>
        </div>
        <div v-else-if="showdistriburoomtext === 3">
          <div>{{ `是否将${peopleName}带离候问室？` }}</div>
        </div>
        <div v-else-if="showdistriburoomtext === 4">
          <div>登记记录不存在或已被删除</div>
        </div>
        <div v-else-if="showdistriburoomtext === 5">
          <div>涉案人员已出区</div>
        </div>
        <div v-else-if="showdistriburoomtext === 6">
          <div>无合适侯问室</div>
        </div>
        <div v-else>
          {{ showdistriburoomtext }}
        </div>
        <span slot="footer"
              class="dialog-footer">
          <template v-if="showdistriburoomtext === 1 || showdistriburoomtext === 2">
            <el-button type="primary"
                       @click="gotodistriburoom">确定分配</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
          </template>
          <template v-if="showdistriburoomtext === 3">
            <el-button type="primary"
                       @click="gotoaway">确定带离</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
          </template>
          <template v-else>
            <el-button @click="dialogVisible = false">关闭</el-button>
          </template>
        </span>
      </el-dialog>
    </div>
  </watermarkContent>
</template>

<script>
import server from '../../server/waitingManagement'
import todayHandlingAreaGeneralSituation from './todayHandlingAreaGeneralSituation'
import waitingCard from './waitingCard'
import Layout, { Main, Header } from '../../components/Layout'
import FilterSearchBox from '../../components/FilterSearchBox/FilterSearchBox'
import FilterSearchItem from '../../components/FilterSearchItem/FilterSearchItem'
import FilterSearchContent from '../../components/FilterSearchContent/FilterSearchContent'
import { clearInterval, setInterval, setTimeout } from 'timers'
import ReconnectingWebSocket from '../../mixin/reconnecting-websocket'
export default {
  name: 'WaitingManagementIndex',
  data () {
    return {
      dialogVisible: false,
      paramsSearch: {
        areaCode: '',
        name: ''
      },
      searchForm: {
        areaCode: '',
        name: ''
      },
      waitRoomInfoList: [],
      authAreaList: [],
      inqDicts: {},
      // waitingRoomTypeMap: {},
      showdistriburoomtext: '请刷手环(卡)...',
      distribuTimer: '',
      areaCode: '',
      personCode: '',
      registerIds: '',
      peopleName: '',
      roomName: '',
      roomIndexcode: '',
      dialogType: '',
      checkPlace: false,
      websock: null,
      updatewebsock: null,

    }
  },
  methods: {
    // 校验是否有定位系统
    async getLocationAbility () {
      const result = await server.getLocationAbility({ areaCode: this.areaCode })
      const { data } = result
      if (data.code === '0') {
        this.checkPlace = !!(data.data && data.data.length > 0 && data.data.indexOf('RFID') > -1)
      } else {
        this.checkPlace = false
        this.$messagebox(result)
      }
    },
    // 切换数据
    changeData () {
      this.handleSearch()
    },
    async gotoaway () {
      let params = {
        registerIds: this.registerIds,
        waitRoomCode: this.roomIndexcode
      }
      let loadingInstance = this.$loading({ fullscreen: true })
      try {
        let res = await server.leaveWaitRoom(params)
        if (res.data.code === '0') {
          loadingInstance.close()
          this.dialogVisible = false
          this.findWaitRoomInfoList()
        } else {
          loadingInstance.close()
          setTimeout(() => {
            this.$messagebox(res)
          }, 300)
        }
      } catch {
        setTimeout(() => {
          loadingInstance.close()
        }, 300)
      }
    },
    async gotodistriburoom () {
      // 提交分配
      let loadingInstance = this.$loading({ fullscreen: true })
      try {
        let params = {
          registerIds: this.registerIds,
          areaCode: this.areaCode,
          waitRoomCode: this.roomIndexcode,
          roomClassify: '123'
        }
        let res = await server.assignedWaitRoom(params)
        if (res.data.code === '0') {
          loadingInstance.close()
          this.dialogVisible = false
          this.findWaitRoomInfoList()
        } else {
          loadingInstance.close()
          setTimeout(() => {
            this.$messagebox(res)
          }, 300)
        }
      } catch {
        setTimeout(() => {
          loadingInstance.close()
        }, 300)
      }
    },
    async distriburoom (id) {
      if (!this.dialogVisible) return
      this.showdistriburoomtext = '正在分配候问室...'
      const params = {
        locationId: id,
        areaCode: this.areaCode
      }
      let res = await server.assignedWaitRoomByLocationCode(params)
      console.log('res', res)
      const datas = res.data.data
      this.peopleName = datas.peopleName
      this.roomName = datas.roomName
      this.registerIds = datas.registerIds
      this.personCode = datas.peopleCode
      this.roomIndexcode = datas.roomIndexcode
      if (res.data.code == 0) {
        this.showdistriburoomtext = 1
      } else if (res.data.code === '0x1fb12217') {
        this.showdistriburoomtext = 4
      } else if (res.data.code === '0x1fb1220b') {
        this.showdistriburoomtext = 5
      } else if (res.data.code === '0x1fb12227') {
        this.showdistriburoomtext = 3
      } else if (res.data.code === '0x1fb32309') {
        this.showdistriburoomtext = 2
      } else if (res.data.code === '0x1fb3230a') {
        this.showdistriburoomtext = 6
      } else {
        this.showdistriburoomtext = '分配候问室失败'
        this.$messagebox(res)
      }
    },
    autodistribu () {
      this.showdistriburoomtext = '请刷涉案人员手环...'
      this.dialogVisible = true
      this.readBracelet()
    },
    // 连接手环
    readBracelet () {
      let _self = this
      // 参数
      // let sendMsg = webMsg //'{"comment":{"commenttype":"startapp", "context":"noteFormatClientprotocol", "commentcmd":"noteFormatClientprotocol://nginxIP:' + webMsg.nginxIp + ';nginxport:' + webMsg.nginxPort + ';sg:' + webMsg.sg + ';protocol:' + webMsg.protocol + ';componentID:' + webMsg.componentId + ';servicetype:' + webMsg.serviceType + ';noteTemplateId:' + webMsg.id + ';language:' + webMsg.language + ';"}}'
      let sendMsg = '{"comment":{"commenttype":"checkapp", "context":"btoolsprotocol"}}'
      let socketHost = window.location.protocol.indexOf('https') > -1
        ? 'wss://127.0.0.1:18001/WebS_Js'
        : 'ws://127.0.0.1:18000/WebS_Js'
      try {
        if (!_self.websock) {
          _self.websock = new WebSocket(socketHost)
          _self.websock.onopen = function () {
            // 发送检测插件助手是否安装请求
            _self.websock.send(sendMsg)
          }
        } else {
          _self.websock.send(sendMsg)
        }
        _self.websock.onerror = function () {
          // 连接失败，通信中间件未安装
          _self.$message('检测到您未安装插件助手')
        }
        _self.websock.onmessage = async (data) => {
          let _data = JSON.parse(data.data)
          if (_data && _data.comment && _data.comment.commenttype === 'checkapp') {
            // 检测插件助手是否安装
            if (_data.comment.resultCode === '1') {
              let jsonObj = `{"comment":{"commenttype":"startapp", "context":"btoolsprotocol", "commentcmd":"btoolsprotocol://CenterUrl:${_self.$centerUrl};Toollist:PROT_BToolCardReaderProtocol;CmdLine:BToolCardReaderProtocol://IReaderType:1;"}}`
              _self.websock.send(jsonObj)
            } else {
              _self.$message('检测到您未安装插件助手')
            }
          } else if (_data && _data.Code === 0 && _data.Result) {
            let bandsNo = _data.Result.Data
            console.log(bandsNo)
            this.showdistriburoomtext = `已读取手环(卡)编号：${bandsNo.CardCode}。正在处理，请稍后...`
            if (this.distribuTimer) clearTimeout(this.distribuTimer)
            setTimeout(() => {
              this.distriburoom(bandsNo.CardCode)
            }, 1000)
          }
        }
        _self.websock.onclose = function () {
          _self.websock = null
        }
      } catch (err) {
        console.log(err)
      }
    },
    async inqDict () {
      let res = await server.inqDict()
      if (res.data.code === '0') {
        let data = res.data.data
        this.inqDicts = data
        let inqDicts = data.waitingRoomType
        // if (inqDicts && inqDicts.length) {
        //   for (let i = 0; i < inqDicts.length; i++) {
        //     this.waitingRoomTypeMap[inqDicts[i].typeCode + '.' + inqDicts[i].key] = inqDicts[i].name
        //   }
        // } else {
        //   this.waitingRoomTypeMap = {}
        // }
      } else {
        this.$messagebox(res)
      }
    },
    async findAuthUserPlaceList () {
      let res = await server.findAuthUserPlaceList()
      let data = res.data
      if (data.code === '0') {
        let list = data.data.list
        if (list && list.length) {
          this.paramsSearch = {
            areaCode: list[0].areaIndexCode,
            name: ''
          }
          this.searchForm = {
            areaCode: list[0].areaIndexCode,
            name: ''
          }
          this.authAreaList = list
          this.findWaitRoomInfoList('init')
        } else if (list && list.length === 0) {
          this.$message.error('办案区为空')
        } else {
          this.$message.error('获取办案区失败')
        }
      } else {
        this.$messagebox(res)
      }
    },
    // 候问室列表展示
    async findWaitRoomInfoList (type) {
      let params = {
        areaCode: this.paramsSearch.areaCode,
        name: this.paramsSearch.name
      }
      let loadingInstance = null

      if (type === 'init') {
        loadingInstance = this.$loading({ fullscreen: true })
      }
      try {
        let res = await server.findWaitRoomInfoList(params)
        this.areaCode = this.paramsSearch.areaCode
        this.getLocationAbility()
        let data = res.data
        if (data.code === '0') {
          if (type === 'init' && loadingInstance) {
            loadingInstance.close()
          }
          let list = JSON.parse(JSON.stringify(data.data))
          if (type !== 'init') {
            this.$refs.todayHandlingAreaGeneralSituation &&
              this.$refs.todayHandlingAreaGeneralSituation.findWaitRoomInfo &&
              this.$refs.todayHandlingAreaGeneralSituation.findWaitRoomInfo()
          }
          if (list && list.length) {
            this.waitRoomInfoList = list
          } else {
            this.waitRoomInfoList = []
          }
        } else {
          if (type === 'init' && loadingInstance) {
            loadingInstance.close()
          }

          this.waitRoomInfoList = []
          setTimeout(() => {
            this.$messagebox(res)
          }, 300)
        }
      } catch {
        if (type === 'init' && loadingInstance) {
          setTimeout(() => {
            loadingInstance.close()
          }, 300)
        }
      }
    },
    // 查询
    handleSearch (res) {
      let list = JSON.parse(JSON.stringify(this.searchForm))
      this.paramsSearch = {
        areaCode: list.areaCode,
        name: list.name
      }
      this.findWaitRoomInfoList('init')
    },
    // 重置
    handleReset () {
      let list = this.authAreaList
      this.paramsSearch = {
        areaCode: list[0].areaIndexCode,
        name: ''
      }
      this.searchForm = {
        areaCode: list[0].areaIndexCode,
        name: ''
      }
      this.findWaitRoomInfoList('init')
    },
    // 刷新卡片信息
    initSocket () {

      let ip = window.location.host
      let socketHost = window.location.protocol.indexOf('https') > -1
        ? `wss://${
        ip
        }/casehandlingmgt/websocket/wait/message.ws`
        : `ws://${
        ip
        }/casehandlingmgt/websocket/wait/message.ws`
      try {
        if (!this.updatewebsock) {
          this.updatewebsock = new ReconnectingWebSocket(socketHost)
          this.updatewebsock.onopen = async (data) => {
            console.log(data)
          }
        }
        this.updatewebsock.onerror = function () {
          this.$message.error('连接失败')
        }
        this.updatewebsock.onmessage = async (val) => {
          if (val) {
            this.findWaitRoomInfoList()
          }
        }
      } catch (err) {
        this.$message.error('连接失败')
      }
    },

  },
  created () {
    this.initSocket()
    this.inqDict()
  },
  mounted () {
    this.findAuthUserPlaceList()
  },
  destroyed () {
    this.updatewebsock && this.updatewebsock.close()
    this.websock && this.websock.close()
  },
  components: {
    Layout,
    Main,
    Header,
    todayHandlingAreaGeneralSituation,
    waitingCard,
    FilterSearchBox,
    FilterSearchItem,
    FilterSearchContent
  }
}
</script>

<style lang="less">
.waitingManagementIndexPage {
  height: 100%;
  padding: 0 8px 8px 8px;
  box-sizing: border-box;
  background: #f2f2f2;
  .mainContent {
    height: 100%;
    background: #fff;
    .ea-header {
      &.titleHeader {
        padding-bottom: 2px;
        box-sizing: border-box;
        background: #f2f2f2;
        position: relative;
        .titleContent {
          height: 38px;
          line-height: 38px;
          padding-left: 16px;
          box-sizing: border-box;
          font-family: PingFangSC-Semibold;
          font-size: 14px;
          color: #4c4c4c;
          letter-spacing: 0;
          background: #fff;
        }
        .filterBtn {
          position: absolute;
          right: 16px;
          top: 2px;
          > .h-icon-fliter-f {
            color: #2080f7;
          }
        }
        .searchContent {
          height: 66px;
          background: #fbfbfb;
          box-shadow: inset 0 -1px 0 0 #e6e6e6, inset 0 1px 0 0 #e6e6e6;
          > .filterForm {
            padding-right: 200px;
            box-sizing: border-box;
            position: relative;
            line-height: 32px !important;
            text-align: center;
            .el-form-item {
              margin-bottom: 0;
              padding-top: 16px;
              height: 64px;
              box-sizing: border-box;
            }
            .elFormItemBtns {
              position: absolute;
              right: 4px;
              top: 0px;
              .el-form-item__content {
                width: 202px !important;
                text-align: right;
                > button {
                  width: 96px;
                }
              }
            }
          }
        }
      }
    }
    .waitingManagementIndexList {
      position: relative;
      .waitingManagementTitle {
        position: absolute;
        height: 48px;
        width: 170px;
        top: 0;
        left: 16px;
        line-height: 48px;
        font-family: PingFangSC-Semibold;
        font-size: 14px;
        color: #4c4c4c;
        letter-spacing: 0;
        z-index: 1;
      }
      > .filter-search-box {
        box-shadow: inset 0 -1px 0 0 #e6e6e6;
      }
    }
    // .h-icon-filter,
    // .h-icon-fliter-f {
    //   font-size: 20px;
    // }
    .waitingDataBox {
      width: 100%;
      height: 100%;
    }
    .noWaitingDataBox {
      width: 100%;
      height: 100%;
      position: relative;
      > img {
        width: 240px;
        height: 200px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .scrollbarWrap {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .waitingManagementIndexMain {
      // height: 100%;
      background: #fff;
      padding: 14px 80px;
      box-sizing: border-box;
    }
  }
}
</style>
