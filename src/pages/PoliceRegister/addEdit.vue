<template>
  <watermarkContent>
    <div class="add-edit-from-box">
      <PathDesc :path-desc-arr="pathDescArr"
                :is-back="true"></PathDesc>
      <div class="add-edit-from-back police-register-add-edit"
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
                           @change="areaChange"
                           :disabled="!!queryParam.id"
                           clear>
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
                                :disabled="true"></SelectWithTree>
              </el-form-item>
              <el-form-item label="卡片编号"
                            prop="cardNo"
                            v-if="checkPlace">
                <el-input v-model="ruleForm.cardNo"
                          v-show="!!queryParam.id"
                          :disabled="!!queryParam.id"></el-input>
                <el-select v-model="ruleForm.cardNo"
                           placeholder="请选择"
                           v-show="!!!queryParam.id"
                           :disabled="!!queryParam.id"
                           clear>
                  <el-option v-for="(item,index) in TagInfoListXiongka"
                             :key="index"
                             :label="item.tagUuid"
                             :value="item.tagUuid">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="民警"
                            prop="policeIndexCode">
                <el-input v-model="ruleForm.police"
                          placeholder="请选择"
                          :disabled="true"></el-input>
                <div class="form-right-btn"
                     v-show="!!!queryParam.id"
                     @click="changepolice">
                  选择民警
                </div>
                <!-- <ElMorePersonSelect v-model="ruleForm.policeIndexCode"
                                  @changeData="policeChange"
                                  :disabled="!!queryParam.id"
                                  :options="policeAccessIdList"></ElMorePersonSelect> -->
                <!-- <el-select v-model="ruleForm.policeIndexCode"
                         placeholder="请选择"
                         filterable
                         @change="policeChange"
                         :disabled="!!queryParam.id"
                         clear>
                <el-option v-for="item in policeAccessIdList"
                           :key="item.userIndexCode"
                           :label="`${item.realName}(${item.username})`"
                           :value="item.userIndexCode">
                </el-option>
              </el-select> -->
              </el-form-item>
              <el-form-item label="民警手机号"
                            prop="telephoneNo">
                <el-input v-model="ruleForm.telephoneNo"></el-input>
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
      <ShuttleBox ref="ShuttleBoxSingle"
                  @ShuttleEvent="ShuttleEvent"
                  :tree-data="orgTreeSingle"
                  :currentCodes="ruleForm.policeIndexCode"
                  :left-table-data="personByOrg"
                  :multiple="false"></ShuttleBox>
    </div>
  </watermarkContent>
</template>
<script>
import PathDesc from './components/PathDesc'
import server from '../../server/policeRegister'
import SelectWithTree from '../../components/SelectWithTree/SelectWithTree'
import ElMorePersonSelect from '../../components/ElMorePersonSelect/ElMorePersonSelect'
import { validateMobile } from '../../mixin/validate.mixins'
import ShuttleBox from '@/components/ShuttleBoxNew/index'

export default {
  name: 'PoliceRegisterAddEdit',
  data () {
    let queryParam = this.$route.query
    // let checkSpCode = (rule, value, callback) => {
    //   if (/['/\\:*?""<>|]/g.test(value)) {
    //     callback(new Error(this.$t('casehandlingmgt_commonCheckSpecialCode')))
    //   } else {
    //     callback()
    //   }
    // }

    return {
      deptList: [],
      areaList: [],
      policeAccessIdList: [],
      formLoading: false,
      pathDescArr: ['民警出入区', `${queryParam.id ? '编辑' : '添加'}民警信息`],
      queryParam: queryParam,
      detailData: {},
      manufacturerList: [],
      ruleForm: {
        areaCode: '',
        areaName: '',
        deptCode: '',
        deptName: '',
        cardNo: '',
        policeName: '',
        policeIndexCode: '',
        policeData: {},
        police: '',
        telephoneNo: ''
      },
      rules: {
        areaCode: [
          { required: true, message: '请选择', trigger: 'change,blur' }
        ],
        deptCode: [
          { required: true, message: '请选择', trigger: 'change,blur' }
        ],
        policeIndexCode: [
          { required: true, message: '请选择', trigger: 'change,blur' }
        ],
        // 联系电话
        telephoneNo: [
          { validator: validateMobile, trigger: 'change,blur' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      TagInfoListXiongka: '',
      checkPlace: false,
      orgTreeSingle: [],
      personByOrg: [],
      boxLoading: false
    }
  },
  watch: {
  },
  mixins: [],
  async mounted () {
    await this.findAuthUserPlaceList()
    this.findAuthDeptList()
    this.getAccessPoliceInfo()
  },
  methods: {
    // 部门切换回调
    deptChange (data) {
      if (data.name) {
        this.ruleForm.deptName = data.name
      }
    },
    // 办案区切换
    areaChange (data) {
      this.areaList.forEach((item) => {
        if (data === item.areaIndexCode) {
          this.ruleForm.areaName = item.areaName
        }
      })
      this.getLocationAbility()
    },
    // 获取设备详情
    async getAccessPoliceInfo () {
      if (!this.queryParam.id) {
        return false
      }
      this.formLoading = true
      const result = await server.getAccessPoliceInfo({ accessId: this.queryParam.id })
      const { data } = result
      if (data.code === '0' && data.data) {
        let _data = data.data
        this.detailData = _data
        this.ruleForm.areaCode = ''
        this.ruleForm = {
          areaCode: _data.areaCode || '',
          areaName: _data.areaName || '',
          deptCode: _data.deptCode || '',
          deptName: _data.deptName || '',
          cardNo: _data.cardNo || '',
          policeName: _data.policeName || '',
          policeIndexCode: _data.policeIndexCode || '',
          policeData: {
            personName: _data.policeName || '',
            personIndexCode: _data.policeIndexCode || '',
            certificateNumber: _data.policeNo || '',
          },
          police: _data.policeName ? `${_data.policeName}(${_data.policeNo || '--'})` : '',
          telephoneNo: _data.telephoneNo || ''
        }
        console.log('areaCode', this.ruleForm.areaCode)
      } else {
        this.$messagebox(result)
      }
      this.formLoading = false
    },
    // 获取标签列表
    async getTagInfoList () {
      if (!this.ruleForm.areaCode) {
        return false
      }
      const params = {
        areaCode: this.ruleForm.areaCode,
        tagType: 2
      }
      const result = await server.getTagInfoList(params)
      const { data } = result
      if (data.code === '0') {
        this.TagInfoListXiongka = data.data
      } else {
        this.$messagebox(result)
      }
    },
    // 表单提交
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let params = this.ruleForm
          if (this.queryParam.id) {
            params['accessId'] = this.queryParam.id
          }
          const result = await server.saveOrUpdatePoliceInfo(params)
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
    // 获取警员账号信息
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
    // 检测是否具有定位系统
    async getLocationAbility () {
      const params = {
        areaCode: this.ruleForm.areaCode
      }
      const result = await server.getLocationAbility(params)
      const { data } = result
      if (data.code === '0') {
        this.checkPlace = !!(data.data && data.data.length > 0 && data.data.indexOf('RFID') > -1)
        if (this.checkPlace) {
          this.getTagInfoList()
        }
      } else {
        this.$messagebox(result)
      }
    },
    goBack () {
      this.$router.push('/')
    },
    ShuttleEvent (val) {
      console.log(1, val)
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
        this.ruleForm.policeIndexCode = val.payload.data.personIndexCode
        this.ruleForm.policeData = val.payload.data
        this.ruleForm.deptCode = val.payload.data.deptIndexCode
        this.ruleForm.police = `${val.payload.data.personName}(${val.payload.data.certificateNumber || '--'})`
        this.ruleForm.telephoneNo = val.payload.data.mobile
        val.payload.close()
      } else if (val.type == 'beforeCLose') {
        val.payload.done()
      }
    },
    async changepolice () {

      const result = await server.loadOrgTree()
      const { data } = result
      if (data.code === '0') {
        console.log(this.$refs.ShuttleBoxSingle)
        this.orgTreeSingle = data.data
        this.$refs.ShuttleBoxSingle.dialogFormVisible = true

      } else {
        this.$messagebox(result)
      }
    },
  },
  components: {
    PathDesc,
    SelectWithTree,
    ElMorePersonSelect,
    ShuttleBox
  }
}
</script>
<style lang="less" rel="stylesheet/less">
.police-register-add-edit {
  &.add-edit-from-back {
    height: ~"calc(100% - 48px)";
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
