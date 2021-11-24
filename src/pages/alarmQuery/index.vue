<template>
  <watermarkContent>
    <div class="index-layout" v-show="exist">
      <div class="top-line">
        <!-- <div class="camera-name">{{ cameraName }}</div> -->
        <div class="camera-name">
          <span class="col1">报警地点：{{ roomName }}</span>
          <span class="col1">关联人员：{{ registerName }}</span>
        </div>
        <div class="close-btn" @click="stopAll('isShow')">
          <i class="h-icon-close_f"></i>
        </div>
      </div>
      <div class="playerWrap" v-show="exist" id="player-area">
        <SimplePlayer
          ref="palyBackSimpleplayer"
          player-id="player1"
          :bind-policy="bindPolicy"
          :notify-method="onNotify"
          @load-result="onLoadResult"
          style="width: 100%; display: block"
          :style="{ height: 'calc(100% - 44px)' }"
        />
        <!-- 回放按钮 -->
        <div class="player-tool">
          <div
            class="player-tool-btn"
            style="padding: 6px; box-sizing: border-box"
            :title="bPlayback ? '暂停' : '恢复'"
            @click="pausePlayback(bPlayback)"
          >
            <i class="player-tool-btn_off" title="暂停" v-if="bPlayback"></i>
            <i class="player-tool-btn_on" title="恢复" v-else></i>
          </div>

          <div class="player-tool-btn" @click="sound">
            <i class="h-icon-talk_on" title="关闭声音" v-if="bOpenSound"></i>
            <i class="h-icon-talk_off" title="打开声音" v-else></i>
          </div>
          <div class="player-tool-btn" @click="fullScreen">
            <i
              class="h-icon-windows_maximum"
              title="全屏"
              v-if="!isFullscreen"
            ></i>
            <i class="h-icon-windows_minimize" title="取消全屏" v-else></i>
          </div>
        </div>
      </div>
      <!-- <button style="margin:6px;" @click="doPlayBack" >开始回放</button>
    <button style="margin:6px;" @click="stopPlayBack" >停止回放</button>
    <button style="margin:6px;" @click="setExist(true)" >创建播放器</button>    
    <button style="margin:6px;" @click="setExist(false)" >销毁播放器</button>
 -->
    </div>
    <div class="alarm-query">
      <div class="content-box">
        <FilterSearchBox>
          <FilterSearchItem>
            <div class="item-lable">办案区</div>
            <div class="item-input">
              <el-select
                v-model="searchForm.areaIndexCode"
                placeholder="请选择"
                clear
              >
                <el-option
                  v-for="(item, index) in authAreaList"
                  :key="index"
                  :label="item.areaName"
                  :value="item.areaIndexCode"
                >
                </el-option>
              </el-select>
            </div>
          </FilterSearchItem>
          <FilterSearchItem>
            <div class="item-lable">报警级别</div>
            <div class="item-input">
              <el-select
                v-model="searchForm.alarmLevel"
                placeholder="请输入"
                clear
              >
                <el-option label="全部" value=""> </el-option>
                <el-option label="低" value="0"> </el-option>
                <el-option label="中" value="1"> </el-option>
                <el-option label="高" value="2"> </el-option>
              </el-select>
            </div>
          </FilterSearchItem>
          <!-- <FilterSearchItem>
            <div class="item-lable">
              报警ID
            </div>
            <div class="item-input">
              <el-input v-model="searchForm.alarmId"
                        placeholder="请输入"></el-input>
            </div>
          </FilterSearchItem> -->
          <FilterSearchItem>
            <div class="item-lable">报警类型</div>
            <div class="item-input">
              <el-select
                v-model="searchForm.alarmType"
                placeholder="请输入"
                clear
              >
                <el-option
                  v-for="v in alarmTypeList"
                  :key="v.alarmType + '1'"
                  :label="v.alarmTypeName"
                  :value="v.alarmType"
                >
                </el-option>
              </el-select>
            </div>
          </FilterSearchItem>
          <FilterSearchItem :is-col2="true">
            <div class="item-lable">报警时间</div>
            <div class="item-input">
              <el-date-picker
                v-model="alarmTime"
                type="datetimerange"
                placeholder="选择日期范围"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :style="{ width: '100%' }"
              >
              </el-date-picker>
            </div>
          </FilterSearchItem>
          <FilterSearchItem :is-btn="true">
            <el-button type="primary" @click="searchHandle"> 查询 </el-button>
            <el-button @click="resetHandle"> 重置 </el-button>
          </FilterSearchItem>
        </FilterSearchBox>
        <FilterSearchContent>
          <el-table
            ref="autoTable"
            :data="tableData"
            force-scroll
            style="width: 100%"
            v-loading="loading"
          >
            <el-table-column type="index" label="序号" width="55">
            </el-table-column>
            <el-table-column
              prop="picUrl"
              label="抓拍照片"
              show-overflow-title
              width="120"
            >
              <template slot-scope="scope">
                <img
                  class="picUrl picUrlImg"
                  v-if="scope.row.picUrl"
                  :src="scope.row.picUrl"
                  @click="showBigPic(scope.row.picUrl)"
                  alt=""
                />
                <div v-else class="picUrl picUrlDiv"></div>
              </template>
            </el-table-column>
             <el-table-column
              prop="areaName"
              :resizable="false"
              label="办案区"
              show-overflow-title
            >
            </el-table-column>
            <el-table-column
              prop="alarmTime"
              label="报警时间"
              show-overflow-title
            >
              <template slot-scope="scope">
                {{ $moment(scope.row.alarmTime).format('YYYY-MM-DD HH:mm:ss') }}
              </template>
            </el-table-column>
            <el-table-column
              prop="roomName"
              label="报警地点"
              show-overflow-title
            >
            </el-table-column>
            <el-table-column
              prop="alarmTypeName"
              label="报警类型"
              show-overflow-title
            >
            </el-table-column>
            <el-table-column
              prop="registerName"
              label="关联人员"
              show-overflow-title
            >
            </el-table-column>
            
            <el-table-column
              prop="alarmLevel"
              label="报警级别"
              show-overflow-title
            >
              <template slot-scope="scope">
                <span class="alarmLevel l" v-if="scope.row.alarmLevel == 0"
                  >低</span
                >
                <span class="alarmLevel c" v-if="scope.row.alarmLevel == 1"
                  >中</span
                >
                <span class="alarmLevel h" v-if="scope.row.alarmLevel == 2"
                  >高</span
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" show-overflow-title width="120">
              <template slot-scope="scope">
                <span class="table-ctrl-btn" @click="lookAlarmVideo(scope.row)"
                  >查看报警视频</span
                >
              </template>
            </el-table-column>
          </el-table>
        </FilterSearchContent>
      </div>
      <div class="pagination-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.pageNo"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="searchForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageTotal"
        >
        </el-pagination>
      </div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        size="small"
        :area="[425, 520]"
        :before-close="beforeClose"
      >
        <div class="bigPicBox">
          <img :src="bigPicUrl" alt="" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="beforeClose">关 闭</el-button>
        </span>
      </el-dialog>
    </div>
  </watermarkContent>
</template>
<script>
import FilterSearchBox from '../../components/FilterSearchBox/FilterSearchBox'
import FilterSearchItem from '../../components/FilterSearchItem/FilterSearchItem'
import FilterSearchContent from '../../components/FilterSearchContent/FilterSearchContent'
import server from '../../server/alarmQuery'
import {
  SimplePlayer,
  SimplePlayerConfig,
  crashOccurPromise,
  getSnapShotPath,
  setSnapShotPath,
} from 'client-container'
import picurl from '../../assets/defaultimg.png'

export default {
  name: 'AlarmQuery',
  data() {
    return {
      picurl: picurl,
      alarmTypeList: [],
      isFullscreen: false,
      wsSocket: null,
      loading: false,
      areaList: [],
      alarmTime: '',
      searchForm: {
        startTime: '',
        endTime: '',
        alarmLevel: '',
        alarmId: '',
        pageNo: 1,
        pageSize: 20,
        alarmTime: '',
        alarmType: '',
        areaIndexCode:''
      },
      lastestParams: null,
      pageTotal: 0,
      isFilterBox: false,
      tableData: [],
      multipleSelection: [],

      roomName: '',
      registerName: '',
      bOpenSound: false,
      bPlayback: true,
      exist: false /* 播放器创建销毁 */,
      bindPolicy: 0 /* 创建播放器的类型 */,
      dialogVisible: false,
      bigPicUrl: '',
      authAreaList:[]
    }
  },
  created() {
    this.webSocketConnect()
  },
  beforeDestroy() {
    this.wsSocket && this.wsSocket.close()
  },
  activated() {
    this.lastestParams
      ? this.findAlarmInfoPage(this.lastestParams)
      : this.findAlarmInfoPage()
  },
  mounted() {
    this.searchForm = { ...this.searchForm, pageNo: 1 }
    this.getToken()
    this.getAlarmTypeList()
    this.findAuthUserPlaceList()
  },
  methods: {
       // 获取办案区
    async findAuthUserPlaceList() {
      const result = await server.findAuthUserPlaceList()
      const { data } = result
      if (data.code == '0') {
        this.authAreaList = data.data.list
        this.searchForm.areaIndexCode = ''
      } else {
        this.$messagebox(result)
      }
    },
    showBigPic(url) {
      this.bigPicUrl = url
      this.dialogVisible = true
    },
    beforeClose(val) {
      this.dialogVisible = false
      this.$nextTick(() => {
        this.bigPicUrl = ''
      })
    },
    async getAlarmTypeList() {
      const result = await server.getAlarmTypeList()
      const { data } = result
      if (data.code == '0') {
        let list = data.data
        list.unshift({
          alarmGroup: '',
          alarmType: '',
          alarmTypeName: '全部',
        })
        this.alarmTypeList = list
      }
    },
    async getToken() {
      const result = await server.platPlayer()
      const { data } = result
      if (data.code === '0') {
        this.commonConfig(data.data)
      }
    },
    pausePlayback(val) {
      this.$refs.palyBackSimpleplayer &&
        this.$refs.palyBackSimpleplayer.pause({ bPause: val })
      this.bPlayback = !this.bPlayback
    },
    sound() {
      this.bOpenSound = !this.bOpenSound
      this.$refs.palyBackSimpleplayer &&
        this.$refs.palyBackSimpleplayer.sound({ bOpen: this.bOpenSound })
    },
    fullScreen() {
      if (document.fullscreenElement) {
        this.isFullscreen = false
        document.exitFullscreen()
      } else {
        let d = document.getElementById('player-area')
        d.requestFullscreen()
        this.isFullscreen = true
      }
    },
    stopAll(isShow) {
      if (isShow == 'isShow') {
        if (this.bPlayback) {
          this.$refs.palyBackSimpleplayer &&
            this.$refs.palyBackSimpleplayer.pause({ bPause: false })
          this.bPlayback = false
        }
      }
      this.$refs.palyBackSimpleplayer &&
        this.$refs.palyBackSimpleplayer.doClear({})
      this.exist = false
      if (isShow == 'isShow') {
        this.isShow = false
      }
      this.isFullscreen = false
    },
    commonConfig({ token, nginxIp, nginxPort, language, protocol }) {
      console.log('token', token)
      let params = {
        strToken: token /* token */,
        iMultiRouteId: 0 /* 多网域线路id */,
        strPlatLanguage: language /* 语言 */,
        bShowCalendar: true /* 回放轴是否需要显示日历按钮 */,
        bShowDownload: false /* 回放轴是否需要显示下载器按钮 */,
      }
      params.strProtocol = protocol
      params.strPlatIp = nginxIp
      params.strPlatPort = nginxPort
      SimplePlayerConfig(params)
    },
    getSnapShotPath() {
      getSnapShotPath({})
    },
    setSnapShotPath() {
      setSnapShotPath({ strSnapPath: 'D:/capture' })
    },
    startPlayReal() {
      let params = {}
      params.strIndexcode = '4006c83549484db480a2fecaca8996db' /* 监控点编号 */
      params.transmode = 1 /* 取流方式 0 UDP 1 TCP  */
      params.streamType = 1 /* 0主码流 1子码流*/
      params.isSmallEagleEyeAbility = 0 /* 是否是小鹰眼设备 默认0不是 1是*/
      params.url = '' /* 预览取流url */
      params.streamDispatchMode = 0 /* 转流方式由vnsc返回 */
      this.$refs.palyBackSimpleplayer.startPlayReal(params)
    },
    stopPlayReal() {
      this.$refs.palyBackSimpleplayer.stopPlayReal({})
    },
    doPlayBack(cameraIndexCode, alarmStartTime, alarmEndTime) {
      console.log('alarmStartTime, alarmEndTime', alarmStartTime, alarmEndTime)
      let params = {}
      let queryParams = {} /* 回放请求体参数 */
      queryParams.indexCode = cameraIndexCode || '' /* 监控点编号 */

      queryParams.recordStyle = 0 /* 传0是查询中心存储  传1是查询设备存储 */
      queryParams.recordType =
        '0|1|2|6' /* 录像类型 0定时录像 1移动侦测 2报警触发 6手动录像 */
      queryParams.transmode = 1 /*0 UDP 1 TCP*/
      queryParams.streamType = 0 /* 0主码流 1子码流 */
      /* ISO带时区格式时间 2019-11-15T00:00:00.000+08:00*/
      queryParams.startTime = this.resetTime(alarmStartTime)
      queryParams.endTime = this.resetTime(alarmEndTime)
      params.strRecordParam = queryParams
      params.bShowBottomFunc = true
      params.bShowDownload = false
      console.log('params', params)
      let res = this.$refs.palyBackSimpleplayer.startPlayBack(params)
      console.log('startPlayBack reslut:' + JSON.stringify(res))
    },
    resetTime(time) {
      if (time) {
        let _time = this.$moment(time).format('YYYY-MM-DD HH:mm:ss')
        console.log(_time)
        let timeList = _time.split(' ')
        return `${timeList[0]}T${timeList[1]}.000+08:00`
      } else {
        return ''
      }
    },
    stopPlayBack() {
      this.$refs.palyBackSimpleplayer.stopPlayBack({})
    },
    onNotify(player, msg) {
      /* 
          客户端给前端发消息在这接收
      */
      console.log(msg)
    },
    onLoadResult(player, errCode, data) {
      console.log('=====', player, errCode, data)
      if (errCode === 0) {
        console.log('load success')
      } else {
        console.error('load failed errCode:' + errCode + ',content:' + data)
        //加载失败
      }
    },
    setExist(bExist) {
      /* 
        不再暴露销毁播放器接口
        删除播放器绑定元素后自动调用销毁
      */
      this.exist = bExist
    },
    //调用插件助手
    webSocketConnect(checkMsg) {
      const { port, hostname, host, protocol } = window.location
      const wsUrl = 'wss://127.0.0.1:18001/WebS_Js'
      try {
        this.wsSocket = new WebSocket(wsUrl)
        this.wsSocket.onopen = () => {
          this.wsSocket.send(
            '{"comment":{"commenttype":"checkapp", "context":"btoolsprotocol:"}}'
          )
        }
        this.wsSocket.onmessage = (event) => {
          let data = event.data
          if (data === '') {
            return
          }
          if (data.indexOf('btoolsprotocol') > -1) {
            if (this.checkAppExist(data) === '1') {
              // 检测极简播放器是否安装
              let checkCmd =
                '{"comment":{"commenttype":"checkapp", "context":"HikCC:"}}'
              this.wsSocket.send(checkCmd)
            } else {
              this.$message({
                message: '请先安装插件助手。',
                type: 'warning',
              })
            }
          }

          if (data.indexOf('HikCC') > -1) {
            if (this.checkAppExist(data) === '1') {
              //如果安装了但是极简播放器没有启动，通过插件助手去启动播放器进程
              if (!this.ccExeExists) {
                this.wsSocket.send(
                  '{"comment":{"commenttype":"startapp", "context":"HikCC:", "commentcmd":""}}'
                )
                // this.$message({
                //   message: '播放器进程已启动，请刷新页面',
                //   type: 'success',
                // });
              }
              this.wsSocket.close()
            } else {
              // 没有安装的时候，安装极简播放器。通过插件助手安装极简播放器，播放器的进程理论上会自动启动。
              this.wsSocket.send(
                // 10.19.141.75是平台地址，请自行替换
                `{"comment":{"commenttype":"startapp", "context":"btoolsprotocol:", "commentcmd":"btoolsprotocol://language:zh_CN;CenterUrl:${protocol}://${host}/portal;toollist:PROT_HikCC"}}`
              )
              // this.$message({
              //   message: '播放器安装完成，请刷新页面',
              //   type: 'success',
              // });
              this.wsSocket.close()
            }
          }
        }
        this.wsSocket.onclose = () => {
          this.wsSocket = null
        }
      } catch (e) {
        throw e
      }
    },
    //根据返回的报文检测是否安装插件
    checkAppExist(data) {
      let resCode = 0
      let resJson = JSON.parse(data)
      if (resJson) {
        resCode = resJson.comment.resultCode
        return resCode
      } else {
        return resCode
      }
    },
    // 查询按钮点击回调
    searchHandle() {
      this.searchForm.pageNo = 1
      this.findAlarmInfoPage()
    },
    // 重置按钮回调
    resetHandle() {
      this.alarmTime = ''
      this.searchForm = {
        ...this.searchForm,
        startTime: '',
        endTime: '',
        alarmLevel: '',
        alarmType: '',
        alarmId: '',
        pageNo: 1,
        pageSize: 20,
        areaIndexCode:''
      }
      this.findAlarmInfoPage()
    },
    // 列表查询
    async findAlarmInfoPage(lastestParams) {
      let params = {}
      if (lastestParams) {
        params = lastestParams
      } else {
        let startTime =
          this.alarmTime &&
          this.alarmTime[0] &&
          this.$moment(this.alarmTime[0]).format('YYYY-MM-DD HH:mm:ss')
        let endTime =
          this.alarmTime &&
          this.alarmTime[1] &&
          this.$moment(this.alarmTime[1]).format('YYYY-MM-DD HH:mm:ss')
        this.lastestParams = params = { ...this.searchForm, startTime, endTime }
      }
      if(!params.areaIndexCode){
        params.areaIndexCode = '-1'
      }
      // this.loading = true
      const result = await server.findAlarmInfoPage(params)
      const { data } = result
      if (data.code === '0') {
        // this.loading = false
        this.tableData = data.data.list
        this.pageTotal = data.data.total
      } else {
        // this.loading = false
        this.$messagebox(result)
      }
    },
    // 每页展示数量改变
    handleSizeChange(pageSize) {
      this.searchForm = { ...this.searchForm, pageSize: pageSize, pageNo: 1 }
      this.lastestParams = {
        ...this.lastestParams,
        pageSize: pageSize,
        pageNo: 1,
      }
      this.findAlarmInfoPage(this.lastestParams)
    },
    // 页码改变
    handleCurrentChange(pageNo) {
      this.searchForm = { ...this.searchForm, pageNo: pageNo }
      this.lastestParams = { ...this.lastestParams, pageNo: pageNo }
      this.findAlarmInfoPage(this.lastestParams)
    },
    // 查看报警视频
    lookAlarmVideo(row) {
      this.exist = true
      this.bPlayback = true
      this.$nextTick(() => {
        this.roomName = row.roomName || '未知'
        this.registerName = row.registerName || '未知'
        this.doPlayBack(
          row.cameraIndexCode,
          row.alarmStartTime,
          row.alarmEndTime
        )
      })
      // alarmId && this.$router.push({ path: 'detailPage', query: { id: alarmId } })
    },
  },
  mixins: [],
  components: {
    FilterSearchBox,
    FilterSearchItem,
    FilterSearchContent,
    SimplePlayer,
  },
}
</script>
<style lang="less" rel="stylesheet/less">
.alarm-query {
  position: relative;
  // padding: 0px 8px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  border: solid 8px #f2f2f2;
  * {
    box-sizing: border-box;
  }
  .ctrl-box {
    font-size: 14px;
    color: #4d4d4d;
    padding: 0px 16px;
    position: absolute;
    top: 10px;
    z-index: 1;
    .ctrl-item {
      display: inline-block;
      vertical-align: middle;
      height: 32px;
      padding: 4px;
      cursor: pointer;
      margin-right: 16px;
      &:hover {
        background: rgba(0, 0, 0, 0.08);
      }
      &.filter-box {
        float: right;
      }
      i {
        font-size: 24px;
        display: inline-block;
        vertical-align: middle;
      }
      .icon-desc {
        display: inline-block;
        vertical-align: middle;
        margin-left: 4px;
      }
    }
  }
  .content-box {
    height: ~'calc(100% - 56px)';
    .table-ctrl-btn {
      border-right: solid 1px #e6e6e6;
      padding: 0px 8px;
      font-size: 12px;
      color: #2080f7;
      cursor: pointer;
      &:first-child {
        padding-left: initial;
      }
      &:last-child {
        padding-right: initial;
        border-right: none;
      }
    }
    .alarmLevel {
      padding-left: 8px;

      &::before {
        content: '';
        display: inline-block;
        position: relative;
        width: 8px;
        height: 8px;
        top: ~'calc(50% - 4px)';
        border-radius: 4px;

        left: -8px;
      }
      &.h {
        &::before {
          background-color: #fa3239;
        }
      }
      &.c {
        &::before {
          background-color: #ffcc00;
        }
      }
      &.l {
        &::before {
          background-color: #2296f3;
        }
      }
    }
  }
  .picUrl {
    width: 72px;
    height: 54px;
    background: url('../../assets/defaultimg.png') no-repeat;
    background-size: 100% 100%;
    &.picUrlImg {
      cursor: pointer;
    }
  }
  .pagination-box {
    box-shadow: 0px -1px 0px #f2f2f2;
    padding: 0 16px;
    box-sizing: border-box;
  }
}
</style>
<style lang="less" scoped>
.index-layout {
  z-index: 2020;
  position: absolute;
  left: 400px;
  top: 120px;
  width: 800px;
  height: 600px;
  box-sizing: border-box;
  background-color: #333;
  // background: url('../../assets/images/playerbg.png') 0 4px no-repeat;
  .top-line {
    height: 38px;
    padding-top: 6px;
    line-height: 32px;
    color: #a7c3fa;
    position: relative;
    margin-bottom: 1px;
    .camera-name {
      height: 32px;
      display: inline-block;
      max-width: 390px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 14px;
      padding: 0 28px;
      .col1 {
        margin-right: 30px;
      }
      .col2 {
      }
    }
    .close-btn {
      width: 24px;
      height: 24px;
      position: absolute;
      right: 0;
      top: 0;
      cursor: pointer;
      .h-icon-close_f {
        font-size: 24px;
        color: #2257bd;
      }
      &:hover .h-icon-close_f {
        color: #5180dd;
      }
    }
  }
  .playerWrap {
    width: 800px;
    height: 550px;
    padding: 0 7px;
    .player-tool {
      height: 44px;
      padding: 6px 8px;
      background: #333;
      .player-tool-btn {
        width: 32px;
        height: 32px;
        margin-right: 8px;
        display: block;
        padding: 4px;
        cursor: pointer;
        border-radius: 2px;
        float: left;
        i {
          font-size: 24px;
          color: #909090;
          &.player-tool-btn_on {
            width: 20px;
            height: 20px;
            display: inline-block;
            background-color: green;
            // background-image: url('../../assets/images/play.png');
            background-repeat: no-repeat;
          }
          &.player-tool-btn_off {
            width: 20px;
            height: 20px;
            display: inline-block;
            background-color: red;
            // background-image: url('../../assets/images/stop.png');
            background-repeat: no-repeat;
          }
          &.player-tool-btn_down {
            width: 20px;
            height: 20px;
            display: inline-block;
            background-color: blue;
            // background-image: url('../../assets/images/stepD.png');
            background-repeat: no-repeat;
          }
          &.player-tool-btn_up {
            width: 20px;
            height: 20px;
            display: inline-block;
            background-color: red;
            // background-image: url('../../assets/images/stepU.png');
            background-repeat: no-repeat;
          }
        }
        &:hover {
          background: #222;
        }
      }
      .speed-box {
        width: 32px;
        height: 32px;
        margin-right: 8px;
        display: block;
        padding: 4px;
        cursor: pointer;
        border-radius: 2px;
        float: left;
        color: #909090;
        position: relative;
        font-size: 16px;
        .speed-list-box {
          position: absolute;
          top: -110px;
          background-color: #fff;
          border-radius: 2px;
          width: 36px;
          font-size: 14px;
          text-align: center;
          > div {
            height: 22px;
            line-height: 22px;
          }
        }
        &:hover {
          .speed-list-box {
            display: block;
          }
        }
      }
    }
  }
  /*background-image: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(59,107,190,0.19) 100%);*/
  /*background: rgba(51,51,51, .2);*/
  /*border: solid 0.01rem #000;*/
}
.bigPicBox {
  width: 400px;
  height: 400px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>