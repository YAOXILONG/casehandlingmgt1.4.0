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
              <el-form-item label="办案区"
                            prop="areaCode">
                <el-select v-model="ruleForm.areaCode"
                           placeholder="请选择"
                           @change="areaChange">
                  <el-option v-for="item in areaList"
                             :key="item.areaIndexCode"
                             :label="item.areaName"
                             :value="item.areaIndexCode">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="办案部门"
                            prop="deptCode">
                <SelectWithTree v-model="ruleForm.deptCode"
                                :tree-data="deptList"
                                :default-props="defaultProps"
                                :simple-data="true"
                                node-key="deptIndexCode"
                                parent-key="parentIndexCode"
                                @change="deptChange"
                                :disabled="deptShow"></SelectWithTree>
                <div class="form-right-btn"
                     @click="changeDept">
                  选择部门
                </div>
              </el-form-item>
              <el-form-item label="主办民警"
                            prop="hostPoliceIndexCode">
                <el-input v-model="ruleForm.hostPolice"
                          placeholder="请选择"
                          :disabled="true"></el-input>
                <div class="form-right-btn"
                     @click="changeHostPolice">
                  选择民警
                </div>
              </el-form-item>
              <el-form-item label="主办民警手机号"
                            prop="policeTel">
                <el-input v-model="ruleForm.policeTel"
                          placeholder="请输入"
                          :maxlength="11"></el-input>
              </el-form-item>
              <el-form-item label="协办民警"
                            prop="auxiliaryPoliceIndexCode">
                <el-input v-model="ruleForm.auxiliaryPolice"
                          placeholder="请选择"
                          :disabled="true"></el-input>
                <div class="form-right-btn"
                     @click="changeAuxiliaryPolice">
                  选择民警
                </div>
              </el-form-item>
              <el-form-item label="协办民警手机号"
                            prop="policeTel2">
                <el-input v-model="ruleForm.policeTel2"
                          placeholder="请输入"
                          :maxlength="11"></el-input>
              </el-form-item>
              <el-form-item label="预约类型"
                            prop="appointType">
                <el-select v-model="ruleForm.appointType"
                           placeholder="请选择">
                  <el-option label="电话预约"
                             value="0">
                  </el-option>
                  <el-option label="网络预约"
                             value="1">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="预计到达时间"
                            prop="arriveTime">
                <el-date-picker v-model="ruleForm.arriveTime"
                                type="datetime"
                                placeholder="选择日期时间"
                                :style="{width:'100%'}">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="案由"
                            prop="caseCause">
                <ElMoreSelect v-model="ruleForm.caseCause"
                              :options="dictData.brief"></ElMoreSelect>
              </el-form-item>
              <el-form-item label="案情描述"
                            prop="caseContent">
                <el-input type="textarea"
                          :rows="5"
                          resize="none"
                          placeholder="请输入内容"
                          v-model="ruleForm.caseContent"
                          :maxlength="200">
                </el-input>
              </el-form-item>
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
                  :currentCodes="ruleForm.hostPoliceIndexCode"
                  :disabledData="ruleForm.auxiliaryPoliceIndexCode"
                  :left-table-data="personByOrg"
                  :multiple="false"></ShuttleBox>
      <ShuttleBox ref="ShuttleBoxSingle1"
                  @ShuttleEvent="ShuttleEvent1"
                  :currentCodes="ruleForm.auxiliaryPoliceIndexCode"
                  :disabledData="ruleForm.hostPoliceIndexCode"
                  :tree-data="orgTreeSingle"
                  :left-table-data="personByOrg"
                  :multiple="false"></ShuttleBox>

    </div>
  </watermarkContent>
</template>
<script>
import PathDesc from './components/PathDesc'
import server from '../../server/appointManage'
import SelectWithTree from '../../components/SelectWithTree/SelectWithTree'
import ElMoreSelect from '../../components/ElMoreSelect/ElMoreSelect'
import ElMorePersonSelect from '../../components/ElMorePersonSelect/ElMorePersonSelect'
import { validateMobile } from '../../mixin/validate.mixins'
import ShuttleBox from '@/components/ShuttleBoxNew/index'

export default {
  name: 'MonitorPointEdit',
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
      accusationSlow: [],
      areaList: [],
      deptList: [],
      dictData: {
        brief: []
      },
      formLoading: false,
      pathDescArr: ['预约登记', `${queryParam.id ? '编辑' : '添加'}预约信息`],
      queryParam: queryParam,
      detailData: {},
      manufacturerList: [],
      ruleForm: {
        areaCode: '',
        areaName: '',
        deptCode: '',
        deptName: '',
        appointType: '',
        hostPoliceIndexCode: '',
        hostPoliceData: {},
        hostPolice: '',
        policeTel: '',
        auxiliaryPoliceData: {},
        auxiliaryPoliceIndexCode: '',
        auxiliaryPolice: '',
        policeTel2: '',
        arriveTime: '',
        caseCause: '',
        caseCauseName: '',
        caseContent: ''
      },
      rules: {
        areaCode: [
          { required: true, message: this.$t('casehandlingmgt_commonCheckRequiredInput'), trigger: 'change' }
        ],
        deptCode: [
          { required: true, message: this.$t('casehandlingmgt_commonCheckRequiredInput'), trigger: 'change' }
        ],
        appointType: [
          { required: true, message: this.$t('casehandlingmgt_commonCheckRequiredInput'), trigger: 'change' }
        ],
        hostPoliceIndexCode: [
          { required: true, message: this.$t('casehandlingmgt_commonCheckRequiredInput'), trigger: 'change' }
        ],
        // auxiliaryPoliceIndexCode: [
        //   { required: true, message: this.$t('casehandlingmgt_commonCheckRequiredInput'), trigger: 'change' }
        // ],
        policeTel: [
          { min: 0, max: 11, message: '请输入0-11位数字', trigger: 'change,blur' },
          { validator: validateMobile, trigger: 'change,blur' }
        ],
        policeTel2: [
          { min: 0, max: 11, message: '请输入0-11位数字', trigger: 'change,blur' },
          { validator: validateMobile, trigger: 'change,blur' }
        ],
        arriveTime: [
          { required: true, message: this.$t('casehandlingmgt_commonCheckRequiredInput'), trigger: 'change', type: 'date' }
        ],
        caseContent: [
          { min: 0, max: 200, message: '请输入0-200位字符', trigger: 'change,blur' },
          { validator: checkSpCode, trigger: 'change,blur' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      deptShow: true,
      orgTreeSingle: [],
      personByOrg: [],
      boxLoading: false
    }
  },
  mounted () {
    this.findAuthUserPlaceList()
    this.findAuthDeptList()
    this.inqDict()
  },
  beforeDestroy () {

  },
  methods: {
    // 办案区选择
    areaChange (data) {
      this.areaList.forEach((item) => {
        if (item.areaIndexCode === data) {
          this.ruleForm.areaName = item.areaName
        }
      })
    },
    // 部门选择
    deptChange (data) {
      if (data.name) {
        this.ruleForm.deptName = data.name
      }
    },
    // 案件选择
    caseCauseChange (data) {
      this.dictData.brief && this.dictData.brief.forEach((item) => {
        if ((item.key + '') === data) {
          this.ruleForm.caseCauseName = item.name
        }
      })
    },
    // 开启手动更换部门
    changeDept () {
      this.deptShow = false
    },
    caseCauseFocus () {
      this.accusationSlow = this.dictData.brief
    },
    // 获取详情
    async findAppointInfo () {
      if (!this.queryParam.id) {
        return false
      }
      this.formLoading = true
      const params = { appointId: this.queryParam.id }
      const result = await server.findAppointInfo(params)
      const { data } = result
      if (data.code === '0' && data.data) {
        let _data = data.data
        this.detailData = _data
        this.ruleForm = {
          areaCode: _data.areaCode,
          areaName: _data.areaName,
          deptCode: _data.deptCode,
          deptName: _data.deptName,
          appointType: _data.appointType + '',
          hostPoliceIndexCode: _data.hostPoliceIndexCode,
          hostPoliceData: {
            personName: _data.hostPoliceName || '',
            personIndexCode: _data.hostPoliceIndexCode || '',
            certificateNumber: _data.hostPoliceNo || '',
          },
          hostPolice: _data.hostPoliceName ? `${_data.hostPoliceName}(${_data.hostPoliceNo || '--'})` : '',
          policeTel: _data.policeTel,
          auxiliaryPoliceIndexCode: _data.auxiliaryPoliceIndexCode,
          auxiliaryPoliceData: {
            personName: _data.auxiliaryPoliceName || '',
            personIndexCode: _data.auxiliaryPoliceIndexCode || '',
            certificateNumber: _data.auxiliaryPoliceNo || '',
          },
          auxiliaryPolice: _data.auxiliaryPoliceName ? `${_data.auxiliaryPoliceName}(${_data.auxiliaryPoliceNo || '--'})` : '',
          policeTel2: _data.policeTel2,
          arriveTime: new Date(_data.arriveTime),
          caseCause: _data.caseCause && (_data.caseCause + '') || '',
          caseCauseName: _data.caseCauseName || '',
          caseContent: _data.caseContent
        }
        this.$nextTick(() => {
          this.ruleForm = {            ...this.ruleForm,
            deptCode: _data.deptCode,
            deptName: _data.deptName,
            policeTel: _data.policeTel,
            policeTel2: _data.policeTel2
          }
        })
      } else {
        this.$messagebox(result)
      }
      this.formLoading = false
    },
    // 表单提交
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let params = { ...this.ruleForm, arriveTime: new Date(this.ruleForm.arriveTime).getTime() }
          let hostPoliceName = ''
          let auxiliaryPoliceName = ''
          hostPoliceName = this.ruleForm.hostPoliceData.personName
          auxiliaryPoliceName = this.ruleForm.auxiliaryPoliceData.personName
          // this.pliceList.forEach((item) => {
          //   if (params.hostPoliceIndexCode === item.personCode) {
          //     hostPoliceName = item.name
          //   }
          //   if (params.auxiliaryPoliceIndexCode === item.personCode) {
          //     auxiliaryPoliceName = item.name
          //   }
          // })
          params = { ...params, hostPoliceName, auxiliaryPoliceName }

          if (this.queryParam.id) {
            params['appointId'] = this.queryParam.id
          }
          this.formLoading = true
          const result = await server.saveOrUpdateAppointInfo(params)
          this.formLoading = false
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
    // 获取办案区
    async findAuthUserPlaceList () {
      const result = await server.findAuthUserPlaceList()
      const { data } = result
      if (data.code === '0') {
        this.areaList = data.data.list
        this.areaList && this.areaList[0] && (this.ruleForm.areaCode = this.areaList[0].areaIndexCode)
      } else {
        this.$messagebox(result)
      }
    },
    // 获取办案部门
    async findAuthDeptList () {
      const result = await server.findAuthDeptList()
      const { data } = result
      if (data.code === '0') {
        this.deptList = data.data
      } else {
        this.$messagebox(result)
      }
    },
    // 获取字典
    async inqDict () {
      const result = await server.inqDict()
      const { data } = result
      if (data.code === '0') {
        this.dictData = { brief: data.data.brief }
        this.findAppointInfo()
      } else {
        this.$messagebox(result)
      }
    },
    // 获取办案民警
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
        this.ruleForm.hostPoliceIndexCode = val.payload.data.personIndexCode
        this.ruleForm.hostPoliceData = val.payload.data
        this.ruleForm.deptCode = val.payload.data.deptIndexCode
        this.ruleForm.hostPolice = `${val.payload.data.personName}(${val.payload.data.certificateNumber || '--'})`
        this.ruleForm.policeTel = val.payload.data.mobile
        val.payload.close()
      } else if (val.type == 'beforeCLose') {
        val.payload.done()
      }
    },
    ShuttleEvent1 (val) {
      if (val && (val.type == 'close')) {
        val.payload.close()
      } else if (val.type == 'getLeftData') {
        if (this.$refs.ShuttleBoxSingle1 && !this.$refs.ShuttleBoxSingle1.dialogFormVisible) {
          return
        }
        let params = {
          deptIndexCodeList: [val.payload.indexCode],
          personName: val.payload.personName ? val.payload.personName : ''
        }
        console.log('hhh', 3)
        this.queryPagePersons(1, params)
      } else if (val.type == 'selectData') {
        this.ruleForm.auxiliaryPoliceIndexCode = val.payload.data.personIndexCode
        this.ruleForm.auxiliaryPoliceData = val.payload.data
        this.ruleForm.auxiliaryPolice = `${val.payload.data.personName}(${val.payload.data.certificateNumber || '--'})`
        this.ruleForm.policeTel2 = val.payload.data.mobile
        val.payload.close()
      } else if (val.type == 'beforeCLose') {
        val.payload.done()
      }
    },
    async changeHostPolice () {
      const result = await server.loadOrgTree()
      const { data } = result
      if (data.code === '0') {
        this.orgTreeSingle = data.data
        this.$refs.ShuttleBoxSingle.dialogFormVisible = true
      } else {
        this.$messagebox(result)
      }
    },
    async changeAuxiliaryPolice () {
      const result = await server.loadOrgTree()
      const { data } = result
      if (data.code === '0') {
        this.orgTreeSingle = data.data
        this.$refs.ShuttleBoxSingle1.dialogFormVisible = true
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
<style lang="less" rel="stylesheet/less">
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
    top: 26px;
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
