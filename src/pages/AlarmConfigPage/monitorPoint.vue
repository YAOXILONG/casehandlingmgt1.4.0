<template>
  <div class="HelpPage">
    <div class="content">
      <div class="title">{{ alarmTypeName }}</div>
      <div class="helpWarp">
        <el-scrollbar>
          <div class="mainContentWrapper">
            <div class="mainContent">
              <el-form label-width="120px" ref="form" :model="$data" :rules="rules">
                <alarm-enable
                  :label-name="alarmTypeName"
                  :enable="enable"
                  @enableChange="handleAlarmEnableChange"
                >
                  <span>启用此功能后，需要配置报警时间间隔和值班室监控点，当{{ alarmTypeName }}时系统将会显示报警信息</span>
                </alarm-enable>
                <template v-if="!!enable">
                  <alarm-enable
                    :label-name="voice"
                    :enable="voiceFlag"
                    @enableChange="handleAlarmEnableChangeVoice"
                  ></alarm-enable>
                  <alarm-level @alarmLevelChange="handleAlarmLevelChange" :level="level"></alarm-level>

                  <el-form-item label="报警时间间隔" prop="intervalTime" content-width="300px">
                    <el-input v-model="intervalTime" tips-class="inputTips" placeholder="请输入"></el-input>
                    <span class="input-tip">分钟</span>
                  </el-form-item>
                  <el-form-item label="值班室监控点" prop="cameraName">
                    <el-input placeholder="请选择" readonly v-model="cameraName">
                      <template slot="append">
                        <el-button @click="chooseMonitory">选择</el-button>
                      </template>
                    </el-input>
                  </el-form-item>
                </template>

                <el-form-item>
                  <el-button class="btn96" type="primary" @click="handleSave">保存</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <el-dialog
      :area="[700,600]"
      top="middle"
      class="chooseMonitoryDialog"
      title="值班室监控点"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="closeMonitory"
      :visible.sync="monitoryDiaVisible"
    >
      <div class="tableWrapper">
        <div class="header">
          <el-row>
            <el-col :span="3">
              <span class="searchMonitoryLabel">监控点名称</span>
            </el-col>
            <el-col :span="9">
              <el-input v-model="searchMonitoryKey" placeholder="搜索"></el-input>
            </el-col>
            <el-col :span="4" style="height: 32px"></el-col>
            <el-col :span="8" style="text-align: right">
              <el-button class="searchMonitoryBtn" type="primary" @click="onSearch">查询</el-button>
              <el-button class="searchMonitoryBtn" @click="onReset">重置</el-button>
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
            style="width: 100%;"
          >
            <el-table-column type="index" label="序号" width="8%"></el-table-column>
            <el-table-column label="监控点名称" width="30%">
              <template slot-scope="scope">{{ polishName(scope.row.name) }}</template>
            </el-table-column>
            <el-table-column prop="chanNum" label="通道号" width="20%"></el-table-column>
            <el-table-column prop="indexCode" label="编号" width="44%"></el-table-column>
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
          ></el-pagination>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitMonitory">确 定</el-button>
        <el-button @click="closeMonitory">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AlarmEnable from '@/model/AlarmEnable'
import AlarmLevel from '@/model/AlarmLevel'
import server from '../../server/alarmconfig'

export default {
  name: 'MonitorPoint',
  props: [
    'currentEnable',
    'areaIndexCode',
    'alarmTypeName',
    'alarmConfigId',
    'alarmType',
    'locationAbility'
  ],
  data() {
    return {
      type: '',
      enable: this.currentEnable,
      level: 0,
      voiceFlag: false,
      voice: '声音状态',
      cameraIndexCode: '',
      cameraName: '',
      intervalTime: '',
      alarmConfigIndexCode: '',
      rules: {
        intervalTime: [
          { required: true, message: '请输入' },
          {
            validator: (rule, value, callback) => {
              if (!/^\d+(\.\d+)?$/.test(value) || Number(value) === 0) {
                callback(new Error('请输入正数'))
              } else {
                if (value > 24) {
                  callback(new Error('输入的数字不得大于24'))
                }
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      // 搜索监控点
      monitoryTable: [],
      pagination: {
        pageSize: 10,
        pageNo: 1,
        total: 0
      },
      searchMonitoryKey: '',
      monitoryTableForm: {
        name: '',
        indexCode: ''
      },
      tempMonitoryTableForm: {
        name: '',
        indexCode: ''
      },
      monitoryDiaVisible: false
    }
  },
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
          indexCode: val.indexCode
        }
      }
    },
    async getMonitoryTable() {
      let params = {
        pageNum: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
        cameraName: this.searchMonitoryKey
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
        indexCode: ''
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
        return
      }
      let params = {
        alarmConfigId: this.alarmConfigId
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
          this.intervalTime = datas.intervalTime
          this.cameraIndexCode = datas.cameraIndexCode
          this.cameraName = datas.cameraName
        }
      } else {
        this.$message.error(this.$t(res.data.code))
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
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.save()
        }
      })
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
        intervalTime: this.intervalTime,
        areaIndexCode: this.areaIndexCode,
        cameraIndexCode: this.cameraIndexCode,
        cameraName: this.cameraName
      }
      const res = await server.save(params)
      if (res.data.code === '0') {
        this.$message.success('保存成功')
        let alarmTypeVal = params.alarmType
        this.$emit('save', alarmTypeVal)
      } else {
        this.$message.error(this.$t(res.data.code))
      }
    }
  },
  components: {
    AlarmEnable,
    AlarmLevel
  },
  watch: {
    alarmType: {
      handler: function(val) {
        this.getInfo()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    console.log(typeof this.currentEnable)
  }
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
