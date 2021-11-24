<template>
  <watermarkContent>
    <div class="burn-task-manage">
      <PathDesc :path-desc-arr="$breadcrumb" :is-back="false"></PathDesc>
      <div class="menu-box">
        <div class="menu-title">办案区列表</div>
        <div class="menu-list">
          <el-scrollbar wrap-class="el-scrollbar__wrap">
            <div
              class="menu-item"
              :class="{ active: areaIndexCode == item.areaIndexCode }"
              v-for="(item, index) in areaList"
              :key="index"
              @click="queryByAreaIndexCode(item)"
            >
              <div class="menu-item-name">
                {{ item.areaName }}
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div class="main-content" v-loading="saveLoading">
        <div class="scrollbar-box">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-position="top"
            class="content-form"
          >
            <div class="form-title">
              参数配置<span class="time-tips"
                >(举例，登记时间12:00，前置时间10分钟，后置时间10分钟，登记活动录像时间11:50--12:10)</span
              >
            </div>
            <div class="form-content">
              <el-form-item label="前置时间" prop="beforeTime">
                <el-input
                  v-model="ruleForm.beforeTime"
                  placeholder="最多120分钟"
                  :maxlength="3"
                >
                  <template slot="append"> 分钟 </template>
                </el-input>
              </el-form-item>
              <el-form-item label="后置时间" prop="afterTime">
                <el-input
                  v-model="ruleForm.afterTime"
                  placeholder="最多120分钟"
                  :maxlength="3"
                >
                  <template slot="append"> 分钟 </template>
                </el-input>
              </el-form-item>
            </div>
            <div class="form-title">关联区域</div>
            <div class="form-content table-content">
              <el-table
                ref="autoTable"
                :data="paramDate.configList"
                force-scroll
                style="width: 100%"
              >
                <el-table-column type="index" label="序号" width="60">
                </el-table-column>
                <el-table-column
                  prop="roomName"
                  label="房间名称"
                  show-overflow-title
                >
                </el-table-column>
                <el-table-column
                  prop="roomTypeName"
                  label="房间类型"
                  show-overflow-title
                >
                </el-table-column>
                <el-table-column
                  prop="regionName"
                  label="区域名称"
                  show-overflow-title
                >
                </el-table-column>
                <el-table-column
                  prop="regionCode"
                  label="区域ID"
                  show-overflow-title
                >
                </el-table-column>
                <el-table-column label="操作" show-overflow-title width="100">
                  <template slot-scope="scope">
                    <span
                      class="table-ctrl-btn"
                      @click="unPlaceHandle(scope.row)"
                      v-if="scope.row.regionCode"
                      >取消关联</span
                    >
                    <span
                      class="table-ctrl-btn"
                      @click="checkPlaceHandle(scope.row)"
                      v-else
                      >关联区域</span
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form>
        </div>
        <div class="btn-box">
          <el-button type="primary" @click="submitForm('ruleForm')">
            确定
          </el-button>
          <el-button @click="findBusinessInfoList"> 重置 </el-button>
        </div>
      </div>
    </div>
    <el-dialog
      title="选择区域"
      custom-class="place-dialog"
      :visible.sync="placeDialogVisible"
      :area="[950, 556]"
    >
      <div class="place-dialog-title">
        <el-input
          clearable
          placeholder="请输入关键字"
          suffix-icon="h-icon-search"
          v-model="dialogSearchParam"
          class="place-search-input"
        >
        </el-input>
      </div>

      <el-table
        ref="singleTable"
        :data="placeList"
        highlight-current-row
        @current-change="placeCurrentChange"
        style="width: 100%"
        height="380"
      >
        <el-table-column type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column prop="name" label="区域名称" show-overflow-title>
        </el-table-column>
        <el-table-column prop="id" label="区域ID" show-overflow-title>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkPlaceSure">确 定</el-button>
        <el-button @click="placeDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </watermarkContent>
</template>
<script>
import server from '../../server/businessConfig'
import PathDesc from './components/PathDesc'
export default {
  name: 'BusinessConfig',
  data() {
    var checkExpendNumber = (rule, value, callback) => {
      if (!/^[0-9]+$/g.test(value) || value < 1 || value > 120) {
        callback(new Error('请输入1-120之间的数字'))
      } else {
        callback()
      }
    }
    return {
      saveLoading: false,
      placeDialogVisible: false,
      dialogSearchParam: '',
      areaIndexCode: '',
      areaList: [],
      pathDescArr: [],
      paramDate: {
        configList: [],
      },
      placeList: [],
      placeListAll: [],
      ruleForm: {
        afterTime: null,
        beforeTime: null,
      },
      rules: {
        beforeTime: [
          {
            required: true,
            message: '请输入1-120之间的数字',
            trigger: 'blur,change',
          },
          { validator: checkExpendNumber, trigger: 'change,blur' },
        ],
        afterTime: [
          {
            required: true,
            message: '请输入1-120之间的数字',
            trigger: 'blur,change',
          },
          { validator: checkExpendNumber, trigger: 'change,blur' },
        ],
      },
      currentPlace: {},
      currentRoom: {},
    }
  },
  watch: {
    dialogSearchParam(data) {
      this.placeList = this.placeListAll.filter((item) => {
        return (
          (item.name && item.name.indexOf(data) > -1) ||
          (item.id && (item.id + '').indexOf(data) > -1)
        )
      })
    },
  },
  mounted() {
    this.findAuthUserPlaceList()
  },
  methods: {
    // 关联区域弹窗
    checkPlaceHandle(data) {
      this.currentRoom = data
      this.placeDialogVisible = true
      this.getPlaceAreas()
    },
    // 根据办案区查询配置参数
    queryByAreaIndexCode(item) {
      this.areaIndexCode = item.areaIndexCode
      this.findBusinessInfoList()
    },
    // 查询办案去列表
    async findAuthUserPlaceList() {
      const { data } = await server.findAuthUserPlaceList()
      if (data.code === '0') {
        this.areaList = data.data.list
        this.areaIndexCode = data.data.list[0].areaIndexCode
        this.findBusinessInfoList()
      } else {
        this.$message.error(this.$i18n.t(data.code))
      }
    },
    // 查询办案区配置参数
    async findBusinessInfoList() {
      const { data } = await server.findBusinessInfoList({
        areaCode: this.areaIndexCode,
      })
      if (data.code === '0') {
        this.paramDate = data.data
        this.resetParam()
      } else {
        this.$message.error(this.$i18n.t(data.code))
      }
    },
    // 获取关联区域列表
    async getPlaceAreas(item) {
      const { data } = await server.getPlaceAreas({
        areaCode: this.areaIndexCode,
      })
      if (data.code === '0') {
        this.placeList = data.data
        this.placeListAll = [...data.data]
      } else {
        this.$message.error(this.$i18n.t(data.code))
      }
    },
    // 选择关联区域
    placeCurrentChange(data) {
      this.currentPlace = data
    },
    // 确认关联区域
    checkPlaceSure() {
      if (this.currentPlace.id) {
        this.currentRoom.regionCode = this.currentPlace.id
        this.currentRoom.regionName = this.currentPlace.name
        this.currentRoom.mapId = this.currentPlace.mapId
        this.currentRoom.xpostion = this.currentPlace.xpostion
        this.currentRoom.ypostion = this.currentPlace.ypostion
        this.placeDialogVisible = false
      } else {
        this.$message('请选择关联区域')
      }
    },
    // 取消区域关联
    unPlaceHandle(data) {
      data.regionCode = ''
      data.regionName = ''
      data.xpostion = null
      data.ypostion = null
    },
    // 保存配置
    async saveBusinessInfo() {
      const param = {
        ...this.paramDate,
        ...this.ruleForm,
        areaCode: this.areaIndexCode,
      }
      this.saveLoading = true
      const { data } = await server.saveBusinessInfo(param)
      if (data.code === '0') {
        this.$message.success('保存成功')
        this.findBusinessInfoList()
      } else {
        this.$message.error(this.$i18n.t(data.code))
      }
      this.saveLoading = false
    },
    // 表单验证提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveBusinessInfo()
        } else {
          return false
        }
      })
    },
    // 重置配置参数
    resetParam() {
      let paramDate = this.paramDate
      this.ruleForm = {
        afterTime: paramDate.afterTime + '',
        beforeTime: paramDate.beforeTime + '',
      }
    },
  },
  mixins: [],
  components: { PathDesc },
}
</script>
<style lang="less" rel="stylesheet/less">
.burn-task-manage {
  height: 100%;
  width: 100%;
  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }
  .menu-box {
    display: inline-block;
    width: 280px;
    height: ~'calc(100% - 48px)';
    vertical-align: top;
    font-size: 14px;
    border-right: solid 1px #e5e5e5;
    .menu-title {
      font-size: 16px;
      height: 40px;
      line-height: 40px;
      padding-left: 15px;
      padding-right: 15px;
      width: 100%;
      background: #f5f5f5;
      border-bottom: solid 1px #e5e5e5;
      .menu-title-ctrl {
        font-size: 12px;
        color: #2080f7;
        float: right;
        cursor: pointer;
      }
    }
    .menu-list {
      height: ~'calc(100% - 40px)';
      padding: 0px 7px;
      position: relative;
      .el-scrollbar__wrap {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
      .menu-item {
        border-bottom: solid 1px #e5e5e5;
        height: 48px;
        padding-left: 8px;
        padding-top: 12px;
        cursor: pointer;
        &:hover {
          background: #f5f5f5;
        }
        &.active {
          background: #e9f2fe;
        }
      }
    }
  }
  .main-content {
    background: #f2f2f2;
    height: ~'calc(100% - 48px)';
    width: ~'calc(100% - 280px)';
    vertical-align: top;
    display: inline-block;
    position: relative;
    .scrollbar-box {
      height: ~'calc(100% - 48px)';
      padding: 8px;
      .content-form {
        height: 100%;
      }
    }
    .el-scrollbar__wrap {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .form-title {
      height: 48px;
      line-height: 48px;
      background: #ffffff;
      border-bottom: solid 1px #e5e5e5;
      padding-left: 15px;
      font-size: 14px;
      .time-tips {
        font-size: 12px;
        color: #777777;
        margin-left: 10px;
      }
    }
    .form-content {
      background: #ffffff;
      padding: 24px 0px 1px 0px;
      margin-bottom: 10px;
      &.table-content {
        height: ~'calc(100% - 300px)';
        padding: 10px;
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
      .form-content-title {
        font-size: 14px;
        padding-left: 48px;
        padding-bottom: 16px;
        position: relative;
        &:before {
          content: '';
          display: block;
          height: 16px;
          width: 4px;
          background: #2080f7;
          position: absolute;
          left: 40px;
          top: 2px;
        }
      }
      .el-radio-group {
        .el-radio {
          width: 72px;
        }
      }
      .el-form-item {
        width: 532px;
        margin-left: auto;
        margin-right: auto;
        .el-input-group__append {
          color: #999999;
          border: none;
          position: relative;
          left: -40px;
          background: transparent;
        }
      }
      // .el-form-item__content {
      //   min-width: 424px;
      // }
    }
    .btn-box {
      text-align: center;
      height: 48px;
      line-height: 48px;
      background: #ffffff;
      width: 100%;
      padding-top: 8px;
      .el-button {
        width: 80px;
      }
    }
  }
}
.place-dialog {
  .place-dialog-title {
    text-align: right;
    padding-bottom: 10px;
    .place-search-input {
      width: 240px;
    }
  }
}
</style>
