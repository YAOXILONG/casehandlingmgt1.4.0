<template>
  <watermarkContent>
    <div class="ledgerManageIndex">
      <div class="ledgerManageIndexBox">
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
            <div class="item-lable">在区状态</div>
            <div class="item-input">
              <el-select
                v-model="searchForm.registerStatus"
                placeholder="请选择"
                clear
              >
                <el-option
                  v-show="item.key != -1"
                  v-for="(item, index) in registerStatusList"
                  :key="index"
                  :label="item.label"
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
                placeholder="选择日期范围"
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
          <div id="ledgerManageTable" class="ledgerManageTable">
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
                  show-overflow-title
                  :resizable="false"
                  width="140"
                >
                  <template slot-scope="scope">
                    <span
                      class="registerName"
                      :title="scope.row.registerName || ''"
                      :style="
                        scope.row.fastSolve == 1
                          ? 'max-width:calc(100% - 50px);'
                          : 'max-width:calc100%;'
                      "
                    >
                      {{ scope.row.registerName || '' }}
                    </span>
                    <span v-if="scope.row.fastSolve == 1" class="greenSpan"
                      >快</span
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  label="性别"
                  show-overflow-title
                  prop="registerSex"
                  width="90"
                >
                  <template slot-scope="scope">
                    <span v-if="sexMap[scope.row.registerSex]">{{
                      sexMap[scope.row.registerSex]
                    }}</span>
                    <span v-else></span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="人员类型"
                  show-overflow-title
                  :resizable="false"
                  width="140"
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
                  label="案件名称"
                  show-overflow-title
                  prop="caseName"
                ></el-table-column>
                <el-table-column
                  label="办案区"
                  show-overflow-title
                  prop="areaName"
                ></el-table-column>

                <el-table-column
                  prop="caseCause"
                  label="案由"
                  show-overflow-title
                >
                  <template slot-scope="scope">
                    {{ briefMap[scope.row.caseCause] }}
                  </template>
                </el-table-column>

                <el-table-column
                  prop="leaveReason"
                  label="办案结果"
                  show-overflow-title
                >
                  <template slot-scope="scope">
                    {{ leaveReasonMap[scope.row.leaveReason] }}
                  </template>
                </el-table-column>

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
                  label="在区状态"
                  show-overflow-title
                  :resizable="false"
                  width="120"
                >
                  <template slot-scope="scope">
                    <span
                      class="registerStatusColor"
                      v-if="scope.row.registerStatus !== -1"
                      :style="
                        registerStatusList[scope.row.registerStatus].color
                      "
                    ></span>
                    <span
                      class="registerStatusColor"
                      v-else
                      :style="registerStatusList[3].color"
                    ></span>
                    <span
                      class="registerStatusLabel"
                      v-if="scope.row.registerStatus !== -1"
                      >{{
                        registerStatusList[scope.row.registerStatus].label
                      }}</span
                    >
                    <span class="registerStatusLabel" v-else>{{
                      registerStatusList[3].label
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="170">
                  <template slot-scope="scope">
                    <span
                      title="查看"
                      class="operationBtn"
                      @click="onDetail(scope.row)"
                      >查看</span
                    >
                    <span class="dividingLine">|</span>

                    <span
                      title="删除"
                      class="operationBtn"
                      v-if="showFlag"
                      @click="delHandle(scope.row.registerId)"
                      >删除</span
                    >
                    <span class="dividingLine">|</span>

                    <el-popover
                      placement="bottom"
                      trigger="hover"
                      popper-class="ledgerManageIndexPopover"
                      v-model="scope.row.visible"
                    >
                      <div style="text-align: right; margin: 0">
                        <span
                          title="关联案件"
                          class="operationBtn"
                          @click="handleRelatedCase(scope.row)"
                          >关联案件</span
                        >
                        <span
                          title="定位轨迹"
                          class="operationBtn"
                          v-if="scope.row.locationCode"
                          @click="locationLocus(scope.row)"
                          >定位轨迹</span
                        >
                        <span
                          title="导出轨迹"
                          v-if="scope.row.locationCode"
                          class="operationBtn"
                          @click="handleExportLocationLocus(scope.row)"
                          >导出轨迹</span
                        >
                        <span
                          title="导出登记表"
                          class="operationBtn"
                          @click="handleExport(scope.row)"
                          >导出登记表</span
                        >
                        <span
                          v-if="scope.row.registerStatus === 1"
                          title="一键刻录"
                          class="operationBtn"
                          @click="handleRecord(scope.row)"
                          >一键刻录</span
                        >
                        <span
                          title="导出吸毒检测报告"
                          class="operationBtn"
                          @click="handleExportDrug(scope.row)"
                          >导出吸毒检测报告</span
                        >
                      </div>
                      <span
                        slot="reference"
                        title="更多"
                        style="margin-left: 10px"
                        class="operationBtn"
                        >更多</span
                      >
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
            </div>
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
      <relatedCaseDialog
        :params-dialog="paramsDialog"
        @handleClose="handleClose"
      ></relatedCaseDialog>
      <el-dialog
        title="录像下载"
        :visible.sync="diaVisible"
        :area="620"
        show-close
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="cancelDownload"
      >
        <el-table
          :data="vedioData"
          :is-show-page="false"
          height="398"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          ref="multipleTable"
        >
          <el-table-column type="selection" width="40">
            <!--:selectable="selectable"-->
          </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            width="62"
          ></el-table-column>
          <el-table-column
            prop="cameraName"
            show-overflow-title
            label="区域名称"
            width="150"
          >
            <template slot-scope="scope">
              {{ formStandand1(scope.row.cameraName) }}
            </template>
          </el-table-column>
          <el-table-column prop="cameraStartTime" label="进入时间">
            <template slot-scope="scope">
              {{ formStandand1(scope.row.cameraStartTime) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="startTime"
            show-overflow-title
            label="离开时间"
          >
            <template slot-scope="scope">
              {{ formStandand1(scope.row.cameraEndTime) }}
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleExportVedio">
            下载
          </el-button>
          <el-button @click="cancelDownload"> 取消 </el-button>
          <!--<el-button type="primary" @click="ready2Update">{{startorcancledownload ? '下 载' : '取消下载'}}</el-button>
        <el-button @click="cancledownload">离 开</el-button>
        <el-button @click="cancledownload">离 开</el-button>-->
        </div>
      </el-dialog>
      <!-- 剪切板方法 -->
      <input class="copyInput" ref="copyInput" type="text" :value="link" />
    </div>
  </watermarkContent>
</template>
<script>
import server from '../../server/ledgerManage'
import FilterSearchBox from '../../components/FilterSearchBox/FilterSearchBox'
import FilterSearchItem from '../../components/FilterSearchItem/FilterSearchItem'
import FilterSearchContent from '../../components/FilterSearchContent/FilterSearchContent'
import SelectWithTree from '../../components/SelectWithTree/SelectWithTree'
import relatedCaseDialog from './components/relatedCaseDialog'
import { setTimeout } from 'timers'

export default {
  name: 'LedgerManageIndex',
  data() {
    return {
      link: '',
      diaVisible: false,
      vedioData: [],
      multipleSelection: [],
      deptName: '',
      paramsSearch: {
        registerStatus: '',
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
        registerStatus: '',
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
      paramsDialog: {
        registerId: '',
        detailDialogVisible: false,
        inqDicts: {},
      },
      registerStatusList: [
        {
          key: 0,
          color: 'background: #FFCC00;',
          label: '在区',
        },
        {
          key: 1,
          color: 'background: #3BCD8D;',
          label: '已出区',
        },
        {
          key: 2,
          color: 'background: #FE5332;',
          label: '临时离开',
        },
        {
          key: -1,
          color: 'background: #39B2FF;',
          label: '全部',
        },
      ],
      inqDicts: {},
      authAreaList: [], // 获取办案区
      deptInfoList: [], // 办案部门
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      personTypeList: [],
      personTypeMap: {},
      sexMap: {},
      websock: null,
      briefMap: {},
      leaveReasonMap: {},
      showFlag: false,
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

        const briefMap = {}
        data.brief.forEach((v) => {
          briefMap[v.key] = v.name
        })
        this.briefMap = briefMap

        const leaveReasonMap = {}
        data.handleResult.forEach((v) => {
          leaveReasonMap[v.key] = v.name
        })
        this.leaveReasonMap = leaveReasonMap
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
    async getRegisterInfoList() {
      let loadingInstance = this.$loading({ fullscreen: true })
      let fastSolve = this.paramsSearch.fastSolve.length
        ? this.paramsSearch.fastSolve[0]
        : ''
      let params = {
        registerStatus:
          this.paramsSearch.registerStatus === ''
            ? -1
            : this.paramsSearch.registerStatus,
        areaCode: this.paramsSearch.areaCode,
        deptCode: this.paramsSearch.deptCode,
        bandNo: this.paramsSearch.bandNo,
        registerName: this.paramsSearch.registerName,
        personType: this.paramsSearch.personType,
        policeAccessName: this.paramsSearch.policeAccessName,
        inStartTime: this.paramsSearch.inStartTime,
        inEndTime: this.paramsSearch.inEndTime,
        fastSolve: fastSolve,
        pageNo: this.paramsTable.pageNo,
        pageSize: this.paramsTable.pageSize,
      }
      try {
        let res = await server.getRegisterInfoList(params)
        let data = res.data
        if (res.data.code === '0') {
          this.paramsTable.tableData = JSON.parse(
            JSON.stringify(data.data.list)
          )
          this.paramsTable.totalSize = data.data.total
          this.$nextTick(() => {
            loadingInstance.close()
          })
        } else {
          loadingInstance.close()
          setTimeout(() => {
            this.$messagebox(res)
          }, 500)
        }
      } catch {
        setTimeout(() => {
          loadingInstance.close()
        }, 500)
      }
    },
    // 查询
    handleSearch() {
      let list = JSON.parse(JSON.stringify(this.searchForm))
      this.paramsSearch = {
        registerStatus: list.registerStatus,
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
        registerStatus: '',
        areaCode: '',
        deptCode: '',
        bandNo: '',
        registerName: '',
        personType: '',
        policeAccessName: '',
        inStartTime: '',
        inEndTime: '',
        fastSolve: ['-1'],
      }
      this.searchForm = {
        registerStatus: '',
        areaCode: '',
        deptCode: '',
        bandNo: '',
        registerName: '',
        personType: '',
        policeAccessName: '',
        inStartTime: '',
        inEndTime: '',
        fastSolve: ['-1'],
      }
      this.currentFastSolve = ['-1']
      this.paramsTable = {
        tableData: [],
        pageSize: 20,
        pageNo: 1,
        totalSize: 0,
      }
      this.deptName = ''
      this.getRegisterInfoList()
    },
    onDetail(item) {
      this.$router.push({
        path: 'ledgerManage',
        query: { id: item.registerId },
      })
    },
    // 是否显示删除按钮（普通用户不显示）
    async showBtn() {
      const result = await server.showBtn()
      const { data } = result
      if (data.code === '0') {
        this.showFlag = data.data
      } else {
        this.$messagebox(result)
      }
      console.log(data)
    },
    // 列表删除
    delHandle(rowId) {
      this.$confirm('确认删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'question',
      }).then(async () => {
        let params = {
          registerId: rowId,
        }
        const result = await server.delRegisterInfo(params)
        const { data } = result
        if (data.code === '0') {
          this.$message.success('删除成功')
          this.getRegisterInfoList()
        } else {
          this.$messagebox(result)
        }
      })
    },
    // 关联案件
    handleRelatedCase(item) {
      if (item.peopleCode) {
        this.paramsDialog = {
          registerId: item.registerId,
          detailDialogVisible: true,
          inqDicts: this.inqDicts,
        }
      } else {
      }
    },
    // 关闭关联案件敞口
    handleClose(type) {
      this.paramsDialog = {
        registerId: '',
        detailDialogVisible: false,
      }
      if (Number(type) === 2) {
        this.getRegisterInfoList()
      }
    },
    // 定位轨迹
    async locationLocus(item) {
      let params = {
        registerId: item.registerId,
      }
      let res = await server.findIndoorPersonUrl(params)
      let data = res.data
      if (data.code === '0') {
        let url = data.data
        window.open(url)
      } else {
        this.$messagebox(res)
      }
    },
    handleRecord(item) {
      console.log(item)
      this.$router.push({ path: 'record', query: { id: item.registerId } })
    },
    // 导出登记表
    async handleExport(item) {
      let params = {
        registerId: item.registerId,
      }
      let res = await server.exportRegisterInfo(params)
      let data = res.data
      if (data.code === '0') {
        if (data.data && data.data.fileUrl) {
          // window.location.href = data.data.fileUrl
          window.open(data.data.fileUrl, '_self')
        } else {
          this.$message({
            type: 'warning',
            message: '未知错误',
          })
        }
      } else {
        this.$messagebox(res)
      }
    },
    async handleExportDrug() {
      let params = {
        registerId: item.registerId,
      }
      let res = await server.exportDrugMsgInfo(params)
      let data = res.data
      if (data.code === '0') {
        if (data.data && data.data.fileUrl) {
          // window.location.href = data.data.fileUrl
          window.open(data.data.fileUrl, '_self')
        } else {
          this.$message({
            type: 'warning',
            message: '未知错误',
          })
        }
      } else {
        this.$messagebox(res)
      }
    },
    // 导出轨迹
    async handleExportLocationLocus(item) {
      this.connectDownLoad()
      let params = {
        locationCode: item.locationCode,
      }
      let loadingInstances = this.$loading({
        fullscreen: true,
        text: '获取轨迹列表...',
      })
      try {
        let res = await server.downLoadPersonTrackVideo(params)
        if (res.data.code === '0') {
          if (res.data.data && res.data.data.length) {
            this.vedioData = res.data.data
            this.diaVisible = true
          } else {
            this.$message({
              type: 'warning',
              message: '未知错误',
            })
          }
          loadingInstances.close()
        } else {
          loadingInstances.close()
          setTimeout(() => {
            this.$messagebox(res)
          }, 300)
        }
      } catch {
        setTimeout(() => {
          loadingInstances.close()
        }, 300)
      }
    },
    async handleExportVedio() {
      if (!this.multipleSelection.length)
        return this.$message.error('请选择区域进行下载')
      let vedioData = this.multipleSelection
      for (let v = 0; v < vedioData.length; v++) {
        let params = {
          cameraIndexCode: vedioData[v].cameraIndexCode,
          cameraStartTime: vedioData[v].cameraStartTime,
          cameraEndTime: vedioData[v].cameraEndTime,
        }
        const result = await server.downVideo(params)
        const { data } = result
        if (data.code === '0') {
          this.link = ''
          let html = data.data
          // eslint-disable-next-line no-useless-escape
          let pre = `hikdl://indoorpersonpos:0@0:0/2/${
            params.cameraIndexCode
          }/${vedioData[v].cameraName}${this.formStandand1(
            params.cameraStartTime
          )
            .replace(/\-/g, '')
            .replace(/\:/g, '')
            .replace(' ', '')}/range=${params.cameraStartTime};${
            params.cameraEndTime
          }`
          let jsonObj = `{"comment":{"commenttype":"startapp","context":"btoolsprotocol:","commentcmd":"btoolsprotocol://CenterUrl:${
            this.$centerUrl
          };Toollist:PROT_btooldownloadprotocol;CmdLine:${pre + html}"}}`
          if (this.websock) {
            this.websock.send(jsonObj)
          } else {
            this.startBTools(jsonObj)
          }
        } else {
          this.$messagebox(result)
        }
      }
    },
    cancelDownload() {
      this.diaVisible = false
      this.link = ''
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 点击下载进行下载
    async connectDownLoad() {
      const ress = await server.playerParam()
      let res = ress.data
      if (res.code === '0') {
        let data = res.data
        let protocolType = data.protocol // http https
        let NginxIp = data.nginxIp
        let NginxPort = data.nginxPort
        // 参数
        let sendMsg = `{"comment":{"commenttype":"startapp", "context":"btoolsprotocol:", "commentcmd":"btoolsprotocol://CenterUrl:${protocolType}://${NginxIp}:${NginxPort}/portal;Toollist:PROT_btooldownloadprotocol;CmdLine:btooldownloadprotocol://"}}` // MiniUI:1;
        if (this.websock) {
          this.websock.send(sendMsg)
        } else {
          this.startBTools(sendMsg)
        }
      } else {
        this.$messagebox(ress)
      }
      // let sendMsg = `{"comment":{"commenttype":"startapp", "context":"btoolsprotocol:", "commentcmd":"btoolsprotocol://CenterUrl:https://10.19.132.27:443/portal;Toollist:PROT_btooldownloadprotocol;CmdLine:btooldownloadprotocol://"}}` // MiniUI:1;
      // this.websock.send(sendMsg)
    },
    startBTools(sendMsgString) {
      let _self = this
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
        _self.websock.onmessage = async (data) => {
          let _data = JSON.parse(data.data)
          if (
            _data &&
            _data.comment &&
            _data.comment.commenttype === 'checkapp'
          ) {
            // 检测插件助手是否安装
            if (_data.comment.resultCode === '1') {
              if (sendMsgString) {
                _self.websock.send(sendMsgString)
              }
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
    },
    // 轨迹导出时间格式转化
    formStandand1(time) {
      if (time === null) return ''
      if (time.indexOf('.') > -1) {
        // eslint-disable-next-line no-useless-escape
        return time.replace(/\T/g, ' ').substring(0, time.indexOf('.'))
      } else {
        return time
      }
    },
    handleSizeChange(val) {
      this.paramsTable.pageSize = val
      this.paramsTable.pageNo = 1
      this.getRegisterInfoList()
    },
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
  },
  mounted() {
    this.inqDict()
    this.findAuthUserPlaceList()
    this.findAuthDeptList()
    this.startBTools()
    this.showBtn()
  },
  activated() {
    this.getRegisterInfoList()
  },
  components: {
    FilterSearchBox,
    FilterSearchItem,
    FilterSearchContent,
    SelectWithTree,
    relatedCaseDialog,
  },
}
</script>
<style lang="less" rel="stylesheet/less">
.ledgerManageIndex {
  height: 100%;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  border: solid 8px #f2f2f2;
  .copyInput {
    width: 200px;
    height: 30px;
    position: absolute;
    left: -200px;
    top: -100px;
  }
  .ledgerManageIndexBox {
    width: 100%;
    height: ~'calc(100% - 56px)';
    .item-input {
      > .el-date-editor--datetimerange.el-input {
        width: 100%;
      }
    }
    .ledgerManageTable {
      width: 100%;
      height: 100%;
      .table-container {
        height: 100%;
        box-sizing: border-box;

        .registerStatusColor {
          width: 8px;
          height: 8px;
          display: inline-block;
          border-radius: 4px;
          margin-right: 4px;
        }
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
          .dividingLine {
            color: #e6e6e6;
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
  }
  .bottom-pagination {
    width: 100%;
    // height: 40px;
    padding: 0 16px;
    border-top: 1px solid #e6e6e6;
    box-sizing: border-box;
  }
}
.el-popover.ledgerManageIndexPopover {
  min-width: 60px !important;
  margin: 0;
  padding: 0;
  .operationBtn {
    width: 96px;
    height: 32px;
    margin: 4px;
    display: block;
    padding: 0 8px;
    box-sizing: border-box;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #2080f7;
    letter-spacing: 0;
    line-height: 20px;
    cursor: pointer;
    text-align: center;
    line-height: 32px;
  }
  .operationBtn:hover {
    background: #f2f2f2;
  }
}
</style>
