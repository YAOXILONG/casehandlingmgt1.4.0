<template>
  <watermarkContent>
    <div class="police-management">
      <div class="ctrl-box">
        <div class="ctrl-item add-box"
             @click="addHandle">
          <i class="h-icon-add"></i><span class="icon-desc">添加</span>
        </div>
        <!--      <div class="ctrl-item del-box"-->
        <!--           @click="delHandle('')">-->
        <!--        <i class="h-icon-delete"></i><span class="icon-desc">删除</span>-->
        <!--      </div>-->
      </div>
      <div class="content-box">
        <FilterSearchBox>
          <FilterSearchItem>
            <div class="item-lable">
              警情编号
            </div>
            <div class="item-input">
              <el-input
                v-model="searchForm.policeSituationNo"
                placeholder="请输入"
              ></el-input>
            </div>
          </FilterSearchItem>
          <FilterSearchItem>
            <div class="item-lable"
            >
              报警人姓名
            </div>
            <div class="item-input">
              <el-input
                v-model="searchForm.reporterName"
                placeholder="请输入"
              >
              </el-input>
            </div>
          </FilterSearchItem>
          <FilterSearchItem>
            <div class="item-lable"
            >
              报警内容
            </div>
            <div class="item-input">
              <el-input
                v-model="searchForm.reportContent"
                placeholder="请输入"
              >
              </el-input>
            </div>
          </FilterSearchItem>
          <FilterSearchItem>
            <div class="item-lable"
            >
              处警单位
            </div>
            <div class="item-input">
              <el-input
                v-model="searchForm.handleDeptName"
                placeholder="请输入"
              >
              </el-input>
            </div>
          </FilterSearchItem>
          <FilterSearchItem>
            <div class="item-lable"
            >
              处警民警
            </div>
            <div class="item-input">
              <el-input
                v-model="searchForm.handlePoliceName"
                placeholder="请输入"
              >
              </el-input>
            </div>
          </FilterSearchItem>
          <FilterSearchItem :is-col2="true">
            <div class="item-lable">
              报警时段
            </div>
            <div class="item-input">
              <el-date-picker
                v-model="timeArr"
                type="datetimerange"
                placeholder="选择日期范围"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :style="{width:'100%'}"
              >
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
            <el-table-column prop="policeSituationNo"
                             label="警情编号"
                             width="140">
            </el-table-column>
            <el-table-column prop="reportTime"
                             label="报警时间"
                             show-overflow-title>
            </el-table-column>
            <el-table-column prop="reporterName"
                             label="报警人姓名"
                             show-overflow-title>
            </el-table-column>
            <el-table-column prop="reporterMobile"
                             label="报警人电话"
                             show-overflow-title>
            </el-table-column>
            <el-table-column prop="reportContent"
                             label="报警内容"
                             width="240">
            </el-table-column>
            <el-table-column prop="receiveTime"
                             label="接警时间"
                             show-overflow-title>
            </el-table-column>
            <el-table-column prop="handleTime"
                             label="处警时间"
                             show-overflow-title>
            </el-table-column>
            <el-table-column prop="handleDeptName"
                             label="处警单位"
                             show-overflow-title>
            </el-table-column>
            <el-table-column prop="handlePoliceName"
                             label="处警民警"
                             show-overflow-title>
            </el-table-column>
            <el-table-column label="操作"
                             show-overflow-title
                             width="150">
              <template slot-scope="scope">
                <span class="table-ctrl-btn"
                      @click="updateHandle(scope.row.policeSituationNo)">编辑</span>
                <span class="table-ctrl-btn"
                      style="border-left: solid 1px #e6e6e6;"
                      v-show="showDeleteTag"
                      @click="delHandle(scope.row.policeSituationNo)">删除</span>
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
  import server from "@/server/policeManagement";
  // import server from '../../server/appointManage'

  export default {
    name: "index",
    data() {
      return {
        loading: false,
        areaList: [],
        timeArr: '',
        searchForm: {
          policeSituationNo: '',
          reporterName: '',
          reportContent: '',
          handleDeptName: '',
          handlePoliceName: '',
          pageNo: 1,
          pageSize: 20
        },
        pageTotal: 0,
        tableData: [],
        lastestParams: null,
        isFilterBox: false,
        showDeleteTag: false,
        multipleSelection: []
      }
    },
    activated() {
      this.lastestParams ? this.findPoliceInfoPage(this.lastestParams) : this.findPoliceInfoPage()
    },
    mounted() {
      this.searchForm = {...this.searchForm, pageNo: 1}
      this.checkIsAdmin()
      // this.findAuthUserPlaceList()
    },
    methods: {
      // 获取是否为超级管理员
      async checkIsAdmin() {
        const result = await server.isAdmin()
        const {data} = result
        if (data.code === '0') {
          this.showDeleteTag = data.data
        } else {
          this.$messagebox(result)
        }
      },
      // 查询按钮点击回调
      searchHandle() {
        this.searchForm.pageNo = 1
        this.findPoliceInfoPage()
      },
      // 重置按钮回调
      resetHandle() {
        this.timeArr = ''
        this.searchForm = {
          ...this.searchForm,
          policeSituationNo: '',
          reporterName: '',
          reportContent: '',
          searchForm: '',
          handleDeptName: '',
          handlePoliceName: '',
          pageNo: 1,
          pageSize: 20
        }
        this.findPoliceInfoPage()
      },
      // 列表查询
      async findPoliceInfoPage(lastestParams) {
        let params = {}
        if (lastestParams) {
          params = lastestParams
        } else {
          let reportTimeStartTime = this.timeArr && this.timeArr[0] && this.timeArr[0].getTime()
          let reportTimeEndTime = this.timeArr && this.timeArr[1] && this.timeArr[1].getTime()
          this.lastestParams = params = {
            ...this.searchForm,
            reportTime: {
              beginTime: reportTimeStartTime ? reportTimeStartTime : '',
              endTime: reportTimeEndTime ? reportTimeEndTime : ''
            },
          }
        }
        this.loading = true
        const result = await server.getPoliceSituationInfoList(params)
        const {data} = result
        if (data.code === '0') {
          this.loading = false
          this.tableData = data.data.list
          this.tableData.map((item) => {
            item.receiveTime = item.receiveTime ? this.$moment(item.receiveTime).format('YYYY-MM-DD HH:mm:ss') : ''
            item.handleTime = item.handleTime ? this.$moment(item.handleTime).format('YYYY-MM-DD HH:mm:ss') : ''
            item.reportTime = item.reportTime ? this.$moment(item.reportTime).format('YYYY-MM-DD HH:mm:ss') : ''
          })
          this.pageTotal = data.data.total
        } else {
          this.loading = false
          this.$messagebox(result)
        }
      },
      // 每页展示数量改变
      handleSizeChange(pageSize) {
        this.searchForm = {...this.searchForm, pageSize: pageSize, pageNo: 1}
        this.lastestParams = {...this.lastestParams, pageSize: pageSize, pageNo: 1}
        this.findPoliceInfoPage(this.lastestParams)
      },
      // 页码改变
      handleCurrentChange(pageNo) {
        this.searchForm = {...this.searchForm, pageNo: pageNo}
        this.lastestParams = {...this.lastestParams, pageNo: pageNo}
        this.findPoliceInfoPage(this.lastestParams)
      },
      // 选中项改变
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // 列表删除
      delHandle(policeSituationNo) {
        this.$confirm('确认删除?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'question'
        }).then(async () => {
          let params = {policeSituationNo: policeSituationNo}
          const result = await server.delPoliceSituation(params)
          const {data} = result
          if (data.code === '0') {
            this.$message.success('删除成功')
            this.searchForm = {...this.searchForm, pageNo: 1}
            this.findPoliceInfoPage()
          } else {
            this.$messagebox(result)
          }
        })
      },
      // 编辑跳转
      updateHandle(policeSituationNo) {
        policeSituationNo && this.$router.push({path: 'addEdit', query: {id: policeSituationNo}})
      },
      // 添加跳转
      addHandle() {
        this.$router.push({path: 'addEdit'})
      }
    },
    mixins: [],
    components: {FilterSearchBox, FilterSearchItem, FilterSearchContent}
  }
</script>

<style lang="less" scoped>
  .police-management {
    position: relative;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    border: solid 8px #f2f2f2;

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
      height: ~"calc(100% - 56px)";

      .table-ctrl-btn {
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
