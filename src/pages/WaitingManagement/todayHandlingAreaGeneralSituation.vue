<template>
  <div class="todayHandlingAreaGeneralSituationPage">
    <div class="mainContent">
      <div class="titleContent">
        办案区慨况
      </div>
      <div class="todayHandlingAreaGeneralSituationContent">
        <ul class="todayHandlingAreaGeneralSituationItem firstItem">
          <li class="itemNumber">
            {{ inAreaPerson || 0 }}
          </li>
          <li class="itemLabel">
            在区涉案人数
          </li>
        </ul>
        <ul class="todayHandlingAreaGeneralSituationItem">
          <li class="itemNumber">
            {{ inWaitPerson || 0 }}
          </li>
          <li class="itemLabel">
            侯问人数
          </li>
        </ul>
        <ul class="todayHandlingAreaGeneralSituationItem">
          <li class="itemNumber">
            {{ inInquestPerson || 0 }}
          </li>
          <li class="itemLabel">
            讯问人数
          </li>
        </ul>
        <ul class="todayHandlingAreaGeneralSituationItem">
          <li class="itemNumber">
            {{ inAreaPolice || 0 }}
          </li>
          <li class="itemLabel">
            在区民警
          </li>
        </ul>
        <ul class="todayHandlingAreaGeneralSituationItem">
          <li class="itemNumber">
            {{ temporaryLeavePerson || 0 }}
          </li>
          <li class="itemLabel">
            临时出区
          </li>
        </ul>
        <ul class="todayHandlingAreaGeneralSituationItem lastItem">
          <li class="itemNumber">
            {{ (inAreaPerson || 0) - 0 + ((temporaryLeavePerson || 0) - 0) }}
          </li>
          <li class="itemLabel">
            总涉案人数
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import server from '../../server/waitingManagement'
import ReconnectingWebSocket from '../../mixin/reconnecting-websocket'
export default {
  name: 'TodayHandlingAreaGeneralSituation',
  props: {
    paramsSearch: {
      type: Object,
      default: () => {
        return {
          areaCode: '',
          name: ''
        }
      }
    },
    currentroomName: {
      type: String,
      default: null
    }
  },
  watch: {
    paramsSearch: {
      handler: function (newV, oldV) {
        if (newV.areaCode) {
          this.findWaitRoomInfo()
        }
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    return {
      inAreaPerson: 0,
      inWaitPerson: 0,
      inInquestPerson: 0,
      inAreaPolice: 0,
      temporaryLeavePerson: 0,
      finalLeavePerson: 0,
      timer: null,
      roomClassify: '',
      updatewebsock: null
    }
  },
  methods: {
    // 刷新卡片信息
    initSocket () {
      let ip = window.location.host
      let socketHost = window.location.protocol.indexOf('https') > -1
        ? `wss://${
        ip
        }/casehandlingmgt/websocket/statistics/message.ws`
        : `ws://${
        ip
        }/casehandlingmgt/websocket/statistics/message.ws`
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
            this.findWaitRoomInfo()
          }
        }
      } catch (err) {
        this.$message.error('连接失败')
      }
    },
    async findWaitRoomInfo () {
      let params = {
        areaCode: this.paramsSearch.areaCode,
        name: this.paramsSearch.name
      }
      const res = await server.findWaitRoomInfo(params)
      if (res.data.code === '0') {
        let data = res.data.data
        if (data && data.statisticsAreaInfo) {
          this.inAreaPerson = data.statisticsAreaInfo.inAreaPerson
          this.inWaitPerson = data.statisticsAreaInfo.inWaitPerson
          this.inInquestPerson = data.statisticsAreaInfo.inInquestPerson
          this.inAreaPolice = data.statisticsAreaInfo.inAreaPolice
          this.temporaryLeavePerson = data.statisticsAreaInfo.temporaryLeavePerson
          this.finalLeavePerson = data.statisticsAreaInfo.finalLeavePerson
        } else {
          this.inAreaPerson = 0
          this.inWaitPerson = 0
          this.inInquestPerson = 0
          this.inAreaPolice = 0
          this.temporaryLeavePerson = 0
          this.finalLeavePerson = 0
        }
      } else {
        this.$messagebox(res)
      }
    }
  },
  created () {
    this.initSocket()
    if (this.paramsSearch && this.paramsSearch.areaCode) {
      this.findWaitRoomInfo()
    }
  },
  destroyed () {
    this.updatewebsock && this.updatewebsock.close()
  },
}
</script>

<style lang="less">
.todayHandlingAreaGeneralSituationPage {
  height: 100%;
  padding-bottom: 8px;
  box-sizing: border-box;
  background: #f2f2f2;
  .mainContent {
    height: 100%;
    background: #fff;
    padding: 8px 16px;
    box-sizing: border-box;
    .titleContent {
      height: 32px;
      line-height: 32px;
      font-family: PingFangSC-Semibold;
      font-size: 14px;
      color: #4d4d4d;
      letter-spacing: 0;
    }
    .todayHandlingAreaGeneralSituationContent {
      height: ~"calc(100% - 32px)";
      padding-top: 16px;
      box-sizing: border-box;
      text-align: center;
      .todayHandlingAreaGeneralSituationItem {
        display: inline-block;
        width: 96px;
        height: 65px;
        margin: 0 48px;
        .itemNumber {
          display: inline-block;
          width: 96px;
          height: 36px;
          line-height: 28px;
          font-family: PingFangSC-Regular;
          font-size: 32px;
          color: #1a1a1a;
          letter-spacing: 0;
          text-align: center;
        }
        .itemLabel {
          display: inline-block;
          width: 96px;
          height: 28px;
          line-height: 36px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #4d4d4d;
          letter-spacing: 0;
          text-align: center;
        }
        &.firstItem {
          margin-left: 0;
        }
        &.lastItem {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
