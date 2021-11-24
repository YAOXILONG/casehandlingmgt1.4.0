/* eslint-disable no-unused-vars */
<template>
  <watermarkContent>
    <div id="returnOfGoods"
         class="returnOfGoods">
      <div class="listPage">
        <Layout>
          <Header :height="80">
            <PathDesc :path-desc-arr="pathDescArr"
                      :is-back="true"></PathDesc>
            <!-- <el-breadcrumb separator="/">
            <el-button type="iconButton"
                       icon="h-icon-arrow_left back"
                       @click="onBack"></el-button>
            <el-breadcrumb-item>物品归还</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentTypes == 1? '录入':'编辑' }}物品归还信息</el-breadcrumb-item>
          </el-breadcrumb> -->
            <div class="personInfo">
              <span>姓名：{{ currentRegisterInfo.registerName }}</span>
              <span>人员类型：{{ personTypeMap[currentRegisterInfo.personType] }}</span>
              <span v-if="sexMap[currentRegisterInfo.registerSex]">性别：{{ sexMap[currentRegisterInfo.registerSex] }}</span>
              <span v-else>性别：</span>
              <span v-if="currentRegisterInfo.registerAge">年龄：{{ currentRegisterInfo.registerAge }}岁</span>
              <span v-else>年龄：未知</span>
              <span v-show="$checkPlace">手环编号：{{ currentRegisterInfo.bandsNo }}</span>
            </div>
          </Header>
          <Main>
            <div class="returnOfGoodsMain"
                 ref="returnOfGoodsMain">
              <Layout>
                <Header :height="96">
                  <StepStatueContent :current-key="5"
                                     :step-statue="stepStatue"></StepStatueContent>
                </Header>
                <Main>
                  <div class="computedHeight"
                       id="computedHeight">
                    <div class="returnOfGoodsInfo"
                         ref="returnOfGoodsInfo"
                         :style="'height:'+ offsetHeight + 'px'">
                      <div class="returnOfGoodsInfoBox">
                        <el-scrollbar wrap-class="scrollbarWrap"
                                      view-class="scrollbarView"
                                      ref="scrollbar">
                          <div class="returnOfGoodsInfoContent"
                               ref="returnOfGoodsInfoContent">
                            <div class="returnOfGoodsInfoTable"
                                 ref="returnOfGoodsInfoTable">
                              <div class="returnOfGoodsInfoTableBox">
                                <Layout>
                                  <Header :height="42">
                                    <div class="titleContent">
                                      物品清单
                                    </div>
                                  </Header>
                                  <Main>
                                    <div class="table-tools">
                                      <el-button type="iconButton"
                                                 icon="h-icon-export"
                                                 @click="handleReturnStatus(1)">
                                        归还
                                      </el-button>
                                      <el-button type="iconButton"
                                                 icon="h-icon-export"
                                                 @click="handleReturnStatus(3)">
                                        代领
                                      </el-button>
                                      <el-button type="iconButton"
                                                 icon="h-icon-export"
                                                 @click="handleReturnStatus(2)">
                                        扣押
                                      </el-button>
                                      <el-button type="iconButton"
                                                 icon="h-icon-export"
                                                 @click="handleReturnStatus(5)">
                                        代保管
                                      </el-button>
                                      <el-button type="iconButton"
                                                 icon="h-icon-export"
                                                 @click="handleReturnStatus(6)">
                                        已邮寄
                                      </el-button>
                                      <el-button type="iconButton"
                                                 icon="h-icon-export"
                                                 @click="handleReturnStatus(7)">
                                        已移交
                                      </el-button>
                                      <template v-if="cabinetType == 1">
                                      <el-button type="primary"
                                                 class="openStorage"
                                                 @click="handleOpen(1)">
                                        打开反面
                                      </el-button>
                                      <el-button
                                        type="primary"
                                        class="openStorage"
                                        @click="handleOpen(0)"
                                      >
                                        打开正面
                                      </el-button>
                                      </template>
                                      <template v-if="cabinetType == 0">
                                      <el-button type="primary"
                                                 class="openStorage"
                                                 @click="handleOpen">
                                        开柜
                                      </el-button>
                                      </template>

                                    </div>
                                    <div class="table-container">
                                      <div class="tabele-box">
                                        <el-table :data="goodsInfoList"
                                                  stripe
                                                  tooltip-effect="dark"
                                                  force-scroll
                                                  :height="tableHeight"
                                                  class="returnTable"
                                                  res="returnTable"
                                                  @selection-change="handleSelectionChange">
                                          <el-table-column type="selection"></el-table-column>
                                          <el-table-column label="序号"
                                                           type="index"
                                                           width="80"></el-table-column>
                                          <el-table-column label="物品名称"
                                                           show-overflow-title
                                                           prop="goodsName"></el-table-column>
                                          <el-table-column label="数量"
                                                           prop="stockNum"
                                                           show-overflow-title></el-table-column>
                                          <el-table-column label="单位"
                                                           show-overflow-title
                                                           prop="goodsUnit"></el-table-column>

                                          <el-table-column label="保管措施"
                                                           show-overflow-title>
                                            <template slot-scope="scope">
                                              <span v-if="scope.row.keepType === 1">扣押</span>
                                              <span v-if="scope.row.keepType === 2">暂存</span>
                                              <span v-if="scope.row.keepType === 3">代保管</span>
                                            </template>
                                          </el-table-column>
                                          <el-table-column label="涉案物品"
                                                           show-overflow-title>
                                            <template slot-scope="scope">
                                              <span v-if="scope.row.goodsType === 1">否</span>
                                              <span v-if="scope.row.goodsType === 0">是</span>
                                            </template>
                                          </el-table-column>
                                          <el-table-column label="物品描述"
                                                           show-overflow-title
                                                           prop="goodsDesc"></el-table-column>
                                          <el-table-column label="保管柜号"
                                                           show-overflow-title
                                                           prop="boxName"></el-table-column>
                                          <el-table-column label="处理状态"
                                                           show-overflow-title>
                                            <template slot-scope="scope">
                                              <span class="returnStatusColor"
                                                    v-if="scope.row.returnStatus"
                                                    :style="returnStatusList[scope.row.returnStatus].color"></span>
                                              <span class="returnStatusColor"
                                                    v-if="!scope.row.returnStatus"
                                                    style="background: #FFCC00;"></span>
                                              <span class="returnStatusLabel"
                                                    v-if="scope.row.returnStatus">{{ returnStatusList[scope.row.returnStatus].label }}</span>
                                              <span class="returnStatusLabel"
                                                    v-if="!scope.row.returnStatus">{{ returnStatusList[scope.row.returnStatus].label }}</span>
                                            </template>
                                          </el-table-column>
                                          <el-table-column label="存入照片"
                                                           show-overflow-title>
                                            <template slot-scope="scope">
                                              <span class="operationBtn operationPhoto"
                                                    :title="scope.row.goodsPhoto"
                                                    @click="handleShowPhoto('存入照片',scope.row.goodsPhoto)">{{ scope.row.goodsPhoto }}</span>
                                            </template>
                                          </el-table-column>
                                          <el-table-column label="归还照片"
                                                           show-overflow-title>
                                            <template slot-scope="scope">
                                              <span class="operationBtn goodsPhoto operationPhoto"
                                                    v-if="scope.row.goodsPhoto2"
                                                    :title="scope.row.goodsPhoto2"
                                                    @click.stop.prevent="handleShowPhoto('归还照片',scope.row.goodsPhoto2)">
                                                {{ scope.row.goodsPhoto2 }}
                                                <i class="canDelete h-icon-close"
                                                   title="删除"
                                                   @click.stop.prevent="handleDeleteShowPhoto(scope)"></i>
                                              </span>
                                            </template>
                                          </el-table-column>
                                          <el-table-column label="操作">
                                            <template slot-scope="scope">
                                              <span title="抓拍"
                                                    v-show="!scope.row.goodsPhoto2"
                                                    class="operationBtn"
                                                    @click="onSnap(scope.$index)">抓拍</span>
                                              <span title="重新抓拍"
                                                    v-show="scope.row.goodsPhoto2"
                                                    class="operationBtn"
                                                    @click="onSnap(scope.$index)">重新抓拍</span>
                                            </template>
                                          </el-table-column>
                                        </el-table>
                                      </div>
                                    </div>
                                  </Main>
                                </Layout>
                              </div>
                            </div>
                            <div class="returnOfGoodsInfoAutograph"
                                 ref="returnOfGoodsInfoAutograph">
                              <div class="returnOfGoodsInfoAutographBox">
                                <Layout>
                                  <Header :height="42">
                                    <div class="titleContent">
                                      电子签名
                                    </div>
                                  </Header>
                                  <Main>
                                    <signItem :item-width="388"
                                              sign-item-top-label="领取人"
                                              @handleCollection="handleCollection"
                                              :sign-text="signObj.personSign"></signItem>
                                  </Main>
                                </Layout>
                              </div>
                            </div>
                          </div>
                        </el-scrollbar>
                      </div>
                      <div class="returnOfGoodsInfoBtn">
                        <div class="footerBtn">
                          <el-button type="primary"
                                     @click="handleSubmite">
                            保存
                          </el-button>
                          <el-button @click="onBack">
                            取消
                          </el-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Main>
              </Layout>
            </div>
          </Main>
        </Layout>
      </div>
      <ShowPhoto :dialog-visible="dialogVisible"
                 :img-url="imgUrl"
                 @closeShowPhoto="handleCloseShowPhoto"
                 :dialog-visible-title="dialogVisibleTitle"></ShowPhoto>
    </div>
  </watermarkContent>
</template>
<script>
import Layout, { Main, Header } from '../../components/Layout/index'
import server from '../../server/returnOfGoods'
import SignItem from '../../components/SignItem/SignItem'
import StepStatueContent from '../../components/StepStatueContent/index'
import ShowPhoto from '../../components/ShowPhoto/index'
import PathDesc from './components/PathDesc'
export default {
  name: 'ReturnOfGoods',
  data () {
    return {
      pathDescArr: ['物品归还', `${this.currentTypes == 1 ? '录入' : '编辑'}物品归还信息`],
      currentTypes: 1,
      stepStatue: [0, 0, 0, 0, 0],
      managerType: 2, // 管理类型（1：存放物品；2：归还物品；3：临时领取；4：临时领取物品归还）
      // 归还状态（0：待领取；1：已归还；2：已扣押；3：已代领;5：已代保管）
      currentRegisterInfo: {
        registerName: '',
        bandsNo: '',
        registerSex: '',
        registerAge: '',
        personType: '',
        registerId: null,
        areaCode: ''
      },
      goodsInfoList: [],
      signObj: {
        managerSign: {
          type: 'managerSign',
          data: '',
          fileUrl: '',
          fileName: ''
        },
        policeSign: {
          type: 'policeSign',
          data: '',
          fileUrl: '',
          fileName: ''
        },
        personSign: {
          type: 'personSign',
          data: '',
          fileUrl: '',
          fileName: ''
        },
        registerId: null,
        managerType: 2,
        roomCode: '',
        outType: 0,
        goodsManagerId: null
      },
      tableHeight: '160',
      returnStatusList: [
        {
          color: 'background: #FFCC00;',
          label: '待领取'
        },
        {
          color: 'background: #3BCD8D;',
          label: '已归还'
        },
        {
          color: 'background: #FE5332;',
          label: '已扣押'
        },
        {
          color: 'background: #39B2FF;',
          label: '已代领'
        }, {}, {
          color: 'background: #FFA939;',
          label: '已代保管'
        }, {
          color: 'background: #39B2FF;',
          label: '已邮寄'
        }, {
          color: 'background: #39B2FF;',
          label: '已移交'
        }
      ],
      dialogVisible: false,
      imgUrl: '',
      dialogVisibleTitle: '',
      initFooterStyle: '',
      offsetHeight: 0,
      currentHeight: 0,
      multipleSelection: [],
      personTypeMap: {},
      sexMap: {},
      websock: null,
      webSocketData: {
        type: '',
        data: {}
      },
      currentType: '',
      currentPhoto: null,
      cabinetType:'-1',//0是单面柜，返回1是双面柜
    }
  },
  mixins: [],
  methods: {
    async findGoods () {
      let params = {
        registerId: this.currentRegisterInfo.registerId
      }
      let res = await server.findGoods(params)
      if (res.data.code === '0') {
        let data = res.data.data
        if (data && data.length) {
          this.goodsInfoList = JSON.parse(JSON.stringify(data))
        } else {
          this.goodsInfoList = []
        }
        this.initFooter()
      } else {
        this.$messagebox(res)
      }
    },
    // 获取签名
    async findGoodsManagerInfo () {
      let params = {
        registerId: this.currentRegisterInfo.registerId,
        managerType: 2
      }
      let res = await server.findGoodsManagerInfo(params)
      if (res.data.code === '0') {
        let data = res.data.data
        if (data) {
          this.signObj = {
            registerId: this.currentRegisterInfo.registerId,
            managerType: this.managerType,
            goodsManagerId: data.goodsManagerId,
            roomCode: data.roomCode || '',
            outType: 0,
            managerSign: {
              type: 'managerSign',
              data: data.managerSignPhotoUrl || '',
              fileUrl: data.managerSignPhotoUrl || '',
              fileName: data.managerSign || ''
            },
            policeSign: {
              type: 'policeSign',
              data: data.policeSignPhotoUrl || '',
              fileUrl: data.policeSignPhotoUrl || '',
              fileName: data.policeSign || ''
            },
            personSign: {
              type: 'personSign',
              data: data.receiptorSignPhotoUrl || '',
              fileUrl: data.receiptorSignPhotoUrl || '',
              fileName: data.receiptorSign || ''
            }
          }
        }
      } else {
        this.$messagebox(res)
      }
    },
    // 获取人员信息
    async findRegisterInfo () {
      let params = {
        registerId: this.currentRegisterInfo.registerId
      }
      let res = await server.findRegisterInfo(params)
      if (res.data.code === '0') {
        let data = res.data.data
        if (data) {
          this.currentRegisterInfo = {
            registerName: data.registerName,
            bandsNo: data.bandsNo,
            registerSex: data.registerSex,
            registerAge: data.registerAge,
            registerId: data.registerId,
            personType: data.personType,
            areaCode: data.areaCode
          }
          this.stepStatue = [
            data.doBodyCheck,
            data.doGoodsStorage,
            data.doCollected,
            data.doDrugCheck,
            data.doGoodsReturn
          ]
        }
      } else {
        this.$messagebox(res)
      }
    },
    // 归还/ 代领/ 扣押
    handleReturnStatus (statue) {
      if (!this.multipleSelection.length) {
        this.$message({
          message: '请先勾选',
          type: 'warning'
        })
      }
      // goodsInfoList
      let list = JSON.parse(JSON.stringify(this.goodsInfoList))
      let selectList = JSON.parse(JSON.stringify(this.multipleSelection))
      for (let j = 0; j < selectList.length; j++) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].goodsId === selectList[j].goodsId) {
            list[i].returnStatus = Number(statue)
            break
          }
        }
      }
      this.goodsInfoList = JSON.parse(JSON.stringify(list))
      this.multipleSelection = []
    },
    // 开柜
    async handleOpen (type) {
      let loadingInstance = this.$loading({
        fullscreen: true,
        text: '开柜中，请稍后'
      })
      try {
        let params = {
          registerId: this.currentRegisterInfo.registerId,
          doorOpenType : type
        }
        const data = await server.goodsBackOpenDoor(params)
        if (data.data.code === '0') {
          loadingInstance.close()
          this.findGoods()
          setTimeout(() => {
            this.$message({
              type: 'success',
              message: '开柜成功'
            })
          }, 300)
        } else {
          loadingInstance.close()
          setTimeout(() => {
            this.$messagebox(data)
          }, 500)
        }
      } catch {
        setTimeout(() => {
          loadingInstance.close()
        }, 500)
      }
    },
    async handleSubmite () {
      let _data = {
        registerId: this.signObj.registerId,
        managerType: this.signObj.managerType,
        goodsManagerId: this.signObj.goodsManagerId,
        roomCode: this.signObj.roomCode,
        outType: this.signObj.outType,
        managerSign: this.signObj.managerSign.fileName,
        policeSign: this.signObj.policeSign.fileName,
        receiptorSign: this.signObj.personSign.fileName
      }
      let params = {
        goodsManagerInfo: _data,
        goodsStockInfoList: JSON.parse(JSON.stringify(this.goodsInfoList))
      }
      let loadingInstance = this.$loading({
        fullscreen: true,
        text: '保存中...'
      })
      try {
        const data = await server.saveBackGoods(params)
        if (data.data.code === '0') {
          loadingInstance.close()
          this.$message.success('保存成功')
          this.onBack()
        } else {
          loadingInstance.close()
          setTimeout(() => {
            this.$messagebox(data)
          }, 300)
        }
      } catch {
        setTimeout(() => {
          loadingInstance.close()
        }, 500)
      }
    },
    handleDeleteShowPhoto (row) {
      let index = row.$index
      let item = row.row
      item.goodsPhoto2 = ''
      this.goodsInfoList[index] = JSON.parse(JSON.stringify(item))
    },
    handleShowPhoto (title, url) {
      this.imgUrl = url
      this.dialogVisibleTitle = title
      this.dialogVisible = true
    },
    handleCloseShowPhoto (res) {
      let bloon = !!res
      this.imgUrl = ''
      this.dialogVisible = bloon
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 采集
    handleCollection (type) {
      let hikUrl = `btoolsprotocol://CenterUrl:${this.$centerUrl};Toollist:PROT_BToolCardReaderProtocol;CmdLine:BToolCardReaderProtocol://MethodType:1`
      this.currentType = type
      this.signObj.personSign.data = ''
      this.signObj.personSign.fileUrl = ''
      this.signObj.personSign.fileName = ''
      this.webSocketConnect(hikUrl, type, 'BToolCardReaderProtocol')
    },
    // 抓拍
    async onSnap (index) {
      let _self = this
      let params = {
        roomType:'roomType.3009',
        cameraMarks: 'roomType.3009',
        areaCode: this.currentRegisterInfo.areaCode
      }
      const ress = await server.findCameraCaptureInfo(params)
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
          case 'highMeter': // ③高拍仪模式
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
              context
            break
        }
        _self.currentPhoto = index
        _self.webSocketConnect(hikUrl, 'photo', 'imagecaptureprotocol')
      } else {
        this.$messagebox(ress)
      }
    },
    webSocketConnect (webMsg, _type, content) {
      let _self = this
      // 参数
      // let sendMsg = webMsg //'{"comment":{"commenttype":"startapp", "context":"noteFormatClientprotocol", "commentcmd":"noteFormatClientprotocol://nginxIP:' + webMsg.nginxIp + ';nginxport:' + webMsg.nginxPort + ';sg:' + webMsg.sg + ';protocol:' + webMsg.protocol + ';componentID:' + webMsg.componentId + ';servicetype:' + webMsg.serviceType + ';noteTemplateId:' + webMsg.id + ';language:' + webMsg.language + ';"}}'
      let sendMsg =
        '{"comment":{"commenttype":"startapp", "context":"btoolsprotocol", "commentcmd":"' +
        webMsg +
        ';"}}'
      let socketHost =
        window.location.protocol.indexOf('https') > -1
          ? 'wss://127.0.0.1:18001/WebS_Js'
          : 'ws://127.0.0.1:18000/WebS_Js'
      try {
        if (!_self.websock) {
          _self.websock = new WebSocket(socketHost)
          _self.websock.onopen = function () {
            // 发送检测插件助手是否安装请求
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
          if (
            _data &&
            _data.comment &&
            _data.comment.commenttype === 'checkapp'
          ) {
            // 检测插件助手是否安装
            if (_data.comment.resultCode === '1') {
              // 模板笔录编辑
              let jsonObj = sendMsg
              _self.websock.send(jsonObj)
            } else {
              _self.$message('检测到您未安装插件助手')
            }
          } else if (_data && _data.Code === 0 && _data.Result) {
            if (_data.Result.Data && _data.Result.Data.ImgData) {
              let base64Str = _data.Result.Data.ImgData
              let res = await server.uploadbase64({ base64Str })
              if (res && res.data && res.data.code === '0') {
                _self.webSocketData = {
                  type: _type,
                  fileUrl: res.data.data.fileUrl,
                  fileName: res.data.data.fileName
                }
              } else {
                this.$messagebox(res)
                // this.$message.error(this.$t(res.data.code))
              }
            }
          } else {
            if (_data.fileUrl && _data.fileName) {
              _self.webSocketData = {
                type: _type,
                fileUrl: _data.fileUrl,
                fileName: _data.fileName
              }
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
    onBack () {
      this.$router.push({ path: '/', query: {} })
    },
    initFooter () {
      let el = document.querySelector('.computedHeight')
      if (!el) {
        return false
      }
      let _height = this.currentHeight
      let _height1 = (this.goodsInfoList.length + 1) * 40 + 32
      try {
        this.tableHeight = _height1 > 160 ? _height1 + '' : '160'
      } catch {
        this.tableHeight = '160'
      }
      let $height = Number(this.tableHeight)
      if (_height >= $height + 400) {
        this.offsetHeight = $height + 400
      } else {
        this.offsetHeight = _height
      }
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
    async getCabinetType(){
      let params = {
        registerId : this.$route.query.id
      }
      let res = await server.getCabinetType(params)
      if (res.data.code === '0') {
        this.cabinetType = res.data.data
      } else {
        this.$messagebox(res)
      }
    }
  },
  created () { },
  mounted () {
    this.inqDict()
    this.getCabinetType()
    this.currentRegisterInfo.registerId = this.$route.query.id
    this.signObj.registerId = this.$route.query.id || 0
    this.currentTypes = this.$route.query.type || ''
    this.findGoods()
    this.findGoodsManagerInfo()
    this.findRegisterInfo()
    let el = document.querySelector('.computedHeight')
    if (!el) {
      return false
    } else {
      this.currentHeight = el.offsetHeight
    }
    this.$nextTick(() => {
      this.initFooter()
    })
    window.addEventListener('resize', () => {
      let el = document.querySelector('.computedHeight')
      if (!el) {
        return false
      } else {
        this.currentHeight = el.offsetHeight
      }
      this.initFooter()
    })
  },
  watch: {
    webSocketData: {
      handler: function (newVal, oldVal) {
        if (newVal.type) {
          let data = JSON.parse(JSON.stringify(newVal))
          if (newVal.type === this.currentType) {
            this.signObj.personSign.data = data.fileUrl
            this.signObj.personSign.fileUrl = data.fileUrl || ''
            this.signObj.personSign.fileName = data.fileName || ''
          }
          if (newVal.type === 'photo') {
            let list = JSON.parse(JSON.stringify(this.goodsInfoList))
            if (list[this.currentPhoto]) {
              list[this.currentPhoto]['goodsPhoto2'] = data.fileName
            }
            this.goodsInfoList = JSON.parse(JSON.stringify(list))
          }
          this.currentType = ''
          this.currentPhoto = null
          this.webSocketData = {
            type: '',
            data: '',
            fileUrl: '',
            fileName: ''
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  components: {
    Layout,
    Main,
    Header,
    SignItem,
    StepStatueContent,
    ShowPhoto,
    PathDesc
  }
}
</script>
<style lang="less" rel="stylesheet/less">
.returnOfGoods {
  height: 100%;
  width: 100%;
  .listPage {
    height: 100%;
    .back {
      cursor: pointer;
    }
    .personInfo {
      height: 24px;
      font-size: 14px;
      color: #999999;
      font-family: PingFangSC-Regular;
      padding-left: 24px;
      box-sizing: border-box;
      > span {
        padding: 0 16px;
      }
    }
    .returnOfGoodsMain {
      height: 100%;
      padding: 8px !important;
      box-sizing: border-box;
      background: #f2f2f2;
      .computedHeight {
        height: 100%;
        width: 100%;
      }
      .returnOfGoodsInfo {
        height: 100%;
        padding-bottom: 48px;
        box-sizing: border-box;
        position: relative;
        .returnOfGoodsInfoBox {
          width: 100%;
          height: 100%;
        }
        .returnOfGoodsInfoBtn {
          height: 48px;
          background: #fff;
          position: absolute;
          bottom: 0;
          width: 100%;
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
        }
        .scrollbarWrap {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          .returnOfGoodsInfoContent {
            height: auto;
            position: static;
            .titleContent {
              height: 42px;
              padding-left: 16px;
              line-height: 42px;
              border-bottom: 1px solid #ccc;
              box-sizing: border-box;
              font-size: 14px;
            }
            .returnOfGoodsInfoTable {
              height: auto;
              padding-bottom: 8px;
              box-sizing: border-box;
              background: #f2f2f2;
              .returnOfGoodsInfoTableBox {
                height: 100%;
                background: #fff;
                .ea-main {
                  padding: 0 16px !important;
                  box-sizing: border-box;
                  .table-tools {
                    height: 48px;
                    padding: 8px 0 8px 8px;
                    box-sizing: border-box;
                    .openStorage {
                      width: 72px;
                      float: right;
                    }
                  }
                  .table-container {
                    .tabele-box {
                      position: relative;
                      .returnTable {
                        height: auto;
                        border-left: none;
                        border-right: none;
                        &.el-table .el-table__body-wrapper:before,
                        &.el-table:after,
                        &.el-table:before {
                          background-color: transparent;
                        }
                        .returnStatusColor {
                          width: 8px;
                          height: 8px;
                          display: inline-block;
                          border-radius: 4px;
                          margin-right: 4px;
                        }
                        .operationBtn {
                          display: inline-block;
                          padding: 0 8px;
                          font-family: PingFangSC-Regular;
                          font-size: 12px;
                          color: #2080f7;
                          letter-spacing: 0;
                          line-height: 32px;
                          height: 100%;
                          cursor: pointer;
                          &.goodsPhoto {
                            width: 100%;
                            height: 26px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            padding-right: 16px;
                            box-sizing: border-box;
                            .canDelete {
                              display: none;
                            }
                          }
                          &.operationPhoto{
                            width: 100%;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                          }
                        }
                        .operationBtn:hover {
                          display: inline-block;
                          width: 100%;
                          padding: 0 8px;
                          font-family: PingFangSC-Regular;
                          font-size: 12px;
                          color: #2080f7;
                          letter-spacing: 0;
                          line-height: 32px;
                          height: 100%;

                          cursor: pointer;
                          &.goodsPhoto {
                            width: 100%;
                            height: 26px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            padding-right: 16px;
                            box-sizing: border-box;
                            position: relative;
                            background: rgba(61, 61, 61, 0.2);
                            .canDelete {
                              display: inline;
                              position: absolute;
                              color: #fff;
                              font-weight: bold;
                              right: 2px;
                              top: 10px;
                              z-index: 2;
                            }
                          }
                          &.operationPhoto{
                            width: 100%;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                          }
                        }
                      }
                      .cell{
                        min-height: 32px;
                      }
                    }
                  }
                }
              }
            }
            .returnOfGoodsInfoAutograph {
              height: 254px;
              box-sizing: border-box;
              background: #f2f2f2;

              .returnOfGoodsInfoAutographBox {
                height: 100%;
                background: #fff;
              }
            }
          }
        }
      }
    }
  }
  .el-dialog.alertMsgDialog {
    .el-dialog__header {
      border-bottom: none;
    }
    .el-dialog__body {
      .alertMsg {
        color: #2080f7;
        font-size: 36px;
        position: relative;
        top: 8px;
        margin-right: 16px;
      }
    }
    .el-dialog__footer {
      background-color: transparent;
    }
  }
}
</style>
