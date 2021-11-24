<template>
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
      <span class="title-detail-item">年龄：{{ detailData.registerAge || 0 }} 岁</span>
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
                     label-width="150px">
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
                  <el-checkbox v-for="item in dictData.collectItem"
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
                                placeholder="请选择"
                                :style="{width:'100%'}"
                                :disabled="ruleForm.doCollectedInfo=='0'"
                                type="datetime"
                                :picker-options="startTimePickerOptions"></el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间"
                            prop="collectedEndTimeStr">
                <el-date-picker v-model="ruleForm.collectedEndTimeStr"
                                placeholder="请选择"
                                :style="{width:'100%'}"
                                :disabled="ruleForm.doCollectedInfo=='0'"
                                type="datetime"
                                :picker-options="endTimePickerOptions"></el-date-picker>
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
</template>
<script>
import PathDesc from './components/PathDesc'
import server from '../../server/infoCollection'
import StepStatueContent from '../../components/StepStatueContent/StepStatueContent'

export default {
  name: 'InfoCollectionAddEdit',
  data () {
    let queryParam = this.$route.query

    return {
      stepStatus: [1, 2, 0, 0, 0, 0, 0],
      formLoading: false,
      // pathDescArr: ['信息采集', `${this.detailData ? '编辑' : '录入'}采集信息`],
      queryParam: queryParam,
      detailData: {},
      ruleForm: {
        doCollectedInfo: '0',
        doStoraged: '0',
        doCompared: '0',
        collectedItems: [],
        collectedStartTimeStr: '',
        collectedEndTimeStr: ''
      },
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
        ]
      },
      dictData: {
        sex: [],
        collectItem: []
      },
      startTimePickerOptions: {
        disabledDate: date => {
          console.log('startTimePickerOptions', date)
          console.log(
            new Date(date).getTime() >
            new Date(this.ruleForm.collectedEndTimeStr).getTime()
          )
          return (
            !!this.ruleForm.collectedEndTimeStr &&
            new Date(date).getTime() >
            new Date(this.ruleForm.collectedEndTimeStr).getTime()
          )
        }
      },
      endTimePickerOptions: {
        disabledDate: date => {
          console.log('endTimePickerOptions', date)
          console.log(
            new Date(date).getTime() <
            new Date(this.ruleForm.collectedStartTimeStr).getTime()
          )
          return (
            !!this.ruleForm.collectedStartTimeStr &&
            new Date(date).getTime() <
            new Date(this.ruleForm.collectedStartTimeStr).getTime()
          )
        }
      }
    }
  },
  watch: {
    'ruleForm.collectedStartTimeStr' (val, oldval) {
      if (this.ruleForm.collectedEndTimeStr) {
        let starttime = new Date(val).getTime()
        let endtime = new Date(this.ruleForm.collectedEndTimeStr).getTime()
        if (starttime >= endtime) {
          this.ruleForm.collectedStartTimeStr = oldval
        }
      }
    },
    'ruleForm.collectedEndTimeStr' (val, oldval) {
      if (this.ruleForm.collectedStartTimeStr) {
        let starttime = new Date(val).getTime()
        let endtime = new Date(this.ruleForm.collectedStartTimeStr).getTime()
        if (starttime <= endtime) {
          this.ruleForm.collectedEndTimeStr = oldval
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
      const { data } = await server.inqDict()
      if (data.code === '0') {
        this.dictData = {
          sex: data.data.sex,
          collectItem: data.data.collectItem
        }
      } else {
        this.$message.error(this.$t(data.code))
      }
      this.getCollectedVo() // 获取人员详细信息
    },
    // 是否采集信息change
    doCollectedInfoChange (data) {
      this.rulesChange()
    },
    // 切换校验规则
    rulesChange () {
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

        this.ruleForm = {
          doCollectedInfo: '0',
          doStoraged: '0',
          doCompared: '0',
          collectedItems: [],
          collectedStartTimeStr: '',
          collectedEndTimeStr: ''
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
      const { data } = await server.getCollectedVo(params)
      if (data.code === '0' && data.data) {
        let _data = data.data
        this.detailData = _data
        this.ruleForm = {
          doCollectedInfo: (_data.doCollectedInfo || '0') + '',
          doStoraged: (_data.doStoraged || '0') + '',
          doCompared: (_data.doCompared || '0') + '',
          collectedItems:
            _data.collectedItems && _data.collectedItems.split(','),
          collectedStartTimeStr: _data.collectedStartTimeStr || '',
          collectedEndTimeStr: _data.collectedEndTimeStr || ''
        }
        this.rulesChange()
      } else {
        this.$message.error(this.$t(data.code))
      }
      this.formLoading = false
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
          const { data } = await server.saveOrUpdateCollectedInfo(params)
          if (data.code === '0') {
            this.$message.success('保存成功')
            this.goBack()
          } else {
            this.$message.error(this.$t(data.code))
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
