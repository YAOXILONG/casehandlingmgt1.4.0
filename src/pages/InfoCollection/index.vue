<template>
  <watermarkContent>
    <div class="info-collection">
      <div class="ctrl-box"></div>
      <div class="content-box">
        <FilterSearchBox>
          <FilterSearchItem>
            <div class="item-lable">办案区</div>
            <div class="item-input">
              <el-select
                v-model="searchForm.areaCode"
                filterable
                placeholder="请选择"
                clear
              >
                <el-option
                  v-for="item in areaList"
                  :key="item.areaIndexCode"
                  :label="item.areaName"
                  :value="item.areaIndexCode"
                >
                </el-option>
              </el-select>
            </div>
          </FilterSearchItem>
          <FilterSearchItem>
            <div class="item-lable">办案部门</div>
            <div class="item-input">
              <SelectWithTree
                v-model="searchForm.deptCode"
                :tree-data="deptList"
                :default-props="defaultProps"
                :simple-data="true"
                node-key="deptIndexCode"
                parent-key="parentIndexCode"
              ></SelectWithTree>
            </div>
          </FilterSearchItem>
          <FilterSearchItem v-if="$checkPlace">
            <div class="item-lable">手环编号</div>
            <div class="item-input">
              <el-select
                v-model="searchForm.bandNo"
                placeholder="点击此文本框后刷手环"
                clear
              >
                <el-option
                  v-for="(item, index) in usedBindList"
                  :key="index"
                  :label="item.tagCode"
                  :value="item.tagCode"
                >
                </el-option>
              </el-select>
            </div>
          </FilterSearchItem>
          <FilterSearchItem>
            <div class="item-lable">涉案人姓名</div>
            <div class="item-input">
              <el-input
                v-model="searchForm.registerName"
                placeholder="请输入"
              ></el-input>
            </div>
          </FilterSearchItem>
          <FilterSearchItem>
            <div class="item-lable">人员类型</div>
            <div class="item-input">
              <el-select
                v-model="searchForm.personType"
                placeholder="请输入"
                clear
              >
                <el-option
                  v-for="item in dictData.suspectType"
                  :key="item.key"
                  :label="item.name"
                  :value="item.key"
                >
                </el-option>
              </el-select>
            </div>
          </FilterSearchItem>
          <FilterSearchItem>
            <div class="item-lable">民警姓名</div>
            <div class="item-input">
              <el-input
                v-model="searchForm.policeAccessName"
                placeholder="请输入"
              ></el-input>
            </div>
          </FilterSearchItem>
          <FilterSearchItem>
            <div class="item-lable">快速办理</div>
            <div class="item-input">
              <el-checkbox-group
                v-model="fastSolveArr"
                @change="fastSolveChange"
              >
                <el-checkbox label="-1"> 全部 </el-checkbox>
                <el-checkbox label="1"> 是 </el-checkbox>
                <el-checkbox label="0"> 否 </el-checkbox>
              </el-checkbox-group>
            </div>
          </FilterSearchItem>
          <FilterSearchItem :is-col2="true">
            <div class="item-lable">入区时段</div>
            <div class="item-input">
              <el-date-picker
                v-model="timeArr"
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
            @selection-change="handleSelectionChange"
            v-loading="loading"
          >
            <el-table-column type="index" label="序号" width="60">
            </el-table-column>
            <el-table-column
              prop="registerName"
              :resizable="false"
              label="姓名"
              show-overflow-title
              width="140"
            >
              <template slot-scope="scope">
                <span
                  class="table-register-name"
                  :title="scope.row.registerName"
                  :style="
                    scope.row.fastSolve == 1
                      ? 'max-width:calc(100% - 50px);'
                      : 'max-width:100%;'
                  "
                  >{{ scope.row.registerName }}</span
                >
                <span
                  class="status-icon green-icon"
                  v-if="scope.row.fastSolve == 1"
                  >快</span
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="registerSex"
              label="性别"
              show-overflow-title
              width="90"
            >
              <template slot-scope="scope">
                <span v-for="item in dictData.sex" :key="item.key">{{
                  item.key == scope.row.registerSex ? item.name : ''
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="suspectType"
              :resizable="false"
              label="人员类型"
              show-overflow-title
              width="140"
            >
              <template slot-scope="scope">
                <span
                  v-for="item in dictData.suspectType"
                  :key="item.key"
                  class="status-icon"
                  :class="{
                    'red-icon': scope.row.personType == 1,
                    'blue-icon': scope.row.personType == 2,
                    'gray-icon':
                      scope.row.personType != 1 && scope.row.personType != 2,
                    'display-none': item.key != scope.row.personType,
                  }"
                  >{{ item.key != scope.row.personType ? '' : item.name }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="deptName"
              label="办案部门"
              show-overflow-title
            >
            </el-table-column>
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
            <el-table-column prop="areaName" label="办案区" show-overflow-title>
            </el-table-column>
            <el-table-column
              prop="entryTime"
              label="入区时间"
              show-overflow-title
            >
              <template slot-scope="scope">
                {{
                  scope.row.entryTime &&
                  $moment(scope.row.entryTime).format('YYYY-MM-DD HH:mm:ss')
                }}
              </template>
            </el-table-column>
            <el-table-column
              prop="caseCause"
              label="入区时长"
              show-overflow-title
            >
              <template slot-scope="scope">
                {{ $duration(scope.row.entryTime, scope.row.outTime) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="registerStatus"
              :resizable="false"
              label="流程状态"
              show-overflow-title
              width="180"
            >
              <template slot-scope="scope">
                <span
                  class="status-icon status-icon-nodo"
                  :class="{ 'green-icon': scope.row.doBodyCheck == 1 }"
                  >检</span
                >
                <span
                  class="status-icon status-icon-nodo"
                  :class="{ 'green-icon': scope.row.doGoodsStorage == 1 }"
                  >物</span
                >
                <span
                  class="status-icon status-icon-nodo"
                  :class="{ 'green-icon': scope.row.doCollected == 1 }"
                  v-if="scope.row.personType == 1"
                  >采</span
                >
                <span
                  class="status-icon status-icon-nodo"
                  :class="{ 'green-icon': scope.row.doDrugCheck == 1 }"
                  v-if="scope.row.personType == 1"
                  >毒</span
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" show-overflow-title width="120">
              <template slot-scope="scope">
                <span
                  class="table-ctrl-btn"
                  @click="updateHandle(scope.row.registerId)"
                  v-if="scope.row.doCollected == 1"
                  >编辑</span
                >
                <span
                  class="table-ctrl-btn"
                  @click="addHandle(scope.row)"
                  v-else
                  >录入</span
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
    </div>
  </watermarkContent>
</template>
<script>
import FilterSearchBox from '../../components/FilterSearchBox/FilterSearchBox'
import FilterSearchItem from '../../components/FilterSearchItem/FilterSearchItem'
import FilterSearchContent from '../../components/FilterSearchContent/FilterSearchContent'
import server from '../../server/infoCollection'
import SelectWithTree from '../../components/SelectWithTree/SelectWithTree'

export default {
  name: 'InfoCollection',
  data() {
    return {
      loading: false,
      areaList: [],
      deptList: [],
      deptName: '',
      timeArr: '',
      fastSolveArr: ['-1'],
      searchForm: {
        registerStatus: '0',
        areaCode: '',
        deptCode: '',
        bandNo: '',
        registerName: '',
        fastSolve: '-1',
        personType: '',
        policeAccessName: '',
        inStartTime: '',
        inEndTime: '',
        pageNo: 1,
        pageSize: 20,
      },
      lastestParams: null,
      pageTotal: 0,
      isFilterBox: false,
      tableData: [],
      multipleSelection: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      usedBindList: [],
      dictData: {
        sex: [],
        suspectType: [],
      },
      processCode: 'collected',
    }
  },
  activated() {
    this.lastestParams
      ? this.getRegisterInfoList(this.lastestParams)
      : this.getRegisterInfoList()
  },
  deactivated() {
    this.socket && this.socket.close()
  },
  beforeDestroy() {
    this.socket && this.socket.close()
  },
  mounted() {
    this.searchForm = { ...this.searchForm, pageNo: 1 }
    this.findAuthUserPlaceList() // 获取办案区列表
    this.findAuthDeptList() // 获取部门列表
    this.inqDict()
    this.$checkPlace && this.connectSocket()
  },
  methods: {
    fastSolveChange(val) {
      if (val.length < 1) {
        this.fastSolveArr = [this.searchForm.fastSolve]
      } else {
        let filterArr = val.filter((item) => {
          return item !== this.searchForm.fastSolve
        })
        if (filterArr.length > 0) {
          this.fastSolveArr = filterArr
          this.searchForm.fastSolve = filterArr[0]
        }
      }
    },
    // 连接胸卡
    connectTag() {
      let jsonObj = `{"comment":{"commenttype":"startapp", "context":"btoolsprotocol", "commentcmd":"btoolsprotocol://CenterUrl:${this.$centerUrl};Toollist:PROT_BToolCardReaderProtocol;CmdLine:BToolCardReaderProtocol://IReaderType:1;"}}`
      this.socket.send(jsonObj)
    },
    // 处理胸卡数据
    tagDataCtrl(_data) {
      if (
        _data &&
        _data.Code === 0 &&
        _data.Result &&
        _data.Result.CommentType === 1
      ) {
        this.usedBindList.some((item) => {
          return item.tagCode === _data.Result.Data.CardCode
        })
          ? (this.searchForm.bandNo = _data.Result.Data.CardCode) &&
            this.getRegisterInfoList()
          : this.$message('此手环未使用')
      }
    },
    // 连接btools工具
    connectSocket(callback) {
      let socketHost =
        window.location.protocol.indexOf('https') > -1
          ? 'wss://127.0.0.1:18001/WebS_Js'
          : 'ws://127.0.0.1:18000/WebS_Js'
      try {
        this.socket = new WebSocket(socketHost)
        this.socket.onopen = () => {
          // 发送检测插件助手是否安装请求
          let jsonObj =
            '{"comment":{"commenttype":"checkapp", "context":"btoolsprotocol"}}'
          this.socket.send(jsonObj)
        }
        this.socket.onerror = () => {
          // 连接失败，通信中间件未安装
          this.$message('检测到您未安装插件助手')
        }
        this.socket.onmessage = async (data) => {
          // onMessageCallback(data)
          let _data = JSON.parse(data.data)
          console.log(_data)
          if (
            _data &&
            _data.comment &&
            _data.comment.commenttype === 'checkapp'
          ) {
            // 检测插件助手是否安装
            if (_data.comment.resultCode === '1') {
              this.connectTag() // 连接胸卡
              if (callback) {
                callback()
              }
            } else {
              this.$message('检测到您未安装插件助手')
            }
          } else {
            this.tagDataCtrl(_data)
          }
        }
        this.socket.onclose = () => {
          console.log(this.socket.readyState)
          this.socket = null
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 部门查询切换
    // deptChange (data) {
    //   this.searchForm.deptCode = data.deptIndexCode
    // },
    // 查询按钮点击回调
    searchHandle() {
      this.searchForm.pageNo = 1
      this.getRegisterInfoList()
    },
    // 重置按钮回调
    resetHandle() {
      this.timeArr = ''
      this.searchForm = {
        ...this.searchForm,
        areaCode: '',
        deptCode: '',
        bandNo: '',
        registerName: '',
        personType: '',
        fastSolve: '-1',
        policeAccessName: '',
        inStartTime: '',
        inEndTime: '',
        pageNo: 1,
        pageSize: 20,
      }
      this.deptName = ''
      this.fastSolveArr = ['-1']
      this.getRegisterInfoList()
    },
    // 列表查询
    async getRegisterInfoList(lastestParams) {
      let params = {}
      if (lastestParams) {
        params = lastestParams
      } else {
        let inStartTime =
          this.timeArr &&
          this.timeArr[0] &&
          this.$moment(this.timeArr[0]).format('YYYY-MM-DD HH:mm:ss')
        let inEndTime =
          this.timeArr &&
          this.timeArr[1] &&
          this.$moment(this.timeArr[1]).format('YYYY-MM-DD HH:mm:ss')
        this.lastestParams = params = {
          ...this.searchForm,
          inStartTime,
          inEndTime,
        }
      }
      // this.loading = true
      const result = await server.getRegisterInfoList(params)
      const { data } = result
      if (data.code === '0') {
        this.tableData = data.data.list
        this.pageTotal = data.data.total
        // this.loading = false
        this.getUsedBandsList()
      } else {
        // this.loading = false
        this.$messagebox(result)
      }
    },
    // 获取已绑定手环列表
    async getUsedBandsList() {
      let params = {}
      const result = await server.getUsedBandsList(params)
      const { data } = result
      if (data.code === '0') {
        this.usedBindList = data.data
      } else {
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
      this.getRegisterInfoList(this.lastestParams)
    },
    // 页码改变
    handleCurrentChange(pageNo) {
      this.searchForm = { ...this.searchForm, pageNo: pageNo }
      this.lastestParams = { ...this.lastestParams, pageNo: pageNo }
      this.getRegisterInfoList(this.lastestParams)
    },
    // 选中项改变
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //录入
    addHandle(item) {
      this.getCaseAreaProcessConfig(item)
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
          this.updateHandle(item.registerId)
        }
      } else {
        this.$message.error(this.$i18n.t(data.code))
      }
    },
    // 编辑跳转
    updateHandle(id) {
      id && this.$router.push({ path: 'addEdit', query: { id: id } })
    },
    // 获取办案区
    async findAuthUserPlaceList() {
      const result = await server.findAuthUserPlaceList()
      const { data } = result
      if (data.code === '0') {
        this.areaList = data.data.list
      } else {
        this.$messagebox(result)
      }
    },
    // 获取办案部门
    async findAuthDeptList() {
      const result = await server.findAuthDeptList()
      const { data } = result
      if (data.code === '0') {
        this.deptList = data.data
      } else {
        this.$messagebox(result)
      }
    },
    // 获取字典
    async inqDict() {
      const result = await server.inqDict()
      const { data } = result
      if (data.code === '0') {
        this.dictData = {
          sex: data.data.sex,
          suspectType: data.data.suspectType,
        }
      } else {
        this.$messagebox(result)
      }
    },
  },
  mixins: [],
  components: {
    FilterSearchBox,
    FilterSearchItem,
    FilterSearchContent,
    SelectWithTree,
  },
}
</script>
<style lang="less" rel="stylesheet/less">
.info-collection {
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
    padding: 0px 24px 0px 24px;
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
  }
  .pagination-box {
    box-shadow: 0px -1px 0px #f2f2f2;
    padding: 0 16px;
    box-sizing: border-box;
  }
}
</style>
