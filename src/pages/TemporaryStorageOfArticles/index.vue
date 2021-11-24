<template>
  <watermarkContent>
    <div class="storageOfArticlesIndex">
      <div class="storageOfArticlesIndexBox">
        <FilterSearchBox>
          <FilterSearchItem>
            <div class="item-lable">办案区</div>
            <div class="item-input">
              <el-select
                v-model="searchForm.areaCode"
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
            <div class="item-lable">办案部门</div>
            <div class="item-input">
              <SelectWithTree
                v-model="deptName"
                :tree-data="deptInfoList"
                :default-props="defaultProps"
                :simple-data="true"
                node-key="deptIndexCode"
                parent-key="parentIndexCode"
                @change="deptChange"
                ref="SelectWithTree"
              ></SelectWithTree>
            </div>
          </FilterSearchItem>
          <FilterSearchItem v-show="$checkPlace">
            <div class="item-lable">手环编号</div>
            <div class="item-input">
              <el-select
                v-model="searchForm.bandNo"
                placeholder="点击此文本框后刷手环"
                clear
              >
                <el-option
                  v-for="(item, index) in bandsList"
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
              <el-input v-model="searchForm.registerName" placeholder="请输入"> </el-input>
            </div>
          </FilterSearchItem>
          <FilterSearchItem>
            <div class="item-lable">人员类型</div>
            <div class="item-input">
              <el-select
                v-model="searchForm.personType"
                placeholder="请选择"
                clear
              >
                <el-option
                  v-for="(item, index) in personTypeList"
                  :key="index"
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
              <el-input v-model="searchForm.policeAccessName" placeholder="请输入"> </el-input>
            </div>
          </FilterSearchItem>
          <FilterSearchItem>
            <div class="item-lable">快速办理</div>
            <div class="item-input">
              <el-checkbox-group
                v-model="searchForm.fastSolve"
                @change="handleChange"
              >
                <el-checkbox label="-1" name="type"> 全部 </el-checkbox>
                <el-checkbox :show-label="false" label="1" name="1">
                  是
                </el-checkbox>
                <el-checkbox :show-label="false" label="0" name="0">
                  否
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </FilterSearchItem>
          <FilterSearchItem :is-col2="true">
            <div class="item-lable">入区时段</div>
            <div class="item-input">
              <el-date-picker
                v-model="searchForm.time"
                type="datetimerange"
                placeholder="选择时段"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              >
              </el-date-picker>
            </div>
          </FilterSearchItem>
          <FilterSearchItem :is-btn="true">
            <el-button type="primary" @click="handleSearch"> 查询 </el-button>
            <el-button @click="handleReset"> 重置 </el-button>
          </FilterSearchItem>
        </FilterSearchBox>
        <FilterSearchContent>
          <div class="table-container">
            <el-table
              :data="paramsTable.tableData"
              tooltip-effect="dark"
              style="width: 100%"
              force-scroll
            >
              <el-table-column
                label="序号"
                type="index"
                width="60"
              ></el-table-column>
              <el-table-column
                label="姓名"
                :resizable="false"
                width="140"
                show-overflow-title
              >
                <template slot-scope="scope">
                  <span
                    class="registerName"
                    :title="scope.row.registerName || ''"
                    :style="
                      scope.row.fastSolve == 1
                        ? 'max-width:calc(100% - 50px);'
                        : 'max-width:100%;'
                    "
                  >
                    {{ scope.row.registerName || '' }}
                  </span>
                  <span v-if="scope.row.fastSolve == 1" class="greenSpan"
                    >快</span
                  >
                </template>
              </el-table-column>
              <el-table-column label="性别" width="90" show-overflow-title>
                <template slot-scope="scope">
                  <span v-if="sexMap[scope.row.registerSex]">{{
                    sexMap[scope.row.registerSex]
                  }}</span>
                  <span v-else></span>
                </template>
              </el-table-column>
              <el-table-column
                label="人员类型"
                :resizable="false"
                width="140"
                show-overflow-title
              >
                <template slot-scope="scope">
                  <span
                    v-if="Number(scope.row.personType) === 2"
                    class="blueSpan"
                    :title="personTypeMap[scope.row.personType]"
                    >{{ personTypeMap[scope.row.personType] }}</span
                  >
                  <span
                    v-if="Number(scope.row.personType) === 1"
                    class="redSpan"
                    :title="personTypeMap[scope.row.personType]"
                    >{{ personTypeMap[scope.row.personType] }}</span
                  >
                  <span
                    v-if="
                      Number(scope.row.personType) >= 3 ||
                      Number(scope.row.personType) <= 0
                    "
                    class="graySpan"
                    :title="personTypeMap[scope.row.personType]"
                    >{{ personTypeMap[scope.row.personType] }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                label="办案部门"
                show-overflow-title
                prop="deptName"
              ></el-table-column>
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
                label="办案区"
                show-overflow-title
                prop="areaName"
              ></el-table-column>
              <el-table-column label="入区时间" show-overflow-title>
                <template slot-scope="scope">
                  {{
                    scope.row.entryTime
                      ? $moment(scope.row.entryTime).format(
                          'YYYY-MM-DD HH:mm:ss'
                        )
                      : ''
                  }}
                </template>
              </el-table-column>
              <el-table-column label="入区时长" show-overflow-title>
                <template slot-scope="scope">
                  {{ $duration(scope.row.entryTime, scope.row.outTime) }}
                </template>
              </el-table-column>
              <el-table-column
                label="流程状态"
                :resizable="false"
                show-overflow-title
                width="180"
              >
                <template slot-scope="scope">
                  <!-- <span :class="scope.row.doBodyCheck==1 ? 'greenSpan' : 'redSpan'">检</span>
                <span :class="scope.row.doGoodsStorage==1 ? 'greenSpan' : 'redSpan'">物</span>
                <span
                  v-if="Number(scope.row.personType) === 1"
                  :class="scope.row.doCollected==1 ? 'greenSpan' : 'redSpan'"
                >采</span>
                <span
                  v-if="Number(scope.row.personType) === 1"
                  :class="scope.row.doDrugCheck==1 ? 'greenSpan' : 'redSpan'"
                >毒</span> -->
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
              <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                  <span
                    title="录入"
                    class="operationBtn"
                    @click="onDetail(scope.row, 1)"
                    v-if="scope.row.doGoodsStorage === 0"
                    >录入</span
                  >
                  <span
                    title="编辑"
                    class="operationBtn"
                    @click="onDetail(scope.row, 2)"
                    v-else
                    >编辑</span
                  >
                  <span class="dividingLine" v-show="scope.row.doGoodsStorage"
                    >|</span
                  >
                  <!-- v-show="scope.row.doGoodsStorage" -->
                  <span
                    title="导出"
                    class="operationBtn"
                    v-show="scope.row.doGoodsStorage"
                    @click="handleExport(scope.row)"
                    >导出</span
                  >
                  <!-- v-show="scope.row.doGoodsStorage" -->
                </template>
              </el-table-column>
            </el-table>
          </div>
        </FilterSearchContent>
      </div>
      <div class="bottom-pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="paramsTable.pageNo"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="paramsTable.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="paramsTable.totalSize"
        >
        </el-pagination>
      </div>
    </div>
  </watermarkContent>
</template>
<script>
import server from '../../server/temporaryStorageOfArticles'
import FilterSearchBox from '../../components/FilterSearchBox/FilterSearchBox'
import FilterSearchItem from '../../components/FilterSearchItem/FilterSearchItem'
import FilterSearchContent from '../../components/FilterSearchContent/FilterSearchContent'
import SelectWithTree from '../../components/SelectWithTree/SelectWithTree'
import { setTimeout } from 'timers'

export default {
  name: 'StorageOfArticles',
  data() {
    return {
      deptName: '',
      paramsSearch: {
        areaCode: '',
        deptCode: '',
        bandNo: '',
        registerName: '',
        personType: '',
        policeAccessName: '',
        inStartTime: '',
        inEndTime: '',
        time: '',
        fastSolve: ['-1'],
      },
      searchForm: {
        areaCode: '',
        deptCode: '',
        bandNo: '',
        registerName: '',
        personType: '',
        policeAccessName: '',
        inStartTime: '',
        inEndTime: '',
        time: '',
        fastSolve: ['-1'],
      },
      currentFastSolve: ['-1'],
      paramsTable: {
        tableData: [],
        pageSize: 20,
        pageNo: 1,
        totalSize: 0,
      },

      parentKey: 'parentIndexCode',
      nodeKey: 'deptIndexCode',
      authAreaList: [], // 获取办案区
      bandsList: [], // 手环
      deptInfoList: [], // 办案部门
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      websock: null,
      inqDicts: {},
      personTypeList: [],
      personTypeMap: {},
      sexMap: {},
      processCode: 'goodsStore',
    }
  },
  watch: {
    'searchForm.time'(newV, oldV) {
      if (newV && newV.length === 2) {
        let startTime = newV[0]
        let endTime = newV[1]
        this.searchForm.inStartTime = startTime
          ? this.$moment(startTime).format('YYYY-MM-DD HH:mm:ss')
          : ''
        this.searchForm.inEndTime = endTime
          ? this.$moment(endTime).format('YYYY-MM-DD HH:mm:ss')
          : ''
      } else {
        this.searchForm.inStartTime = ''
        this.searchForm.inEndTime = ''
      }
    },
  },
  mixins: [],
  methods: {
    // 数据字典
    async inqDict() {
      let res = await server.inqDict()
      if (res.data.code === '0') {
        let data = res.data.data
        this.inqDicts = data
        let sexData = data.sex
        let personType = data.suspectType
        this.personTypeList = personType && personType.length ? personType : []
        this.sexMap = this.computedDic(sexData)
        this.personTypeMap = this.computedDic(personType)
      } else {
        this.$messagebox(res)
      }
    },
    computedDic(list) {
      let dicMap = {}
      if (list && list.length) {
        for (let i = 0; i < list.length; i++) {
          dicMap[list[i].key] = list[i].name
        }
      }
      return dicMap
    },
    // 获取办案区
    async findAuthUserPlaceList() {
      let res = await server.findAuthUserPlaceList()
      let data = res.data
      if (data.code === '0') {
        this.authAreaList = data.data.list
      } else {
        this.$messagebox(res)
      }
    },
    // 获取办案部门
    async findAuthDeptList() {
      let res = await server.findAuthDeptList()
      let data = res.data
      if (data.code === '0') {
        this.deptInfoList = data.data
      } else {
        this.$messagebox(res)
      }
    },
    // 部门查询切换
    deptChange(data) {
      this.searchForm.deptCode = data.deptIndexCode
    },
    // 获取手环编号
    async getUsedBandsList() {
      let res = await server.getUsedBandsList()
      let data = res.data
      if (data.code === '0') {
        let _data = data.data
        if (_data && _data.length) {
          this.bandsList = _data
        } else {
          this.bandsList = []
        }
      } else {
        this.$messagebox(res)
      }
    },
    // 获取列表
    async getRegisterInfoList() {
      // let loadingInstance = this.$loading({ fullscreen: true })
      let fastSolve = this.paramsSearch.fastSolve.length
        ? this.paramsSearch.fastSolve[0]
        : '-1'
      let params = {
        registerStatus: 0,
        areaCode: this.paramsSearch.areaCode,
        deptCode: this.paramsSearch.deptCode,
        bandNo: this.paramsSearch.bandNo,
        registerName: this.paramsSearch.registerName,
        personType: this.paramsSearch.personType + '',
        policeAccessName: this.paramsSearch.policeAccessName,
        inStartTime: this.paramsSearch.inStartTime,
        inEndTime: this.paramsSearch.inEndTime,
        fastSolve: fastSolve + '',
        pageNo: this.paramsTable.pageNo + '',
        pageSize: this.paramsTable.pageSize + '',
      }
      try {
        let res = await server.getRegisterInfoList(params)
        let data = res.data
        if (res.data.code === '0') {
          this.paramsTable.tableData = JSON.parse(
            JSON.stringify(data.data.list)
          )
          this.paramsTable.totalSize = data.data.total
          // this.$nextTick(() => {
          //   // loadingInstance.close()
          // })
        } else {
          // loadingInstance.close()
          this.$nextTick(() => {
            this.$messagebox(res)
          })
        }
      } catch {
        setTimeout(() => {
          // loadingInstance.close()
        }, 500)
      }
    },
    // 查询
    handleSearch() {
      let list = JSON.parse(JSON.stringify(this.searchForm))
      this.paramsSearch = {
        areaCode: list.areaCode,
        deptCode: list.deptCode,
        bandNo: list.bandNo,
        registerName: list.registerName,
        personType: list.personType,
        policeAccessName: list.policeAccessName,
        inStartTime: list.inStartTime,
        inEndTime: list.inEndTime,
        fastSolve: JSON.parse(JSON.stringify(list.fastSolve)),
      }
      this.paramsTable.pageNo = 1
      this.getRegisterInfoList()
    },
    // 重置
    handleReset() {
      this.paramsSearch = {
        areaCode: '',
        deptCode: '',
        bandNo: '',
        registerName: '',
        personType: '',
        policeAccessName: '',
        inStartTime: '',
        inEndTime: '',
        time: '',
        fastSolve: ['-1'],
      }
      this.searchForm = {
        areaCode: '',
        deptCode: '',
        bandNo: '',
        registerName: '',
        personType: '',
        policeAccessName: '',
        inStartTime: '',
        inEndTime: '',
        time: '',
        fastSolve: ['-1'],
      }
      this.currentFastSolve = ['-1']
      this.deptName = ''
      this.paramsTable = {
        tableData: [],
        pageSize: 20,
        pageNo: 1,
        totalSize: 0,
      }
      this.getRegisterInfoList()
    },
    // 导出
    async handleExport(item) {
      let params = {
        registerId: item.registerId,
      }
      let res = await server.exportGoodsInfo(params)
      let data = res.data
      if (data.code === '0') {
        if (data.data && data.data.fileUrl) {
          // window.location.href = data.data.fileUrl
          window.open(data.data.fileUrl, '_self')
        } else {
          this.$message({
            type: 'warning',
            message: this.$t(data.code),
          })
        }
      } else {
        this.$messagebox(res)
      }
    },
    // 录入、查看详情
    onDetail(item, type) {
      // /storageOfArticles
      if (type == 1) {
        this.getCaseAreaProcessConfig(item)
      } else {
        this.$router.push({
          path: 'storageOfArticles',
          query: { id: item.registerId, type: type },
        })
      }
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
          this.$router.push({
            path: 'storageOfArticles',
            query: { id: item.registerId, type: 1 },
          })
        }
      } else {
        this.$message.error(this.$i18n.t(data.code))
      }
    },
    // 改变每页显示
    handleSizeChange(val) {
      this.paramsTable.pageSize = val
      this.paramsTable.pageNo = 1
      this.getRegisterInfoList()
    },
    // 改变页码
    handleCurrentChange(val) {
      this.paramsTable.pageNo = val
      this.getRegisterInfoList()
    },
    // 更改是否快速办理
    handleChange(value) {
      if (value.length) {
        let list = JSON.parse(JSON.stringify(value))
        for (let i = 0; i < list.length; i++) {
          if (list[i] !== this.searchForm.fastSolve[0]) {
            this.searchForm.fastSolve = [list[i]]
            break
          }
        }
        this.currentFastSolve = this.searchForm.fastSolve
      } else {
        this.searchForm.fastSolve = this.currentFastSolve
      }
    },
    // 连接手环
    readBracelet() {
      let _self = this
      // 参数
      // let sendMsg = webMsg //'{"comment":{"commenttype":"startapp", "context":"noteFormatClientprotocol", "commentcmd":"noteFormatClientprotocol://nginxIP:' + webMsg.nginxIp + ';nginxport:' + webMsg.nginxPort + ';sg:' + webMsg.sg + ';protocol:' + webMsg.protocol + ';componentID:' + webMsg.componentId + ';servicetype:' + webMsg.serviceType + ';noteTemplateId:' + webMsg.id + ';language:' + webMsg.language + ';"}}'
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
              // 模板笔录编辑
              let jsonObj = `{"comment":{"commenttype":"startapp", "context":"btoolsprotocol", "commentcmd":"btoolsprotocol://CenterUrl:${this.$centerUrl};Toollist:PROT_BToolCardReaderProtocol;CmdLine:BToolCardReaderProtocol://IReaderType:1;"}}`
              _self.websock.send(jsonObj)
            } else {
              _self.$message('检测到您未安装插件助手')
            }
          } else if (_data && _data.Code === 0 && _data.Result) {
            let bandNo = _data.Result.Data
            let CardCode = bandNo.CardCode
            let string = null
            for (let i = 0; i < _self.bandsList.length; i++) {
              if (_self.bandsList[i].tagCode === CardCode) {
                string = CardCode
                break
              }
            }
            if (string) {
              if (_self.searchForm.bandNo !== string) {
                _self.searchForm.bandNo = string
                _self.handleSearch()
              } else {
                _self.searchForm.bandNo = string
              }
            } else if (CardCode) {
              _self.$message('此手环未使用')
            }
          }
        }
        _self.websock.onclose = function () {
          _self.websock = null
        }
      } catch (err) {
        _self.$message.error(err)
      }
    },
  },
  mounted() {
    this.findAuthUserPlaceList()
    this.findAuthDeptList()
    if (this.$checkPlace) {
      this.getUsedBandsList()
      this.readBracelet()
    }

    this.inqDict()
  },
  activated() {
    this.getRegisterInfoList()
  },
  components: {
    FilterSearchBox,
    FilterSearchItem,
    FilterSearchContent,
    SelectWithTree,
  },
}
</script>
<style lang="less" rel="stylesheet/less">
.storageOfArticlesIndex {
  height: 100%;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  overflow: hidden;
  border: solid 8px #f2f2f2;
  .storageOfArticlesIndexBox {
    height: ~'calc(100% - 48px)';
    width: 100%;
    > .filter-search-box {
      width: 100%;
      height: auto;
    }
    > .filter-search-content {
      height: 100%;
      width: 100%;
      .table-container {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        .el-table {
          border: 1px solid transparent;
          border-top: 1px solid #e5e5e5;
          .registerName {
            display: inline-block;
            margin-right: 8px;
            // width: 55px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: middle;
          }
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
          .dividingLine {
            color: #e6e6e6e6;
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
    }
    .item-input {
      > .el-date-editor--datetimerange.el-input {
        width: 100%;
      }
    }
  }
  .bottom-pagination {
    width: 100%;
    height: 56px;
    border-top: 1px solid #e6e6e6;
    box-sizing: border-box;
    padding: 0 16px;
  }
}
</style>
