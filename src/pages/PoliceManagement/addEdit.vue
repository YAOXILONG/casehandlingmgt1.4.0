<template>
  <watermarkContent>
    <div class="add-edit-from-box">
      <PathDesc :path-desc-arr="pathDescArr"
                :is-back="true"></PathDesc>
      <div class="add-edit-from-back appoint-manage-add-edit"
           v-loading="formLoading">
        <el-scrollbar wrap-class="el-scrollbar__wrap">
          <div class="add-edit-from-content">
            <el-form :model="ruleForm"
                     :rules="rules"
                     ref="ruleForm"
                     label-position="top">
              <el-form-item label="警情编号"
                            prop="policeSituationNo">
                <el-input v-model.trim="ruleForm.policeSituationNo"
                          placeholder="请输入"
                          :disabled="!!queryParam.id"
                          :maxlength="64"></el-input>
              </el-form-item>
              <el-form-item label="报警时间"
                            prop="reportTime">
                <el-date-picker v-model="ruleForm.reportTime"
                                type="datetime"
                                :picker-options="pickerOptions"
                                placeholder="选择日期时间"
                                :style="{width:'100%'}">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="报警人姓名"
                            prop="reporterName">
                <el-input v-model.trim="ruleForm.reporterName"
                          placeholder="请输入"
                          :maxlength="64"></el-input>
              </el-form-item>
              <el-form-item label="报警人电话"
                            prop="reporterMobile">
                <el-input v-model.trim="ruleForm.reporterMobile"
                          placeholder="请输入"
                          :maxlength="30"></el-input>
              </el-form-item>
              <el-form-item label="报警内容"
                            prop="reportContent">
                <el-input type="textarea"
                          :rows="5"
                          resize="none"
                          placeholder="请输入内容"
                          v-model.trim="ruleForm.reportContent"
                          :maxlength="1000">
                </el-input>
              </el-form-item>
              <el-form-item label="接警时间"
                            prop="receiveTime">
                <el-date-picker v-model="ruleForm.receiveTime"
                                type="datetime"
                                :picker-options="pickerOptions"
                                placeholder="选择日期时间"
                                :style="{width:'100%'}">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="处警时间"
                            prop="handleTime">
                <el-date-picker v-model="ruleForm.handleTime"
                                type="datetime"
                                :picker-options="pickerOptions"
                                placeholder="选择日期时间"
                                :style="{width:'100%'}">
                </el-date-picker>
              </el-form-item>
              <!--            <el-form-item label="处警单位编码"-->
              <!--                          prop="handleDeptNo">-->
              <!--              <el-input v-model="ruleForm.handleDeptIndexCode"-->
              <!--                        placeholder="请输入"-->
              <!--                        :maxlength="11"></el-input>-->
              <!--            </el-form-item>-->
              <!--            <el-form-item label="处警单位名称"-->
              <!--                          prop="handleDeptName">-->
              <!--              <el-input v-model="ruleForm.handleDeptName"-->
              <!--                        placeholder="请输入"-->
              <!--                        :maxlength="11"></el-input>-->
              <!--            </el-form-item>-->
              <el-form-item label="处警单位"
                            prop="handleDeptIndexCode">
                <SelectWithTree v-model="ruleForm.handleDeptIndexCode"
                                :tree-data="handleDeptList"
                                :simple-data="true"
                                :default-props="defaultProps"
                                node-key="deptIndexCode"
                                parent-key="parentIndexCode"
                                @change="handleDeptChange"
                                :disabled="true"></SelectWithTree>
              </el-form-item>
              <el-form-item label="处警民警"
                            prop="handlePoliceIndexCode">
                <!-- <ElMorePersonSelect v-model="ruleForm.handlePoliceIndexCode"
                                  @changeData="handlePoliceChange"
                                  :options="pagePersonsList"
              ></ElMorePersonSelect> -->
                <el-input v-model="ruleForm.handlePolice"
                          placeholder="请选择"
                          :disabled="true"></el-input>
                <div class="form-right-btn"
                     @click="changeHandlePolice">
                  选择民警
                </div>
              </el-form-item>
              <!--            <el-form-item label="处警民警警号"-->
              <!--                          prop="handlePoliceNo">-->
              <!--              <el-input v-model="ruleForm.handlePoliceNo"-->
              <!--                        placeholder="请输入"-->
              <!--                        :maxlength="11"></el-input>-->
              <!--            </el-form-item>-->
              <!--            <el-form-item label="处警民警姓名"-->
              <!--                          prop="handlePoliceName">-->
              <!--              <el-input v-model="ruleForm.handlePoliceName"-->
              <!--                        placeholder="请输入"-->
              <!--                        :maxlength="11"></el-input>-->
              <!--            </el-form-item>-->
              <el-form-item class="form-btns-box">
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
              </el-form-item>
            </el-form>
          </div>
        </el-scrollbar>
      </div>
      <ShuttleBox ref="ShuttleBoxSingle"
                  @ShuttleEvent="ShuttleEvent"
                  :tree-data="orgTreeSingle"
                  :currentCodes="ruleForm.handlePoliceIndexCode"
                  :left-table-data="personByOrg"
                  :multiple="false"></ShuttleBox>
    </div>
  </watermarkContent>
</template>

<script>
import SelectWithTree from '../../components/SelectWithTree/SelectWithTree'
import ElMoreSelect from '../../components/ElMoreSelect/ElMoreSelect'
import ElMorePersonSelect from '../../components/ElMorePersonSelect/ElMorePersonSelect'
import { validateMobile } from '../../mixin/validate.mixins'
import PathDesc from "@/pages/AppointManage/components/PathDesc";
import server from '../../server/policeManagement'
import ShuttleBox from '@/components/ShuttleBoxNew/index'


export default {
  name: "addEdit",
  data () {
    let queryParam = this.$route.query
    var checkSpCode = (rule, value, callback) => {
      if (/['/\\:*?""<>|]/g.test(value)) {
        callback(new Error('不能包含 \' / \\ : * ? " < > | 这些特殊字符'))
      } else {
        callback()
      }
    }
    return {
      pathDescArr: ['警情管理', `${queryParam.id ? '编辑' : '添加'}警情信息`],
      queryParam: queryParam,
      formLoading: false,
      pagePersonsList: [],
      handlePoliceList: [],
      handleDeptList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      pickerOptions: {
        disabledDate: (date) => {
          if (date <= new Date()){
            return false
          } else{
            return true
          }
            
        }
      },
      ruleForm: {
        policeSituationNo: '',
        reportTime: '',
        reporterName: '',
        reporterMobile: '',
        reportContent: '',
        receiveTime: '',
        handleTime: '',
        handleDeptIndexCode: '',
        handleDeptName: '',
        handlePoliceNo: '',
        handlePoliceIndexCode: '',
        handlePolice: '',
        handlePoliceName: ''
      },
      detailData: '',
      rules: {
        policeSituationNo: [
          { required: true, message: this.$t('casehandlingmgt_commonCheckRequiredInput'), trigger: 'change' },
          { min: 1, max: 64, message: '请输入1-64位字符', trigger: 'change,blur' }
        ],
        reportTime: [
          { required: true, message: this.$t('casehandlingmgt_commonCheckRequiredInput'), trigger: 'change', type: 'date' }
        ],
        reporterName: [
          { required: true, message: this.$t('casehandlingmgt_commonCheckRequiredInput'), trigger: 'change' },
          { min: 1, max: 64, message: '请输入1-64位字符', trigger: 'change,blur' }
        ],
        reporterMobile: [
          { min: 0, max: 30, message: '请输入0-30位数字', trigger: 'change,blur' },
          { validator: validateMobile, trigger: 'change,blur' }
        ],
        reportContent: [
          { required: true, message: this.$t('casehandlingmgt_commonCheckRequiredInput'), trigger: 'change' },
          { min: 1, max: 1000, message: '请输入1-1000位字符', trigger: 'change,blur' }
        ]
      },
      orgTreeSingle: [],
      personByOrg: []
    }
  },
  async mounted () {
    // 新增警情需要获取警情编号
    if (!this.$route.query.id) {
      this.loadDefaultPoliceSituationNo()
    }
    // 编辑警情获取警情信息
    this.findAuthDeptList()
    this.findPoliceInfo()
  },
  methods: {
    // 获取详情
    async findPoliceInfo () {
      if (!this.queryParam.id) {
        return false
      }
      this.formLoading = true
      const params = { policeSituationNo: this.queryParam.id }
      const result = await server.findByPoliceSituationNo(params)
      const { data } = result
      if (data.code === '0' && data.data) {
        let _data = data.data
        this.detailData = _data
        this.ruleForm = {
          policeSituationNo: _data.policeSituationNo,
          reportTime: new Date(_data.reportTime),
          reporterName: _data.reporterName,
          reporterMobile: _data.reporterMobile,
          reportContent: _data.reportContent,
          receiveTime: _data.receiveTime ? new Date(_data.receiveTime) : '',
          handleTime: _data.handleTime ? new Date(_data.handleTime) : '',
          handleDeptIndexCode: _data.handleDeptIndexCode,
          handleDeptName: _data.handleDeptName,
          handlePoliceNo: _data.handlePoliceNo,
          handlePoliceName: _data.handlePoliceName,
          handlePoliceIndexCode: _data.handlePoliceIndexCode ? _data.handlePoliceIndexCode : '',
          handlePolice: _data.handlePoliceName ? `${_data.handlePoliceName}(${_data.handlePoliceNo || '--'})` : ''
        }
        this.$nextTick(() => {
          this.ruleForm = { ...this.ruleForm }
        })
      } else {
        this.$messagebox(result)
      }
      this.formLoading = false
    },
    // 获取警情编号
    async loadDefaultPoliceSituationNo () {
      this.formLoading = true
      const result = await server.loadDefaultPoliceSituationNo()
      const { data } = result
      if (data.code === '0' && data.data) {
        let _data = data.data
        this.ruleForm.policeSituationNo = _data
      } else {
        this.$messagebox(result)
      }
      this.formLoading = false
    },
    // 获取警员账号信息
    async queryPagePersons (number, param) {
      let params = {
        ...param,
        pageNo: number,
        pageSize: 1000
      }
      const result = await server.queryPagePersons(params)
      const { data } = result
      if (data.code === '0') {
        if (number == 1) {
          this.personByOrg = data.data.list
        } else {
          this.personByOrg = this.personByOrg.concat(data.data.list)
        }
        if (data.data.pageNo != Math.floor(data.data.total / 1000) + 1) {
          console.log('hhh', 1)
          this.queryPagePersons(data.data.pageNo - 0 + 1, param)
        }
      } else {
        this.$messagebox(result)
      }
    },
    // 获取办案部门
    async findAuthDeptList () {
      const result = await server.findAuthDeptList()
      const { data } = result
      if (data.code === '0') {
        this.handleDeptList = data.data
      } else {
        this.$messagebox(result)
      }
    },
    // 部门切换回调
    handleDeptChange (data) {
      if (data.name) {
        this.ruleForm.handleDeptName = data.name
      }
    },
    // 警员切换
    handlePoliceChange (val) {
      if (!val) {
        this.ruleForm.handlePoliceIndexCode = ''
        this.ruleForm.handlePoliceName = ''
        this.ruleForm.handleDeptIndexCode = ''
        this.ruleForm.handleDeptName = ''
        return
      }
      this.pagePersonsList && this.pagePersonsList.forEach((item) => {
        if (item.personCode === val) {
          this.ruleForm.handlePoliceName = item.name
          this.ruleForm.handleDeptIndexCode = item.deptIndexCode
          this.ruleForm.handleDeptName = item.deptName
        }
      })
    },
    // 表单提交
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let params = {            ...this.ruleForm,
            handleTime: this.ruleForm.handleTime ? new Date(this.ruleForm.handleTime).getTime() : '',
            reportTime: this.ruleForm.reportTime ? new Date(this.ruleForm.reportTime).getTime() : '',
            receiveTime: this.ruleForm.receiveTime ? new Date(this.ruleForm.receiveTime).getTime() : ''
          }
          if (this.queryParam.id) {
            params['policeSituationId'] = this.detailData.policeSituationId
          }
          const result = await server.savePoliceSituation(params)
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
    },
    ShuttleEvent (val) {
      if (val && val.type == 'close') {
        val.payload.close()
      } else if (val.type == 'getLeftData') {
        if (this.$refs.ShuttleBoxSingle && !this.$refs.ShuttleBoxSingle.dialogFormVisible) {
          return
        }
        let params = {
          deptIndexCodeList: [val.payload.indexCode],
          personName: val.payload.personName ? val.payload.personName : ''
        }
        console.log('hhh', 2)
        this.queryPagePersons(1, params)
      } else if (val.type == 'selectData') {
        this.ruleForm.handlePoliceIndexCode = val.payload.data.personIndexCode
        this.ruleForm.handleDeptIndexCode = val.payload.data.deptIndexCode
        this.ruleForm.handlePoliceName = val.payload.data.personName
        this.ruleForm.handleDeptName = val.payload.data.deptName
        this.ruleForm.handlePoliceNo = val.payload.data.certificateNumber
        this.ruleForm.handlePolice = `${val.payload.data.personName}(${val.payload.data.certificateNumber || '--'})`
        val.payload.close()
      } else if (val.type == 'beforeCLose') {
        val.payload.done()
      }
    },
    async changeHandlePolice () {
      const result = await server.loadOrgTree()
      const { data } = result
      if (data.code === '0') {
        this.orgTreeSingle = data.data
        this.$refs.ShuttleBoxSingle.dialogFormVisible = true
      } else {
        this.$messagebox(result)
      }
    }
  },
  components: {
    PathDesc,
    SelectWithTree,
    ElMoreSelect,
    ElMorePersonSelect,
    ShuttleBox
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.appoint-manage-add-edit {
  &.add-edit-from-back {
    height: calc(~"100% - 48px");
    width: 100%;
    .scroll-box {
      height: ~"calc(100% - 100px)";
    }
  }
  .form-right-btn {
    position: absolute;
    right: -61px;
    top: 24px;
    font-size: 12px;
    color: #2080f7;
    cursor: pointer;
    &.six {
      right: -80px;
    }
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
