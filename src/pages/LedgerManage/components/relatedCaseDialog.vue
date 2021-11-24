<template>
  <el-dialog
    :title="dialogTitle"
    :area="[960, 540]"
    top="middle"
    :close-on-click-modal="false"
    :visible.sync="detailDialogVisible"
    :before-close="handleClose"
  >
    <div id="distributionTable" class="distributionTable">
      <div class="table-search">
        <div class="searchLeft"></div>
        <div class="searchRight">
          <el-input
            clearable
            placeholder="请输入案件编号或案件名称"
            suffix-icon="h-icon-search"
            v-model="searchText"
            @keyup="handleSearch"
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
          @current-change="handleCurrentTableChange"
        >
          <!-- <el-table-column type="selection"></el-table-column> -->
          <el-table-column
            type="radio"
            :selectable="selectable"
          ></el-table-column>
          <el-table-column
            label="序号"
            type="index"
            width="60"
          ></el-table-column>
          <el-table-column label="案件名称" show-overflow-title prop="name">
          </el-table-column>
          <el-table-column label="案件编号" show-overflow-title prop="caseNo">
          </el-table-column>
          <el-table-column
            label="办案部门"
            show-overflow-title
            prop="orgName"
          ></el-table-column>
          <el-table-column label="案件级别" show-overflow-title>
            <template
              slot-scope="scope"
              :title="scope.row.level ? caseLevelMap[scope.row.level] : ''"
            >
              <span>{{
                scope.row.level ? caseLevelMap[scope.row.level] : ''
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="案件类型" show-overflow-title>
            <template
              slot-scope="scope"
              :title="scope.row.type ? caseLevelMap[scope.row.type] : ''"
            >
              <span>{{
                scope.row.type ? caseTypeMap[scope.row.type] : ''
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="案由" show-overflow-title>
            <template
              slot-scope="scope"
              :title="
                scope.row.accusation ? accusationMap[scope.row.accusation] : ''
              "
            >
              <span>{{
                scope.row.accusation ? accusationMap[scope.row.accusation] : ''
              }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNo"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageTotal"
        >
        </el-pagination>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click.stop.prevent="submitDialog">
        确定
      </el-button>
      <el-button @click.stop.prevent="handleClose"> 取消 </el-button>
    </span>
  </el-dialog>
</template>
<script>
import server from '../../../server/ledgerManage'
export default {
  name: 'DistributionTable',
  props: {
    paramsDialog: {
      type: Object,
      default: () => {
        return {
          registerId: '',
          detailDialogVisible: false,
          inqDicts: {},
        }
      },
    },
  },
  watch: {
    paramsDialog: {
      handler: function (newV, oldV) {
        if (newV.registerId && newV.detailDialogVisible) {
          this.getRelationCaseInfoList('init')
        }
      },
      immediate: true,
      deep: true,
    },
    'paramsDialog.detailDialogVisible'(newV, oldV) {
      if (!newV) {
        this.searchText = ''
        this.pageNo = 1
        this.pageSize = 20
        this.detailDialogVisible = false
        this.searchText = ''
        this.selectTableItem = {}
      }
    },
    'paramsDialog.inqDicts'(newV, oldV) {
      if (newV) {
        this.caseLevelMap = this.computedDic(newV.caseLevel)
        this.caseTypeMap = this.computedDic(newV.caseType)
        this.accusationMap = this.computedDic(newV.brief)
      }
    },
  },
  data() {
    return {
      tableData: [],
      searchText: '',
      pageNo: 1,
      pageSize: 20,
      pageTotal: 0,
      detailDialogVisible: false,
      dialogTitle: '关联案件',
      selectTableItem: {},
      caseLevelMap: {},
      caseTypeMap: {},
      accusationMap: {},
    }
  },
  methods: {
    // 获取案件
    async getRelationCaseInfoList(type) {
      let pageSize = {
        param: this.searchText,
        start: this.pageNo,
        limit: this.pageSize,
      }
      let res = await server.getRelationCaseInfoList(pageSize)
      let data = res.data
      if (data.code === '0') {
        this.tableData = data.data.list
        this.pageTotal = data.data.total
        if (type === 'init') {
          this.detailDialogVisible = this.paramsDialog.detailDialogVisible
        }
      } else {
        this.$messagebox(res)
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNo = 1
      this.getRelationCaseInfoList()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getRelationCaseInfoList()
    },
    async submitDialog() {
      if (this.selectTableItem && this.selectTableItem.indexCode) {
        let params = {
          registerId: this.paramsDialog.registerId,
          indexCode: this.selectTableItem.indexCode,
        }
        let res = await server.relationCaseInfo(params)
        let data = res.data
        if (data.code === '0') {
          this.$message({
            type: 'success',
            message: '关联案件成功',
          })
          this.$emit('handleClose', 2)
        } else {
          this.$messagebox(res)
        }
      } else {
        this.$message({
          type: 'warning',
          message: '请选择关联的案件',
        })
      }
    },
    // 获取
    handleSearch() {
      this.getRelationCaseInfoList()
    },
    handleClose(res) {
      this.$emit('handleClose', 1)
    },
    handleCurrentTableChange(val) {
      console.log(val)
      this.selectTableItem = JSON.parse(JSON.stringify(val))
    },
    clearIconClick() {
      this.searchText = ''
      this.getRelationCaseInfoList()
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
    selectable(row, index) {
      return true
    },
  },
  components: {},
}
</script>
<style lang="less" rel="stylesheet/less">
.distributionTable {
  width: 100%;
  height: 420px;
  .table-container {
    height: ~'calc(100% - 96px)';
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
      .el-table__body tr.current-row > td {
        // background: rgba(32,128,247,.1);
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
      top: 2px;
    }
    .searchRight {
      width: 280px;
      height: 32px;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  .table-pagination {
    height: 48px;
    border-top: #f2f2f2 solid 1px;
  }
}
</style>
