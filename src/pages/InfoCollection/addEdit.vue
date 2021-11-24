<template>
  <watermarkContent>
    <div class="add-edit-from-box info-collention">
      <PathDesc :path-desc-arr="['信息采集', `${this.detailData.collectedId ? '编辑' : '录入'}采集信息`]"
                :is-back="true"></PathDesc>
      <div class="title-detail-box">
        <span class="title-detail-item">姓名：{{ detailData.registerName }}</span>
        <span class="title-detail-item">人员类型：{{ detailData.personTypeName }}</span>
        <span class="title-detail-item">
          性别：
          <template v-for="item in dictData.sex">{{ item.key==detailData.registerSex?item.name:'' }}</template>
        </span>
        <span class="title-detail-item"
              v-if="detailData.registerAge">年龄：{{ detailData.registerAge}} 岁</span>
        <span class="title-detail-item"
              v-else>年龄：未知</span>
        <span class="title-detail-item"
              v-if="$checkPlace">手环编号：{{ detailData.bandsNo }}</span>
      </div>
      <div class="add-edit-from-back info-collection-add-edit"
           v-loading="formLoading">
        <StepStatueContent :step-statue="[1, this.detailData.doBodyCheck, this.detailData.doGoodsStorage, 2, this.detailData.doDrugCheck, this.detailData.doGoodsReturn, 0]"></StepStatueContent>
        <div class="scroll-box">
          <el-scrollbar wrap-class="el-scrollbar__wrap">
            <div class="add-edit-from-content">
              <el-form :model="ruleForm"
                       :rules="rules"
                       ref="ruleForm"
                       label-position="top">
                <el-form-item label="信息采集"
                              prop="doCollectedInfo">
                  <el-radio-group v-model="ruleForm.doCollectedInfo"
                                  @change="doCollectedInfoChange">
                    <el-radio label="1">
                      是
                    </el-radio>
                    <el-radio label="0">
                      否
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="采集项目"
                              prop="collectedItems">
                  <el-checkbox-group v-model="ruleForm.collectedItems">
                    <el-checkbox v-for="item in collectList"
                                 :key="item.key"
                                 :label="item.key"
                                 :disabled="ruleForm.doCollectedInfo=='0'">
                      {{ item.name }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="信息入库"
                              prop="doStoraged">
                  <el-radio-group v-model="ruleForm.doStoraged">
                    <el-radio label="1"
                              :disabled="ruleForm.doCollectedInfo=='0'">
                      是
                    </el-radio>
                    <el-radio label="0"
                              :disabled="ruleForm.doCollectedInfo=='0'">
                      否
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="核查比对"
                              prop="doCompared">
                  <el-radio-group v-model="ruleForm.doCompared">
                    <el-radio label="1"
                              :disabled="ruleForm.doCollectedInfo=='0'">
                      是
                    </el-radio>
                    <el-radio label="0"
                              :disabled="ruleForm.doCollectedInfo=='0'">
                      否
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="开始时间"
                              prop="collectedStartTimeStr">
                  <el-date-picker v-model="ruleForm.collectedStartTimeStr"
                                  type="datetime"
                                  ref="dateref1"
                                  :picker-options="pickerOptions1"
                                  placeholder="选择开始时间" />
                </el-form-item>
                <el-form-item label="结束时间"
                              prop="collectedEndTimeStr">
                  <el-date-picker v-model="ruleForm.collectedEndTimeStr"
                                  type="datetime"
                                  ref="dateref2"
                                  :picker-options="pickerOptions2"
                                  placeholder="选择结束时间" />
                </el-form-item>
              </el-form>
            </div>
            <div class="form-btns">
              <el-button class="add-edit-btn"
                         type="primary"
                         @click="submitForm('ruleForm')">
                保存
              </el-button>
              <el-button class="add-edit-btn"
                         @click="goBack">
                取消
              </el-button>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </watermarkContent>
</template>
<script>
import PathDesc from './components/PathDesc'
import server from '../../server/infoCollection'
import StepStatueContent from '../../components/StepStatueContent/StepStatueContent'

export default {
  name: 'InfoCollectionAddEdit',
  data () {
    let queryParam = this.$route.query
    const validStartTime = (rule, value, callback) => {
      if (value && this.ruleForm.collectedEndTimeStr && new Date(value).getTime() > new Date(this.ruleForm.collectedEndTimeStr).getTime()) {
        return callback(new Error('开始时间不能晚于结束时间'))
      }
      this.$refs.ruleForm && this.$refs.ruleForm.resetValidate('collectedEndTimeStr')
      callback()
    }
    const validEndTime = (rule, value, callback) => {
      if (value && this.ruleForm.collectedStartTimeStr && new Date(value).getTime() < new Date(this.ruleForm.collectedStartTimeStr).getTime()) {
        return callback(new Error('结束时间不能早于开始时间'))
      }
      this.$refs.ruleForm && this.$refs.ruleForm.resetValidate('collectedStartTimeStr')
      callback()
    }
    return {
      stepStatus: [1, 2, 0, 0, 0, 0, 0],
      formLoading: false,
      // pathDescArr: ['信息采集', `${this.detailData ? '编辑' : '录入'}采集信息`],
      queryParam: queryParam,
      detailData: {},
      ruleForm: {
        doCollectedInfo: '1',
        doStoraged: '1',
        doCompared: '1',
        collectedItems: [],
        collectedStartTimeStr: this.$moment().format('YYYY/MM/DD HH:mm:ss'),
        collectedEndTimeStr: this.$moment().add(30, 'minutes').format('YYYY/MM/DD HH:mm:ss')
      },
      collectList: [],
      rules: {
        doCollectedInfo: [
          { required: true, message: '请选择', trigger: 'change,blur' }
        ],
        doStoraged: [
          { required: true, message: '请选择', trigger: 'change,blur' }
        ],
        doCompared: [
          { required: true, message: '请选择', trigger: 'change,blur' }
        ],
        collectedItems: [
          {
            required: true,
            message: '请选择',
            trigger: 'change,blur',
            type: 'array'
          }
        ],
        collectedStartTimeStr: [
          { validator: validStartTime }
        ],
        collectedEndTimeStr: [
          { validator: validEndTime }
        ]
      },
      dictData: {
        sex: [],
        collectItem: []
      },
      pickerOptions1: {
        disabledDate: (date) => {
          if (!this.ruleForm.collectedEndTimeStr) {
            return false
          }
          let startDate = this.$moment(this.ruleForm.collectedEndTimeStr).format('YYYY/MM/DD 00:00:00')
          let endDate = this.$moment(date).format('YYYY/MM/DD 00:00:00')
          let end = (new Date(startDate)).getTime()
          let _date = (new Date(endDate)).getTime()
          if (_date > end) {
            return true
          }
          return false
        }
      },
      pickerOptions2: {
        disabledDate: (date) => {
          if (!this.ruleForm.collectedStartTimeStr) {
            return false
          }
          let startDate = this.$moment(date).format('YYYY/MM/DD 00:00:00')
          let endDate = this.$moment(this.ruleForm.collectedStartTimeStr).format('YYYY/MM/DD 00:00:00')
          let start = (new Date(endDate)).getTime()
          let _date = (new Date(startDate)).getTime()
          if (_date < start) {
            return true
          }
          return false
        }
      }
    }
  },
  mounted () {
    this.inqDict()
  },
  methods: {
    // 获取字典
    async inqDict () {
      const result = await server.inqDict()
      const { data } = result
      if (data.code === '0') {
        this.dictData = {
          sex: data.data.sex,
          collectItem: data.data.collectItem
        }
        this.collectList = this.dictData.collectItem
      } else {
        this.$messagebox(result)
      }
      this.getCollectedVo() // 获取人员详细信息
    },
    // 是否采集信息change
    doCollectedInfoChange (data) {
      this.rulesChange('reset')
    },
    // 切换校验规则
    rulesChange (val) {
      if (this.ruleForm.doCollectedInfo === '1') {
        this.rules = {
          ...this.rules,
          doCollectedInfo: [
            { required: true, message: '请选择', trigger: 'change,blur' }
          ],
          doStoraged: [
            { required: true, message: '请选择', trigger: 'change,blur' }
          ],
          doCompared: [
            { required: true, message: '请选择', trigger: 'change,blur' }
          ],
          collectedItems: [
            {
              required: true,
              message: '请选择',
              trigger: 'change,blur',
              type: 'array'
            }
          ]
        }
        if(val){
          this.ruleForm.doStoraged = '1'
          this.ruleForm.doCompared = '1'
        }
         
      } else {
        this.rules = {
          ...this.rules,
          doCollectedInfo: [
            { required: true, message: '请选择', trigger: 'change,blur' }
          ],
          doStoraged: [
            { required: false, message: '请选择', trigger: 'change,blur' }
          ],
          doCompared: [
            { required: false, message: '请选择', trigger: 'change,blur' }
          ],
          collectedItems: [
            {
              required: false,
              message: '请选择',
              trigger: 'change,blur',
              type: 'array'
            }
          ]
        }
        if(val){
          this.ruleForm.doStoraged = '0'
        this.ruleForm.doCompared = '0'
        this.ruleForm.collectedItems = []
        }
        
      }
    },
    // 获取设备详情
    async getCollectedVo () {
      if (!this.queryParam.id) {
        return false
      }
      this.formLoading = true
      const params = { registerId: this.queryParam.id }
      const result = await server.getCollectedVo(params)
       this.formLoading = false
      const { data } = result
      if (data.code === '0' && data.data) {
        let _data = data.data
        this.detailData = _data
        this.ruleForm = {
          doCollectedInfo: (_data.doCollectedInfo == 1 || _data.doCollectedInfo == 0) ? _data.doCollectedInfo + '' : '1',
          doStoraged: (_data.doStoraged == 1 || _data.doStoraged == 0)?_data.doStoraged + '':'1',
          doCompared: (_data.doCompared ==1 || _data.doCompared==0)?_data.doCompared + '':'1',
          collectedItems: _data.collectedItems && _data.collectedItems.split(',') || [], // 采集项目
          collectedStartTimeStr: (_data.collectedStartTimeStr && this.$moment(_data.collectedStartTimeStr).format('YYYY/MM/DD HH:mm:ss')) || this.$moment().format('YYYY/MM/DD HH:mm:ss'),
          collectedEndTimeStr: (_data.collectedEndTimeStr && this.$moment(_data.collectedEndTimeStr).format('YYYY/MM/DD HH:mm:ss')) || this.$moment().add(30, 'minutes').format('YYYY/MM/DD HH:mm:ss'),
        }
        if (!_data.collectedId) {
          // 编辑
          let arr = []
          arr = this.detailData.collectedItems&&this.detailData.collectedItems.split(',')
          this.collectList = []
          this.dictData.collectItem.forEach((val) => {
            if (val.used === 0) {
              this.collectList.push(val)
            } else {
              arr.forEach((item) => {
                if (val.key == item) {
                  this.collectList.push(val)
                }
              })
            }
          })
        } else { // 添加
          this.collectList = this.dictData.collectItem.filter((val) => {
            return val.used === 0
          })
        }
        this.rulesChange('')
      } else {
        this.$messagebox(result)
      }
     
    },
    // 表单提交
    submitForm (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let params = {
            ...this.ruleForm,
            registerId: this.queryParam.id,
            collectedId: this.detailData.collectedId,
            collectedItems: this.ruleForm.collectedItems.join(',')
          }
          params = {
            ...params,
            collectedStartTimeStr:
              params.collectedStartTimeStr &&
              this.$moment(params.collectedStartTimeStr).format(
                'YYYY-MM-DD HH:mm:ss'
              ),
            collectedEndTimeStr:
              params.collectedEndTimeStr &&
              this.$moment(params.collectedEndTimeStr).format(
                'YYYY-MM-DD HH:mm:ss'
              )
          }
          const result = await server.saveOrUpdateCollectedInfo(params)
          const { data } = result
          if (data.code === '0') {
            this.$message.success('保存成功')
            this.goBack()
          } else {
            this.$messagebox(result)
          }
        } else {
          return false
        }
      })
    },
    goBack () {
      this.$router.push('/')
    }
  },
  components: {
    PathDesc,
    StepStatueContent
  }
}
</script>
<style lang="less" rel="stylesheet/less">
.info-collection-add-edit {
  &.add-edit-from-back {
    height: ~"calc(100% - 79px)";
    .scroll-box {
      height: ~"calc(100% - 100px)";
    }
  }
  .el-checkbox-group.type-default {
    white-space: nowrap;
  }
}
.content-desc {
  padding: 20px;
  text-align: center;
  color: #565656;
  .content-desc-item {
    padding: 10px;
  }
}
</style>
