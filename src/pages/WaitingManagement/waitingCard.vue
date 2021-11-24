<template>
  <div class="waitingCardPage">
    <ul v-for="(item, index) in waitingCardList"
        :key="index"
        class="waitingCardItem">
      <li class="waitingCardItemTop">
        <ul class="waitingCardItemTopRoom ">
          <span class="roomName overflow"
                :title="item.name"> {{ item.name }}</span>
          <span class="roomLabel overflow"
                :title="'可容纳总人数:' + item.roomCapacity">（可容纳总人数：{{ item.roomCapacity }}）</span>
        </ul>
        <ul class="waitingCardItemTopGender  overflow"
            v-if="item.roomClassify && item.roomClassify!= '无'">
          <!-- v-if="item.roomClassify !='waitingRoomType.4' && waitingRoomTypeMap[item.roomClassify]" -->
          <span></span>{{ item.roomClassify}}候问室
          <!-- {{ waitingRoomTypeMap[item.roomClassify] }} -->
        </ul>
        <ul class="waitingCardItemTopGender  overflow"
            v-else>
        </ul>
        <div class="waitingCardItemFullStarffed"
             v-show="item.remainder == 0">
          <div class="waitingCardItemFullStarffedOutSide">
            <div class="waitingCardItemFullStarffedInner">
              <div>满员</div>
            </div>
          </div>
        </div>
      </li>
      <li class="waitingCardItemMiddle">
        <ul class="cardItem">
          <li class="cardItemNumber">
            {{ item.assigned || 0 }}
          </li>
          <li class="cardItemLabel  overflow">
            当前室内人数
          </li>
        </ul>
        <ul class="cardItem cardItemLast overflow">
          <li class="cardItemNumber">
            {{ item.remainder || 0 }}
          </li>
          <li class="cardItemLabel">
            可容纳人数
          </li>
        </ul>
      </li>
      <li class="waitingCardItemBottom">
        <ul class="waitingCardItemBottomIcon">
          <li class="iconLeft"></li>
          <li class="iconCenter">
            - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          </li>
          <li class="iconRight"></li>
        </ul>
        <ul class="waitingCardItemBottomBtn">
          <el-button @click.stop.prevent="onDistribution(item)"
                     type="iconButton"
                     icon="h-icon-share"
                     v-show="!(item.assigned === item.roomCapacity)">
            分配
          </el-button>
          <el-button @click.stop.prevent="realTimeVideo(item)"
                     type="iconButton"
                     icon="icon-video">
            实时视频
          </el-button>
          <el-button @click.stop.prevent="OnTakeAway(item)"
                     type="iconButton"
                     icon="h-icon-arrow_right"
                     v-show="item.assigned !== 0">
            带离
          </el-button>
          <el-button @click.stop.prevent="OnDetail(item)"
                     type="iconButton"
                     icon="h-icon-details"
                     v-show="item.assigned !== 0">
            查看详情
          </el-button>
        </ul>
      </li>
    </ul>
    <distributionDialog :params-dialog="paramsDialog"
                        @searchTable="handleSearchTable"
                        @handleSubmit="handleSubmit"
                        :inq-dicts="inqDicts"
                        :check-place="checkPlace"></distributionDialog>
    <detailDialog :params-dialog="onDetailDialog"
                  :inq-dicts="inqDicts">
    </detailDialog>
    <el-dialog title="提示"
               :visible.sync="dialogVisible"
               :area="[450,200]">
      <div v-for="(item,index) in showdistriburoomtext"
           :key="index">
        {{ item }}
      </div>
      <span slot="footer"
            class="dialog-footer">
        <template>
          <el-button type="primary"
                     @click="onSure">确定分配</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </template>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import distributionDialog from './distributionDialog'
import detailDialog from './detailDialog'
import bus from '../../views/waitingManagement/index'
import server from '../../server/waitingManagement'
import { setTimeout } from 'timers'
export default {
  name: 'WaitingCard',
  props: {
    waitRoomInfoList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // waitingRoomTypeMap: {
    //   type: Object,
    //   default: () => {
    //     return {}
    //   }
    // },
    inqDicts: {
      type: Object,
      default: () => {
        return {}
      }
    },
    checkPlace: {
      type: Boolean,
      default: () => {
        return ''
      }
    }
  },
  components: { distributionDialog, detailDialog },
  watch: {
    waitRoomInfoList: {
      handler: function (newV, oldV) {
        this.waitingCardList = JSON.parse(JSON.stringify(newV))
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    return {
      dialogVisible: false,
      showdistriburoomtext: [],
      isFilterBox: false,
      waitingCardList: this.waitRoomInfoList,
      paramsDialog: {
        dialogType: '',
        total: 0,
        tableData: [],
        distributionDialogVisible: false
      },
      onDetailDialog: {
        tableData: [],
        detailDialogVisible: false
      },
      currentRoom: {},
      sureVal: {},
      processCode: 'waitStart'
    }
  },
  methods: {
    // 提交信息，刷新数据
    handleSubmit (res) {
      if (res.dialogType === 'distribution') { // 分配
        this.judgeDistribution(res)
      } else { // 带离
        let list = JSON.parse(JSON.stringify(res.selectTableItem))
        let string = list.length > 1 ? (list[0].registerName + '等') : (list[0].registerName)
        this.$confirm('确认要将' + string + '带出 ?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'question'
        }).then(() => {
          this.submitTakeAway(res)
        }).catch(() => {
        })
      }
    },
    // 判断是否分配
    async judgeDistribution (data1) {
      for(var i = 0;i<data1.selectTableItem.length;i++) {
        let params = {
          registerIndexCode: data1.selectTableItem[i].registerCode,
          processCode: this.processCode
        }
        const { data } = await server.getCaseAreaProcessConfig(params)
        if (data.code === "0") {
          let _data = data.data
          if(_data.indexOf(',') > -1) {
            this.$message.warning(`${_data.split(',')[1]}！`)
            return false
          }
        }  
      else {
        this.$message.error(this.$i18n.t(data.code))
        return false
      }
      }

      let list = JSON.parse(JSON.stringify(data1.selectTableItem))
      let array = []
      for (let i = 0; i < list.length; i++) {
        array.push(list[i].registerId)
      }
      let params1 = {
        registerIds: array.join(','),
        areaCode: this.currentRoom.areaIndexCode,
        waitRoomCode: this.currentRoom.roomIndexCode,
        roomClassify: this.currentRoom.roomClassify
      }
      let loadingInstance = this.$loading({ fullscreen: true })
      try {
        let res = await server.checkAssignedWaitRoom(params1)
        console.log('返回的内容', res)
        if (res.data.code === '0') {
          loadingInstance.close()
          if (res.data.data.confirm === 'yes') {
            this.dialogVisible = true
            let _data = res.data.data.checkMsg
            let _list = _data.split(',')
            let arr = []
            for (let i = 0; i < _list.length; i++) {
              arr.push(this.$t(_list[i]))
            }
            console.log('arr', arr)
            this.showdistriburoomtext = arr
            this.sureVal = params1
          } else {
            this.submitDistribution(params1)
          }
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
    onSure () {
      let params = this.sureVal
      this.submitDistribution(params)
    },
    // 提交分配
    async submitDistribution (params1) {
      let loadingInstance = this.$loading({ fullscreen: true })
      try {
        let res = await server.assignedWaitRoom(params1)
        if (res.data.code === '0') {
          loadingInstance.close()
          this.paramsDialog.distributionDialogVisible = false
          this.dialogVisible = false
          this.$emit('updateList')
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
    // 提交带离
    async submitTakeAway (data) {
      let list = JSON.parse(JSON.stringify(data.selectTableItem))
      let array = []
      for (let i = 0; i < list.length; i++) {
        array.push(list[i].registerId)
      }
      let params = {
        registerIds: array.join(','),
        waitRoomCode: this.currentRoom.roomIndexCode
      }
      let loadingInstance = this.$loading({ fullscreen: true })
      try {
        let res = await server.leaveWaitRoom(params)
        if (res.data.code === '0') {
          this.paramsDialog.distributionDialogVisible = false
          loadingInstance.close()
          this.$emit('updateList')
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
    // 打开分配弹窗
    onDistribution (item) {
      this.currentRoom = JSON.parse(JSON.stringify(item))
      this.paramsDialog.dialogType = 'distribution'
      this.findNotAssignedWaitRoomRegisterInfoList()
    },
    async findNotAssignedWaitRoomRegisterInfoList () {
      let params = {
        areaCode: this.currentRoom.areaIndexCode,
        registerName: ''
      }
      let res = await server.findNotAssignedWaitRoomRegisterInfoList(params)
      if (res.data.code === '0') {
        this.paramsDialog.tableData = res.data.data
        this.paramsDialog.total = this.currentRoom.remainder
        this.paramsDialog.distributionDialogVisible = true
      } else {
        this.$messagebox(res)
      }
    },
    // 搜索分配/带离人员
    async handleSearchTable (data) {
      if (data.dialogType === 'distribution') { // 分配
        let params = {
          areaCode: this.currentRoom.areaIndexCode,
          registerName: data.searchText
        }
        let res = await server.findNotAssignedWaitRoomRegisterInfoList(params)
        if (res.data.code === '0') {
          this.paramsDialog.tableData = res.data.data
        } else {
          this.$messagebox(res)
        }
      } else { // 带离
        let params = {
          waitRoomCode: this.currentRoom.roomIndexCode,
          bandsNo: data.searchText
        }
        let res = await server.findInWaitRoomRegisterInfoList(params)
        if (res.data.code === '0') {
          this.paramsDialog.tableData = res.data.data
        } else {
          this.$messagebox(res)
        }
      }
    },
    // 实时视频
    async realTimeVideo (item) {
      let params = {
        'waitRoomCode': item.roomIndexCode
      }
      const ress = await server.findWaitRoomCameraInfo(params)
      let res = ress.data
      if (res.code === '0') {
        let data = res.data
        if (data && data.length) {
          let array = []
          for (let i = 0; i < data.length; i++) {
            array.push(data[i].cameraIndexCode)
          }
          let indexCode = array.join(',')
          this.handleShowVideo(indexCode)
        } else {
          this.$message.error('暂无监控点')
        }
      } else {
        this.$messagebox(ress)
      }
    },
    async handleShowVideo (indexCode) {
      let _self = this
      const ress = await server.playerParam()
      let res = ress.data
      if (res.code === '0') {
        let data = res.data
        let protocolType = data.protocol // http https

        let NginxIp = data.nginxIp
        let NginxPort = data.nginxPort
        let sg = data.sg
        let userId = data.userId
        let language = data.language ? data.language : 'zh_CN'
        // 参数
        let sendMsg = `{"comment":{"commenttype":"startapp", "context":"btoolsprotocol:", "commentcmd":"btoolsprotocol://CenterUrl:${protocolType}://${NginxIp}:${NginxPort}/portal;Toollist:PROT_btoolinqplatformplayerprotocol;CmdLine:btoolinqplatformplayerprotocol://ReqType:PlayReal;Language:${language};clear:1;WndCount:1;NginxIp:${NginxIp};NginxPort:${NginxPort};UserID:${userId};sg:${sg};protocol:${protocolType};CamList:${indexCode};appType:imap;gridtrack:1;"}}` // MiniUI:1;
        let socketHost = window.location.protocol.indexOf('https') > -1
          ? 'wss://127.0.0.1:18001/WebS_Js'
          : 'ws://127.0.0.1:18000/WebS_Js'
        try {
          if (!_self.websock) {
            _self.websock = new WebSocket(socketHost)
            _self.websock.onopen = function () {
              // 发送检测插件助手是否安装请求
              let jsonObj = '{"comment":{"commenttype":"checkapp", "context":"btoolsprotocol"}}'
              _self.websock.send(jsonObj)
            }
          } else {
            let jsonObj = '{"comment":{"commenttype":"checkapp", "context":"btoolsprotocol"}}'

            _self.websock.send(jsonObj)
          }
          _self.websock.onerror = function () {
            // 连接失败，通信中间件未安装
            _self.$messagert('检测到您未安装插件助手')
          }
          _self.websock.onmessage = async (data) => {
            let _data = JSON.parse(data.data)
            if (_data && _data.comment && _data.comment.commenttype === 'checkapp') {
              // 检测插件助手是否安装
              if (_data.comment.resultCode === '1') {
                // 模板笔录编辑
                let jsonObj = sendMsg
                _self.websock.send(jsonObj)
              } else {
                _self.$message('检测到您未安装插件助手')
              }
            }
          }
          _self.websock.onclose = function () {
            _self.websock = null
          }
        } catch (err) {
          console.log(err)
        }
      } else {
        _self.$messagebox(ress)
      }
    },
    // 打开带离弹窗
    OnTakeAway (item) {
      this.currentRoom = JSON.parse(JSON.stringify(item))
      this.paramsDialog.dialogType = 'takeAway'
      this.findInWaitRoomRegisterInfoList()
    },
    async findInWaitRoomRegisterInfoList () {
      let params = {
        waitRoomCode: this.currentRoom.roomIndexCode
        // registerName: ''
      }
      let res = await server.findInWaitRoomRegisterInfoList(params)
      if (res.data.code === '0') {
        this.paramsDialog.tableData = res.data.data
        this.paramsDialog.distributionDialogVisible = true
      } else {
        this.$messagebox(res)
      }
    },
    // 查看详情
    async OnDetail (item) {
      this.currentRoom = JSON.parse(JSON.stringify(item))
      let params = {
        waitRoomCode: this.currentRoom.roomIndexCode
        // registerName: ''
      }
      let res = await server.findInWaitRoomRegisterInfoList(params)
      if (res.data.code === '0') {
        this.onDetailDialog.tableData = res.data.data
        this.onDetailDialog.detailDialogVisible = true
      } else {
        this.$messagebox(res)
      }
    }
  },
  created () {
    bus.$off('closeDialog')
    bus.$off('detailCloseDialog')
    bus.$on('closeDialog', (res) => {
      if (!res) {
        this.paramsDialog.tableData = []
        this.paramsDialog.distributionDialogVisible = false
      }
    })
    bus.$on('detailCloseDialog', (res) => {
      if (!res) {
        this.onDetailDialog.tableData = []
        this.onDetailDialog.detailDialogVisible = false
      }
    })
  }
}
</script>

<style lang="less">
.waitingCardPage {
  background: #fff;
  height: 100%;
  .waitingCardItem {
    width: 364px;
    height: 246px;
    margin: 12px;
    display: inline-block;
    border: 1px solid #e6e6e6;
    box-sizing: border-box;
    background: rgba(251, 251, 251, 0.44);
    > li {
      padding: 0 4px;
      box-sizing: border-box;
    }
    .waitingCardItemFullStarffed {
      width: 82px;
      height: 80px;
      padding: 4px;
      position: absolute;
      top: -20px;
      right: -25px;
      border: 1px solid #c52f2f;
      box-sizing: border-box;
      border-radius: 42px;
      .waitingCardItemFullStarffedOutSide {
        width: 100%;
        height: 100%;
        border: 1px solid #c52f2f;
        padding: 2px;
        box-sizing: border-box;
        border-radius: 36px;
        .waitingCardItemFullStarffedInner {
          width: 100%;
          height: 100%;
          border: 1px dashed #c52f2f;
          padding: 2px;
          box-sizing: border-box;
          border-radius: 36px;
          > div {
            width: 100%;
            height: 100%;
            -webkit-transform: rotate(-15deg);
            transform: rotate(-15deg);
            font-family: PingFangSC-Regular;
            font-size: 18px;
            line-height: 55px;
            padding-left: 4px;
            -webkit-box-sizing: border-box;
            padding-top: 4px;
            box-sizing: border-box;
            text-align: left;
            color: #f23030;
          }
        }
      }
    }
    .waitingCardItemTop {
      height: 74px;
      padding-top: 4px;
      overflow: hidden;
      text-align: center;
      position: relative;
      box-sizing: border-box;
      .waitingCardItemTopRoom {
        height: 36px;
        padding-left: 8px;
        box-sizing: border-box;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #4d4d4d;
        letter-spacing: 0;
        line-height: 36px;
        background: #f5f5f5;
        text-align: left;
        padding-right: 55px;
        .roomName {
          display: inline-block;
          max-width: 94px;
        }
        .roomLabel {
          display: inline-block;
          max-width: 152px;
          opacity: 0.7;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #4d4d4d;
          letter-spacing: 0;
        }
      }
      .waitingCardItemTopGender {
        height: 32px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #4d4d4d;
        line-height: 38px;
        > span {
          display: inline-block;
          width: 4px;
          height: 4px;
          background: #2080f7;
          position: relative;
          top: -4px;
          left: -8px;
          border-radius: 2px;
        }
      }
    }
    .waitingCardItemMiddle {
      height: 110px;
      .cardItem {
        float: left;
        width: 160px;
        margin-left: 8px;
        margin-right: 4px;
        height: 100px;
        text-align: center;
        .cardItemNumber {
          height: 62px;
          font-family: PingFangSC-Regular;
          font-size: 36px;
          color: #4d4d4d;
          letter-spacing: 0;
          line-height: 70px;
        }
        .cardItemLabel {
          height: 34px;
          font-size: 14px;
          color: #4d4d4d;
        }
        &.cardItemFirst {
          margin-left: 12px;
          font-family: PingFangSC-Regular;
          font-size: 142px;
          color: #4d4d4d;
          letter-spacing: 0;
          line-height: 20px;
        }
        &.cardItemLast {
          margin-right: 0px;
        }
      }
    }
    .waitingCardItemBottom {
      height: 44px;
      .waitingCardItemBottomIcon {
        width: 100%;
        height: 16px;
        position: relative;
        .iconLeft {
          width: 7px;
          height: 16px;
          border-right: 1px solid #d8d8d8;
          border-radius: 0 8px 8px 0;
          position: absolute;
          background: #fff;
          left: -5px;
        }
        .iconCenter {
          width: ~"calc(100% - 4px)";
          height: 16px;
          line-height: 16px;
          color: #d8d8d8;
          position: absolute;
          left: 7px;
          overflow: hidden;
        }
        .iconRight {
          width: 7px;
          height: 16px;
          border-left: 1px solid #d8d8d8;
          border-radius: 8px 0 0 8px;
          position: absolute;
          right: -5px;
          background: #fff;
        }
      }
      .waitingCardItemBottomBtn {
        height: 28px;
        line-height: 28px;
        padding-left: 2px;
        box-sizing: border-box;
        > .el-button.is-icon {
          padding: 6px 4px;
          > span {
            margin-left: 4px;
          }
        }
        > .el-button + .el-button {
          margin-left: 8px;
        }
      }
    }
  }
  .el-dialog.alertMsgDialog {
    .el-dialog__header {
      border-bottom: none;
    }
    .el-dialog__body {
      .alertMsg {
        color: #2080f7;
        font-size: 36px;
        position: relative;
        top: 8px;
        margin-right: 16px;
      }
    }
    .el-dialog__footer {
      background-color: transparent;
    }
  }
}
</style>
