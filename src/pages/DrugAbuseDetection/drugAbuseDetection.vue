<template>
  <watermarkContent>
    <div id="drugAbuseDetection"
         class="drugAbuseDetection">
      <div class="listPage">
        <Layout>
          <Header :height="80">
            <PathDesc :path-desc-arr="pathDescArr"
                      :is-back="true"></PathDesc>
            <!-- <el-breadcrumb separator="/">
            <el-button type="iconButton"
                       icon="h-icon-arrow_left back"
                       @click="onBack"></el-button>
            <el-breadcrumb-item>吸毒检测</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentType == 1? '录入':'编辑' }}吸毒检测信息</el-breadcrumb-item>
          </el-breadcrumb> -->
            <div class="personInfo">
              <span>姓名：{{ currentRegisterInfo.registerName }}</span>
              <span>人员类型：{{ currentRegisterInfo.personTypeName }}</span>
              <span v-if="sexMap[currentRegisterInfo.registerSex]">性别：{{ sexMap[currentRegisterInfo.registerSex] }}</span>
              <span v-else>性别：</span>
              <span v-if="currentRegisterInfo.registerAge">年龄：{{ currentRegisterInfo.registerAge }}岁</span>
              <span v-else>年龄：未知</span>
              <span v-show="$checkPlace">手环编号：{{ currentRegisterInfo.bandsNo }}</span>
            </div>
          </Header>

          <Main>
            <div class="drugAbuseDetectionMain">
              <Layout>
                <Header :height="96">
                  <StepStatueContent :current-key="4"
                                     :step-statue="stepStatue"></StepStatueContent>
                </Header>
                <Main>
                  <div class="drugAbuseDetectionInfo">
                    <el-scrollbar wrap-class="scrollbarWrap"
                                  view-class="scrollbarView"
                                  ref="scrollbar">
                      <div class="formContant">
                        <el-form ref="drugForm"
                                 :model="drugForm"
                                 :rules="rules"
                                 label-position="top">
                          <!-- <el-form-item label="检测结果"
                                      required
                                      prop="checkResult">
                          <el-radio class="radio"
                                    v-model="drugForm.checkResult"
                                    label="1">
                            阴性
                          </el-radio>
                          <el-radio class="radio"
                                    v-model="drugForm.checkResult"
                                    label="2">
                            阳性
                          </el-radio>
                        </el-form-item> -->
                          <el-form-item label="检测样本"
                                        prop="checkSample">
                            <el-checkbox-group v-model="drugForm.checkSample">
                              <el-checkbox v-for="(item,index) in sampleList"
                                           :key="index"
                                           :label="item.key"
                                           :show-label="false">{{item.name}}</el-checkbox>
                            </el-checkbox-group>
                          </el-form-item>
                          <el-form-item label="检测方法"
                                        prop="checkMethod">
                            <el-input v-model="drugForm.checkMethod">
                            </el-input>
                          </el-form-item>
                          <el-form-item label="检测项目"
                                        prop="itemCheckCon">
                            <el-input v-model="itemCheckCon"
                                      :title="itemCheckCon"
                                      :disabled="true">
                            </el-input>
                            <div class="itemContent">
                              <div class="toolsbox">
                                <!-- <el-checkbox-group 
                                                 :max='1'
                                                 > -->
                                <el-checkbox label="全阴性"
                                             @change="changeitemCheckYin"
                                             v-model="itemCheckYin"></el-checkbox>
                                <el-checkbox label="全阳性"
                                             @change="changeitemCheckYang"
                                             v-model="itemCheckYang"></el-checkbox>
                                <!-- </el-checkbox-group> -->
                              </div>
                              <div class="itemBox">
                                <div class="itemRow"
                                     :key="item.key"
                                     v-if="item.show"
                                     v-for="item in itemData">
                                  <div class="itemCol">
                                    {{item.name}}
                                  </div>
                                  <div class="itemCol">
                                    <el-radio class="radio"
                                              v-model="item.checkResult "
                                              :label="1">阴性</el-radio>

                                  </div>
                                  <div class="itemCol">
                                    <el-radio class="radio"
                                              v-model="item.checkResult "
                                              :label="2">阳性</el-radio>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </el-form-item>
                          <el-form-item label="检测地点"
                                        prop="checkPlace">

                            <el-input v-model="drugForm.checkPlace"></el-input>
                          </el-form-item>
                          <el-form-item label="检测开始时间"
                                        prop="checkStartTimeStr">
                            <el-date-picker v-model="drugForm.checkStartTimeStr"
                                            type="datetime"
                                            :picker-options="pickerOptions1"
                                            placeholder="选择检测开始时间" />
                          </el-form-item>
                          <el-form-item label="检测结束时间"
                                        prop="checkEndTimeStr">
                            <el-date-picker v-model="drugForm.checkEndTimeStr"
                                            type="datetime"
                                            :picker-options="pickerOptions2"
                                            placeholder="选择检测结束时间" />
                          </el-form-item>
                          <el-form-item label="检测结果图片">
                            <div class="uploadWarp"
                                 @mouseover="mouseoverUpload(1)"
                                 @mouseout="mouseoutUpload(1)">
                              <div class="uploadImg">
                                <i class="h-icon-add">
                                  <i class="el-label">上传图片</i>
                                </i>

                                <img :src="drugForm.checkPhotoPicture"
                                     v-show="drugForm.checkPhotoPicture"
                                     alt />
                                <div class="upload"
                                     v-show="showUploadOne"
                                     :style="showUploadOne ? 'background: rgba(0,0,0,0.60);border-radius: 2px;' : ''">
                                  <a class="chooseImgBtn icon-camera"
                                     @click="onSnap(0)">抓拍</a>
                                  <a class="chooseImgBtn icon-export">
                                    {{ drugForm.checkPhotoPicture? '更换' : '上传' }}
                                    <el-upload :action="`/person/uploadPhoto.do`"
                                               list-type="picture-card"
                                               ref="fileInput"
                                               :key="fileInputKey[1]"
                                               class="fileInput"
                                               accept="image/jpg, image/jpeg, image/jpg"
                                               :http-request="uploadFile"
                                               :multiple="false"
                                               :show-file-list="false"></el-upload>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </el-form-item>

                          <el-form-item label="被检测人手持结果拍照">
                            <div class="uploadWarp"
                                 @mouseover="mouseoverUpload(2)"
                                 @mouseout="mouseoutUpload(2)">
                              <div class="uploadImg">
                                <i class="h-icon-add">
                                  <i class="el-label">上传图片</i>
                                </i>

                                <img :src="drugForm.checkPhoto2Picture"
                                     v-show="drugForm.checkPhoto2Picture"
                                     alt />
                                <div class="upload"
                                     :style="showUploadTwo ? 'background: rgba(0,0,0,0.6);border-radius: 2px;' : ''"
                                     v-show="showUploadTwo">
                                  <a class="chooseImgBtn icon-camera"
                                     @click="onSnap(1)">抓拍</a>
                                  <a class="chooseImgBtn icon-export">
                                    {{ drugForm.checkPhoto2Picture? '更换' : '上传' }}
                                    <el-upload :action="`/person/uploadPhoto.do`"
                                               list-type="picture-card"
                                               ref="fileInput"
                                               :key="fileInputKey[1]"
                                               class="fileInput"
                                               accept="image/jpg, image/jpeg, image/jpg"
                                               :http-request="uploadFile1"
                                               :multiple="false"
                                               :show-file-list="false"></el-upload>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </el-form-item>

                          <el-row :gutter="16"
                                  class="sign-box"
                                  style="width:640px">
                            <el-col :span="12">
                              <div class="sign-ctrl-box">
                                <div class="sign-lable">
                                  <span>检测民警</span>
                                </div>
                                <el-button type="primary"
                                           size="mini"
                                           @click="signHandle('policeSign')">
                                  开始采集
                                </el-button>
                                <div class="sign-area-box">
                                  <img :src="policeSign"
                                       v-show="policeSign"
                                       alt="">
                                  <span class="tip1">
                                    签字处
                                  </span>
                                </div>
                              </div>
                            </el-col>

                            <el-col :span="12">
                              <div class="sign-ctrl-box">
                                <div class="sign-lable">
                                  <span>被检测人</span>
                                </div>
                                <el-button type="primary"
                                           size="mini"
                                           @click="signHandle('suspectSign')">
                                  开始采集
                                </el-button>
                                <div class="sign-area-box">
                                  <img :src="suspectSign"
                                       v-show="suspectSign"
                                       alt="">
                                  <span class="tip">
                                    签字处/指纹
                                  </span>
                                </div>
                              </div>
                            </el-col>
                          </el-row>
                        </el-form>
                      </div>
                    </el-scrollbar>
                  </div>
                </Main>
                <Footer :height="48">
                  <div class="footerBtn">
                    <el-button type="primary"
                               @click="onSubmit">
                      保存
                    </el-button>
                    <el-button @click="onBack">
                      取消
                    </el-button>
                  </div>
                </Footer>
              </Layout>
            </div>
          </Main>
        </Layout>
      </div>
    <el-dialog
      title="导出"
      custom-class="DrugAbuseDetectionexport"
      :visible.sync="dialogVisible"
      size="small"
      top="middle"
      :area="[350,202]"
      @close="closeExportDialog"
    >
      <div class="tag-select-box">
        <el-button
          type="primary"
          @click="handleUrineExport()">导出尿液提取笔录</el-button>
        <el-button type="primary"
          @click="handleDrugExport()">导出现场检测报告</el-button>
      </div>
      <span slot="footer"
              class="dialog-footer">
          <!-- <el-button type="primary"
                     @click="tagCheckSure">确 定</el-button> -->
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
    </el-dialog>
    </div>
  </watermarkContent>
</template>
<script>
import Layout, { Main, Footer, Header } from '../../components/Layout'
import server from '../../server/drugAbuseDetection'
// import bus from '../../views/temporaryStorageOfArticles/index'
import StepStatueContent from '../../components/StepStatueContent/index'
import PathDesc from './components/PathDesc'
export default {
  name: 'DrugAbuseDetection',
  data () {
    const validStartTime = (rule, value, callback) => {
      if (value && this.drugForm.checkEndTimeStr && new Date(value).getTime() > new Date(this.drugForm.checkEndTimeStr).getTime()) {
        return callback(new Error('开始时间不能晚于结束时间'))
      }
      this.$refs.drugForm && this.$refs.drugForm.resetValidate('checkEndTimeStr')
      callback()
    }
    const validEndTime = (rule, value, callback) => {
      if (value && this.drugForm.checkStartTimeStr && new Date(value).getTime() < new Date(this.drugForm.checkStartTimeStr).getTime()) {
        return callback(new Error('结束时间不能早于开始时间'))
      }
      this.$refs.drugForm && this.$refs.drugForm.resetValidate('checkStartTimeStr')
      callback()
    }
    return {
      signature: false,
      dialogVisible: false,
      signBox: 'policeSign',
      policeSignKey: '',
      policeSign: '',
      suspectSignKey: '',
      suspectSign: '',
      currentType: 1,
      stepStatue: [0, 0, 0, 0, 0],
      currentRegisterInfo: {
        registerName: '',
        bandsNo: '',
        registerSex: '',
        registerAge: '',
        personTypeName: ''
      },
      currentRegisterId: null,
      drugForm: {
        checkPlace: '',
        checkStartTimeStr: this.$moment().format('YYYY/MM/DD HH:mm:ss'),
        checkEndTimeStr: this.$moment().add(30, 'minutes').format('YYYY/MM/DD HH:mm:ss'),
        checkPhoto: '',
        checkPhotoName: '',
        checkPhotoFile: '',
        checkPhoto2: '',
        checkPhoto2Name: '',
        checkPhoto2File: '',
        checkSample: [],
        checkMethod: '胶体金法',

      },
      itemCheckCon: '',
      rules: {
        checkStartTimeStr: [
          { validator: validStartTime, trigger: 'change', }
        ],
        checkEndTimeStr: [
          { validator: validEndTime, trigger: 'change', }
        ]
        // checkResult: [
        //   { required: true, message: '请选择检测结果', trigger: 'change' }
        // ]
        // ,
        // checkPlace: [
        //   { required: true, message: '请选择检测地点', trigger: 'change' }
        // ]
      },
      itemData: [],
      itemDataMap: {},
      itemCheckYin: false,
      itemCheckYang: false,
      showUploadOne: false,
      showUploadTwo: false,
      fileInputKey: ['', ''],
      drugRoomList: [],
      personTypeMap: {},
      sexMap: {},
      loadingInstance: null,
      timePickerOptions: {
        disabledDate: date => {
          return false
        }
      },
      pickerOptions1: {
        disabledDate: (date) => {
          if (!this.drugForm.checkEndTimeStr) {
            return false
          }
          let endDate = this.$moment(this.drugForm.checkEndTimeStr).format('YYYY-MM-DD')
          let startDate = this.$moment(date).format('YYYY-MM-DD')
          let end = (new Date(endDate)).getTime()
          let _date = (new Date(startDate)).getTime()
          if (_date > end) {
            return true
          }
          return false
        }
      },
      pickerOptions2: {
        disabledDate: (date) => {
          if (!this.drugForm.checkStartTimeStr) {
            return false
          }
          let startDate = this.$moment(this.drugForm.checkStartTimeStr).format('YYYY-MM-DD')
          let endDate = this.$moment(date).format('YYYY-MM-DD')
          let start = (new Date(startDate)).getTime()
          let _date = (new Date(endDate)).getTime()

          if (_date < start) {
            return true
          }
          return false
        }
      },
      sampleListAll: [],
      sampleList: []
    }
  },
  mixins: [],
  methods: {
    async handleDrugExport () {
      let params = {
        registerId: this.currentRegisterId
      }
      let res = await server.exportDrugInfo(params)
      let data = res.data
      if (data.code === '0') {
        if (data.data && data.data.fileUrl) {
          // window.location.href = data.data.fileUrl
          window.open(data.data.fileUrl, '_self')
        } else {
          this.$message({
            type: 'warning',
            message: '未知错误'
          })
        }
      } else {
        this.$message.error(this.$t(res.data.code))
      }
    },
    async handleUrineExport () {
      let params = {
        registerId: this.currentRegisterId
      }
      let res = await server.exportUrineInfo(params)
      let data = res.data
      if (data.code === '0') {
        if (data.data && data.data.fileUrl) {
          // window.location.href = data.data.fileUrl
          window.open(data.data.fileUrl, '_self')
        } else {
          this.$message({
            type: 'warning',
            message: '未知错误'
          })
        }
      } else {
        this.$message.error(this.$t(res.data.code))
      }
    },
    closeExportDialog() {
      this.dialogVisible = false;
      this.onBack();
    },
    getitemData (data) {
      let arr1 = []
      let arr2 = {}
      data.forEach((v, i) => {
        arr1.push({
          ...v,
          checkResult: 1,
          drugItem: v.key,
          show: v.used == 0 ? true : false
        })
        arr2[v.key] = i
      })
      this.itemData = arr1
      this.itemDataMap = arr2
    },
    async getDrugCheckVo () {
      let params = {
        registerId: this.currentRegisterId
      }
      let res = await server.getDrugCheckVo(params)
      this.loadingInstance.close()
      if (res.data.code === '0') {
        let data = res.data.data

        this.policeSign = data.policeSignPhotoUrl
        this.suspectSign = data.personSignPhotoUrl
        this.policeSignKey = data.policeSign
        this.suspectSignKey = data.suspectSign

        this.currentRegisterInfo = {
          registerName: data.registerName,
          bandsNo: data.bandsNo,
          registerSex: data.registerSex,
          registerAge: data.registerAge,
          personTypeName: data.personTypeName,
          areaCode: data.areaCode
        }
        let drugItemAndResult = data.drugItemAndResult && JSON.parse(data.drugItemAndResult) || []
        // 检测样本的处理
        let checkSample = data.checkSample && JSON.parse(data.checkSample) || []
        let checkSampleMap = {}
        checkSample.forEach(v => {
          checkSampleMap[v] = true
        })
        let sampleList = []
        Object.keys(this.sampleListAll).forEach(v => {
          let _data = this.sampleListAll[v]
          if (_data.used == 0) {
            sampleList.push(_data)
          } else if (checkSampleMap[v]) {
            sampleList.push(_data)
          }
        })
        this.sampleList = sampleList
        // ========
        let itemData = JSON.parse(JSON.stringify(this.itemData))
        drugItemAndResult.forEach(v => {

          let index = this.itemDataMap[v.drugItem]
          if (index != -1) {
            let jcItem = itemData[index]
            if (jcItem.used == 1) {
              jcItem.show = true
            }
            itemData[index] = { ...jcItem, ...v, checkResult: Number(v.checkResult) }
          }

        })
        this.itemData = itemData
        this.drugForm = {
          checkPlace: data.checkPlace || '',
          checkEndTimeStr: data.checkEndTimeStr && this.$moment(data.checkEndTimeStr).format('YYYY/MM/DD HH:mm:ss') || this.$moment().add(30, 'minutes').format('YYYY/MM/DD HH:mm:ss'),//this.$moment(this.drugForm.checkEndTimeStr).format('YYYY-MM-DD')
          checkStartTimeStr: data.checkStartTimeStr && this.$moment(data.checkStartTimeStr).format('YYYY/MM/DD HH:mm:ss') || this.$moment().format('YYYY/MM/DD HH:mm:ss'),
          fileName: data.checkPhoto || '',
          checkPhotoPicture: data.checkPhotoUrl || '',
          fileName2: data.checkPhoto2 || '',
          checkPhoto2Picture: data.checkPhoto2Url || '',
          areaCode: data.areaCode,
          drugId: data.drugId || '',
          checkSample: checkSample,
          checkMethod: data.checkMethod || '胶体金法'
          // checkPhoto2Name: '',
          // checkPhoto2File: ''
        }
        // this.getDrugRoomByAreaCode()
        this.stepStatue = [
          // '入区登记','人身检查','物品登记  ','信息采集','吸毒检测','物品归还','出区登记'
          data.doBodyCheck || 0,
          data.doGoodsStorage || 0,
          data.doCollected || 0,
          data.doDrugCheck || 0,
          data.doGoodsReturn || 0
        ] // [registerStatusIn, data.doBodyCheck, data.doGoodsStorage, data.doCollected, data.doDrugCheck, data.doGoodsReturn, registerStatusOut]
      } else {
        setTimeout(() => {
          this.$messagebox(res)
        }, 500)
      }
    },
    async getDrugRoomByAreaCode () {
      let params = {
        areaCode: this.currentRegisterInfo.areaCode
      }
      try {
        let res = await server.getDrugRoomByAreaCode(params)
        if (res.data.code === '0') {
          let data = res.data.data
          if (data && data.length) {
            this.drugRoomList = data
            if (Number(this.currentType) === 1) {
              this.drugForm.checkPlace = this.drugRoomList[0].roomIndexCode
            }
          } else {
            this.drugRoomList = []
            this.drugForm.checkPlace = ''
          }
          this.loadingInstance && this.loadingInstance.close()
        } else {
          this.loadingInstance && this.loadingInstance.close()
          setTimeout(() => {
            this.$messagebox(res)
          }, 300)
        }
      } catch {
        setTimeout(() => {
          this.loadingInstance && this.loadingInstance.close()
        }, 300)
      }
    },
    mouseoverUpload (index) {
      if (index === 1) {
        this.showUploadOne = true
      } else {
        this.showUploadTwo = true
      }
    },
    mouseoutUpload (index) {
      if (index === 1) {
        this.showUploadOne = false
      } else {
        this.showUploadTwo = false
      }
    },
    // 自定义上传
    async uploadFile (value) {
      let file = value.file
      let formData = new FormData()
      formData.append('file', file)
      let uploadSuccess = false
      const res = await server.uploadFile(formData, {
        transformRequest: [
          function (data) {
            return data
          }
        ],
        headers: {
          post: { 'Content-Type': 'multipart/form-data' }
        }
      })
      const { data } = res
      if (data.code === '0') {
        // let picObj = {}
        if (data.data.fileUrl) {
          this.drugForm.checkPhotoPicture = data.data.fileUrl
          this.drugForm.fileName = data.data.fileName
        }
        this.uploadSuccess = true
      } else {
        this.$messagebox(res)
      }
      if (!uploadSuccess) {
      }
    },
    // 自定义上传1
    async uploadFile1 (value) {
      let file = value.file
      let formData = new FormData()
      formData.append('file', file)
      let uploadSuccess = false
      const result = await server.uploadFile(formData, {
        transformRequest: [
          function (data) {
            return data
          }
        ],
        headers: {
          post: { 'Content-Type': 'multipart/form-data' }
        }
      })
      const { data } = result
      if (data.code === '0') {
        if (data.data.fileUrl) {
          this.drugForm.checkPhoto2Picture = data.data.fileUrl
          this.drugForm.fileName2 = data.data.fileName
        }
        this.uploadSuccess = true
      } else {
        this.$messagebox(result)
      }
      if (!uploadSuccess) {
      }
    },
    // 抓拍
    async onSnap (index) {
      let _self = this
      // if (!this.drugForm.checkPlace) {
      //   this.$message.error('检测地点为空')
      //   return false
      // }
      let params = {
        registerId: this.currentRegisterId
      }
      const ress = await server.findDrugCameraCaptureInfo(params)//
      let res = ress.data
      if (res.code === '0') {
        let data = res.data
        let language = data.language ? data.language : 'zh_CN'
        let cameraType = data.cameraType // USB相机usbCamera;网络摄像机ipCamera;高拍仪highMeter
        let protocolType = data.protocolType // http https
        let indexCode = data.indexCode
        let NginxIp = data.nginxIp
        let NginxPort = data.nginxPort
        let sg = data.sg
        let context = data.context
        // eslint-disable-next-line no-unused-vars
        let hikUrl = null
        switch (cameraType) {
          case 'usbCamera': // ①USB相机模式
            hikUrl =
              'btoolsprotocol://CenterUrl:' +
              this.$centerUrl +
              ';toollist:PROT_imagecaptureprotocol;CmdLine:imagecaptureprotocol://language:' +
              language +
              ';cameraType:' +
              cameraType +
              ';NginxIp:' +
              NginxIp +
              ';NginxPort:' +
              NginxPort +
              ';sg:' +
              sg +
              ';protocolType:' +
              protocolType +
              ';context:' +
              context +
              ';faceMode:0;'
            break
          case 'ipCamera': // ②网络摄像机模式
            hikUrl =
              'btoolsprotocol://CenterUrl:' +
              this.$centerUrl +
              ';toollist:PROT_imagecaptureprotocol;CmdLine:imagecaptureprotocol://language:' +
              language +
              ';cameraType:' +
              cameraType +
              ';indexCode:' +
              indexCode +
              ';NginxIp:' +
              NginxIp +
              ';NginxPort:' +
              NginxPort +
              ';sg:' +
              sg +
              ';protocolType:' +
              protocolType +
              ';context:' +
              context
            break
          // case 'highMeter': // ③高拍仪模式
          //   hikUrl = 'btoolsprotocol://CenterUrl:' + window.location.origin + ';toollist:PROT_imagecaptureprotocol;CmdLine:imagecaptureprotocol://language:' + language + ';cameraType:' + cameraType + ';NginxIp:' + NginxIp + ';NginxPort:' + NginxPort + ';sg:' + sg + ';protocolType:' + protocolType + ';componentId:' + componentId + ';serviceType:' + serviceType
          //   break
        }
        _self.webSocketConnect(hikUrl, index)
      } else {
        this.$messagebox(ress)
      }
    },
    webSocketConnect (webMsg, index) {
      let _self = this
      // 参数
      // let sendMsg = webMsg //'{"comment":{"commenttype":"startapp", "context":"noteFormatClientprotocol", "commentcmd":"noteFormatClientprotocol://nginxIP:' + webMsg.nginxIp + ';nginxport:' + webMsg.nginxPort + ';sg:' + webMsg.sg + ';protocol:' + webMsg.protocol + ';componentID:' + webMsg.componentId + ';servicetype:' + webMsg.serviceType + ';noteTemplateId:' + webMsg.id + ';language:' + webMsg.language + ';"}}'
      let sendMsg = '{"comment":{"commenttype":"startapp", "context":"btoolsprotocol", "commentcmd":"' + webMsg + '"}}' // 抓拍
      let sendMsg2 = '{"comment":{"commenttype":"startapp", "context":"btoolsprotocol", "commentcmd":"' + webMsg + '}}' // 签字板
      let socketHost =
        window.location.protocol.indexOf('https') > -1
          ? 'wss://127.0.0.1:18001/WebS_Js'
          : 'ws://127.0.0.1:18000/WebS_Js'
      try {
        if (!_self.websock) {
          _self.websock = new WebSocket(socketHost)
          _self.websock.onopen = function () {
            let jsonObj =
              '{"comment":{"commenttype":"checkapp", "context":"btoolsprotocol"}}'
            _self.websock.send(jsonObj)
          }
        } else {
          let jsonObj =
            '{"comment":{"commenttype":"checkapp", "context":"btoolsprotocol"}}'

          _self.websock.send(jsonObj)
        }
        _self.websock.onerror = function () {
          // 连接失败，通信中间件未安装
          _self.$message('检测到您未安装插件助手')
        }
        _self.websock.onmessage = async data => {
          let _data = JSON.parse(data.data)
          if (_data && _data.comment && _data.comment.commenttype === 'checkapp') {
            // 检测插件助手是否安装
            if (_data.comment.resultCode === '1') {
              let jsonObj
              if (webMsg.indexOf('SignType') > -1) {
                jsonObj = sendMsg2
              } else {
                jsonObj = sendMsg
              }
              // let jsonObj = sendMsg
              _self.websock.send(jsonObj)
            } else {
              _self.$message('检测到您未安装插件助手')
            }
          } else if (_data && _data.fileUrl && _data.fileName) {
            if (index === 0) {
              _self.drugForm.checkPhotoPicture = _data.fileUrl
              _self.drugForm.fileName = _data.fileName
            }
            if (index === 1) {
              _self.drugForm.checkPhoto2Picture = _data.fileUrl
              _self.drugForm.fileName2 = _data.fileName
            }
          } else {
            if (index === 2) {
              this.signToolDataCtrl(_data)
            }
          }
        }
        _self.websock.onclose = function () {
          _self.websock = null
        }
      } catch (err) {
        console.log(err)
      }
    },

    // 连接签字板
    async connectSignPicTool (signBox) {
      const SignType = signBox === 'suspectSign' ? 1 : 0
      // if (this.socket && this.socket.readyState === 1) {
      // let jsonObj = `{"comment":{"commenttype":"startapp", "context":"btoolsprotocol", "commentcmd":"btoolsprotocol://CenterUrl:${this.$centerUrl};Toollist:PROT_BToolCardReaderProtocol;CmdLine:BToolCardReaderProtocol://MethodType:1;"}}`
      //  this.socket.send(jsonObj)
      // } else {
      //  this.webSocketConnect(this.connectSignPicTool)
      // }
      let hikUrl = `btoolsprotocol://CenterUrl:${this.$centerUrl};Toollist:PROT_BToolCardReaderProtocol;CmdLine:BToolCardReaderProtocol://MethodType:1;SignType:${SignType};"`
      this.webSocketConnect(hikUrl, 2)
    },
    // 签字数据处理
    async signToolDataCtrl (_data) {
      if (_data && _data.Code === 0 && _data.Result && _data.Result.CommentType === 4) {
        let base64Str = _data.Result.Data.ImgData
        const result = await server.uploadbase64({ base64Str })
        const { data } = result
        if (data.code === '0') {
          this[this.signBox] = data.data.fileUrl
          this[this.signBox + 'Key'] = data.data.fileName
        } else {
          this.$messagebox(result)
        }
      }
    },
    // 开始采集签字信息
    signHandle (signBox) {
      this.signBox = signBox
      this[this.signBox] = ''
      this[this.signBox + 'Key'] = ''
      this.connectSignPicTool(signBox)
    },

    onSubmit () {
      this.$refs.drugForm.validate(async valid => {
        if (valid) {
          let itemData = this.itemData.filter(v => {
            return v.show
          })
          console.log(itemData)
          let params = {
            registerId: this.currentRegisterId,
            checkPlace: this.drugForm.checkPlace,
            checkStartTimeStr:
              this.drugForm.checkStartTimeStr ? this.$moment(this.drugForm.checkStartTimeStr).format('YYYY-MM-DD HH:mm:ss')
                : '',
            checkEndTimeStr: this.drugForm.checkEndTimeStr ? this.$moment(this.drugForm.checkEndTimeStr).format('YYYY-MM-DD HH:mm:ss')
              : '',
            checkPhoto: this.drugForm.fileName,
            checkPhoto2: this.drugForm.fileName2,
            policeSign: this.policeSignKey,
            suspectSign: this.suspectSignKey,
            drugItemAndResult: JSON.stringify(itemData),
            checkSample: JSON.stringify(this.drugForm.checkSample),
            checkMethod: this.drugForm.checkMethod,
            // registrantName: this.currentRegisterInfo.registerName

          }
          if (this.drugForm.drugId) {
            params.drugId = this.drugForm.drugId
          }
          let loadingInstance = this.$loading({
            fullscreen: true,
            text: '保存中...'
          })
          try {
            let res = await server.saveOrUpdateDrugCheckInfo(params)
            if (res.data.code === '0') {
              loadingInstance.close()
              setTimeout(() => {
                this.$message.success('保存成功')
              }, 500)
              if(this.drugForm.drugId){
                this.onBack()
              }
             // this.onBack()
            } else {
              loadingInstance.close()
              setTimeout(() => {
                this.$messagebox(res)
              }, 500)
            }
            if (res.data.code === "0" && !this.drugForm.drugId) {
              this.dialogVisible = true;
            }
          } catch {
            setTimeout(() => {
              loadingInstance.close()
            }, 500)
          }
        } else {
          return false
        }
      })
    },
    onBack () {
      this.$router.push({ path: '/', query: {} })
    },
    // 数据字典
    async inqDict () {
      let res = await server.inqDict()
      if (res.data.code === '0') {
        let data = res.data.data
        let sexData = data.sex
        let personType = data.suspectType
        this.sexMap = this.computedDic(sexData)
        this.personTypeMap = this.computedDic(personType)
        let sampleList = []
        let sampleListAll = {}
        data.checkSample && data.checkSample.forEach(v => {
          sampleListAll[v.key] = v
          if (v.used == 0) {
            sampleList.push(v)
          }
        })
        this.sampleList = sampleList
        this.sampleListAll = sampleListAll
        this.getitemData(data.sampleDrugItem || [])//checkSample

      } else {
        this.$messagebox(res)
      }
    },
    computedDic (list) {
      let dicMap = {}
      if (list && list.length) {
        for (let i = 0; i < list.length; i++) {
          dicMap[list[i].key] = list[i].name
        }
      }
      return dicMap
    },
    changeitemCheckYin (val) {
      if (val) {
        if (this.itemCheckYang) {
          this.itemCheckYang = !this.itemCheckYang
        }
      } else {
        if (!this.itemCheckYang) {
          this.itemCheckYin = true
        }
      }
      this.itemData.forEach(v => {
        v.checkResult = 1
      })
    },
    changeitemCheckYang (val) {
      if (val) {
        if (this.itemCheckYin) {
          this.itemCheckYin = !this.itemCheckYin
        }
      } else {
        if (!this.itemCheckYin) {
          this.itemCheckYang = true
        }
      }

      this.itemData.forEach(v => {
        v.checkResult = 2
      })
    }
  },
  async mounted () {
    await this.inqDict()
    this.loadingInstance = this.$loading({ fullscreen: true })
    this.currentRegisterId = this.$route.query.id
    this.drugForm = {
      checkPlace: '',
      checkStartTimeStr: this.$moment().format('YYYY/MM/DD HH:mm:ss'),
      checkEndTimeStr: this.$moment().add(30, 'minutes').format('YYYY/MM/DD HH:mm:ss'),
      checkPhoto: '',
      checkPhotoName: '',
      checkPhotoFile: '',
      checkPhoto2: '',
      checkPhoto2Name: '',
      checkPhoto2File: '',
      policeSignKey: '',
      policeSign: '',
      suspectSignKey: '',
      suspectSign: ''
    }
    console.log(this.drugForm)
    this.currentType = this.$route.query.type

    await this.getDrugCheckVo()
  },
  watch: {
    itemData: {
      handler: function (val, oldV) {
        let yin = false
        let yang = false
        let string1 = ''
        this.itemData.forEach(v => {
          if (v.show) {
            if (v.checkResult == 1) {
              yin = true
              string1 += `${v.name}(阴性);`
            }
            if (v.checkResult == 2) {
              yang = true
              string1 += `${v.name}(阳性);`
            }
          }
        })
        this.itemCheckCon = string1
        if (yin && !yang) {
          this.itemCheckYin = true
          this.itemCheckYang = false
        } else if (!yin && yang) {
          this.itemCheckYin = false
          this.itemCheckYang = true
        } else {
          this.itemCheckYin = false
          this.itemCheckYang = false
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    pathDescArr () {
      return ['吸毒检测', `${this.currentType == 1 ? '录入' : '编辑'}吸毒检测信息`]
    }
  },
  created () { },
  components: {
    Layout,
    Main,
    Footer,
    Header,
    StepStatueContent,
    PathDesc
  }
}
</script>
<style lang="less" rel="stylesheet/less">
.drugAbuseDetection {
  height: 100%;
  width: 100%;
  .listPage {
    height: 100%;
    .personInfo {
      height: 24px;
      font-size: 14px;
      color: #999999;
      font-family: PingFangSC-Regular;
      padding-left: 20px;
      box-sizing: border-box;
      > span {
        padding: 0 16px;
      }
    }
    .drugAbuseDetectionMain {
      height: 100%;
      padding: 8px !important;
      box-sizing: border-box;
      background: #f2f2f2;
      .drugAbuseDetectionInfo {
        background: #fff;
        height: 100%;
        padding: 16px 0;
        box-sizing: border-box;
        .scrollbarWrap {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          .formContant {
            width: 33.33%;
            margin: 0 auto;
            .uploadWarp {
              width: 80px;
              height: 80px;
              .uploadImg {
                width: 80px;
                height: 80px;
                text-align: center;
                line-height: 64px;
                border: 1px dashed #ddd;
                // border-style: dashed dotted
                font-size: 26px;
                color: #ccc;
                position: relative;
                > i {
                  display: inline-block;
                  width: 100%;
                  height: 26px;
                  position: relative;
                  > .el-label {
                    position: absolute;
                    display: inline-block;
                    top: 32px;
                    left: 0;
                    width: 100%;
                    font-size: 12px;
                    font-style: normal;
                  }
                }
                > img {
                  width: 100%;
                  height: 100%;
                  position: absolute;
                  top: 0;
                  left: 0;
                  z-index: 1;
                }
                .upload {
                  line-height: 32px;
                  width: 100%;
                  height: 100%;
                  padding: 12px 0;
                  box-sizing: border-box;
                  position: absolute;
                  top: 0;
                  left: 0;
                  z-index: 2;
                  background: transparent;
                  .el-button {
                    width: 96px;
                    background-color: #fff;
                    .el-button + .el-button {
                      margin-left: 0;
                    }
                  }
                  .chooseImgBtn {
                    position: relative;
                    display: inline-block;
                    font-size: 12px;
                    vertical-align: top;
                    text-align: center;
                    text-decoration: none;
                    width: 100%;
                    height: 24px;
                    line-height: 24px;
                    color: #fff;
                    cursor: pointer;
                    > i {
                      margin-right: 8px;
                      font-size: 16px;
                    }
                    .fileInput {
                      font-size: 0;
                      position: absolute;
                      top: 0;
                      left: 0;
                      width: 100%;
                      height: 100%;
                      opacity: 0;
                      .el-upload--picture-card {
                        background-color: #fbfdff;
                        border: 1px dashed #c0ccda;
                        border-radius: 6px;
                        -webkit-box-sizing: border-box;
                        box-sizing: border-box;
                        // width: 148px;
                        // height: 148px;
                        width: 100%;
                        height: 100%;
                        cursor: pointer;
                        // line-height: 146px;
                        vertical-align: top;
                      }
                    }
                    &.icon-export::before {
                      display: inline-block;
                      transform: rotate(-90deg);
                    }
                    &.icon-camera {
                      text-indent: 6px;
                      &:before {
                        position: relative;
                        left: -4px;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    .footerBtn {
      height: 48px;
      padding-top: 8px;
      box-sizing: border-box;
      text-align: center;
      border-top: 1px solid #ddd;
      > .el-button {
        min-width: 96px;
        > span {
          display: inline-block;
          width: 50%;
          text-align-last: justify;
          text-align: justify;
          text-justify: distribute-all-lines;
        }
      }
    }
    .itemContent {
      border: 1px solid #ddd;
      border-bottom: none;
      margin-top: 8px;
      .toolsbox {
        border-bottom: 1px solid #ddd;
        padding-left: 6px;
        box-sizing: border-box;
        .el-checkbox {
          &:nth-of-type(2) {
            margin-left: 4px;
          }
        }
      }
    }
    .itemRow {
      height: 32px;
      width: 100%;
      font-size: 0px;
      &:nth-of-type(2n) {
        background-color: #c0ccda4d;
      }
      .itemCol {
        display: inline-block;
        vertical-align: top;
        height: 32px;
        line-height: 30px;
        font-size: 14px;
        border-bottom: 1px solid #ddd;
        box-sizing: border-box;
        &:nth-of-type(1) {
          width: 40%;
          text-indent: 8px;
        }
        &:nth-of-type(2) {
          width: 30%;
        }
        &:nth-of-type(3) {
          width: 30%;
        }
      }
    }
  }
}
.DrugAbuseDetectionexport{
  .el-dialog__body{
    padding-top: 36px;
  }
  .tag-select-box{
    text-align: center;
  }
}
</style>
