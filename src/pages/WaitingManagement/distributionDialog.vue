<template>
  <el-dialog
    :title="dialogTitle"
    :area="[720, 400]"
    top="middle"
    no-scrollbar
    :close-on-click-modal="false"
    :visible.sync="distributionDialogVisible"
    :before-close="handleClose"
  >
    <div id="distributionTable1" class="distributionTable1">
      <div class="table-search">
        <div class="searchLeft" v-show="checkPlace">
          <el-button type="primary" @click.stop.prevent="readBracelet">
            读取手环
          </el-button>
        </div>
        <div class="searchRight">
          <el-input
            clearable
            :placeholder="$checkPlace ? '请输入姓名/手环编号' : '请输入姓名'"
            suffix-icon="h-icon-search"
            :maxlength="32"
            v-model="searchText"
            @keyup="handleSearch"
            :on-icon-click="handleSearch"
            :clear-icon-click="clearIconClick"
          >
          </el-input>
        </div>
      </div>
      <div class="table-container" v-show="$checkPlace">
        <el-table
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          force-scroll
          @current-change="handleSelectionChange"
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
          <el-table-column label="姓名" show-overflow-title prop="registerName">
          </el-table-column>
          <el-table-column label="人员类型" show-overflow-title width="90">
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
                >{{ personTypeMap[scope.row.personType] }}</span
              >
              <span
                v-if="
                  Number(scope.row.personType) >= 3 ||
                  Number(scope.row.personType) <= 0
                "
                class="status-icon gray-icon"
                style="
                  max-width: 60px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                "
                >{{ personTypeMap[scope.row.personType] }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="性别" show-overflow-title width="40">
            <template slot-scope="scope">
              <span v-if="sexMap[scope.row.registerSex]">{{
                sexMap[scope.row.registerSex]
              }}</span>
              <span v-else></span>
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
            label="手环编号"
            show-overflow-title
            prop="bandsNo"
          ></el-table-column>
        </el-table>
      </div>
      <div class="table-container" v-show="!$checkPlace">
        <el-table
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          force-scroll
          @current-change="handleSelectionChange"
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
          <el-table-column label="姓名" show-overflow-title prop="registerName">
          </el-table-column>
          <el-table-column
            label="人员类型"
            :resizable="false"
            show-overflow-title
            width="90"
          >
            <template slot-scope="scope">
              <span
                v-if="Number(scope.row.personType) === 2"
                class="blueSpan"
                >{{ personTypeMap[scope.row.personType] }}</span
              >
              <span v-if="Number(scope.row.personType) === 1" class="redSpan">{{
                personTypeMap[scope.row.personType]
              }}</span>
              <span
                v-if="Number(scope.row.personType) >= 3"
                class="status-icon gray-icon"
                >{{ personTypeMap[scope.row.personType] }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="性别" show-overflow-title width="60">
            <template slot-scope="scope">
              <span v-if="sexMap[scope.row.registerSex]">{{
                sexMap[scope.row.registerSex]
              }}</span>
              <span v-else></span>
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
        </el-table>
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
import bus from '../../views/waitingManagement/index'
// import server from '../../server/waitingManagement'
export default {
  name: 'DistributionTable1',
  props: {
    paramsDialog: {
      type: Object,
      default: () => {
        return {
          dialogType: '',
          tableData: [],
          distributionDialogVisible: false,
        }
      },
    },
    inqDicts: {
      type: Object,
      default: () => {
        return {}
      },
    },
    checkPlace: {
      type: Boolean,
      default: () => {
        return ''
      },
    },
  },
  watch: {
    paramsDialog: {
      handler: function (newV, oldV) {
        this.distributionDialogVisible = newV.distributionDialogVisible
        this.tableData = newV.tableData
        if (newV.dialogType === 'distribution') {
          this.dialogTitle = '分配候问室'
        } else {
          this.dialogTitle = '已分配候问室人员'
        }
      },
      immediate: true,
      deep: true,
    },
    'paramsDialog.distributionDialogVisible'(newV, oldV) {
      this.searchText = ''
      this.selectTableItem = []
    },
    inqDicts: {
      handler: function (newV, oldV) {
        if (this.inqDicts) {
          this.personTypeMap = this.computedDic(this.inqDicts.suspectType)
          this.sexMap = this.computedDic(this.inqDicts.sex)
        }
      },
      immediate: true,
      deep: true,
    },
    checkPlace: {
      handler: function (newV, oldV) {
        console.log('268', this.checkPlace)
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      tableData: [],
      searchText: '',
      distributionDialogVisible: false,
      dialogTitle: '',
      selectTableItem: [],
      personTypeMap: {},
      sexMap: {},
    }
  },
  methods: {
    submitDialog() {
      if (!(this.selectTableItem && this.selectTableItem.length)) {
        this.$message({
          message: '请选择人员',
          type: 'warning',
        })
        return false
      }
      if (this.paramsDialog.dialogType === 'distribution') {
        if (this.selectTableItem && this.selectTableItem.length) {
          if (this.selectTableItem.length - this.paramsDialog.total > 0) {
            this.$message({
              message: '最多分配' + this.paramsDialog.total + '人',
              type: 'warning',
            })
            return false
          }
        }
      }
      let params = {
        dialogType: this.paramsDialog.dialogType,
        selectTableItem: JSON.parse(JSON.stringify(this.selectTableItem)),
      }
      this.$emit('handleSubmit', params)
    },
    // 获取
    handleSearch() {
      let params = {
        dialogType: this.paramsDialog.dialogType,
        searchText: this.searchText,
      }
      this.$emit('searchTable', params)
    },
    handleClose(res) {
      bus.$emit('closeDialog', false)
    },
    handleSelectionChange(val) {
      this.selectTableItem = [JSON.parse(JSON.stringify(val))]
    },
    clearIconClick() {
      this.searchText = ''
      this.handleSearch()
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
  created() {
    if (this.inqDicts) {
      this.sexMap = this.computedDic(this.inqDicts.sex)
      this.personTypeMap = this.computedDic(this.inqDicts.suspectType)
    }
  },
  components: {},
}
</script>
<style lang="less" rel="stylesheet/less">
.distributionTable1 {
  width: 100%;
  height: 290px;
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
