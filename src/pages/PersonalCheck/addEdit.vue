<template>
  <watermarkContent>
    <div class="add-edit-from-box personal-check-add-edit full">
      <PathDesc
        :path-desc-arr="[
          '人身检查',
          `${detailData.checkId ? '编辑' : '录入'}人身信息`,
        ]"
        :is-back="true"
      ></PathDesc>
      <div class="title-detail-box">
        <span class="title-detail-item"
          >姓名：{{ detailData.registerName }}</span
        >
        <span class="title-detail-item"
          >人员类型：{{ detailData.personTypeName }}</span
        >
        <span class="title-detail-item"
          >性别：
          <template v-for="item in dictData.sex">
            {{ item.key == detailData.registerSex ? item.name : '' }}
          </template>
        </span>

        <span class="title-detail-item" v-if="detailData.registerAge"
          >年龄：{{ detailData.registerAge }} 岁</span
        >
        <span class="title-detail-item" v-else>年龄：未知</span>
        <span class="title-detail-item" v-if="$checkPlace"
          >手环编号：{{ detailData.bandsNo }}</span
        >
      </div>
      <div class="add-edit-from-back" v-loading="formLoading">
        <StepStatueContent
          :step-statue="[
            1,
            2,
            this.detailData.doGoodsStorage,
            this.detailData.doCollected,
            this.detailData.doDrugCheck,
            this.detailData.doGoodsReturn,
            0,
          ]"
        ></StepStatueContent>
        <div class="scroll-box">
          <el-scrollbar wrap-class="el-scrollbar__wrap">
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-position="top"
            >
              <div class="form-title">
                <span class="desc1">检查信息</span>
              </div>
              <div class="check-content-box">
                <div class="readme-check-box">
                  <div class="readme-info-text">
                    <el-form-item label="自述状况" prop="selfContent">
                      <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="无既往病史、无饮酒、未患有传染性等疾病；"
                        v-model="ruleForm.selfContent"
                        class="check-content-textarea"
                        resize="none"
                      >
                      </el-input>
                    </el-form-item>
                  </div>
                  <div class="check-info-text">
                    <el-form-item label="检查情况" prop="checkContent">
                      <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="体表无伤痕、无饮酒、全身检查情况正常；"
                        v-model="ruleForm.checkContent"
                        class="check-content-textarea"
                        resize="none"
                      >
                      </el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="check-btn-box">
                  <el-button type="primary" size="mini" @click="makeCheckInfo">
                    生成检查信息
                  </el-button>
                </div>
                <div class="front-img-warp">
                  <el-alert
                    title="鼠标点击背景人体图任意点进行人体标记"
                    type="info"
                    simple
                    show-icon
                  ></el-alert>
                  <div class="front-img-warp-con">
                    <div class="front-img-box">
                      <canvas
                        id="front_img_canvas"
                        width="169"
                        height="313"
                        @click="
                          (e) => {
                            personTag(e, 'front')
                          }
                        "
                      ></canvas>
                    </div>
                    <div class="front-desc-box">
                      <el-scrollbar>
                        <template v-for="(item, index) in tagInfoList">
                          <div
                            class="sign-item"
                            :key="index"
                            v-if="item.tagType == 0"
                          >
                            <div class="sign-item-ctrl">
                              <i
                                class="h-icon-edit"
                                @click="signItemUpdate(item)"
                              ></i>
                              <i
                                class="h-icon-delete"
                                @click="signItemDel(item)"
                              ></i>
                            </div>
                            <div class="sign-desc-box">
                              <span class="sign-icon">{{ item.num }}</span>
                              <div
                                class="desc-length-ctrl"
                                v-if="item.description"
                                :title="item.description"
                              >
                                {{ $substring(item.description, 47) }}
                              </div>
                            </div>
                            <div class="sign-pic-box">
                              <img
                                v-if="item.picture1Str"
                                :src="item.picture1Str"
                                alt=""
                                class="sign-pic-item"
                                @click="bigPicHandle(item.picture1Str)"
                              />
                              <img
                                v-if="item.picture2Str"
                                :src="item.picture2Str"
                                alt=""
                                class="sign-pic-item"
                                @click="bigPicHandle(item.picture2Str)"
                              />
                              <img
                                v-if="item.picture3Str"
                                :src="item.picture3Str"
                                alt=""
                                class="sign-pic-item"
                                @click="bigPicHandle(item.picture3Str)"
                              />
                            </div>
                          </div>
                        </template>
                      </el-scrollbar>
                    </div>
                    <div class="back-img-box">
                      <canvas
                        id="back_img_canvas"
                        width="169"
                        height="313"
                        @click="
                          (e) => {
                            personTag(e, 'back')
                          }
                        "
                      ></canvas>
                    </div>
                    <div class="back-desc-box">
                      <el-scrollbar>
                        <template v-for="(item, index) in tagInfoList">
                          <div
                            class="sign-item"
                            :key="index"
                            v-if="item.tagType == 1"
                          >
                            <div class="sign-item-ctrl">
                              <i
                                class="h-icon-edit"
                                @click="signItemUpdate(item)"
                              ></i>
                              <i
                                class="h-icon-delete"
                                @click="signItemDel(item)"
                              ></i>
                            </div>
                            <div class="sign-desc-box">
                              <span class="sign-icon">{{ item.num }}</span>
                              <div
                                class="desc-length-ctrl"
                                v-if="item.description"
                                :title="item.description"
                              >
                                {{ $substring(item.description, 47) }}
                              </div>
                            </div>
                            <div class="sign-pic-box">
                              <img
                                v-if="item.picture1Str"
                                :src="item.picture1Str"
                                alt=""
                                class="sign-pic-item"
                                @click="bigPicHandle(item.picture1Str)"
                              />
                              <img
                                v-if="item.picture2Str"
                                :src="item.picture2Str"
                                alt=""
                                class="sign-pic-item"
                                @click="bigPicHandle(item.picture2Str)"
                              />
                              <img
                                v-if="item.picture3Str"
                                :src="item.picture3Str"
                                alt=""
                                class="sign-pic-item"
                                @click="bigPicHandle(item.picture3Str)"
                              />
                            </div>
                          </div>
                        </template>
                      </el-scrollbar>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-title">
                <span class="desc1">电子签名</span>
              </div>
              <div style="height: 206px; overflow: hidden">
                <el-row :gutter="10" class="sign-box">
                  <el-col :span="7">
                    <div class="sign-lable">
                      <span>检查民警</span>
                    </div>
                    <div class="sign-ctrl-box">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="signHandle('policeSign')"
                      >
                        开始采集
                      </el-button>
                      <div class="sign-area-box">
                        <img :src="policeSign" v-show="policeSign" alt="" />
                        <span class="tip"> 签字处 </span>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="7">
                    <div class="sign-lable">
                      <span>见证人</span>
                    </div>
                    <div class="sign-ctrl-box">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="signHandle('witnessSign')"
                      >
                        开始采集
                      </el-button>
                      <div class="sign-area-box">
                        <img :src="witnessSign" v-show="witnessSign" alt="" />
                        <span class="tip"> 签字处 </span>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="10">
                    <div class="sign-lable">
                      <span>被检查人/监护人</span>
                    </div>
                    <div class="sign-ctrl-box">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="signHandle('personSign')"
                      >
                        开始采集
                      </el-button>
                      <div class="sign-area-box">
                        <img :src="personSign" v-show="personSign" alt="" />
                        <span class="tip"> 签字处/指纹 </span>
                      </div>
                    </div>
                    <!-- <div class="sign-ctrl-box">
                  <el-button
                    type="primary"
                    size="mini"
                  >
                    开始采集
                  </el-button>
                  <div class="sign-area-box mini">
                    <img
                      src="../../assets/image/123.jpg"
                      alt=""
                    >
                    <span class="tip">
                      指纹
                    </span>
                  </div>
                </div> -->
                  </el-col>
                </el-row>
              </div>
            </el-form>
          </el-scrollbar>
        </div>
      </div>
      <div class="form-btns">
        <el-button
          class="add-edit-btn"
          type="primary"
          @click="submitForm('ruleForm')"
        >
          保存
        </el-button>
        <el-button class="add-edit-btn" @click="goBack"> 取消 </el-button>
      </div>
      <el-dialog
        title="检查信息"
        :visible.sync="dialogVisible"
        :area="600"
        class="description-pic-dialog"
        :before-close="signCancelHandle"
      >
        <div>
          <!-- <div class="dialog-title">
          症状描述
        </div> -->
          <el-form
            :model="tagItem"
            :rules="rules"
            ref="dialogForm"
            label-width="100px"
            label-position="top"
          >
            <el-form-item label="检查情况描述" prop="description">
              <el-input
                type="textarea"
                resize="none"
                :rows="4"
                placeholder="请输入内容"
                v-model="tagItem.description"
                :maxlength="100"
              >
              </el-input>
            </el-form-item>
          </el-form>

          <div class="pic-item" v-if="tagItem.picture1Str">
            <img :src="tagItem.picture1Str" alt="" />
            <div class="del-back">
              <i class="h-icon-delete" @click="itemPicDel(1)"></i>
            </div>
          </div>
          <div class="pic-item" v-if="tagItem.picture2Str">
            <img :src="tagItem.picture2Str" alt="" />
            <div class="del-back">
              <i class="h-icon-delete" @click="itemPicDel(2)"></i>
            </div>
          </div>
          <div class="pic-item" v-if="tagItem.picture3Str">
            <img :src="tagItem.picture3Str" alt="" />
            <div class="del-back">
              <i class="h-icon-delete" @click="itemPicDel(3)"></i>
            </div>
          </div>
          <div
            class="pic-item"
            v-if="
              !(
                tagItem.picture1Str &&
                tagItem.picture2Str &&
                tagItem.picture3Str
              )
            "
          >
            <div class="upload-btn">
              <i class="h-icon-add"></i>
              <div class="upload-back">
                <el-upload
                  :action="`/person/uploadFile.do`"
                  list-type="text"
                  accept="image/jpg,image/jpeg,image/jpg"
                  :http-request="uploadFile"
                  :multiple="false"
                  :show-file-list="false"
                >
                  <div class="upload-pic">
                    <!-- h-icon-upload -->
                    <i class="icon-export"></i>
                    上传
                  </div>
                </el-upload>
                <div @click.stop="connectCatchPhoto" class="catch-pic">
                  <i class="icon-camera"></i>
                  抓拍
                </div>
              </div>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="signSureHandle">确 定</el-button>
          <el-button @click="signCancelHandle">取 消</el-button>
        </span>
      </el-dialog>

      <el-dialog
        :visible.sync="bigPicDialog"
        size="small"
        class="big-pic-dialog"
        top="middle"
      >
        <div class="big-pic-box">
          <img class="big-pic-item" :src="bigPicSrc" alt="" />
        </div>
      </el-dialog>
    </div>
  </watermarkContent>
</template>
<script>
import PathDesc from './components/PathDesc'
import server from '../../server/personalCheck'
import StepStatueContent from '../../components/StepStatueContent/StepStatueContent'

export default {
  name: 'PersonalCheckAddEdit',
  data() {
    let queryParam = this.$route.query
    var checkSpCode = (rule, value, callback) => {
      if (/['/\\:*?""<>|]/g.test(value)) {
        callback(new Error('不能包含 \' / \\ : * ? " < > | 这些特殊字符'))
      } else {
        callback()
      }
    }

    return {
      socket: null,
      bigPicDialog: false,
      dialogVisible: false,
      formLoading: false,
      // pathDescArr: ['人身检查', `${queryParam.id ? '编辑' : '录入'}人身信息`],
      queryParam: queryParam,
      detailData: {},
      signBox: 'policeSign',
      policeSign: '',
      witnessSign: '',
      personSign: '',
      policeSignKey: '',
      witnessSignKey: '',
      personSignKey: '',
      ruleForm: {
        selfContent: '无既往病史、无饮酒、未患有传染性等疾病；',
        checkContent: '体表无伤痕、无饮酒、全身检查情况正常；',
      },
      rules: {
        selfContent: [
          { required: true, message: '请输入', trigger: 'change,blur' },
        ],
        checkContent: [
          { required: true, message: '请输入', trigger: 'change,blur' },
        ],
        description: [{ validator: checkSpCode, trigger: 'change,blur' }],
      },
      frontCanvas: null,
      backCanvas: null,
      frontImgUrl: require('../../assets/image/body_facade.jpg'),
      backImgUrl: require('../../assets/image/body_back.jpg'),
      tagInfoList: [],
      tagItem: {
        tagType: 0,
        xAxis: 0,
        yAxis: 0,
        num: 0,
        description: '',
        picture1: '',
        picture1Str: '',
        picture2: '',
        picture2Str: '',
        picture3: '',
        picture3Str: '',
      },
      bigPicSrc: '',
      tagPicAlert: true,
      dictData: {
        sex: [],
      },
    }
  },
  mounted() {
    this.inqDict()
    this.drawReset()
    this.getBodyCheckVo()
  },
  methods: {
    // 连接btools工具
    connectSocket(callback) {
      let socketHost =
        window.location.protocol.indexOf('https') > -1
          ? 'wss://127.0.0.1:18001/WebS_Js'
          : 'ws://127.0.0.1:18000/WebS_Js'
      try {
        this.socket = new WebSocket(socketHost)
        this.socket.onopen = () => {
          // 发送检测插件助手是否安装请求
          let jsonObj =
            '{"comment":{"commenttype":"checkapp", "context":"btoolsprotocol"}}'
          this.socket.send(jsonObj)
        }
        this.socket.onerror = () => {
          // 连接失败，通信中间件未安装
          this.$message('检测到您未安装插件助手')
        }
        this.socket.onmessage = async (data) => {
          let _data = JSON.parse(data.data)
          console.log(_data)
          if (
            _data &&
            _data.comment &&
            _data.comment.commenttype === 'checkapp'
          ) {
            // 检测插件助手是否安装
            if (_data.comment.resultCode === '1') {
              if (callback) {
                callback()
              }
            } else {
              // this.socket = null
              this.$message('检测到您未安装插件助手')
            }
          } else {
            this.catchPhotoDataCtrl(_data)
            this.signToolDataCtrl(_data)
          }
        }
        this.socket.onclose = () => {
          console.log(this.socket.readyState)
          this.socket = null
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 连接图片抓拍工具
    async connectCatchPhoto() {
      if (this.socket && this.socket.readyState === 1) {
        const result = await server.findCameraCaptureInfo({
          roomType: 'roomType.3006',
          cameraMarks: 'roomType.3006',
          areaCode: this.detailData.areaCode,
        })
        const { data } = result
        if (data.code === '0') {
          let _data = data.data
          let faceMode = 0
          let jsonObj = `{"comment":{"commenttype":"startapp", "context":"btoolsprotocol:", "commentcmd":"btoolsprotocol://CenterUrl:${
            this.$centerUrl
          };toollist:PROT_imagecaptureprotocol;CmdLine:imagecaptureprotocol://language:${
            _data.language || 'zh_CN'
          };cameraType:${_data.cameraType};NginxIp:${_data.nginxIp};NginxPort:${
            _data.nginxPort
          };sg:${_data.sg};protocolType:${_data.protocolType};componentId:${
            _data.componentId
          };serviceType:${_data.serviceType};context:${
            _data.context
          };faceMode:${faceMode}${
            _data.indexCode ? ';indexCode:' + _data.indexCode : ''
          }"}}`
          console.log(jsonObj)
          this.socket.send(jsonObj)
        } else {
          this.$messagebox(result)
        }
      } else {
        this.connectSocket(this.connectCatchPhoto)
      }
    },
    // 抓拍数据处理
    catchPhotoDataCtrl(_data) {
      if (_data.fileUrl && _data.fileName) {
        if (
          this.tagItem.picture1Str &&
          this.tagItem.picture2Str &&
          this.tagItem.picture3Str
        ) {
          // this.$message('每个标记点最多保存3张图片！')
          if (this.tagPicAlert) {
            this.tagPicAlert = false
            this.$alert('每个标记点最多保存3张图片！', '提示', {
              confirmButtonText: '确定',
              callback: (action) => {
                this.tagPicAlert = true
              },
            })
          }

          return
        }
        let picObj = {}
        if (!this.tagItem.picture1Str) {
          picObj = { picture1Str: _data.fileUrl, picture1: _data.fileName }
        } else if (!this.tagItem.picture2Str) {
          picObj = { picture2Str: _data.fileUrl, picture2: _data.fileName }
        } else if (!this.tagItem.picture3Str) {
          picObj = { picture3Str: _data.fileUrl, picture3: _data.fileName }
        }
        this.tagItem = { ...this.tagItem, ...picObj }
      }
    },
    // 连接签字板
    async connectSignTool(signBox) {
      if (this.socket && this.socket.readyState === 1) {
        const SignType = signBox === 'personSign' ? 1 : 0
        let jsonObj = `{"comment":{"commenttype":"startapp", "context":"btoolsprotocol", "commentcmd":"btoolsprotocol://CenterUrl:${this.$centerUrl};Toollist:PROT_BToolCardReaderProtocol;CmdLine:BToolCardReaderProtocol://MethodType:1;SignType:${SignType};"}}`
        this.socket.send(jsonObj)
      } else {
        this.connectSocket(() => this.connectSignTool())
      }
    },

    // 签字数据处理
    async signToolDataCtrl(_data) {
      if (
        _data &&
        _data.Code === 0 &&
        _data.Result &&
        _data.Result.CommentType === 4
      ) {
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
    signHandle(signBox) {
      this.signBox = signBox
      this[this.signBox] = ''
      this[this.signBox + 'Key'] = ''
      this.connectSignTool(signBox)
    },
    // 生成检查信息
    makeCheckInfo() {
      let checkInfoDesc = ''
      this.tagInfoList.forEach((item) => {
        checkInfoDesc += item.num + '、' + item.description + '。\n'
      })
      if (!checkInfoDesc) {
        return this.$message('暂无可生成检查信息，请点击右侧人身添加')
      }

      checkInfoDesc &&
        this.$confirm('此操作将覆盖检查情况内容，确认覆盖？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'question',
        })
          .then(() => {
            this.ruleForm = { ...this.ruleForm, checkContent: checkInfoDesc }
          })
          .catch(() => {})
    },
    // 展示大图
    bigPicHandle(picSrc) {
      this.bigPicSrc = picSrc
      this.bigPicDialog = true
    },
    // 添加标记确认
    signSureHandle() {
      if (
        this.tagItem.description ||
        this.tagItem.picture1Str ||
        this.tagItem.picture2Str ||
        this.tagItem.picture3Str
      ) {
        this.$refs['dialogForm'].validate((valid, invalidFields) => {
          if (valid) {
            let idEdit = false
            this.tagInfoList = this.tagInfoList.map((item) => {
              let obj = {}
              if (item.num === this.tagItem.num) {
                obj = this.tagItem
                idEdit = true
              } else {
                obj = item
              }
              return obj
            })
            if (!idEdit) {
              this.tagInfoList.push(this.tagItem)
            }

            this.dialogVisible = false
            this.drawReset()
          } else {
            return false
          }
        })
      } else {
        this.$message.warning('请添加描述或上传图片')
      }
    },
    // 添加标记取消
    signCancelHandle() {
      this.drawReset()
      this.dialogVisible = false
    },
    // 添加人身标记点数据
    addSignInfo() {
      this.dialogVisible = true
    },
    // 修改标记点数据
    signItemUpdate(item) {
      this.tagItem = item
      this.dialogVisible = true
    },
    // 标记点删除
    signItemDel(item) {
      this.$confirm('确认删除此标记点?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'question',
      }).then(() => {
        this.tagInfoList = this.tagInfoList.filter((filterItem) => {
          return filterItem.num !== item.num
        })
        this.drawReset()
        // this.$message.success('删除成功!')
      })
    },
    // 获取可用标记num
    getSignNum() {
      let num = 0
      let filterArr = null
      while (!filterArr || filterArr.length > 0) {
        filterArr = this.tagInfoList.filter((item) => {
          return item.num > num
        })
        num++
      }
      return num
    },
    // 人身图片标记
    personTag(e, type) {
      if (this.tagInfoList.length && this.tagInfoList.length >= 10) {
        this.$message('最多添加10处标记')
        return
      }
      let targetObj = e.target.getBoundingClientRect()
      let offsetX = e.clientX - targetObj.left
      let offsetY = e.clientY - targetObj.top
      let canvas = null
      let tagItem = {}
      if (type === 'front' && this.frontCanvas) {
        canvas = this.frontCanvas
        tagItem.tagType = 0
      }
      if (type === 'back' && this.backCanvas) {
        canvas = this.backCanvas
        tagItem.tagType = 1
      }
      if (canvas) {
        let ctx = canvas.getContext('2d')
        let num = this.getSignNum()
        let x = offsetX
        let y = offsetY
        this.drawOneSign(ctx, num, x, y)
        tagItem.xAxis = x
        tagItem.yAxis = y
        tagItem.num = num
        this.tagItem = {
          tagType: 0,
          xAxis: 0,
          yAxis: 0,
          num: 0,
          description: '',
          picture1: '',
          picture1Str: '',
          picture2: '',
          picture2Str: '',
          picture3: '',
          picture3Str: '',
          ...tagItem,
        }

        // 唤起弹窗
        this.addSignInfo()
      }
    },

    // 重绘
    drawReset() {
      this.frontCanvas && this.clearCanvas(this.frontCanvas)
      this.backCanvas && this.clearCanvas(this.backCanvas)
      this.insetPersonFrontImg()
      this.insetPersonBackImg()
    },

    // 清空画布
    clearCanvas(canvas) {
      let ctx = canvas.getContext('2d')
      let w = canvas.width
      let h = canvas.height
      ctx.clearRect(0, 0, w, h)
    },

    // 画标记点
    drawSign() {
      if (
        this.frontCanvas &&
        this.backCanvas &&
        this.tagInfoList &&
        this.tagInfoList.length > 0
      ) {
        let canvas = null
        this.tagInfoList.forEach((item) => {
          if (item.tagType === 0 && this.frontCanvas) {
            canvas = this.frontCanvas
          }
          if (item.tagType === 1 && this.backCanvas) {
            canvas = this.backCanvas
          }
          let ctx = canvas.getContext('2d')
          let num = item.num
          let x = item.xAxis
          let y = item.yAxis
          this.drawOneSign(ctx, num, x, y)
        })
      }
    },
    // 绘制单个标记点
    drawOneSign(ctx, num, x, y) {
      ctx.beginPath()
      ctx.fillStyle = '#2080F7'
      ctx.arc(
        x,
        y,
        (num + '').length < 2 ? 6 : (num + '').length * 3,
        0,
        2 * Math.PI
      )
      ctx.fill()
      ctx.font = '12px'
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.fillText(num, Number(x), Number(y) + 4)
      ctx.closePath()
    },

    // 插入正面人身默认图片
    insetPersonFrontImg() {
      let canvas = document.getElementById('front_img_canvas')
      let ctx = canvas.getContext('2d')
      let img = new Image()
      img.src = this.frontImgUrl
      img.onload = () => {
        this.frontCanvas = canvas
        ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight)
        this.drawSign()
      }
    },
    // 插入背面人身图片
    insetPersonBackImg() {
      let canvas = document.getElementById('back_img_canvas')
      let ctx = canvas.getContext('2d')
      let img = new Image()
      img.src = this.backImgUrl
      img.onload = () => {
        this.backCanvas = canvas
        ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight)
        this.drawSign()
      }
    },
    // 自定义上传
    async uploadFile(value) {
      let file = value.file
      let formData = new FormData()
      formData.append('file', file)
      let uploadSuccess = false
      const result = await server.uploadFile(formData, {
        transformRequest: [
          function (data) {
            return data
          },
        ],
        headers: {
          post: { 'Content-Type': 'multipart/form-data' },
        },
      })
      const { data } = result
      if (data.code === '0') {
        let picObj = {}
        if (!this.tagItem.picture1Str) {
          picObj = {
            picture1Str: data.data.fileUrl,
            picture1: data.data.fileName,
          }
        } else if (!this.tagItem.picture2Str) {
          picObj = {
            picture2Str: data.data.fileUrl,
            picture2: data.data.fileName,
          }
        } else if (!this.tagItem.picture3Str) {
          picObj = {
            picture3Str: data.data.fileUrl,
            picture3: data.data.fileName,
          }
        }
        this.tagItem = { ...this.tagItem, ...picObj }
        this.uploadSuccess = true
      } else {
        this.$messagebox(result)
      }
      if (!uploadSuccess) {
      }
    },
    // 图片删除
    itemPicDel(index) {
      let picObj = {}
      if (index === 1) {
        picObj = { picture1Str: '', picture1: '' }
      } else if (index === 2) {
        picObj = { picture2Str: '', picture2: '' }
      } else if (index === 3) {
        picObj = { picture3Str: '', picture3: '' }
      }
      this.tagItem = { ...this.tagItem, ...picObj }
    },
    // 获取详情
    async getBodyCheckVo() {
      if (!this.queryParam.id) {
        return false
      }
      this.formLoading = true
      const params = { registerId: this.queryParam.id }
      const result = await server.getBodyCheckVo(params)
      const { data } = result
      if (data.code === '0' && data.data) {
        let _data = data.data
        this.detailData = _data
        this.policeSign = _data.policeSignPhotoUrl
        this.witnessSign = _data.witnessSignPhotoUrl
        this.personSign = _data.personSignPhotoUrl
        this.policeSignKey = _data.policeSign
        this.witnessSignKey = _data.witnessSign
        this.personSignKey = _data.personSign
        if (_data.selfContent || _data.checkContent) {
          this.ruleForm = {
            selfContent: _data.selfContent,
            checkContent: _data.checkContent,
          }
        }

        this.tagInfoList = _data.tagInfoList
        this.drawSign()
      } else {
        this.$messagebox(result)
      }
      this.formLoading = false
    },
    // 获取字典
    async inqDict() {
      const result = await server.inqDict()
      const { data } = result
      if (data.code === '0') {
        this.dictData = {
          sex: data.data.sex,
          suspectType: data.data.suspectType,
        }
      } else {
        this.$messagebox(result)
      }
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let params = this.ruleForm
          params = {
            ...params,
            registerId: this.queryParam.id,
            tagInfoList: this.tagInfoList,
            checkId: this.detailData.checkId,
          }
          let frontImgUrl = this.frontCanvas.toDataURL('image/jpeg')
          let backImgUrl = this.backCanvas.toDataURL('image/jpeg')
          params.frontPic = frontImgUrl
          params.backPic = backImgUrl
          params.policeSign = this.policeSignKey
          params.witnessSign = this.witnessSignKey
          params.personSign = this.personSignKey
          const result = await server.saveOrUpdateBodyCheckInfo(params)
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
    goBack() {
      this.$router.push('/')
    },
  },
  components: {
    PathDesc,
    StepStatueContent,
  },
}
</script>
<style lang="less" rel="stylesheet/less">
.personal-check-add-edit {
  min-width: 1366px;
  height: 100%;
  overflow: hidden;
  color: #4d4d4d;
  box-sizing: border-box;
  &.add-edit-from-box {
    &.full {
      .add-edit-from-back {
        height: ~'calc(100% - 127px)';
      }
    }
  }

  .scroll-box {
    height: ~'calc(100% - 100px)';
    .form-title {
      font-size: 14px;
      padding-left: 12px;
      height: 48px;
      line-height: 40px;
      border-bottom: solid 1px #e6e6e6;
      border-top: solid 8px #f2f2f2;
      &:first-child {
        border-top: none;
        height: 40px;
      }
      .desc1 {
        margin-right: 16px;
      }
      .small-seitch {
        margin-right: 8px;
      }
      .desc2 {
        color: #4d4d4d;
      }
    }
    .form-row-box {
      padding: 16px 0px;
      width: 100%;
      .el-col {
        box-sizing: border-box;
      }
    }
    .check-content-box {
      padding: 24px 0px;
      height: 460px;
      font-size: 0px;
      text-align: center;
      > div {
        font-size: 14px;
      }
      .readme-check-box {
        vertical-align: middle;
        display: inline-block;
        height: 100%;
        width: ~'calc(100% - 1046px)';
        max-width: 468px;
        padding-top: 16px;
        box-sizing: border-box;
        .readme-info-text {
          // margin-bottom: 24px;
        }
        .check-content-label {
          display: inline-block;
          vertical-align: top;
          padding: 7px 20px;
        }
        .check-content-textarea {
          vertical-align: top;
          height: 144px;
          // width: ~"calc(100% - 90px)";
          textarea {
            height: 100%;
          }
        }
      }
      .check-btn-box {
        vertical-align: middle;
        display: inline-block;
        padding: 0px 20px;
      }
      .front-img-warp {
        display: inline-block;
        vertical-align: middle;
        height: 100%;
        .el-alert {
          .el-alert__content {
            line-height: 20px;
            text-align: left;
          }
        }
        .front-img-warp-con {
          display: inline-block;
          margin-top: 6px;
          height: ~'calc(100% - 40px)';
        }
      }
      .front-img-box {
        vertical-align: middle;
        display: inline-block;
        height: 100%;
        background: #f2f2f2;
      }
      .front-desc-box {
        vertical-align: middle;
        display: inline-block;
        width: 287px;
        height: 100%;
      }
      .back-img-box {
        vertical-align: middle;
        display: inline-block;
        background: #f2f2f2;
        height: 100%;
      }
      .back-desc-box {
        vertical-align: middle;
        display: inline-block;
        width: 287px;
        height: 100%;
      }
      .sign-item {
        width: 100%;
        padding: 0px 67px 0px 32px;
        text-align: left;
        margin-bottom: 24px;
        position: relative;
        .sign-item-ctrl {
          position: absolute;
          top: 0px;
          right: 8px;
          color: #2080f7;
          .h-icon-edit {
            cursor: pointer;
            font-size: 24px;
          }
          .h-icon-delete {
            margin-left: 10px;
            cursor: pointer;
            font-size: 24px;
          }
        }
        &:last-child {
          margin-bottom: 0px;
        }
        .sign-desc-box {
          position: relative;
          line-height: 20px;
          font-size: 14px;
          .sign-icon {
            display: block;
            position: absolute;
            left: -16px;
            top: 4px;
            width: 12px;
            height: 12px;
            border-radius: 12px;
            text-align: center;
            line-height: 12px;
            background: #2080f7;
            color: #ffffff;
          }
          .desc-length-ctrl {
            height: 40px;
            overflow: hidden;
            position: relative;
            word-break: break-all;
            &.line-auto {
              &:after {
                content: '...';
                display: block;
                position: absolute;
                bottom: 0px;
                right: 0px;
                background: #ffffff;
                width: 24px;
                text-align: center;
                font-size: 18px;
                padding-right: 8px;
                padding-bottom: 3px;
              }
            }
          }
        }
        .sign-pic-box {
          .sign-pic-item {
            width: 40px;
            height: 40px;
            margin-right: 8px;
            cursor: pointer;
          }
        }
      }
    }
  }
  .big-pic-box {
    text-align: center;
    font-size: 0px;
    .big-pic-item {
      width: 100%;
      height: 100%;
    }
  }
  .pic-item {
    width: 148px;
    height: 148px;
    display: inline-block;
    vertical-align: top;
    margin-right: 38px;
    margin-top: 15px;
    position: relative;
    &:last-child {
      margin-right: 0px;
    }
    img {
      width: 100%;
      height: 100%;
    }
    .del-back {
      display: none;
    }
    &:hover {
      .del-back {
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        color: #ffffff;
        top: 0px;
        left: 0px;
        border-radius: 6px;
        display: block;
        text-align: center;
        font-size: 24px;
        line-height: 148px;
        i {
          cursor: pointer;
        }
      }
    }
  }
  .dialog-title {
    font-size: 14px;
    margin-bottom: 8px;
  }
  .upload-btn {
    position: relative;
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    line-height: 146px;
    vertical-align: top;
    text-align: center;
    i.h-icon-add {
      font-size: 28px;
      color: #8c939d;
    }
    .upload-back {
      display: none;
    }
    &:hover {
      .upload-back {
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        color: #ffffff;
        top: 0px;
        left: 0px;
        border-radius: 6px;
        display: block;
        .upload-pic {
          position: absolute;
          top: 80px;
          left: 45px;
          line-height: normal;
          i {
            color: #ffffff;
            font-size: 18px;
            position: relative;
            top: -1px;
            left: 2px;
            margin-right: 3px;
            transform: rotate(-90deg);
            display: inline-block;
          }
        }
        .catch-pic {
          position: absolute;
          top: 38px;
          left: 45px;
          line-height: normal;
          cursor: pointer;
          i {
            color: #ffffff;
            font-size: 18px;
            position: relative;
            top: 2px;
            margin-right: 3px;
          }
        }
      }
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

.big-pic-dialog {
  .el-dialog__header {
    position: fixed;
    right: 40px;
    top: 40px;
    width: 64px;
    height: 64px;
    color: #ffffff;
    border-radius: 64px;
    background: rgba(0, 0, 0, 0.5);
    border: none;
    .el-dialog__headerbtn {
      float: none;
      width: 100%;
      text-align: center;
      padding-top: 17px;
      .el-dialog__close {
        color: #ffffff;
        font-size: 26px;
      }
    }
  }
  .el-dialog__body {
    padding: 0px;
    .el-dialog__body-wrapper {
      padding: 0px;
    }
  }
}
.description-pic-dialog {
  .pic-item {
    width: 148px;
    height: 148px;
    display: inline-block;
    vertical-align: top;
    margin-right: 38px;
    margin-top: 15px;
    position: relative;
    &:last-child {
      margin-right: 0px;
    }
    img {
      width: 100%;
      height: 100%;
    }
    .del-back {
      display: none;
    }
    &:hover {
      .del-back {
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        color: #ffffff;
        top: 0px;
        left: 0px;
        border-radius: 6px;
        display: block;
        text-align: center;
        font-size: 24px;
        line-height: 148px;
        i {
          cursor: pointer;
        }
      }
    }
  }
  .dialog-title {
    font-size: 14px;
    margin-bottom: 8px;
  }
  .upload-btn {
    position: relative;
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    line-height: 146px;
    vertical-align: top;
    text-align: center;
    i.h-icon-add {
      font-size: 28px;
      color: #8c939d;
    }
    .upload-back {
      display: none;
    }
    &:hover {
      .upload-back {
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        color: #ffffff;
        top: 0px;
        left: 0px;
        border-radius: 6px;
        display: block;
        .upload-pic {
          position: absolute;
          top: 80px;
          left: 45px;
          line-height: normal;
          i {
            color: #ffffff;
            font-size: 18px;
            position: relative;
            top: -1px;
            left: 2px;
            margin-right: 3px;
            display: inline-block;
            transform: rotate(-90deg);
          }
        }
        .catch-pic {
          position: absolute;
          top: 38px;
          left: 45px;
          line-height: normal;
          cursor: pointer;
          i {
            color: #ffffff;
            font-size: 18px;
            position: relative;
            top: 2px;
            margin-right: 3px;
          }
        }
      }
    }
  }
}
</style>
