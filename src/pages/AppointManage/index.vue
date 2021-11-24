<template>
  <watermarkContent>
    <div class="appoint-manage">
      <div class="ctrl-box">
        <div class="ctrl-item add-box"
             @click="addHandle">
          <i class="h-icon-add"></i><span class="icon-desc">添加</span>
        </div>
        <div class="ctrl-item del-box"
             @click="delHandle('')">
          <i class="h-icon-delete"></i><span class="icon-desc">删除</span>
        </div>
      </div>
      <div class="content-box">
        <FilterSearchBox>
          <FilterSearchItem>
            <div class="item-lable">
              办案区
            </div>
            <div class="item-input">
              <el-select v-model="searchForm.areaCode"
                         filterable
                         placeholder="请选择"
                         clear>
                <el-option label="全部"
                           value="">
                </el-option>
                <el-option v-for="item in areaList"
                           :key="item.areaIndexCode"
                           :label="item.areaName"
                           :value="item.areaIndexCode">
                </el-option>
              </el-select>
            </div>
          </FilterSearchItem>
          <FilterSearchItem>
            <div class="item-lable">
              民警姓名
            </div>
            <div class="item-input">
              <el-input v-model="searchForm.policeName"
                        placeholder="请输入"></el-input>
            </div>
          </FilterSearchItem>
          <FilterSearchItem>
            <div class="item-lable">
              预约类型
            </div>
            <div class="item-input">
              <el-select v-model="searchForm.appointType"
                         placeholder="请输入"
                         clear>
                <el-option label="全部"
                           value="">
                </el-option>
                <el-option label="电话预约"
                           value="0">
                </el-option>
                <el-option label="网络预约"
                           value="1">
                </el-option>
              </el-select>
            </div>
          </FilterSearchItem>
          <FilterSearchItem :is-col2="true">
            <div class="item-lable">
              预约时段
            </div>
            <div class="item-input">
              <el-date-picker v-model="timeArr"
                              type="datetimerange"
                              placeholder="选择日期范围"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              :style="{width:'100%'}">
              </el-date-picker>
            </div>
          </FilterSearchItem>
          <FilterSearchItem :is-btn="true">
            <el-button type="primary"
                       @click="searchHandle">
              查询
            </el-button>
            <el-button @click="resetHandle">
              重置
            </el-button>
          </FilterSearchItem>
        </FilterSearchBox>
        <FilterSearchContent>
          <el-table ref="autoTable"
                    :data="tableData"
                    force-scroll
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    v-loading="loading">
            <!-- <template slot="empty">
            <img
              src="../../assets/image/default_no_data.svg"
              alt=""
            >
            <div>暂无数据</div>
          </template> -->
            <el-table-column type="selection">
            </el-table-column>
            <el-table-column type="index"
                             label="序号"
                             width="55">
            </el-table-column>
            <el-table-column prop="hostPoliceName"
                             label="主办民警"
                             show-overflow-title>
            </el-table-column>
            <el-table-column prop="auxiliaryPoliceName"
                             label="协办民警"
                             show-overflow-title>
            </el-table-column>
            <el-table-column prop="areaName"
                             label="办案区"
                             show-overflow-title>
            </el-table-column>
            <el-table-column prop="deptName"
                             label="办案部门"
                             show-overflow-title>
            </el-table-column>
            <el-table-column prop="policeTel"
                             label="主办民警电话"
                             show-overflow-title>
            </el-table-column>
            <el-table-column prop="policeTel2"
                             label="协办民警电话"
                             show-overflow-title>
            </el-table-column>
            <el-table-column prop="appointType"
                             label="预约类型"
                             show-overflow-title>
              <template slot-scope="scope">
                <span v-if="scope.row.appointType==0">电话预约</span>
                <span v-if="scope.row.appointType==1">网络预约</span>
              </template>
            </el-table-column>
            <el-table-column prop="arriveTime"
                             label="预计到达时间"
                             show-overflow-title>
              <template slot-scope="scope">
                {{ $moment(scope.row.arriveTime).format('YYYY-MM-DD HH:mm:ss') }}
              </template>
            </el-table-column>
            <el-table-column prop="caseCauseName"
                             label="案由"
                             show-overflow-title>
            </el-table-column>
            <el-table-column label="操作"
                             show-overflow-title
                             width="120">
              <template slot-scope="scope">
                <span class="table-ctrl-btn"
                      @click="updateHandle(scope.row.appointId)">编辑</span>
                <span class="table-ctrl-btn"
                      @click="delHandle(scope.row.appointId)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </FilterSearchContent>
      </div>
      <div class="pagination-box">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="searchForm.pageNo"
                       :page-sizes="[10, 20, 30, 50]"
                       :page-size="searchForm.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="pageTotal">
        </el-pagination>
      </div>
    </div>
  </watermarkContent>

</template>
<script>
import FilterSearchBox from '../../components/FilterSearchBox/FilterSearchBox'
import FilterSearchItem from '../../components/FilterSearchItem/FilterSearchItem'
import FilterSearchContent from '../../components/FilterSearchContent/FilterSearchContent'
import server from '../../server/appointManage'

export default {
  name: 'AppointManage',
  data () {
    return {
      loading: false,
      areaList: [],
      timeArr: '',
      searchForm: {
        areaCode: '',
        appointType: '',
        policeName: '',
        pageNo: 1,
        pageSize: 20
      },
      lastestParams: null,
      pageTotal: 0,
      isFilterBox: false,
      tableData: [],
      multipleSelection: []
    }
  },
  activated () {
    this.lastestParams ? this.findAppointInfoPage(this.lastestParams) : this.findAppointInfoPage()
  },
  mounted () {
    this.searchForm = { ...this.searchForm, pageNo: 1 }
    this.findAuthUserPlaceList()
  },
  methods: {
    // 获取办案区
    async findAuthUserPlaceList () {
      const result = await server.findAuthUserPlaceList()
      const { data } = result
      if (data.code === '0') {
        this.areaList = data.data.list
      } else {
        this.$messagebox(result)
      }
    },
    // 查询按钮点击回调
    searchHandle () {
      this.searchForm.pageNo = 1
      this.findAppointInfoPage()
    },
    // 重置按钮回调
    resetHandle () {
      this.timeArr = ''
      this.searchForm = {        ...this.searchForm,
        areaCode: '',
        appointType: '',
        policeName: '',
        pageNo: 1,
        pageSize: 20      }
      this.findAppointInfoPage()
    },
    // 列表查询
    async findAppointInfoPage (lastestParams) {
      let params = {}
      if (lastestParams) {
        params = lastestParams
      } else {
        let arriveStartTime = this.timeArr && this.timeArr[0] && this.$moment(this.timeArr[0]).format('YYYY-MM-DD HH:mm:ss')
        let arriveEndTime = this.timeArr && this.timeArr[1] && this.$moment(this.timeArr[1]).format('YYYY-MM-DD HH:mm:ss')
        this.lastestParams = params = { ...this.searchForm, arriveStartTime, arriveEndTime }
      }

      // this.loading = true
      const result = await server.findAppointInfoPage(params)
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
    handleSizeChange (pageSize) {
      this.searchForm = { ...this.searchForm, pageSize: pageSize, pageNo: 1 }
      this.lastestParams = { ...this.lastestParams, pageSize: pageSize, pageNo: 1 }
      this.findAppointInfoPage(this.lastestParams)
    },
    // 页码改变
    handleCurrentChange (pageNo) {
      this.searchForm = { ...this.searchForm, pageNo: pageNo }
      this.lastestParams = { ...this.lastestParams, pageNo: pageNo }
      this.findAppointInfoPage(this.lastestParams)
    },
    // 选中项改变
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 列表删除
    delHandle (rowId) {
      let rowIds = rowId ? [rowId] : this.multipleSelection.map((item) => { return item.appointId })
      if (!rowIds || rowIds.length < 1) {
        this.$message.warning('至少选择一项')
        return
      }
      this.$confirm('确认删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'question'
      }).then(async () => {
        // let params = {rowIds}
        const result = await server.delAppointInfo(rowIds)
        const { data } = result
        if (data.code === '0') {
          this.$message.success('删除成功')
          this.searchForm = { ...this.searchForm, pageNo: 1 }
          this.findAppointInfoPage()
        } else {
          this.$messagebox(result)
        }
      })
    },
    // 编辑跳转
    updateHandle (appointId) {
      appointId && this.$router.push({ path: 'addEdit', query: { id: appointId } })
    },
    // 添加跳转
    addHandle () {
      this.$router.push({ path: 'addEdit' })
    }

  },
  mixins: [],
  components: { FilterSearchBox, FilterSearchItem, FilterSearchContent }
}
</script>
<style lang="less" rel="stylesheet/less">
.appoint-manage {
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
    height: ~"calc(100% - 56px)";
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
