<template>
  <div id="activityRecord">
    <el-scrollbar v-loading="loadingInstance"
                  wrap-class="scrollbarWrap"
                  view-class="scrollbarView"
                  ref="scrollbar">
      <div class="activityRecordBox"
           :style="activityListWidth">
        <template v-for="(item, index) in activityList">
          <li class="activityListBox"
              :key="index"
              :style="computedStyle(index+ 1)">
            <div class="activityBox"
                 :style="computedLfet(index + 1)">
              <div class="activityBoxStatus">
                <div>
                  <div class="icon-connectSuccess"></div>
                </div>
              </div>
              <div class="activityBoxTime overflow"
                   :title="item.businessFinishTime || ''">
                {{ item.businessFinishTime || '' }}
                <i></i>
                <span class="spanL"></span>
                <span class="spanR"></span>
              </div>
              <div class="activityBoxLeft">
                <div class="activityBoxLeftIcon">
                  <span :class="item.activeType ? activityType[item.activeType].icon + ' icon-icon' : ''">
                    <template v-show="item.activeType ===8">
                      <span class="path1"></span><span class="path2"></span><span class="path3"></span>
                    </template>
                  </span>
                </div>
                <div class="activityBoxLeftLabel">
                  {{ item.activeType ? activityType[item.activeType].name : '' }}
                </div>
              </div>
              <div class="activityBoxRight">
                <div class="activityBoxRightVedio">
                  <span :title="item.roomName"
                        class="roomName overflow">{{ item.roomName }}</span>
                  <span class="linevedio overflow"
                        v-show="item.roomName || (item.activeCameraInfoList && item.activeCameraInfoList.length)">|</span>
                  <span class="cameraName overflow"
                        v-show="item.activeCameraInfoList && item.activeCameraInfoList.length "
                        :title="item.activeCameraInfoList && item.activeCameraInfoList.length && item.activeCameraInfoList[0]['cameraName']">{{ item.activeCameraInfoList && item.activeCameraInfoList.length && item.activeCameraInfoList[0]['cameraName'] }}</span>
                  <span class="icon-icon-circlePlay icon-icon"
                        v-show="item.activeCameraInfoList && item.activeCameraInfoList.length "
                        @click="showVideo(item)"></span>
                </div>
                <div class="activityBoxRightStartTime overflow"
                     :title="item.startTime || ''">
                  开始时间：{{ item.startTime || '' }}
                </div>
                <div class="activityBoxRightEndTime overflow"
                     :title="item.endTime || ''">
                  结束时间：{{ item.endTime || '' }}
                </div>
              </div>
            </div>
            <div class="activityArrow"
                 v-if="showLine(index + 1)"
                 :style="computedActivityListLineStyle(index + 1)">
            </div>
            <div class="activityArrowLine"
                 v-if="index === 0 || index === activityList.length - 1"
                 :style="computedActivityArrowLineStyle(index + 1)">
              <div class="startEnd startEnd_start"
                   v-show="index === 0">
                <span class="startEndSpan"></span>
              </div>
              <div class="startEnd startEnd_end"
                   :style="computedstartEnd_end(index + 1)"
                   v-show="index === activityList.length - 1">
                <span class="startEndSpan"></span>
              </div>
            </div>
          </li>
        </template>
        <div :style="'height:'+ currentBoxHeight+'px'"></div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
// import { Main } from '../../../components/Layout'
import server from '../../../server/ledgerManage'
export default {
  name: 'TimeAxis',
  props: {
    currentRegisterId: {
      type: Number,
      default: 1
    },
    inqDictList: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    currentBoxHeight () {
      let lenth =
        Math.ceil(this.activityList.length / this.colSpan) *
        this.activityListBoxHeight +
        100
      return lenth
    }
  },
  data () {
    return {
      loadingInstance: false,
      // activityList: [{statue: 0}, {statue: 1}, {statue: 1}, {statue: 0}, {statue: 1}, {statue: 1}, {statue: 0}, {statue: 1}, {statue: 1}],
      activityList: [],
      activityListWidth: 'width:1200px;',
      colSpan: 3,
      activityListBoxWidth: 360,
      activityListBoxHeight: 260,
      activityType: {
        1: {
          name: '入区登记',
          icon: 'icon-icon-RegistrationInDistrict'
        },
        2: {
          name: '人身检查',
          icon: 'icon-icon-personalExamination'
        },
        3: {
          name: '物品登记',
          icon: 'icon-icon-TemporaryStorage'
        },
        4: {
          name: '信息采集',
          icon: 'icon-icon-informationAcquisition'
        },
        5: {
          name: '吸毒检测',
          icon: 'icon-icon-drugAbuseDetection'
        },
        6: {
          name: '候问',
          icon: 'icon-icon-WaitAsk'
        },
        7: {
          name: '讯/询问',
          icon: 'icon-icon-Interrogation'
        },
        8: {
          name: '物品归还',
          icon: 'icon-icon-returnOfGoods'
        },
        9: {
          name: '临时出区',
          icon: 'icon-icon-TemporaryExit'
        },
        10: {
          name: '最终出区登记',
          icon: 'icon-icon-FinalExit'
        },
        11: {
          name: '回区',
          icon: 'icon-icon-BackArea'
        }
      },
      websock: null
    }
  },
  methods: {
    async findActiveInfo () {
      this.loadingInstance = true

      try {
        let params = {
          registerId: this.currentRegisterId
        }
        let res = await server.findActiveInfo(params)
        if (res.data.code === '0') {
          let data = res.data.data
          if (data) {
            this.activityList = JSON.parse(JSON.stringify(data))
          } else {
            this.activityList = []
            this.$message({
              type: 'warning',
              message: '暂无活动信息'
            })
          }
          this.loadingInstance = false
        } else {
          this.$messagebox(res)
          this.loadingInstance = false
        }
      } catch {
        this.loadingInstance = false
      }
    },
    // 视频回放
    async showVideo (item) {
      let params = {
        activeId: item.activeId
      }
      const ress = await server.playBackActiveInfoVideo(params)
      let res = ress.data
      if (res.code === '0') {
        let data = res.data[0]
        let indexCode = data.cameraCode
        let enterTime = data.startTime
        let leaveTime = data.endTime
        let camlist = indexCode + '_' + enterTime + '_' + leaveTime
        this.handleShowVideo(camlist, indexCode)
      } else {
        this.$messagebox(ress)
      }
    },
    async handleShowVideo (camlist, indexCode) {
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
        let sendMsg = `{"comment":{"commenttype":"startapp", "context":"btoolsprotocol:", "commentcmd":"btoolsprotocol://CenterUrl:${protocolType}://${NginxIp}:${NginxPort}/portal;Toollist:PROT_btoolinqplatformplayerprotocol;CmdLine:btoolinqplatformplayerprotocol://ReqType:PlayBack;Language:${language};clear:1;WndCount:1;NginxIp:${NginxIp};NginxPort:${NginxPort};UserID:${userId};sg:${sg};protocol:${protocolType};CamList:${camlist};appType:imap;gridtrack:1;"}}` // MiniUI:1;

        let socketHost =
          window.location.protocol.indexOf('https') > -1
            ? 'wss://127.0.0.1:18001/WebS_Js'
            : 'ws://127.0.0.1:18000/WebS_Js'
        try {
          if (!_self.websock) {
            _self.websock = new WebSocket(socketHost)
            _self.websock.onopen = function () {
              // 发送检测插件助手是否安装请求
              let jsonObj =
                '{"comment":{"commenttype":"checkapp", "context":"btoolsprotocol"}}'
              _self.websock.send(jsonObj)
            }
          } else {
            let jsonObj =
              '{"comment":{"commenttype":"checkapp", "context":"btoolsprotocol"}}'

            _self.websock.send(jsonObj)
          }
          _self.websock.onerror = function () {
            // 连接失败，通信中间件未安装
            _self.$message('检测到您未安装插件助手')
          }
          _self.websock.onmessage = async data => {
            let _data = JSON.parse(data.data)
            if (
              _data &&
              _data.comment &&
              _data.comment.commenttype === 'checkapp'
            ) {
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
    computedStyle (itemNumber) {
      let offWidth = this.activityListBoxWidth / 2 + 32
      let string = ''
      let currentRow = Math.ceil(itemNumber / this.colSpan) - 1 // 所在行 0,1,2，。。。。
      let currentCol = itemNumber % this.colSpan || this.colSpan // 所在的列 1,2,3，。。。。
      if (currentCol === 1 || currentCol === this.colSpan) {
        string =
          'width:' +
          offWidth +
          'px;height:' +
          this.activityListBoxHeight +
          'px;'
      } else {
        string =
          'width:' +
          this.activityListBoxWidth +
          'px;height:' +
          this.activityListBoxHeight +
          'px;'
      }
      if (currentRow % 2 !== 0) {
        // 偶数行
        let _number = this.colSpan - currentCol //
        string +=
          'left:' +
          (_number === 0
            ? offWidth
            : _number * this.activityListBoxWidth + 64) +
          'px;top:' +
          currentRow * this.activityListBoxHeight +
          'px;'
      } else {
        // 奇数行
        if (currentCol === 1) {
          string +=
            'left:' +
            offWidth +
            'px;top:' +
            currentRow * this.activityListBoxHeight +
            'px;'
        } else if (currentCol === 2) {
          string +=
            'left:' +
            offWidth * 2 +
            'px;top:' +
            currentRow * this.activityListBoxHeight +
            'px;color:#aaa;'
        } else {
          string +=
            'left:' +
            ((currentCol - 2) * this.activityListBoxWidth + offWidth * 2) +
            'px;top:' +
            currentRow * this.activityListBoxHeight +
            'px;color:#aaa;'
        }
      }
      return string
    },
    computedActivityListLineStyle (index) {
      let currentRow = Math.ceil(index / this.colSpan)
      let $index = currentRow % 2
      let _index = index % this.colSpan

      let offWidth = this.activityListBoxWidth / 2 + 32
      let string =
        'width:' +
        offWidth +
        'px;height:' +
        (this.activityListBoxHeight + 4) +
        'px; top: ' +
        this.activityListBoxHeight +
        'px;'
      if ($index === 1) {
        // 奇数 border-width: 0 4px 0 0;
        if (_index === 0) {
          string +=
            'right:-' +
            offWidth +
            'px;border-width: 4px 4px 4px 0;border-radius: 0 ' +
            offWidth +
            'px ' +
            offWidth +
            'px 0;'
        }
      } else {
        if (_index === 0) {
          string +=
            'left:-' +
            offWidth +
            'px;border-width: 4px 0 4px 4px;border-radius: ' +
            offWidth +
            'px 0  0 ' +
            offWidth +
            'px;'
        }
      }
      return string
    },
    computedActivityArrowLineStyle (index) {
      let currentRow = Math.ceil(index / this.colSpan)
      let $index = currentRow % 2
      let offWidth = this.activityListBoxWidth / 2 + 32
      let string =
        'border-width: 0px 0 4px 0px;width:' +
        offWidth +
        'px;height:' +
        (this.activityListBoxHeight + 4) +
        'px;'
      if (index === 1) {
        string = string + 'left:-' + offWidth + 'px;'
      } else if (index === this.activityList.length) {
        if ($index === 1) {
          string = string + 'right:-' + offWidth + 'px;top:0;'
        } else {
          string = string + 'left:-' + offWidth + 'px;top:0;'
        }
      }
      return string
    },
    computedLfet (index) {
      let currentRow = Math.ceil(index / this.colSpan)
      let $index = currentRow % 2
      let string = ''

      if ($index === 1) {
        if (index % this.colSpan === 0) {
          string = string + 'left:16px;'
        }
      } else {
        if (index % this.colSpan === 1) {
          string = string + 'left:16px;'
        }
      }
      return string
    },
    showLine (index) {
      if (index === this.activityList.length) {
        return false
      }
      let _index = index % this.colSpan
      if (_index === 0) {
        return true
      } else {
        return false
      }
    },
    cumputedWidth () {
      let el = document.querySelectorAll('#activityRecord')
      if (el && el.length) {
        let _width = el[0].offsetWidth
        if (_width > 320 * 5 + 40) {
          this.activityListWidth = 'width:1350px;'
          this.colSpan = 4
          this.activityListBoxWidth = 304
          this.activityListBoxHeight = 270
        } else {
          this.activityListWidth = 'width:1200px;'
          this.colSpan = 3
          this.activityListBoxWidth = 350
          this.activityListBoxHeight = 260
        }
      } else {
        this.activityListWidth = 'width:1200px;'
        this.colSpan = 3
        this.activityListBoxWidth = 360
        this.activityListBoxHeight = 260
      }
    },
    computedstartEnd_end (index) {
      let string = ''
      let currentRow = Math.ceil(index / this.colSpan) - 1 // 所在行 0,1,2，。。。。
      if (index === 1) {
        string =
          string + 'right:-' + (this.activityListBoxWidth / 2 + 40) + 'px'
      } else {
        if (currentRow % 2) {
          string = string + 'left:0px'
        } else {
          string = string + 'right:0px'
        }
      }
      return string
    }
  },
  created () {
    this.findActiveInfo()
  },
  mounted () {
    window.addEventListener('resize', () => {
      this.cumputedWidth()
    })
    this.cumputedWidth()
  },
  destroyed () {
    this.websock && this.websock.close()
  }
}
</script>

<style lang="less" rel="stylesheet/less">
#activityRecord {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .scrollbarView {
    // padding: 0 260px;
    // box-sizing: border-box;
  }
  .activityRecordBox {
    // width: 1350px;
    // height: 100%;
    padding: 16px 0;
    box-sizing: border-box;
    margin: 0 auto;
    position: relative;
    .activityListBox {
      list-style: none;
      display: inline-block;
      z-index: 1;
      // width: 340px;
      // height: 200px;
      border-bottom: 4px solid #6de7be;
      position: absolute;
      box-sizing: content-box;
      .activityBox {
        list-style: none;
        border-radius: 4px;
        z-index: 2;
        display: inline-block;
        width: 288px;
        height: 117px;
        border: 1px solid #2185f8;
        position: absolute;
        bottom: 40px;
        right: 0px;
        .icon-icon {
          color: #fff;
          &.icon-icon-returnOfGoods {
            > .path2:before {
              color: #279bfd;
            }
          }
        }
        .activityItem {
          width: 100%;
          height: 100%;
          .activityItemTitle {
            width: 100%;
            height: 48px;

            border-radius: 4px 4px 0 0;
            background-image: linear-gradient(90deg, #2185f8 0%, #45bbfc 100%);
            > i {
              font-family: PingFangSC-Medium;
              font-size: 24px;
              color: #ffffff;
              position: relative;
              top: -14px;
              left: 14px;
            }
            > span {
              line-height: 48px;
              font-family: PingFangSC-Medium;
              font-size: 14px;
              color: #ffffff;
              position: relative;
              left: 24px;
              display: inline-block;
              max-width: 200px;
            }
          }
          .activityItemContent {
            padding: 0px 16px 0 60px;
            box-sizing: border-box;
            height: 112px;
            .activityItemContentData {
              height: 100%;
              .activityItemName {
                height: 36px;
                line-height: 36px;
              }
              .activityItemTime {
                height: 24px;
                line-height: 24px;
              }
              .activityItemVideo {
                height: 40px;
                position: relative;
                .activityVideo {
                  width: 100%;
                  height: 20px;
                  padding-left: 36px;
                  line-height: 28px;
                  box-sizing: border-box;
                  position: relative;
                  > span {
                    font-family: PingFangSC-Regular;
                    font-size: 12px;
                    color: #4d4d4d;
                    display: inline-block;
                    max-width: 140px;
                  }
                  > i {
                    color: #2080f7;
                    padding-left: 24px;
                  }
                }
                .activityVideoLine {
                  position: absolute;
                  left: 10px;
                  width: 15px;
                  height: 27px;
                  border-width: 0 0 1px 1px;
                  border-color: #eeeeee;
                  border-style: solid;
                  > .activityVideoLineCircular {
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    width: 4px;
                    background: #eeeeee;
                    height: 4px;
                    border-radius: 2px;
                  }
                }
              }
            }
          }
        }
        .activityBoxLeft {
          width: 76px;
          height: 100%;
          float: left;
          background-image: linear-gradient(-180deg, #29a3fe 0%, #2080f7 100%);
          > .activityBoxLeftIcon {
            height: ~"calc(100% - 48px)";
            padding: 24px 18px 0px 18px;
            box-sizing: border-box;
            > span {
              font-size: 40px;
            }
          }
          > .activityBoxLeftLabel {
            height: 48px;
            font-size: 12px;
            padding: 0 12px;
            box-sizing: border-box;
            line-height: 16px;
            color: #fff;
            text-align: center;
          }
        }
        .activityBoxRight {
          width: ~"calc(100% - 76px)";
          height: 100%;
          float: left;
          .activityBoxRightVedio {
            height: 46px;
            line-height: 46px;
            padding-left: 4px;
            box-sizing: border-box;
            position: relative;
            span {
              height: 46px;
              box-sizing: border-box;
              padding: 8px;
              font-family: PingFangSC-Regular;
              font-size: 12px;
              color: #4d4d4d;
              letter-spacing: 0;
              &.icon-icon-circlePlay {
                position: absolute;
                height: 32px;
                right: 12px;
                top: 8px;
                color: #2185f8;
                font-size: 16px;
                cursor: pointer;
              }
              &.icon-icon-circlePlay:before {
                color: #2185f8;
              }
              &.roomName {
                max-width: 80px;
                line-height: 32px;
                display: inline-block;
              }
              &.cameraName {
                max-width: 88px;
                line-height: 32px;
                display: inline-block;
              }
              &.linevedio {
                width: 2px;
                display: inline-block;
                padding: 0;
              }
            }
          }
          > .activityBoxRightStartTime,
          > .activityBoxRightEndTime {
            height: 26px;
            line-height: 26px;
            text-indent: 14px;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #4d4d4d;
            letter-spacing: 0;
          }
        }
        .activityPoint {
          position: absolute;
          top: 68px;
          right: -52px;
          width: 30px;
          height: 8px;
          background: #3bcd8d;
          box-shadow: 0 2px 4px 0 rgba(59, 205, 141, 0.5);
          > .activityArrow {
            width: 0;
            position: absolute;
            top: -8px;
            right: -24px;
            border-width: 12px;
            border-color: transparent transparent transparent #3bcd8d;
            border-style: solid dashed dashed dashed;
          }
        }
      }
      .activityBoxStatus {
        position: absolute;
        bottom: -61px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 3;
        width: 43px;
        height: 43px;
        border-radius: 24px;
        background: #fff;
        > div {
          width: 36px;
          height: 36px;
          background: #dcffef;
          border-radius: 18px;
          position: absolute;
          top: 4px;
          left: 4px;
          > div {
            width: 28px;
            height: 28px;
            background: #fff;
            border-radius: 14px;
            position: absolute;
            top: 4px;
            font-size: 28px;
            line-height: 30px;
            color: #3bcd8d;
            position: relative;
            top: 3px;
            left: 4px;
          }
        }
      }
      .activityBoxTime {
        position: absolute;
        bottom: -100px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 3;
        width: 164px;
        height: 28px;
        background: #f6f6f6;
        overflow: hidden;
        padding-left: 24px;
        box-sizing: border-box;
        line-height: 28px;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #4d4d4d;
        > i {
          position: absolute;
          top: 50%;
          left: 12px;
          transform: translateY(-50%);
          z-index: 3;
          width: 4px;
          height: 4px;
          border-radius: 4px;
          background: #3bcd8d;
        }
        .spanL {
          position: absolute;
          bottom: 10px;
          left: 0px;
          transform: translateX(-50%);
          z-index: 3;
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background: #fff;
        }
        .spanR {
          position: absolute;
          bottom: 10px;
          right: -7px;
          transform: translateX(-50%);
          z-index: 3;
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background: #fff;
        }
      }
      .activityArrow {
        position: absolute;
        box-sizing: border-box;
        border-color: #6de7be;
        border-style: solid;
      }
      .activityArrowLine {
        position: absolute;
        top: 0px;
        height: 204px;
        width: 130px;
        box-sizing: border-box;
        border-color: #6de7be;
        border-style: solid;
        .startEnd {
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 8px;
          padding: 4px;
          box-sizing: border-box;
          bottom: -8px;
          > span {
            display: inline-block;
            width: 8px;
            height: 8px;
            position: absolute;
            top: 4px;
            left: 4px;

            border-radius: 6px;
          }
          &.startEnd_start {
            left: 0px;
            background: #6de8c0;
            > span {
              background: #ebfaf3;
            }
          }
          &.startEnd_end {
            right: -8px;
            background: #6de8c0;
            > span {
              background: #ebfaf3;
            }
          }
        }
      }
      > .activityArrowItem {
        width: 16px;
        height: 16px;
        border-radius: 8px;
        background: rgba(59, 205, 141, 0.2);
        position: absolute;
        bottom: -8px;
        left: 50%;
        margin-left: -8px;
      }
    }
  }
}
</style>
