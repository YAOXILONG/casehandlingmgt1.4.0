<template>
  <watermarkContent>
    <div class="police-register">
      <div class="ctrl-box">
        <div class="ctrl-item add-box" @click="addHandle">
          <i class="h-icon-add"></i><span class="icon-desc">添加</span>
        </div>
      </div>
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
                v-model="deptName"
                :tree-data="deptList"
                :default-props="defaultProps"
                :simple-data="true"
                node-key="deptIndexCode"
                parent-key="parentIndexCode"
                @change="deptChange"
              ></SelectWithTree>
            </div>
          </FilterSearchItem>
          <FilterSearchItem>
            <div class="item-lable">民警姓名</div>
            <div class="item-input">
              <el-input
                v-model="searchForm.policeName"
                placeholder="请输入"
              ></el-input>
            </div>
          </FilterSearchItem>
          <FilterSearchItem v-if="$checkPlace">
            <div class="item-lable">胸卡编号</div>
            <div class="item-input">
              <el-select
                v-model="searchForm.cardNo"
                placeholder="点击此文本框后刷胸卡"
                filterable
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
            <div class="item-lable">状态</div>
            <div class="item-input">
              <el-select
                v-model="searchForm.accessStatus"
                placeholder="请输入"
                clear
              >
                <el-option label="全部" value=""> </el-option>
                <el-option label="在区" value="0"> </el-option>
                <el-option label="出区" value="1"> </el-option>
              </el-select>
            </div>
          </FilterSearchItem>
          <FilterSearchItem :is-col2="true">
            <div class="item-lable">入区时间段</div>
            <div class="item-input">
              <el-date-picker
                v-model="inTimeArr"
                type="datetimerange"
                placeholder="选择日期范围"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :style="{ width: '100%' }"
              >
              </el-date-picker>
            </div>
          </FilterSearchItem>
          <FilterSearchItem :is-col2="true">
            <div class="item-lable">出区时间段</div>
            <div class="item-input">
              <el-date-picker
                v-model="outTimeArr"
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
            <el-table-column prop="policeName" label="姓名" show-overflow-title>
            </el-table-column>
            <el-table-column
              prop="policeNo"
              label="民警证件号"
              show-overflow-title
            >
            </el-table-column>
            <el-table-column prop="areaName" label="办案区" show-overflow-title>
            </el-table-column>
            <el-table-column
              prop="deptName"
              label="办案部门"
              show-overflow-title
            >
            </el-table-column>
            <el-table-column
              prop="accessStatus"
              label="状态"
              show-overflow-title
            >
              <template slot-scope="scope">
                {{ scope.row.accessStatus == '0' ? '在区' : '出区' }}
              </template>
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
              prop="outTime"
              label="出区时间"
              show-overflow-title
            >
              <template slot-scope="scope">
                {{
                  scope.row.outTime &&
                  $moment(scope.row.outTime).format('YYYY-MM-DD HH:mm:ss')
                }}
              </template>
            </el-table-column>
            <el-table-column label="操作" show-overflow-title width="280">
              <template slot-scope="scope">
                <span
                  class="table-ctrl-btn"
                  @click="bindTag(scope.row)"
                  v-if="
                    scope.row.accessStatus == 0 &&
                    scope.row.cardNo &&
                    scope.row.locationSys &&
                    scope.row.locationSys.indexOf('RFID') != -1
                  "
                  >更换胸卡</span
                >
                <span
                  class="table-ctrl-btn"
                  @click="bindTag(scope.row)"
                  v-else-if="
                    scope.row.accessStatus == 0 &&
                    scope.row.locationSys &&
                    scope.row.locationSys.indexOf('RFID') != -1
                  "
                  >发放胸卡</span
                >
                <span
                  class="table-ctrl-btn"
                  @click="policeLeaveInfo(scope.row.accessId)"
                  v-if="scope.row.accessStatus == 0"
                  >民警出区</span
                >
                <span
                  class="table-ctrl-btn"
                  @click="updateHandle(scope.row.accessId)"
                  v-if="scope.row.accessStatus == 0"
                  >编辑</span
                >
                <span
                  class="table-ctrl-btn"
                  @click="delHandle(scope.row.accessId)"
                  >删除</span
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
        title="发放胸卡"
        :visible.sync="dialogVisible"
        size="small"
        :area="500"
      >
        <div class="tag-select-box">
          <span class="tag-label">胸卡编号：</span>
          <el-select
            v-model="selectedTag"
            placeholder="点击此文本框后刷胸卡"
            class="tag-select"
            :area="500"
            filterable
            clear
          >
            <el-option
              v-for="(item, index) in TagInfoListXiongka"
              :key="index"
              :label="item.tagUuid"
              :value="item.tagUuid"
            >
            </el-option>
          </el-select>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="tagCheckSure">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </watermarkContent>
</template>
<script>
import FilterSearchBox from '../../components/FilterSearchBox/FilterSearchBox'
import FilterSearchItem from '../../components/FilterSearchItem/FilterSearchItem'
import FilterSearchContent from '../../components/FilterSearchContent/FilterSearchContent'
import server from '../../server/policeRegister'
import SelectWithTree from '../../components/SelectWithTree/SelectWithTree'

export default {
  name: 'PoliceRegister',
  data() {
    return {
      loading: false,
      dialogVisible: false,
      selectedTag: '',
      inTimeArr: '',
      outTimeArr: '',
      areaList: [],
      deptList: [],
      searchForm: {
        areaCode: '',
        cardNo: '',
        policeName: '',
        accessStatus: '',
        pageNo: 1,
        pageSize: 20,
        deptCode: '',
      },
      lastestParams: null,
      deptName: '',
      pageTotal: 0,
      isFilterBox: false,
      tableData: [],
      multipleSelection: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      TagInfoListXiongka: [],
      currentPoliceData: {},
      usedBindList: [],
    }
  },
  activated() {
    this.lastestParams
      ? this.getAccessPoliceInfoList(this.lastestParams)
      : this.getAccessPoliceInfoList()
  },
  deactivated() {
    this.socket && this.socket.close()
  },
  beforeDestroy() {
    this.socket && this.socket.close()
  },
  mounted() {
    this.findAuthUserPlaceList()
    this.findAuthDeptList()
    this.$checkPlace && this.connectSocket()
  },
  methods: {
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
        // this.searchForm.bandNo = _data.Result.Data.CardCode
        if (this.dialogVisible) {
          this.TagInfoListXiongka.some((item) => {
            return item.tagUuid === _data.Result.Data.CardCode
          })
            ? (this.selectedTag = _data.Result.Data.CardCode)
            : this.$message('暂无此胸卡数据')
        } else {
          this.usedBindList.some((item) => {
            return item.tagCode === _data.Result.Data.CardCode
          })
            ? (this.searchForm.cardNo = _data.Result.Data.CardCode) &&
              this.getAccessPoliceInfoList()
            : this.$message('此胸卡未使用')
        }
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
    deptChange(data) {
      this.searchForm.deptCode = data.deptIndexCode
    },
    // 查询按钮点击回调
    searchHandle() {
      this.searchForm.pageNo = 1
      this.getAccessPoliceInfoList()
    },
    // 重置按钮回调
    resetHandle() {
      this.inTimeArr = ''
      this.outTimeArr = ''
      this.searchForm = {
        ...this.searchForm,
        areaCode: '',
        cardNo: '',
        policeName: '',
        accessStatus: '',
        pageNo: 1,
        pageSize: 20,
        deptCode: '',
      }
      this.deptName = ''
      this.getAccessPoliceInfoList()
    },
    // 列表查询
    async getAccessPoliceInfoList(lastestParams) {
      let params = {}
      if (lastestParams) {
        params = lastestParams
      } else {
        let inStartTime =
          this.inTimeArr &&
          this.inTimeArr[0] &&
          this.$moment(this.inTimeArr[0]).format('YYYY-MM-DD HH:mm:ss')
        let inEndTime =
          this.inTimeArr &&
          this.inTimeArr[1] &&
          this.$moment(this.inTimeArr[1]).format('YYYY-MM-DD HH:mm:ss')
        let outStartTime =
          this.outTimeArr &&
          this.outTimeArr[0] &&
          this.$moment(this.outTimeArr[0]).format('YYYY-MM-DD HH:mm:ss')
        let outEndTime =
          this.outTimeArr &&
          this.outTimeArr[1] &&
          this.$moment(this.outTimeArr[1]).format('YYYY-MM-DD HH:mm:ss')
        this.lastestParams = params = {
          ...this.searchForm,
          inStartTime,
          inEndTime,
          outStartTime,
          outEndTime,
        }
      }

      // this.loading = true
      const result = await server.getAccessPoliceInfoList(params)
      const { data } = result
      if (data.code === '0') {
        // this.loading = false
        this.tableData = data.data.list
        this.pageTotal = data.data.total
        this.getUsedBandsList()
      } else {
        // this.loading = false
        this.$messagebox(result)
      }
    },
    // 发放胸卡
    bindTag(item) {
      this.selectedTag = ''
      this.currentPoliceData = item
      this.getTagInfoList(item.areaCode)
      this.dialogVisible = true
    },
    // 绑定标签确认
    tagCheckSure() {
      this.manageTag(1)
    },

    // 绑定/解绑胸卡
    async manageTag(status) {
      let params = {
        personId: this.currentPoliceData.accessId,
        operate: status,
        tagType: 2,
        tagUuid:
          status === 1 ? this.selectedTag : this.currentPoliceData.cardNo,
      }
      if (!params.tagUuid) {
        this.$message('请选择胸卡')
        return
      }
      const result = await server.manageTag(params)
      const { data } = result
      if (data.code === '0') {
        this.$message.success(status === 1 ? '绑定成功' : '解绑成功')
        this.dialogVisible = false
        this.getAccessPoliceInfoList()
      } else {
        this.$messagebox(result)
      }
    },
    // 民警出区
    async policeLeaveInfo(id) {
      this.$confirm('确认出区?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'question',
      }).then(async () => {
        // let params = {
        //   accessId: id
        // }
        const result = await server.policeLeaveInfo({ accessId: id })
        const { data } = result
        if (data.code === '0') {
          this.$message.success('出区成功')
          this.getAccessPoliceInfoList()
        } else {
          this.$messagebox(result)
        }
      })
    },
    // 每页展示数量改变
    handleSizeChange(pageSize) {
      this.searchForm = { ...this.searchForm, pageSize: pageSize, pageNo: 1 }
      this.lastestParams = {
        ...this.lastestParams,
        pageSize: pageSize,
        pageNo: 1,
      }
      this.getAccessPoliceInfoList(this.lastestParams)
    },
    // 页码改变
    handleCurrentChange(pageNo) {
      this.searchForm = { ...this.searchForm, pageNo: pageNo }
      this.lastestParams = { ...this.lastestParams, pageNo: pageNo }
      this.getAccessPoliceInfoList(this.lastestParams)
    },
    // 选中项改变
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 列表删除
    delHandle(rowId) {
      this.$confirm('删除以后会自动解除定位标签，是否确认删除该民警？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'question',
      }).then(async () => {
        const result = await server.deletePoliceInfo({ accessId: rowId })
        const { data } = result
        if (data.code === '0') {
          this.$message.success('删除成功')
          this.getAccessPoliceInfoList()
        } else {
          this.$messagebox(result)
        }
      })
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
    // 获取标签列表
    async getTagInfoList(areaCode) {
      const params = {
        areaCode: areaCode,
        tagType: 2,
      }
      const result = await server.getTagInfoList(params)
      const { data } = result
      if (data.code === '0') {
        this.TagInfoListXiongka = data.data
      } else {
        this.$messagebox(result)
      }
    },
    // 获取已绑定标签列表
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
    // 编辑跳转
    updateHandle(id) {
      id && this.$router.push({ path: 'addEdit', query: { id: id } })
    },
    // 添加跳转
    addHandle() {
      this.$router.push({ path: 'addEdit' })
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
.police-register {
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
      font-size: 14px;
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
  .tag-select-box {
    .tag-label {
      display: inline-block;
      vertical-align: middle;
    }
    .tag-select {
      width: 260px;
      display: inline-block;
      vertical-align: middle;
    }
  }
  .pagination-box {
    box-shadow: 0px -1px 0px #f2f2f2;
    padding: 0 16px;
    box-sizing: border-box;
  }
}
</style>
