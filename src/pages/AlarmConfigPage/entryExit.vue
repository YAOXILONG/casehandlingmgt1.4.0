<template>
  <div class="HelpPage">
    <div class="content">
      <div class="title">
        {{ alarmTypeName }}
      </div>
      <div class="helpWarp">
        <el-scrollbar>
          <div class="mainContentWrapper">
            <div class="mainContent">
              <el-form label-width="120px">
                <alarm-enable
                  :label-name="alarmTypeName"
                  :enable="enable"
                  @enableChange="handleAlarmEnableChange"
                >
                  <span
                    >启用此功能后，需要配置监控点{{
                      locationAbility ? '和配置区域' : ''
                    }}，当{{ alarmTypeName }}时系统将会显示报警信息</span
                  >
                </alarm-enable>
                <template v-if="enable">
                  <alarm-enable
                    :label-name="voice"
                    :enable="voiceFlag"
                    @enableChange="handleAlarmEnableChangeVoice"
                  >
                  </alarm-enable>
                  <alarm-level
                    @alarmLevelChange="handleAlarmLevelChange"
                    :level="level"
                  ></alarm-level>
                  <el-form-item
                    label="关联区域"
                    v-if="locationAbility"
                    prop="regionName"
                  >
                    <el-input
                      placeholder="请选择"
                      readonly
                      v-model="regionName"
                    >
                      <template slot="append">
                        <el-button @click="chooseArea"> 选择 </el-button>
                      </template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="关联监控点" prop="cameraName">
                    <el-input
                      placeholder="请选择"
                      readonly
                      v-model="cameraName"
                    >
                      <template slot="append">
                        <el-button @click="chooseMonitory"> 选择 </el-button>
                      </template>
                    </el-input>
                  </el-form-item>
                </template>
                <el-form-item>
                  <el-button class="btn96" type="primary" @click="save">
                    保存
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <el-dialog
      :area="[700, 600]"
      top="middle"
      class="chooseMonitoryDialog"
      title="关联监控点"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="closeMonitory"
      :visible.sync="monitoryDiaVisible"
    >
      <div class="tableWrapper">
        <div class="header">
          <el-row>
            <el-col :span="3">
              <span class="searchMonitoryLabel"> 监控点名称 </span>
            </el-col>
            <el-col :span="9">
              <el-input
                v-model="searchMonitoryKey"
                placeholder="搜索"
              ></el-input>
            </el-col>
            <el-col :span="4" style="height: 32px"></el-col>
            <el-col :span="8" style="text-align: right">
              <el-button
                class="searchMonitoryBtn"
                type="primary"
                @click="onSearch"
              >
                查询
              </el-button>
              <el-button class="searchMonitoryBtn" @click="onReset">
                重置
              </el-button>
            </el-col>
          </el-row>
        </div>
        <div class="content">
          <el-table
            ref="monitoryTable"
            :data="monitoryTable"
            force-scroll
            highlight-current-row
            @current-change="handleMonitoryTableClick"
            style="width: 100%"
          >
            <el-table-column type="index" label="序号" width="8%">
            </el-table-column>
            <el-table-column label="监控点名称" width="30%">
              <template slot-scope="scope">
                {{ polishName(scope.row.name) }}
              </template>
            </el-table-column>
            <el-table-column prop="chanNum" label="通道号" width="20%">
            </el-table-column>
            <el-table-column prop="indexCode" label="编号" width="44%">
            </el-table-column>
          </el-table>
        </div>
        <div class="bottom">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.pageNo"
            :page-sizes="[10, 20, 30, 50, 100]"
            :page-size="pagination.pageSize"
            layout="total, sizes, huiPager, jumper"
            :total="pagination.total"
          >
          </el-pagination>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitMonitory"> 确 定 </el-button>
        <el-button @click="closeMonitory"> 取 消 </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :area="[700, 600]"
      top="middle"
      class="chooseAreaDialog"
      title="关联区域"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="closeArea"
      :visible.sync="areaDiaVisible"
    >
      <div class="tableWrapper">
        <!-- <div class="header">
        <el-row>
          <el-col :span="3">
            <span class="searchMonitoryLabel">
              监控点名称
            </span>
          </el-col>
          <el-col :span="9">
            <el-input
              v-model="searchMonitoryKey"
              placeholder="搜索"
            ></el-input>
          </el-col>
          <el-col
            :span="4"
            style="height: 32px"
          ></el-col>
          <el-col
            :span="8"
            style="text-align: right"
          >
            <el-button
              class="searchMonitoryBtn"
              type="primary"
              @click="onSearch"
            >
              查询
            </el-button>
            <el-button
              class="searchMonitoryBtn"
              @click="onReset"
            >
              重置
            </el-button>
          </el-col>
        </el-row>
      </div> -->
        <div class="content">
          <el-table
            ref="monitoryTable"
            :data="areaTable"
            force-scroll
            highlight-current-row
            @current-change="handleAreaTableClick"
            style="width: 100%"
          >
            <el-table-column type="index" label="序号" width="8%">
            </el-table-column>
            <el-table-column prop="name" label="区域名称" width="20%">
            </el-table-column>
            <el-table-column label="监控点名称" width="30%" prop="cameraName">
            </el-table-column>
          </el-table>
        </div>
        <!-- <div class="bottom">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.pageNo"
          :page-sizes="[10, 20, 30, 50, 100]"
          :page-size="pagination.pageSize"
          layout="total, sizes, huiPager, jumper"
          :total="pagination.total"
        >
        </el-pagination>
      </div> -->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitArea"> 确 定 </el-button>
        <el-button @click="closeArea"> 取 消 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AlarmEnable from '@/model/AlarmEnable'
import AlarmLevel from '@/model/AlarmLevel'
import server from '../../server/alarmconfig'

export default {
  name: 'strangerOut',
  props: [
    'currentEnable',
    'areaIndexCode',
    'alarmTypeName',
    'alarmConfigId',
    'alarmType',
    'locationAbility',
  ],
  data() {
    return {
      // name: '非法出区',
      type: '',
      enable: this.currentEnable,
      level: 0,
      voiceFlag: false,
      voice: '声音状态',
      cameraIndexCode: '',
      cameraName: '',
      alarmConfigIndexCode: '',
      monitoryTable: [],
      pagination: {
        pageSize: 10,
        pageNo: 1,
        total: 0,
      },
      // 搜索监控点
      searchMonitoryKey: '',
      monitoryTableForm: {
        name: '',
        indexCode: '',
      },
      tempMonitoryTableForm: {
        name: '',
        indexCode: '',
      },
      monitoryDiaVisible: false,
      // 区域
      regionName: '',
      regionId: '',
      xpostion: '',
      ypostion: '',
      areaDiaVisible: false,
      areaTable: [],
      currentSelectArea: {
        cameraIndexCode: '',
        cameraName: '',
        id: '',
        name: '',
        xpostion: '',
        ypostion: '',
      },
    }
  },
  mounted() {},
  methods: {
    chooseMonitory() {
      this.searchMonitoryKey = ''
      this.getMonitoryTable()
      this.monitoryDiaVisible = true
    },
    closeMonitory() {
      this.monitoryDiaVisible = false
      this.clearMonitory()
    },
    handleMonitoryTableClick(val) {
      if (val) {
        this.tempMonitoryTableForm = {
          name: this.polishName(val.name),
          indexCode: val.indexCode,
        }
      }
    },
    async getMonitoryTable() {
      let params = {
        pageNum: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
        cameraName: this.searchMonitoryKey,
      }
      const { data } = await server.getCameraByPage(params)
      if (data.code === '0') {
        this.monitoryTable = data.data.list
        this.pagination.pageNo = data.data.pageNo
        this.pagination.total = data.data.total
      } else {
        this.$message.error(this.$t(data.code))
      }
    },
    // 修改监控点表格pageSize
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.getMonitoryTable()
    },
    // 监控点表格翻页
    handleCurrentChange(val) {
      this.pagination.pageNo = val
      this.getMonitoryTable()
    },
    onSearch() {
      this.pagination.pageNo = 1
      this.getMonitoryTable()
    },
    onReset() {
      this.searchMonitoryKey = ''
      this.onSearch()
    },
    submitMonitory() {
      if (!this.tempMonitoryTableForm.name) {
        return this.$message.error('请选择监控点!')
      }
      this.monitoryTableForm = { ...this.tempMonitoryTableForm }
      this.cameraName = this.monitoryTableForm.name
      this.cameraIndexCode = this.monitoryTableForm.indexCode
      this.monitoryDiaVisible = false
      this.clearMonitory()
    },
    clearMonitory() {
      this.tempMonitoryTableForm = {
        name: '',
        indexCode: '',
      }
    },
    polishName(name) {
      return name.replace(/<font color="red">/g, '').replace(/<\/font>/g, '')
    },
    async getInfo() {
      if (!this.alarmConfigId) {
        this.type = ''
        this.enable = false
        this.alarmConfigIndexCode = ''
        this.voiceFlag = false
        this.level = 0
        this.intervalTime = ''
        this.cameraIndexCode = ''
        this.cameraName = ''
        this.regionName = ''
        this.regionId = ''
        this.xpostion = ''
        this.ypostion = ''
        return
      }
      let params = {
        alarmConfigId: this.alarmConfigId,
      }
      const res = await server.queyByType(params)
      if (res.data.code === '0') {
        const datas = res.data.data
        if (datas) {
          this.type = datas.alarmConfigId
          this.enable = datas.useFlag
          this.alarmConfigIndexCode = datas.alarmConfigIndexCode
          this.voiceFlag = datas.voiceFlag
          this.level = Number(datas.alarmLevel)
          this.cameraIndexCode = datas.cameraIndexCode
          this.cameraName = datas.cameraName
          this.regionName = datas.regionName
          this.regionId = datas.regionId
          this.xpostion = datas.xpostion
          this.ypostion = datas.ypostion
        }
      } else {
        this.$message.error(res.data.msg)
      }
    },
    handleAlarmEnableChange(val) {
      this.enable = val
    },
    handleAlarmEnableChangeVoice(val) {
      this.voiceFlag = val
    },
    handleAlarmLevelChange(val) {
      this.level = val
    },
    async save() {
      let params = {
        alarmType: this.alarmType,
        alarmTypeName: this.alarmTypeName,
        alarmConfigId: this.type,
        alarmConfigIndexCode: this.alarmConfigIndexCode,
        alarmLevel: this.level.toString(),
        voiceFlag: Boolean(this.voiceFlag),
        useFlag: Boolean(this.enable),
        cameraIndexCode: this.cameraIndexCode,
        cameraName: this.cameraName,
        areaIndexCode: this.areaIndexCode,
        xpostion: this.xpostion,
        ypostion: this.ypostion,
        regionId: this.regionId,
        regionName: this.regionName,
      }
      const res = await server.save(params)
      if (res.data.code === '0') {
        this.$message.success('保存成功')
        let alarmTypeVal = params.alarmType
        this.$emit('save', alarmTypeVal)
      } else {
        this.$message.error(this.$t(res.data.code))
      }
    },
    chooseArea() {
      this.getAreaTable()
      this.areaDiaVisible = true
    },
    closeArea() {
      this.areaDiaVisible = false
      this.clearArea()
    },
    handleAreaTableClick(val) {
      if (val) {
        this.currentSelectArea = {
          ...val,
        }
      }
    },
    async getAreaTable() {
      let params = {
        areaCode: this.areaIndexCode,
      }
      const { data } = await server.getPlaceAreas(params)
      if (data.code === '0') {
        this.areaTable = data.data
      } else {
        this.$message.error(this.$t(data.code))
      }
    },
    submitArea() {
      if (!this.currentSelectArea.id) {
        return this.$message.error('请选择区域!')
      }
      this.cameraName = this.currentSelectArea.cameraName
      this.cameraIndexCode = this.currentSelectArea.cameraIndexCode
      this.regionName = this.currentSelectArea.name
      this.regionId = this.currentSelectArea.id
      this.xpostion = this.currentSelectArea.xpostion
      this.ypostion = this.currentSelectArea.ypostion
      this.areaDiaVisible = false
      this.clearArea()
    },
    clearArea() {
      this.currentSelectArea = {
        cameraIndexCode: '',
        cameraName: '',
        id: '',
        name: '',
        xpostion: '',
        ypostion: '',
      }
    },
  },
  components: {
    AlarmEnable,
    AlarmLevel,
  },
  watch: {
    alarmType: {
      handler: function (val) {
        this.getInfo()
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    // this.getInfo()
  },
}
</script>

<style lang="less" rel="stylesheet/less">
@mainContentWidth: 660px;
.HelpPage {
  height: 100%;
  padding: 8px;
  background: #f2f2f2;
  box-sizing: border-box;
  overflow: hidden;

  .content {
    background: #fff;
    height: 100%;
    width: 100%;
    .title {
      height: 64px;
      line-height: 64px;
      padding-left: 16px;
      font-size: 16px;
      font-weight: bold;
      border-bottom: 1px solid #e5e5e5;
      box-sizing: border-box;
    }
    .helpWarp {
      width: 100%;
      height: calc(~'100% - 64px');
      background: #f2f2f2;
      .mainContentWrapper {
        position: relative;
        padding: 40px 0;
        background: #ffffff;
        .mainContent {
          width: @mainContentWidth;
          margin: 0 auto;
          .el-input {
            width: calc(~'100% - 32px');
          }
          .input-tip {
            display: inline-block;
            vertical-align: middle;
            color: #8484a4;
            font-size: 12px;
            margin-left: 4px;
          }
          .el-button {
            &.gradientBtn {
              width: 96px;
              box-sizing: border-box;
              background-image: linear-gradient(
                -90deg,
                rgba(25, 109, 217, 0.98) 0%,
                #28aef0 100%
              );
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="less" rel="stylesheet/less">
.chooseMonitoryDialog {
  .el-dialog__body {
    padding: 0 5px;
  }
  .tableWrapper {
    position: relative;
    height: 100%;
    .header {
      padding: 8px 0;
      .searchMonitoryLabel {
        font-size: 14px;
        line-height: 32px;
        position: relative;
        left: 14px;
      }
      .el-form-item {
        margin-bottom: 0;
      }
      .monitoryName {
        float: left;
      }
      .monitoryBtn {
        float: right;
      }
    }
    .content {
      height: 453px;
      padding-bottom: 48px;
      box-sizing: border-box;
    }
    .bottom {
      position: absolute;
      bottom: 0;
      height: 48px;
      width: 100%;
    }
  }
  .el-table .cell,
  .el-table .el-tooltip.cell,
  .el-table .show-header-overflow.cell,
  .el-table .show-overflow-title.cell {
    white-space: normal;
  }
}
.chooseAreaDialog {
  .el-dialog__body {
    padding: 0 5px;
  }
  .tableWrapper {
    position: relative;
    height: 100%;
    .content {
      height: 501px;
      box-sizing: border-box;
    }
  }
  .el-table .cell,
  .el-table .el-tooltip.cell,
  .el-table .show-header-overflow.cell,
  .el-table .show-overflow-title.cell {
    white-space: normal;
  }
}
</style>