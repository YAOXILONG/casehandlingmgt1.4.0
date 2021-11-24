<template>
  <watermarkContent>
    <div class="exitApplication">
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="在区人员" name="0"> </el-tab-pane>
          <el-tab-pane label="已出区人员" name="1"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="content-box">
        <FilterSearchBox :isFilter="isFilter">
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
            <div class="item-lable">姓名</div>
            <div class="item-input">
              <el-input
                v-model="searchForm.suspectName"
                placeholder="请输入"
              ></el-input>
            </div>
          </FilterSearchItem>
          <FilterSearchItem>
            <div class="item-lable">主办民警</div>
            <div class="item-input">
              <el-input
                v-model="searchForm.policeName"
                placeholder="请输入"
              ></el-input>
            </div>
          </FilterSearchItem>
          <!-- :is-col2="true" -->
          <FilterSearchItem>
            <div class="item-lable">入区时间</div>
            <div class="item-input">
              <el-date-picker
                v-model="searchForm.timeArr"
                type="datetimerange"
                placeholder="选择日期范围"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :style="{ width: '100%' }"
              >
              </el-date-picker>
            </div>
          </FilterSearchItem>
          <FilterSearchItem v-show="activeName == 1">
            <div class="item-lable">状态</div>
            <div class="item-input">
              <el-select v-model="searchForm.status" placeholder="请选择" clear>
                <el-option label="已出区" value="1"> </el-option>
                <el-option label="临时离开" value="2"> </el-option>
              </el-select>
            </div>
          </FilterSearchItem>
          <FilterSearchItem
            :is-btn="true"
            :style="activeName == 0 ? 'padding-top:32px!important' : ''"
          >
            <el-button type="primary" @click="searchHandle"> 搜索 </el-button>
            <el-button @click="resetHandle"> 重置 </el-button>
          </FilterSearchItem>
        </FilterSearchBox>
        <FilterSearchContent>
          <el-table
            :data="tableData"
            force-scroll
            style="width: 100%"
            v-loading="loading"
          >
            <el-table-column type="index" label="序号" width="55">
            </el-table-column>
            <el-table-column
              prop="suspectPhotoUrl"
              label="照片"
              width="120"
              show-overflow-title
            >
              <template slot-scope="scope">
                <el-tooltip placement="top">
                  <div slot="content">
                    <img
                      v-if="scope.row.suspectPhotoUrl"
                      :src="scope.row.suspectPhotoUrl"
                      alt=""
                      width="135px"
                      height="180px"
                    />
                    <img
                      v-else
                      :src="require('../../assets/image/u5576.png')"
                      width="135px"
                      height="180px"
                    />
                  </div>
                  <img
                    v-if="scope.row.suspectPhotoUrl"
                    :src="scope.row.suspectPhotoUrl"
                    alt=""
                    width="39px"
                    height="39px"
                  />
                  <img
                    v-else
                    :src="require('../../assets/image/u5576.png')"
                    width="39px"
                    height="39px"
                  />
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              prop="suspectName"
              :resizable="false"
              label="姓名"
              show-overflow-title
            >
            </el-table-column>
            <el-table-column
              prop="areaName"
              :resizable="false"
              label="办案区"
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
              prop="entryReason"
              label="入区原由"
              show-overflow-title
            >
              <template slot-scope="scope">
                {{ registerTypeMap[scope.row.entryReason] }}
              </template>
            </el-table-column>
            <el-table-column
              prop="entryTime"
              label="入区时间"
              show-overflow-title
            >
              <template slot-scope="scope">
                {{ $moment(scope.row.entryTime).format('YYYY-MM-DD HH:mm:ss') }}
              </template>
            </el-table-column>
            <el-table-column
              label="在区时长"
              show-overflow-title
            >
              <template slot-scope="scope">
                {{ $duration(scope.row.entryTime,scope.row.leaveTime) }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="activeName != 0"
              prop="leaveTime"
              label="出区时间"
              show-overflow-title
            >
              <template slot-scope="scope">
                {{
                  scope.row.leaveTime &&
                  $moment(scope.row.leaveTime).format('YYYY-MM-DD HH:mm:ss')
                }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="activeName != 0"
              prop="status"
              label="状态"
              show-overflow-title
            >
              <template slot-scope="scope">
                <span
                  class="registerStatusColor"
                  :class="'registerStatusColor' + scope.row.status"
                ></span>
                <span class="registerStatusLabel">{{
                  scope.row.status == 1
                    ? '已出区'
                    : scope.row.status == 2
                    ? '临时离开'
                    : ''
                }}</span>
              </template>
            </el-table-column>
             <el-table-column
              label="巡查次数"
              show-overflow-title
            >
              <template slot-scope="scope">
                {{ scope.row.inspectionCount ? scope.row.inspectionCount+'次':'' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" show-overflow-title width="150">
              <template slot-scope="scope">
                <span
                  class="table-ctrl-btn"
                  @click="viewHandle(scope.row.registerIndexCode)"
                  >查看</span
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
import server from '../../server/visitingRecord'

export default {
  name: 'VisitingRecord',
  data() {
    return {
      activeName: '0',
      loading: false,
      authAreaList: [],
      isFilter: false,
      dictData: {
        sex: [],
        suspectType: [],
      },
      searchForm: {
        policeName: '',
        suspectName: '',
        areaCode: '',
        pageNo: 1,
        pageSize: 20,
        timeArr: ['',''],
        status: '',
      },
      lastestParams: null,
      pageTotal: 0,
      tableData: [],
      registerTypeMap: {},
      areaIndexCodes: '-1',
    }
  },
  activated() {
    if (this.lastestParams) {
      this.getStandingBookPage()
    } else {
      this.findAuthUserPlaceList()
    }
  },
  mounted() {
    this.inqDict() // 获取字典列表
  },
  methods: {
    // 获取办案区
    async findAuthUserPlaceList() {
      this.loading = true
      const result = await server.findAuthUserPlaceList()
      const { data } = result
      if (data.code == '0') {
        this.authAreaList = data.data.list
        let authAreaList =
          (this.authAreaList &&
            this.authAreaList.map((v) => v.areaIndexCode)) ||
          []
        // let areaIndexCodes = ''
        // if (!this.searchForm.areaCode) {
        //   areaIndexCodes = '-1'//authAreaList.join(',') || '-1'
        // } else {
        //   areaIndexCodes = this.searchForm.areaCode
        // }
        // this.areaIndexCodes = areaIndexCodes
        this.searchForm.areaIndexCodes = -1
        this.lastestParams = {
          ...this.searchForm,
        }
        this.getStandingBookPage()
      } else {
        this.loading = false
        this.$messagebox(result)
      }
    },
    //分页查询办案区出入区申请记录
    async getStandingBookPage() {
      let params = {
        ...this.lastestParams,
        entryBeginTimeStr:this.lastestParams.timeArr[0] && this.$moment(this.lastestParams.timeArr[0]).format('YYYY-MM-DD HH:mm:ss') ||'',
        entryEndTimeStr:this.lastestParams.timeArr[1]&&this.$moment(this.lastestParams.timeArr[1]).format('YYYY-MM-DD HH:mm:ss')||''
      }

      if (this.activeName != 0) {
        params.status = this.lastestParams.status
          ? this.lastestParams.status
          : '1,2'
      } else {
        params.status = '0'
      }
      this.loading = true
      const result = await server.getStandingBookPage(params)
      const { data } = result
      if (data.code === '0') {
        this.tableData = data.data.list
        this.pageTotal = data.data.total
        this.loading = false
      } else {
        this.loading = false
        this.$messagebox(result)
      }
    },
    //切换选项卡触发的事件
    handleClick(tab, event) {
      this.searchForm = {
        policeName: '',
        suspectName: '',
        areaCode: '',
        pageNo: 1,
        pageSize: 20,
        timeArr: ['',''],
        status: '',
      }
      this.lastestParams = {
        policeName: '',
        suspectName: '',
        areaCode: '',
        pageNo: 1,
        pageSize: 20,
        timeArr: ['',''],
        status: '',
        areaIndexCodes:'-1'
      }
      this.isFilter = true
      this.$nextTick(() => {
        this.isFilter = false
      })
      this.findAuthUserPlaceList()
    },
    // 查询按钮点击回调
    searchHandle() {
      console.log(this.searchForm.timeArr)
      this.searchForm.pageNo = 1
      let areaIndexCodes = ''
        if (!this.searchForm.areaCode) {
          areaIndexCodes = '-1'//authAreaList.join(',') || '-1'
        } else {
          areaIndexCodes = this.searchForm.areaCode
        }
        this.areaIndexCodes = areaIndexCodes
        this.lastestParams = {
          ...this.searchForm,
          areaIndexCodes: areaIndexCodes,
        }
      this.getStandingBookPage()
    },
    // 重置按钮回调
    resetHandle() {
      this.searchForm = {
        policeName: '',
        suspectName: '',
        areaCode: '',
        pageNo: 1,
        pageSize: 20,
        timeArr: ['',''],
        status: '',
      }
      this.lastestParams = {
        ...this.searchForm,
        areaIndexCodes: '-1',
      }
      this.findAuthUserPlaceList()
    },
    // 每页展示数量改变
    handleSizeChange(pageSize) {
      this.searchForm.pageSize = pageSize
      this.lastestParams.pageSize = pageSize
      this.getStandingBookPage()
    },
    // 页码改变
    handleCurrentChange(pageNo) {
      this.searchForm.pageNo = pageNo
      this.lastestParams.pageNo = pageNo
      this.getStandingBookPage()
    },
    // 编辑跳转
    updateHandle(applyIndexCode) {
      applyIndexCode &&
        this.$router.push({ path: 'addEdit', query: { id: applyIndexCode } })
    },
    // 查看跳转
    viewHandle(registerIndexCode) {
      registerIndexCode &&
        this.$router.push({
          path: '/detailsPage',
          query: { id: registerIndexCode,type:this.activeName },
        })
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
        const registerTypeMap = {}
        data.data.registerType.forEach((v) => {
          registerTypeMap[v.key] = v.name
        })
        this.registerTypeMap = registerTypeMap
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
  },
}
</script>
<style lang="less" rel="stylesheet/less">
.exitApplication {
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
    top: 60px;
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
    height: ~'calc(100% - 95px)';
    position: relative;
    bottom: 14px;
    .status-icon {
      font-size: 14px;
      line-height: 22px !important;
    }
    .filter-search-box .search-box .search-btn {
      padding-top: 4px !important;
    }
    .registerStatusColor {
      width: 8px;
      height: 8px;
      display: inline-block;
      border-radius: 4px;
      margin-right: 4px;
      &.registerStatusColor1 {
        background: #3bcd8d;
      }
      &.registerStatusColor2 {
        background: #fe5332;
      }
    }
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
    .el-table td,
    .el-table th {
      height: 46px !important;
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
    box-sizing: border-box;
    position: relative;
    bottom: 23px;
  }
}
.status-icon {
  font-size: 14px !important;
}
.inDistrict {
  color: #ff0000;
}
</style>
