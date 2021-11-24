<template>
  <watermarkContent>
    <div id="accessAreaManagement" class="accessAreaManagement">
      <div class="handlingSituation">
        <div class="handling-title">
          <span>今日办案区概况</span>
        </div>
        <div class="handling-info">
          <div class="room-info">
            <img src="../../assets/image/sum.png" />
            <div class="roomStatus">
              <div class="roomSum">
                <span class="room-num">
                  {{ dataInfo.roomTotal || 0 }}
                </span>
                <div class="room-text">审讯室总数</div>
              </div>
              <div class="roomFree">
                <span class="room-num">
                  {{ dataInfo.freeRoomNum || 0 }}
                </span>
                <div class="room-text">空闲</div>
              </div>
              <div class="roomDistribution">
                <span class="room-num">
                  {{ dataInfo.allocationRoomNum || 0 }}
                </span>
                <div class="room-text">已分配</div>
              </div>
              <div class="roomUsed">
                <span class="room-num">
                  {{ dataInfo.interrogateRoomNum || 0 }}
                </span>
                <div class="room-text">审讯中</div>
              </div>
            </div>
          </div>
          <div class="partLine"></div>
          <div class="person-info">
            <img src="../../assets/image/person.png" />
            <div class="person-involved">
              <div class="person-inarea">
                <span class="room-num">
                  {{ dataInfo.inAreaSuspectNum || 0 }}
                </span>
                <div class="room-text">在区涉案人</div>
              </div>
              <div class="interrogation-number">
                <span class="room-num">
                  {{ dataInfo.interrogateSuspectNum || 0 }}
                </span>
                <div class="room-text">讯问人数</div>
              </div>
              <div class="waiting-number">
                <span class="room-num">
                  {{ dataInfo.waitSuspectNum || 0 }}
                </span>
                <div class="room-text">侯问人数</div>
              </div>
              <div class="temporary-number">
                <span class="room-num">
                  {{ dataInfo.temporaryLeaveNum || 0 }}
                </span>
                <div class="room-text">临时出区人数</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="interrogationRoom">
        <div class="interrogation-title">
          <span>审讯室</span>
          <el-button
            type="iconButton"
            icon="h-icon-filter"
            style="float: right"
            @click="onShowSearch"
            v-if="!showSearch"
            title="过滤"
          ></el-button>
          <el-button
            class="active"
            style="float: right"
            type="iconButton"
            icon="h-icon-filter_f"
            @click="onShowSearch"
            v-if="showSearch"
            title="过滤"
          ></el-button>
        </div>
        <div class="searchBar" v-if="showSearch">
          <el-form class="searchForm" :model="searchForm" label-position="top">
            <el-row>
              <el-col :span="6" style="padding-right: 24px; padding-left: 16px">
                <el-form-item label="办案区">
                  <el-select
                    v-model="searchForm.areaCode"
                    placeholder="请选择"
                    @change="changeData"
                  >
                    <el-option
                      v-for="(item, index) in authAreaList"
                      :key="index"
                      :label="item.areaName"
                      :value="item.areaIndexCode"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" style="padding-right: 24px; padding-left: 16px">
                <el-form-item label="审讯室状态">
                  <el-select
                    v-model="searchForm.roomStatus"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :span="12"
                style="
                  text-align: right;
                  padding-right: 24px;
                  padding-top: 24px;
                "
              >
                <el-button type="primary" @click="onSearch" size="large">
                  查询
                </el-button>
                <el-button type="primary" @click="onReset" size="large">
                  重置
                </el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div
          class="interrogation-info"
          :style="{ height: 'calc(100% - ' + topHeight + 'px)' }"
        >
          <el-scrollbar
            wrap-class="el-demo1-scrollbar__wrap"
            view-class="el-demo1-scrollbar__view"
            tag="ul"
          >
            <div class="interrogationRoom-box">
              <el-scrollbar>
                <ul>
                  <li
                    class="interrogationRoom-card"
                    v-for="(item, index) in roomList"
                    :key="index"
                  >
                    <div class="free-room" v-show="item.roomStatus === '0'">
                      <div
                        class="interrogationRoom-title"
                        :title="item.roomName"
                      >
                        {{ item.roomName || '--' }}
                      </div>
                      <div class="interrogationRoom-status">空闲</div>
                      <el-button
                        type="iconButton"
                        icon="h-icon-share"
                        class="distribute-button"
                        @click.stop.prevent="onDistribute(item)"
                      >
                        分配
                      </el-button>
                    </div>
                    <div class="used-room" v-show="item.roomStatus !== '0'">
                      <div
                        class="interrogationRoom-title"
                        :title="item.roomName"
                      >
                        {{ item.roomName }}
                      </div>
                      <div
                        :class="
                          item.roomStatus === '4'
                            ? 'allocatedTime-show'
                            : 'workTime-show'
                        "
                        :title="item.startTime"
                      >
                        <span>{{
                          item.roomStatus === '4' ? '分配时间：' : '开始时间：'
                        }}</span>
                        <span class="time">{{ item.startTime }}</span>
                      </div>
                      <div
                        :class="item.roomStatus === '4' ? 'allocated' : 'trial'"
                      >
                        {{ item.roomStatus === '4' ? '已分配' : '审讯中' }}
                      </div>
                      <div class="interrogationPerson-box">
                        <div class="interrogationPerson">
                          <el-button
                            type="iconButton"
                            icon="h-icon-user"
                            class="user-button"
                          ></el-button>
                          <span class="person-title">审讯人：</span>
                          <span
                            class="person-name"
                            :title="getPoliceName(item)"
                          >
                            {{ getPoliceName(item) }}
                          </span>
                        </div>
                        <div class="interrogationObject">
                          <span class="person-title">审讯对象：</span>
                          <span class="person-name" :title="item.suspectName">
                            {{ item.suspectName }}
                          </span>
                        </div>
                      </div>
                      <div class="interrogationRoom-cancelButton">
                        <el-button
                          type="iconButton"
                          icon="h-icon-minus_circle"
                          class="cancel-distribution"
                          v-show="item.roomStatus === '4'"
                          @click.stop.prevent="onCancel(item)"
                        >
                          取消分配
                        </el-button>
                      </div>
                    </div>
                  </li>
                </ul>
              </el-scrollbar>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <el-dialog
        title="分配审讯室"
        :area="[720, 400]"
        top="middle"
        :close-on-click-modal="false"
        :visible.sync="distributionDialogVisible"
      >
        <div id="interrogationTable" class="interrogationTable">
          <div class="table-search">
            <div class="searchLeft">
              <el-button
                type="primary"
                v-show="checkPlace"
                @click.stop.prevent="readBracelet"
              >
                读取手环
              </el-button>
            </div>
            <div class="searchRight">
              <el-input
                clearable
                placeholder="请输入姓名/手环编号"
                suffix-icon="h-icon-search"
                :maxlength="32"
                v-model="searchText"
                :on-icon-click="handleSearch"
                :clear-icon-click="clearIconClick"
              >
              </el-input>
            </div>
          </div>
          <div class="table-container">
            <el-table
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              force-scroll
              highlight-current-row
              @current-change="openDetails"
            >
              <!--  @row-click="openDetails" -->
              <el-table-column
                type="radio"
                :selectable="selectable"
              ></el-table-column>
              <el-table-column
                label="序号"
                type="index"
                width="60"
              ></el-table-column>
              <el-table-column
                label="姓名"
                show-overflow-title
                prop="registerName"
              >
              </el-table-column>
              <el-table-column
                label="人员类型"
                show-overflow-title
                prop="personTypeMap"
                width="90"
              >
                <template slot-scope="scope">
                  <span
                    v-if="Number(scope.row.personType) === 2"
                    class="blueSpan"
                    style="
                      max-width: 60px;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    "
                    >{{ personTypeMap[scope.row.personType] }}</span
                  >
                  <span
                    v-if="Number(scope.row.personType) === 1"
                    class="redSpan"
                    style="
                      max-width: 60px;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    "
                    >{{ personTypeMap[1] }}</span
                  >
                  <span
                    v-if="
                      Number(scope.row.personType) >= 3 ||
                      Number(scope.row.personType) <= 0
                    "
                    class="status-icon gray-icon"
                    style="
                      max-width: 70px;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    "
                    >{{ personTypeMap[scope.row.personType] }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="sex"
                label="性别"
                show-overflow-title
                width="60"
              >
                <template slot-scope="scope">
                  <span v-if="sexMap[scope.row.registerSex]">
                    {{ sexMap[scope.row.registerSex] }}
                  </span>
                  <span v-else></span>
                </template>
              </el-table-column>
              <el-table-column
                label="办案部门"
                show-overflow-title
                prop="deptName"
              ></el-table-column>
              <!-- <el-table-column label="主办民警"
                             show-overflow-title
                             prop="policeAccessName"></el-table-column>
            <el-table-column label="协办民警"
                             show-overflow-title
                             prop="policeAccessName2"></el-table-column> -->
              <el-table-column
                prop="hostPoliceName"
                label="主办民警"
                show-overflow-title
              >
              </el-table-column>
              <el-table-column
                prop="auxiliaryPoliceName"
                label="协办民警"
                show-overflow-title
              >
              </el-table-column>
              <el-table-column
                label="手环编号"
                show-overflow-title
                prop="bandsNo"
              ></el-table-column>
            </el-table>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click.stop.prevent="submitDialog">
            确定
          </el-button>
          <el-button @click.stop.prevent="distributionDialogVisible = false">
            取消
          </el-button>
        </span>
      </el-dialog>
    </div>
  </watermarkContent>
</template>

<script>
import server from '../../server/accessAreaManagement'
import ReconnectingWebSocket from '../../mixin/reconnecting-websocket'
export default {
  name: 'AccessAreaManagement',
  data() {
    return {
      showSearch: false,
      topHeight: 66,
      searchForm: {
        areaCode: '',
        roomStatus: '',
      },
      authAreaList: [],
      options: [
        { value: '', label: '全部' },
        { value: '0', label: '空闲' },
        { value: '2', label: '审讯中' },
        { value: '4', label: '已分配' },
      ],
      dataInfo: {},
      roomList: [],
      currentRoom: {},
      distributionDialogVisible: false,
      tableData: [],
      personTypeMap: {}, // 人员类型
      sexMap: {}, // 性别
      searchText: '',
      selectTableItem: [],
      checkPlace: false,
      processCode: 'inquestAllocation',
    }
  },
  async mounted() {
    await this.findAuthUserPlaceList()
    // this.findAuthUserPlaceList()
    this.initSocket()
    this.initSocket2()
  },
  methods: {
    // 校验是否有定位系统
    async getLocationAbility() {
      const { data } = await server.getLocationAbility({
        areaCode: this.searchForm.areaCode,
      })
      if (data.code === '0') {
        this.checkPlace = !!(
          data.data &&
          data.data.length > 0 &&
          data.data.indexOf('RFID') > -1
        )
      } else {
        this.checkPlace = false
      }
    },
    getPoliceName(item) {
      if (item.policeNameList) {
        let arr = item.policeNameList
        return arr.join('、')
      }
    },
    // 办案区和房间名称
    async findAuthUserPlaceList() {
      let res = await server.findAuthUserPlaceList()
      let data = res.data
      if (data.code === '0') {
        let list = data.data.list
        if (list && list.length) {
          this.searchForm = {
            areaCode: list[0].areaIndexCode,
            roomStatus: '',
          }
          this.authAreaList = list
          this.findLocalInterrogationRoomList()
          this.findStatisticsInfo()
        } else if (list && list.length === 0) {
          this.$message.error('办案区为空')
        } else {
          this.$message.error('获取办案区失败')
        }
      } else {
        this.$messagebox(res)
        // this.$message.error(this.$t(data.code))
      }
    },
    // 切换数据
    changeData() {
      this.onSearch()
    },
    // 获取概况信息
    async findStatisticsInfo() {
      const params = {
        areaCode: this.searchForm.areaCode,
      }
      const res = await server.findStatisticsInfo(params)
      const { data } = res
      if (data.code === '0') {
        this.dataInfo = data.data
      } else {
        this.$messagebox(res)
        // this.$message.error(this.$t(data.code))
      }
    },
    // websocket获取办案区概况
    initSocket2() {
      let socketHost =
        window.location.protocol.indexOf('https') > -1
          ? `wss://${window.location.host}/casehandlingmgt/websocket/statistics/message.ws`
          : `ws://${window.location.host}/casehandlingmgt/websocket/statistics/message.ws`
      try {
        window.socketPlay = new ReconnectingWebSocket(socketHost)
        window.socketPlay.onopen = async (data) => {
          console.log(data)
        }
        window.socketPlay.onmessage = async (val) => {
          if (val) {
            this.findStatisticsInfo()
          }
        }
      } catch (err) {
        this.$message.error('连接失败')
      }
    },
    // 获取审讯室房间
    async findLocalInterrogationRoomList() {
      const params = {
        areaCode: this.searchForm.areaCode,
        roomStatus: this.searchForm.roomStatus,
      }
      const res = await server.findLocalInterrogationRoomList(params)
      const { data } = res
      if (data.code === '0') {
        this.roomList = data.data
      } else {
        this.$messagebox(res)
        // this.$message.error(this.$t(data.code))
      }
    },
    onShowSearch() {
      this.showSearch = !this.showSearch
      if (this.showSearch) {
        this.topHeight = 148
      } else {
        this.topHeight = 66
      }
    },
    // 查询
    onSearch() {
      let obj = JSON.parse(JSON.stringify(this.searchForm))
      this.searchForm = {
        areaCode: obj.areaCode,
        roomStatus: obj.roomStatus,
      }
      this.findStatisticsInfo()
      this.findLocalInterrogationRoomList()
    },
    // 重置
    onReset() {
      let list = this.authAreaList
      this.searchForm = {
        areaCode: list[0].areaIndexCode,
        roomStatus: '',
      }
      this.onSearch()
    },
    // 分配
    onDistribute(item) {
      this.currentRoom = JSON.parse(JSON.stringify(item))
      this.searchText = ''
      this.selectTableItem = []
      this.distributionDialogVisible = true
      this.findAllocationSuspectInfoList()
      this.getLocationAbility()
    },
    // 获取分配室弹框数据
    async findAllocationSuspectInfoList() {
      let params = {
        areaCode: this.currentRoom.areaCode,
      }
      let res = await server.findAllocationSuspectInfoList(params)
      if (res.data.code === '0') {
        this.tableData = res.data.data
        this.getDictionaries()
        this.getPersonDict()
      } else {
        this.$messagebox(res)
      }
    },
    // 性别数据字典
    async getDictionaries() {
      let params = {
        typeCode: 'sex',
      }
      const res = await server.getDictionaries(params)
      const { data } = res
      if (data.code === '0') {
        let sex = {}
        data.data.sex.forEach((v) => {
          sex[v.key] = v.name
        })
        this.sexMap = sex
      } else {
        this.$messagebox(res)
      }
    },
    // 人员类型数据字典
    async getPersonDict() {
      let params = {
        typeCode: 'suspectType',
      }
      const res = await server.getDictionaries(params)
      const { data } = res
      if (data.code === '0') {
        let suspectType = {}
        data.data.suspectType.forEach((v) => {
          suspectType[v.key] = v.name
        })
        this.personTypeMap = suspectType
      } else {
        this.$messagebox(res)
      }
    },
    // 审讯信息-websocket
    initSocket() {
      let socketHost =
        window.location.protocol.indexOf('https') > -1
          ? `wss://${window.location.host}/casehandlingmgt/websocket/allocation/message.ws`
          : `ws://${window.location.host}/casehandlingmgt/websocket/allocation/message.ws`
      try {
        window.socketPlay = new ReconnectingWebSocket(socketHost)
        window.socketPlay.onopen = async (data) => {
          console.log(data)
        }
        window.socketPlay.onmessage = async (val) => {
          if (val) {
            this.findLocalInterrogationRoomList()
          }
        }
      } catch (err) {
        this.$message.error('连接失败')
      }
    },
    // 连接手环
    readBracelet() {
      let _self = this
      // 参数
      let sendMsg =
        '{"comment":{"commenttype":"checkapp", "context":"btoolsprotocol"}}'
      let socketHost =
        window.location.protocol.indexOf('https') > -1
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
          if (
            _data &&
            _data.comment &&
            _data.comment.commenttype === 'checkapp'
          ) {
            // 检测插件助手是否安装
            if (_data.comment.resultCode === '1') {
              let jsonObj = `{"comment":{"commenttype":"startapp", "context":"btoolsprotocol", "commentcmd":"btoolsprotocol://CenterUrl:${_self.$centerUrl};Toollist:PROT_BToolCardReaderProtocol;CmdLine:BToolCardReaderProtocol://IReaderType:1;"}}`
              _self.websock.send(jsonObj)
            } else {
              _self.$message('检测到您未安装插件助手')
            }
          } else if (_data && _data.Code === 0 && _data.Result) {
            let bandsNo = _data.Result.Data
            _self.searchText = bandsNo.CardCode
            _self.handleSearch()
          }
        }
        _self.websock.onclose = function () {
          _self.websock = null
        }
      } catch (err) {
        console.log(err)
      }
    },
    // // 勾选人员
    // handleSelectionChange (val) {
    //   this.selectTableItem = JSON.parse(JSON.stringify(val))
    // },
    openDetails(row) {
      this.selectTableItem = [row]
    },
    // 侯问室弹框-确定
    submitDialog() {
      if (!(this.selectTableItem && this.selectTableItem.length)) {
        this.$message({
          message: '请选择人员',
          type: 'warning',
        })
        return false
      }
      this.allocationRoom()
      this.distributionDialogVisible = false
    },
    // 分配
    async allocationRoom() {
      this.getCaseAreaProcessConfig(this.selectTableItem[0])
    },
    async allocationRoom2() {
      let list = this.selectTableItem
      let registerArr = []
      for (let i = 0; i < list.length; i++) {
        registerArr.push(list[i].registerCode)
      }
      let params = {
        registerCode: registerArr.join(','),
        roomCode: this.currentRoom.roomCode,
      }
      const res = await server.allocationRoom(params)
      const { data } = res
      if (data.code === '0') {
        this.findStatisticsInfo()
        this.findLocalInterrogationRoomList()
      } else {
        this.$messagebox(res)
      }
    },
    // 取消分配
    onCancel(item) {
      this.$confirm('确定取消分配？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'question',
      })
        .then(async () => {
          let params = {
            roomCode: item.roomCode,
          }
          const res = await server.cancelAllocationRoom(params)
          const { data } = res
          if (data.code === '0') {
            this.findLocalInterrogationRoomList()
          } else {
            this.$messagebox(res)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          })
        })
    },
    // 查询当前流程是否可做
    async getCaseAreaProcessConfig(item) {
      let params = {
        registerIndexCode: item.registerCode,
        processCode: this.processCode,
      }
      const { data } = await server.getCaseAreaProcessConfig(params)
      if (data.code === '0') {
        let _data = data.data
        if (_data.indexOf(',') > -1) {
          this.$message.warning(`${_data.split(',')[1]}！`)
        } else {
          this.allocationRoom2()
        }
      } else {
        this.$message.error(this.$i18n.t(data.code))
      }
    },
    // 搜索分配人员
    async handleSearch() {
      let params = {
        areaCode: this.currentRoom.areaCode,
        registerName: this.searchText,
      }
      let res = await server.findAllocationSuspectInfoList(params)
      if (res.data.code === '0') {
        this.tableData = res.data.data
      } else {
        this.$messagebox(res)
      }
    },
    clearIconClick() {
      this.searchText = ''
      this.handleSearch()
    },
    selectable(row, index) {
      return true
    },
  },
}
</script>

<style lang="less" rel="stylesheet/less">
.accessAreaManagement {
  position: relative;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  border: solid 8px #f2f2f2;
  * {
    box-sizing: border-box;
  }
  .handlingSituation {
    width: 100%;
    height: 176px;
    .handling-title {
      height: 48px;
      border-bottom: 1px solid #f1f1f1;
      font-size: 16px;
      color: #4c4c4c;
      padding: 12px 16px;
    }
    .handling-info {
      width: 100%;
      height: ~'calc(100% - 48px)';
      .room-info {
        width: 49.7%;
        height: 100%;
        display: inline-block;
        vertical-align: top;
        position: relative;
        > img {
          height: 80px;
          width: 80px;
          position: absolute;
          top: 20px;
          left: 32%;
        }
        .roomStatus {
          width: 384px;
          position: absolute;
          top: 40px;
          left: 45%;
        }
        .roomSum,
        .roomFree,
        .roomDistribution,
        .roomUsed {
          display: inline-block;
          width: 96px;
          text-align: center;
        }
      }
      .person-info {
        width: 48%;
        height: 100%;
        display: inline-block;
        position: relative;
        img {
          width: 80px;
          height: 80px;
          position: absolute;
          top: 20px;
          left: 20%;
        }
        .person-involved {
          display: inline-block;
          width: 384px;
          position: absolute;
          top: 40px;
          left: 32%;
        }
        .person-inarea,
        .interrogation-number,
        .waiting-number,
        .temporary-number {
          display: inline-block;
          width: 96px;
          text-align: center;
        }
      }
      .partLine {
        display: inline-block;
        width: 4px;
        height: 40px;
        background: #b9b9b9;
        vertical-align: top;
        margin-top: 40px;
      }
      .room-num {
        font-family: Arial-BoldMT;
        font-size: 30px;
        color: #4c4c4c;
      }
      .room-text {
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #666666;
        margin-top: 8px;
      }
    }
  }
  .interrogationRoom {
    width: 100%;
    height: ~'calc(100% - 176px)';
    border-top: solid 8px #f2f2f2;
    .interrogation-title {
      height: 48px;
      border-bottom: 1px solid #f1f1f1;
      font-size: 16px;
      color: #4c4c4c;
      padding: 12px 16px;
      .h-icon-filter_f {
        color: #2080f7;
        background: #f2f2f2;
      }
    }
    .interrogation-info {
      .interrogationRoom-box {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding-left: 72px;
        margin-top: 40px;
      }
      .interrogationRoom-card,
      .used-room {
        position: relative;
        display: inline-block;
        vertical-align: top;
        width: 320px;
        height: 240px;
        margin-right: 40px;
        margin-bottom: 20px;
        background: url('../../assets/image/card.png') no-repeat;
        .free-room {
          width: 100%;
          height: 100%;
        }
        .used-room {
          width: 100%;
          height: 100%;
        }
        .interrogationRoom-title {
          width: 120px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          font-family: MicrosoftYaHei;
          font-size: 18px;
          color: #4c4c4c;
          position: absolute;
          top: 15px;
          left: 100px;
          text-align: center;
        }
        .workTime-show {
          width: 240px;
          height: 22px;
          background: rgba(32, 128, 247, 0.16);
          border: 1px solid #6aadff;
          border-radius: 11px;
          font-family: MicrosoftYaHei;
          font-size: 14px;
          color: #2080f7;
          text-align: center;
          position: absolute;
          top: 62px;
          left: 40px;
        }
        .allocatedTime-show {
          width: 240px;
          height: 22px;
          background: rgba(247, 133, 32, 0.15);
          border: 1px solid #ffad65;
          border-radius: 11px;
          font-family: MicrosoftYaHei;
          font-size: 14px;
          color: #f78520;
          text-align: center;
          position: absolute;
          top: 62px;
          left: 40px;
        }
        .interrogationRoom-status {
          font-family: MicrosoftYaHei;
          font-size: 40px;
          color: #31c335;
          text-align: center;
          position: absolute;
          top: 89px;
          left: 120px;
        }
        .allocated {
          font-family: MicrosoftYaHei;
          font-size: 40px;
          color: #f78520;
          text-align: center;
          position: absolute;
          top: 89px;
          left: 107px;
        }
        .trial {
          font-family: MicrosoftYaHei;
          font-size: 40px;
          color: #2080f7;
          text-align: center;
          position: absolute;
          top: 89px;
          left: 107px;
        }
        .distribute-button {
          position: absolute;
          top: 206px;
          left: 121px;
        }
        .user-button {
          position: absolute;
          top: -10px;
          left: -33px;
        }
      }
    }
    .used-room {
      position: relative;
      .interrogationPerson-box {
        .interrogationPerson {
          display: inline-block;
        }
        .interrogationPerson {
          position: absolute;
          top: 146px;
          left: 58px;
        }
        .interrogationObject {
          position: absolute;
          top: 174px;
          left: 58px;
        }
        .person-title {
          font-family: MicrosoftYaHei;
          font-size: 14px;
          color: #999999;
          line-height: 19px;
        }
        .person-name {
          display: inline-block;
          width: 100px;
          vertical-align: top;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          font-family: MicrosoftYaHei;
          font-size: 14px;
          color: #4c4c4c;
          line-height: 19px;
        }
        .line {
          width: 2px;
          height: 11px;
          background: #b8b8b8;
          border-radius: 1px;
          display: inline-block;
          position: absolute;
          top: 176px;
          left: 166px;
        }
      }
    }
    .interrogationRoom-cancelButton {
      position: absolute;
      top: 211px;
      left: 142px;
      font-family: MicrosoftYaHeiUI;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.7);
      letter-spacing: 0;
      line-height: 20px;
      text-align: center;
    }
    .cancel-distribution {
      position: absolute;
      top: -6px;
      left: -33px;
    }
  }
  .searchBar {
    height: 100px;
    border-bottom: 1px solid #e5e5e5;
    background: #fbfbfb;
    .searchForm {
      padding: 16px 0;
      box-sizing: border-box;
    }
  }
}
.el-scrollbar {
  width: 100%;
}
.el-demo1-scrollbar__wrap {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.interrogationTable {
  width: 100%;
  height: 280px;
  .table-container {
    height: ~'calc(100% - 40px)';
    box-sizing: border-box;
    .el-table {
      border: 1px solid transparent;
      border-top: 1px solid #e5e5e5;
      .operationBtn {
        display: inline-block;
        padding: 0 8px;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #2080f7;
        letter-spacing: 0;
        line-height: 20px;
        cursor: pointer;
      }
    }
    .el-table .el-table__body-wrapper:before,
    .el-table:after,
    .el-table:before {
      content: '';
      position: absolute;
      background-color: transparent;
      z-index: 1;
    }
  }
  .table-search {
    height: 40px;
    padding-bottom: 8px;
    box-sizing: border-box;
    position: relative;
    .searchLeft {
      width: 100px;
      height: 32px;
      position: absolute;
      left: 0;
      top: 0;
    }
    .searchRight {
      width: 280px;
      height: 32px;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
}
</style>
