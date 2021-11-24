<template>
  <watermarkContent>
    <div id="exitRegistration" class="exitRegistration">
      <div class="listPage">
        <Layout>
          <Header :height="80">
            <PathDesc :path-desc-arr="pathDescArr" :is-back="true"></PathDesc>
            <!-- <el-breadcrumb separator="/">
            <el-button type="iconButton"
                       icon="h-icon-arrow_left back"
                       @click="onBack"></el-button>
            <el-breadcrumb-item>出区登记</el-breadcrumb-item>
            <el-breadcrumb-item>录入出区登记信息</el-breadcrumb-item>
          </el-breadcrumb> -->
            <div class="personInfo">
              <span>姓名：{{ currentRegisterInfo.registerName }}</span>
              <span
                >人员类型：{{
                  personTypeMap[currentRegisterInfo.personType]
                }}</span
              >
              <span v-if="sexMap[currentRegisterInfo.registerSex]"
                >性别：{{ sexMap[currentRegisterInfo.registerSex] }}</span
              >
              <span v-else>性别：</span>
              <span v-if="currentRegisterInfo.registerAge"
                >年龄：{{ currentRegisterInfo.registerAge }}岁</span
              >
              <span v-else>年龄：未知</span>
              <span v-show="$checkPlace"
                >手环编号：{{ currentRegisterInfo.bandsNo }}</span
              >
            </div>
          </Header>

          <Main>
            <div class="exitRegistrationMain">
              <Layout>
                <Header :height="96">
                  <StepStatueContent
                    :current-key="6"
                    :step-statue="stepStatue"
                  ></StepStatueContent>
                </Header>
                <Main class="computedHeight">
                  <div
                    class="exitRegistrationInfo"
                    :style="'height:' + offsetHeight + 'px'"
                  >
                    <div class="exitRegistrationInfoBox">
                      <el-scrollbar
                        wrap-class="scrollbarWrap"
                        view-class="scrollbarView"
                        ref="scrollbar"
                      >
                        <div class="formContant">
                          <div
                            class="exitRegistrationReason"
                            id="exitRegistrationReason"
                            ref="exitRegistrationReason"
                          >
                            <div class="exitRegistrationReasonBox">
                              <Layout>
                                <Header :height="42">
                                  <div class="titleContent">登记出区信息</div>
                                </Header>
                                <Main>
                                  <div class="formItem">
                                    <el-alert
                                      class="alertMsg"
                                      :title="alertMsg"
                                      type="info"
                                      simple
                                      show-icon
                                      v-show="alertMsg && $checkPlace"
                                    ></el-alert>
                                    <div class="formItemLabel">出区方式</div>
                                    <div class="formItemContent">
                                      <el-radio-group
                                        v-model="handlingResultRadio"
                                        @change="changeRadio"
                                      >
                                        <el-radio-button :label="1"
                                          >最终出区</el-radio-button
                                        >
                                        <el-radio-button :label="2"
                                          >临时出区</el-radio-button
                                        >
                                      </el-radio-group>
                                    </div>
                                  </div>
                                  <div
                                    class="formItem"
                                    v-show="handlingResultRadio === 1"
                                  >
                                    <div class="formItemLabel">办案结果</div>
                                    <div class="formItemContent">
                                      <el-radio-group
                                        v-model="handlingResult"
                                        @change="handlingResultChange"
                                      >
                                        <el-radio
                                          v-for="(item, index) in resultList"
                                          :key="index"
                                          v-model="handlingResult"
                                          :label="item.key"
                                          :class="{
                                            otherRadio: item.key == '0',
                                          }"
                                          :style="
                                            resultKey && item.key == '0'
                                              ? 'padding-right:250px;height:48px;position:relation;'
                                              : ''
                                          "
                                        >
                                          {{ item.name }}
                                          <el-form
                                            v-show="resultKey"
                                            v-if="item.key == '0'"
                                            :model="ruleForm"
                                            ref="ruleForm"
                                            class="otherForm"
                                            label-width="0px"
                                            :rules="rules"
                                          >
                                            <el-form-item
                                              label
                                              key="OtherInput"
                                              prop="OtherInput"
                                            >
                                              <el-input
                                                class="otherInput"
                                                v-model="ruleForm.OtherInput"
                                              ></el-input>
                                            </el-form-item>
                                          </el-form>
                                        </el-radio>
                                      </el-radio-group>
                                    </div>
                                  </div>
                                  <div class="formItem" v-if="showFlag">
                                    <div class="formItemLabel">
                                      关联民警是否出区
                                    </div>
                                    <div class="formItemContent">
                                      <el-radio-group
                                        v-model="handlingLeave"
                                        @change="handlingLeaveChange"
                                      >
                                        <el-radio :label="1"> 是 </el-radio>
                                        <el-radio :label="0"> 否 </el-radio>
                                      </el-radio-group>
                                    </div>
                                  </div>
                                  <div
                                    class="formItem"
                                    v-show="handlingResultRadio === 2"
                                  >
                                    <div class="formItemLabel">
                                      临时带出原因
                                    </div>
                                    <div class="formItemContent">
                                      <el-radio-group
                                        v-model="handlingReason"
                                        @change="handlingReasonChange"
                                      >
                                        <el-radio
                                          v-for="(item, index) in reasonList"
                                          :key="index"
                                          :class="{
                                            otherRadio: item.key == '0',
                                          }"
                                          :style="
                                            reasonKey && item.key == '0'
                                              ? 'padding-right:250px;height:52px;position:relation;'
                                              : ''
                                          "
                                          :label="item.key"
                                        >
                                          {{ item.name }}
                                          <el-form
                                            v-if="item.key == '0'"
                                            v-show="reasonKey"
                                            :model="ruleForm1"
                                            ref="ruleForm1"
                                            :rules="rules"
                                            class="otherForm"
                                            label-width="0px"
                                          >
                                            <el-form-item
                                              label
                                              key="OtherInput1"
                                              prop="OtherInput1"
                                            >
                                              <el-input
                                                class="otherInput"
                                                v-model="ruleForm1.OtherInput1"
                                              ></el-input>
                                            </el-form-item>
                                          </el-form>
                                        </el-radio>
                                      </el-radio-group>
                                    </div>
                                  </div>
                                  <div class="formItem" v-show="showApplicationFlag">
                                    <div class="formItemLabel">
                                      审批状态
                                    </div>
                                    <div class="formItemContent formItemContentChild">
                                        <span
                                          class="status-icon blue-icon"
                                          :class="{ 'blue-icon': currentPerson.applyStatus == 0 }"
                                          v-if="currentPerson.applyStatus == 0"
                                            >待审批</span
                                        >
                                        <span
                                          class="status-icon red-icon"
                                          :class="{
                                            'red-icon': currentPerson.applyStatus == 1,
                                          }"
                                          v-if="currentPerson.applyStatus == 1"
                                          >已退回</span
                                        >
                                        <span
                                          class="status-icon green-icon"
                                          :class="{
                                            'green-icon': currentPerson.applyStatus == 2,
                                          }"
                                          v-if="currentPerson.applyStatus == 2"
                                          >已审批</span
                                        >
                                        <span
                                          class="status-icon gray-icon"
                                          :class="{ 'gray-icon': currentPerson.applyStatus == 4 }"
                                          v-if="currentPerson.applyStatus == 4"
                                          >已作废</span
                                        >
                                        <span
                                          class="status-icon green-icon"
                                          :class="{
                                            'green-icon': currentPerson.applyStatus == 3,
                                          }"
                                          v-if="currentPerson.applyStatus == 3"
                                          >已预约</span
                                        >
                                        <span
                                          class="status-icon blue-icon"
                                          :class="{
                                            'blue-icon': !('applyStatus' in currentPerson),
                                          }"
                                          v-if=" !('applyStatus' in currentPerson)"
                                          >未提交</span
                                        >
                                    </div>
                                  </div>
                                </Main>
                              </Layout>
                            </div>
                          </div>
                          <div
                            class="exitRegistrationAutograph"
                            ref="exitRegistrationAutograph"
                          >
                            <div class="exitRegistrationAutographBox">
                              <Layout>
                                <Header :height="42">
                                  <div class="titleContent">电子签名</div>
                                </Header>
                                <Main>
                                  <signItem
                                    :item-width="388"
                                    sign-item-top-label="管理员"
                                    @handleCollection="handleCollection"
                                    :sign-text="signObj.managerSign"
                                  ></signItem>
                                </Main>
                              </Layout>
                            </div>
                          </div>
                        </div>
                      </el-scrollbar>
                    </div>
                    <div class="footerBtn">
                      <el-button type="primary" @click="onSubmit">
                        保存
                      </el-button>
                      <el-button @click="onBack"> 取消 </el-button>
                    </div>
                  </div>
                </Main>
              </Layout>
            </div>
          </Main>
        </Layout>
      </div>
    </div>
  </watermarkContent>
</template>
<script>
import Layout, { Main, Header } from "../../components/Layout/index";
import SignItem from "../../components/SignItem/SignItem";
import StepStatueContent from "../../components/StepStatueContent/index";
import server from "../../server/exitRegistration";
import PathDesc from "./components/PathDesc";
export default {
  name: "ExitRegistration",
  computed: {
    currentRegisterId() {
      if (this.$route.query && this.$route.query.id) {
        return this.$route.query.id;
      } else {
        return null;
      }
    },
    currentRegisterAreaCode() {
      if (this.$route.query && this.$route.query.areaCode) {
        return this.$route.query.areaCode;
      } else {
        return null;
      }
    },
    currentRegisterCode() {
      if (this.$route.query && this.$route.query.registerCode) {
        return this.$route.query.registerCode;
      } else {
        return null;
      }
    },
    currentRegisterInfos() {
      if (this.$route.query && this.$route.query.registerInfo) {
        return this.$route.query.registerInfo;
      } else {
        return null;
      }
    },
  },
  data() {
    let validateCommon = (rule, value, callback) => {
      if (value && value.length) {
        if (/['/\\:*?""<>|]/g.test(value)) {
          callback(new Error("不能包含 ' / \\ : * ? \" < > | 这些特殊字符"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      handlingResultRadio: 1,
      pathDescArr: ["出区登记", "录入出区登记信息"],
      rules: {
        OtherInput: [
          { min: 0, max: 50, message: "请输入0~50个字符" },
          { validator: validateCommon },
        ],
        OtherInput1: [
          { min: 0, max: 50, message: "请输入0~50个字符" },
          { validator: validateCommon },
        ],
      },
      stepStatue: [0, 0, 0, 0, 0],
      managerType: 2, // 管理类型（1：存放物品；2：归还物品；3：临时领取；4：临时领取物品归还）
      currentRegisterInfo: {
        registerName: "",
        bandsNo: "",
        registerSex: "",
        registerAge: "",
        personType: "",
      },
      signObj: {
        managerSign: {
          type: "managerSign",
          data: "",
          fileUrl: "",
          fileName: "",
        },
        policeSign: {
          type: "policeSign",
          data: "",
          fileUrl: "",
          fileName: "",
        },
        personSign: {
          type: "personSign",
          data: "",
          fileUrl: "",
          fileName: "",
        },
        registerId: null,
        managerType: 2,
        roomCode: "",
        outType: 0,
        // goodsManagerId: null
      },
      alertMsg: "",
      inqDictList: {},
      resultList: [],
      reasonList: [],
      ruleForm1: {
        OtherInput1: "",
      },
      // OtherInput: '',
      ruleForm: {
        OtherInput: "",
      },
      handlingReason: null,
      handlingResult: null,
      handlingLeave: 1,
      resultKey: false,
      reasonKey: false,
      offsetHeight: 0,
      personTypeMap: {},
      sexMap: {},
      websock: null,
      webSocketData: {
        type: "",
        data: {},
      },
      currentType: "",
      showFlag: true,
      isLeaveApproval: 0,//办案区是否开启出区审批
      isTemporaryLeaveApproval: 0,//办案区是否开启临时出区审批
      currentPerson: {},
      showApplicationFlag: false,
      processCode: 'finalLeave'
    };
  },
  mixins: [],
  methods: {
    async getRegisterInfoVo(typeList) {
      let params = {
        registerId: this.currentRegisterId,
      };
      let res = await server.getRegisterInfoVo(params);
      if (res.data.code === "0") {
        let data = res.data.data;
        this.currentRegisterInfo = {
          registerName: data.registerName,
          bandsNo: data.bandsNo,
          registerSex: data.registerSex,
          registerAge: data.registerAge,
          personType: data.personType,
        };
        this.stepStatue = [
          // '入区登记','人身检查','物品登记  ','信息采集','吸毒检测','物品归还','出区登记'
          data.doBodyCheck,
          data.doGoodsStorage,
          data.doCollected,
          data.doDrugCheck,
          data.doGoodsReturn,
        ]; // [registerStatusIn, data.doBodyCheck, data.doGoodsStorage, data.doCollected, data.doDrugCheck, data.doGoodsReturn, registerStatusOut]
        this.signObj = {
          registerId: this.currentRegisterId,
          managerType: 2,
          roomCode: data.roomCode || "",
          outType: 0,
          managerSign: {
            type: "managerSign",
            data: data.managerSignPhotoUrl || "",
          },
          policeSign: {
            type: "policeSign",
            data: data.policeSignPhotoUrl || "",
          },
          personSign: {
            type: "personSign",
            data: data.personSignPhotoUrl || "",
          },
        };
      } else {
        this.$messagebox(res);
      }
    },
   // 查询办案区配置参数
    async getApproval() {
      const { data } = await server.getApproval({
        areaIndexCode: this.currentRegisterAreaCode,
      });
      if (data.code === "0") {
        if (data.data) {
          var _data = JSON.parse(JSON.stringify(data.data));
          this.isLeaveApproval = _data.leaveApproval;
          this.isTemporaryLeaveApproval = _data.temporaryLeaveApproval
          this.isLeaveApproval == 1 ? this.showApplicationFlag=true : this.showApplicationFlag = false
        }
      } else {
        this.$message.error(this.$i18n.t(data.code));
      }
    },
    //获取人员出区申请信息
    async getExitApplicaInfo() {
      this.currentPerson = {}
      let params = {
        registerIndexCode: this.currentRegisterCode,
        pageNo: 1,
        pageSize: 20,
        applyTypes: this.handlingResultRadio == 2 ? [4] : [3],
        registerStatus: [2]
      };
      let res = await server.exitApplicaitionSearch(params);
      if (res.data.code === "0") {
        let data = res.data.data;
          if(data.list[0]) {
            this.currentPerson = JSON.parse(JSON.stringify(data.list[0]));
            if(this.handlingResultRadio == 2) {
              this.handlingReason = this.currentPerson.applyReason
            }else{
              this.handlingResult = this.currentPerson.applyReason
            }
          }else{
            this.currentPerson = {}
          }
      } else {
        this.$messagebox(res);
      }
    },
    changeRadio(val) {
      if (val == 1) {
        this.showFlag = true;
        this.ruleForm.OtherInput = "";
        this.handlingReason = null;
        this.handlingLeave = 1;
        this.resultKey = false;
      } else {
        this.showFlag = false;
        this.ruleForm1.OtherInput1 = "";
        this.handlingResult = null;
        this.reasonKey = false;
      }
      this.$nextTick(()=> {
        if((this.isLeaveApproval == 1 && this.handlingResultRadio == 1) ||(this.isTemporaryLeaveApproval == 1 && this.handlingResultRadio == 2)) {
          this.showApplicationFlag = true
        }else{
          this.showApplicationFlag = false
        }
      })
      this.getExitApplicaInfo()
    },
    handlingReasonChange(val) {
      // 原因
      if (val) {
        this.showFlag = false;
        window.setTimeout(() => {
          this.$refs["ruleForm1"] &&
            this.$refs["ruleForm1"][0] &&
            this.$refs["ruleForm1"][0].resetValidates();
        }, 0);
        if (val === "0") {
          this.reasonKey = true;
          this.ruleForm1.OtherInput1 = "";
        } else {
          this.reasonKey = false;
        }
      }
    },
    handlingResultChange(val) {
      // 结果
      //
      if (val) {
        this.showFlag = true;
        window.setTimeout(() => {
          this.$refs["ruleForm"] &&
            this.$refs["ruleForm"][0] &&
            this.$refs["ruleForm"][0].resetValidates();
        }, 0);
        if (val === "0") {
          this.resultKey = true;
          this.ruleForm.OtherInput = "";
        } else {
          this.resultKey = false;
        }
      }
    },
    handlingLeaveChange(val) {
      console.log(val);
    },
    onSubmit() {
      if(this.handlingResultRadio === 2&&this.isTemporaryLeaveApproval ==1 ) {
        if(this.currentPerson.applyStatus!=2) {
          this.$message.error('临时出区申请审批通过后才能出区！')
          return
        }
      }
      if(this.handlingResultRadio === 1&&this.isLeaveApproval ==1 ) {
        if(this.currentPerson.applyStatus!=2) {
          this.$message.error('最终出区申请审批通过后才能出区！')
          return
        }
      }
      if (this.handlingResultRadio === 2) {
        if (!this.handlingReason) {
          this.$message.error("请选择临时带出原因");
          return;
        }

        if (this.handlingReason === "0") {
          this.$refs["ruleForm1"][0].validate(async (valid) => {
            if (valid) {
              this.handleSubmit();
            }
          });
        } else {
          this.handleSubmit();
        }
      } else if (this.handlingResultRadio === 1) {
        if (!this.handlingResult) {
          this.$message.error("请选择办案结果");
          return;
        }
        if (this.handlingResult === "0") {
          this.$refs["ruleForm"][0].validate(async (valid) => {
            if (valid) {
              this.checkGoods();
            }
          });
        } else {
          this.checkGoods();
        }
      } else {
        this.$message({
          message: "请选择结果或原因",
          type: "warning",
        });
      }
    },
    async checkGoods() {
      if (this.handlingResultRadio === 1) {
        let params = {
          registerId: this.currentRegisterId,
        };
        const res = await server.getNoBackGoodsList(params);
        if (res && res.data && res.data.code === "0") {
          if (res.data.data && res.data.data.length) {
            this.$confirm("涉案人员有暂存物品未归还，确认继续出区?", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              closeOnClickModal: false,
              type: "question",
            })
              .then(() => {
                this.handleSubmit();
              })
              .catch(() => {});
          } else {
            this.handleSubmit();
          }
        } else {
          this.$messagebox(res);
        }
      } else {
        this.handleSubmit();
      }
    },
    async handleSubmit() {
      try {
        if (this.handlingResultRadio === 2) {
          this.$confirm("确认出区?", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "question",
          })
            .then(async () => {
              let params = {
                registerId: this.currentRegisterId,
                leaveReason: this.handlingReason,
                otherReason: this.ruleForm1.OtherInput1,
                managerSign: this.signObj.managerSign.fileName,
              };
              let loadingInstance = this.$loading({
                fullscreen: true,
                text: "保存中...",
              });
              try {
                const res = await server.saveTemporaryLeaveInfo(params);
                if (res && res.data && res.data.code === "0") {
                  loadingInstance.close();
                  setTimeout(() => {
                    this.$message.success("保存成功");
                  }, 500);
                  this.onBack();
                } else {
                  loadingInstance.close();
                  setTimeout(() => {
                    this.$messagebox(res);
                  }, 500);
                }
              } catch {
                setTimeout(() => {
                  loadingInstance.close();
                }, 500);
              }
            })
            .catch(() => {});
        } else if (this.handlingResultRadio === 1) {
            // 查询当前流程是否可做
            let params = {
              registerIndexCode: this.currentRegisterInfos.registerCode,
              processCode: this.processCode
            }
            const { data } = await server.getCaseAreaProcessConfig(params)
            if (data.code === "0") {
              let _data = data.data
              if(_data.indexOf(',') > -1) {
                this.$message.warning(`${_data.split(',')[1]}！`)
                return false
              }
            }  
            else {
              this.$message.error(this.$i18n.t(data.code))
              return false
            }
          this.$confirm("确认出区?", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnClickModal: false,
            type: "question",
          })
            .then(async () => {
              // status: type// 是否关联民警一起出区 是：1，否 0
              let params = {
                registerId: this.currentRegisterId,
                leaveReason: this.handlingResult,
                otherReason: this.ruleForm.OtherInput,
                managerSign: this.signObj.managerSign.fileName,
                status: this.handlingLeave,
              };
              let loadingInstance = this.$loading({
                fullscreen: true,
                text: "保存中...",
              });
              try {
                const res = await server.saveFinalLeaveInfo(params);
                if (res && res.data && res.data.code === "0") {
                  loadingInstance.close();
                  setTimeout(() => {
                    this.$message.success("保存成功");
                  }, 500);
                  this.onBack();
                } else {
                  loadingInstance.close();
                  setTimeout(() => {
                    this.$messagebox(res);
                  }, 500);
                }
              } catch {
                setTimeout(() => {
                  loadingInstance.close();
                }, 500);
              }
            })
            .catch(() => {});
        }
      } catch {}
    },
    // 采集
    handleCollection(type) {
      let hikUrl = `btoolsprotocol://CenterUrl:${this.$centerUrl};Toollist:PROT_BToolCardReaderProtocol;CmdLine:BToolCardReaderProtocol://MethodType:1;SignType:0;`;
      this.currentType = type;
      this.signObj.managerSign.data = "";
      this.signObj.managerSign.fileUrl = "";
      this.signObj.managerSign.fileName = "";
      this.webSocketConnect(hikUrl, type, "BToolCardReaderProtocol");
    },
    webSocketConnect(webMsg, _type, content) {
      let _self = this;
      // 参数
      // let sendMsg = webMsg //'{"comment":{"commenttype":"startapp", "context":"noteFormatClientprotocol", "commentcmd":"noteFormatClientprotocol://nginxIP:' + webMsg.nginxIp + ';nginxport:' + webMsg.nginxPort + ';sg:' + webMsg.sg + ';protocol:' + webMsg.protocol + ';componentID:' + webMsg.componentId + ';servicetype:' + webMsg.serviceType + ';noteTemplateId:' + webMsg.id + ';language:' + webMsg.language + ';"}}'
      let sendMsg =
        '{"comment":{"commenttype":"startapp", "context":"btoolsprotocol", "commentcmd":"' +
        webMsg +
        ';"}}';
      let socketHost =
        window.location.protocol.indexOf("https") > -1
          ? "wss://127.0.0.1:18001/WebS_Js"
          : "ws://127.0.0.1:18000/WebS_Js";
      try {
        if (!_self.websock) {
          _self.websock = new WebSocket(socketHost);
          _self.websock.onopen = function () {
            // 发送检测插件助手是否安装请求
            let jsonObj =
              '{"comment":{"commenttype":"checkapp", "context":"btoolsprotocol"}}';
            _self.websock.send(jsonObj);
          };
        } else {
          let jsonObj =
            '{"comment":{"commenttype":"checkapp", "context":"btoolsprotocol"}}';

          _self.websock.send(jsonObj);
        }
        _self.websock.onerror = function () {
          // 连接失败，通信中间件未安装
          _self.$message("检测到您未安装插件助手");
        };
        _self.websock.onmessage = async (data) => {
          let _data = JSON.parse(data.data);
          if (
            _data &&
            _data.comment &&
            _data.comment.commenttype === "checkapp"
          ) {
            // 检测插件助手是否安装
            if (_data.comment.resultCode === "1") {
              // 模板笔录编辑
              let jsonObj = sendMsg;
              _self.websock.send(jsonObj);
            } else {
              _self.$message("检测到您未安装插件助手");
            }
          } else if (_data && _data.Code === 0 && _data.Result) {
            let base64Str = _data.Result.Data.ImgData;
            let res = await server.uploadbase64({ base64Str });
            if (res && res.data && res.data.code === "0") {
              _self.webSocketData = {
                type: _type,
                fileUrl: res.data.data.fileUrl,
                fileName: res.data.data.fileName,
              };
            } else {
              this.$messagebox(res);
            }
          }
        };
        _self.websock.onclose = function () {
          _self.websock = null;
        };
      } catch (err) {
        console.log(err);
      }
    },
    onBack() {
      this.$router.push({ path: "/", query: {} });
    },
    computedHeight() {
      let el = document.querySelector("#exitRegistrationReason");
      let el1 = document.querySelector(".computedHeight");
      if (!el || !el1) {
        return false;
      }
      let _offsetHeight = el.offsetHeight;
      let _offsetHeight1 = el1.offsetHeight;
      let $height = 450;
      if (_offsetHeight1 >= _offsetHeight + $height) {
        this.offsetHeight = el.offsetHeight + $height;
      } else {
        this.offsetHeight = _offsetHeight1;
      }
    },
    // 数据字典
    async inqDict() {
      let res = await server.inqDict();
      if (res.data.code === "0") {
        let data = res.data.data;
        this.inqDictList = data;
        this.reasonList = JSON.parse(
          JSON.stringify(this.inqDictList.temporaryLeaveReason)
        );
        this.resultList = JSON.parse(
          JSON.stringify(this.inqDictList.handleResult)
        );
        // 办案结果
        this.resultList = this.resultList.filter((val) => {
          return val.used === 0;
        });
        // 临时带出原因
        this.reasonList = this.reasonList.filter((val) => {
          return val.used === 0;
        });
        this.$nextTick(() => {
          this.computedHeight();
        });
        let sexData = data.sex;
        let personType = data.suspectType;
        this.sexMap = this.computedDic(sexData);
        this.personTypeMap = this.computedDic(personType);
      } else {
        this.$messagebox(res);
      }
    },
    computedDic(list) {
      let dicMap = {};
      for (let i = 0; i < list.length; i++) {
        dicMap[list[i].key] = list[i].name;
      }
      return dicMap;
    },
  },
  mounted() {
    this.inqDict();
    if (this.$route.query && this.$route.query.id) {
      this.signObj = {
        registerId: this.currentRegisterId,
        managerSign: {
          type: "managerSign",
          data: "",
        },
        policeSign: {
          type: "policeSign",
          data: "",
        },
        personSign: {
          type: "personSign",
          data: "",
        },
        managerType: 2,
        roomCode: "",
        outType: 0,
      };
      this.getRegisterInfoVo();
      this.getExitApplicaInfo();
      this.getApproval()
    } else {
      this.$router.push({ path: "/", query: {} });
    }
    window.addEventListener("resize", () => {
      this.computedHeight();
    });
  },
  watch: {
    webSocketData: {
      handler: function (newVal, oldVal) {
        if (newVal.type) {
          if (newVal.type === this.currentType) {
            let data = JSON.parse(JSON.stringify(newVal));
            this.signObj.managerSign.data = data.fileUrl;
            this.signObj.managerSign.fileUrl = data.fileUrl || "";
            this.signObj.managerSign.fileName = data.fileName || "";
          }
          if (newVal === "onSnap") {
          }
          this.currentType = "";
          this.webSocketData = {
            type: "",
            data: "",
          };
        }
      },
      immediate: true,
      deep: true,
    },
    currentRegisterInfo: {
      handler: function (newV, oldV) {
        // currentRegisterInfo
        if (newV.bandsNo && newV.bandsNo.length) {
          this.alertMsg =
            "提示：" + newV.registerName + "登记时已绑定手环，出区时请注意回收";
        } else {
          this.alertMsg = "";
        }
      },
      immediate: true,
      deep: true,
    },
    handlingResultRadio(newV, oldV) {
      this.computedHeight();
    },
  },
  created() {},
  components: {
    Layout,
    Main,
    Header,
    SignItem,
    StepStatueContent,
    PathDesc,
  },
};
</script>
<style lang="less" rel="stylesheet/less">
.exitRegistration {
  height: 100%;
  width: 100%;
  .listPage {
    height: 100%;
    .personInfo {
      height: 24px;
      font-size: 14px;
      color: #999999;
      font-family: PingFangSC-Regular;
      padding-left: 10px;
      box-sizing: border-box;
      > span {
        padding: 0 16px;
      }
    }
    .exitRegistrationMain {
      height: 100%;
      padding: 8px !important;
      box-sizing: border-box;
      background: #f2f2f2;
      .exitRegistrationInfo {
        background: #fff;
        height: 100%;
        padding-bottom: 48px;
        box-sizing: border-box;
        position: relative;
        .exitRegistrationInfoBox {
          width: 100%;
          height: 100%;
          .applicationDetailSituation {
            width: 100%;
            height: 100%;
            .applicationDetailSituationTableBox {
              width: 856px;
              padding: 40px;
              margin: 40px auto;
              background: #fff;
              height: auto;
              box-sizing: border-box;
              background: #ffffff;
              box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.2);
            }
            .tableContent {
              width: 100%;
              border: 1px solid #ddd;
              border-right: 1px solid #fff;
              border-bottom: 1px solid #fff;
            }
            .applicationDetailSituationTable {
              width: 100%;
              box-sizing: border-box;
              position: relative;
              .el-col {
                height: 40px;
                .tableItem {
                  width: 100%;
                  height: 40px;
                  border-bottom: 1px solid #ddd;
                  .tableItemLabel {
                    width: 120px;
                    text-indent: 14px;
                    font-family: PingFangSC-Semibold;
                    font-size: 14px;
                    color: #999999;
                    position: relative;
                  }
                  .tableItemLabel::before {
                    content: "";
                    display: block;
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    opacity: 0.3;
                    top: 0;
                    left: 0;
                    z-index: 1;
                    background: #f2f2f2;
                  }
                  .tableItemCon {
                    width: ~"calc(100% - 122px)";
                    text-align: left;
                    text-indent: 14px;
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: #4d4d4d;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                  .status-icon {
                    padding: 0px 12px 0px 0px !important;
                    font-size: 14px;
                  }
                  > div {
                    height: 40px;
                    float: left;
                    line-height: 40px;
                    text-align: center;
                    border-right: 1px solid #ddd;
                  }
                }
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
          .formContant {
            width: 100%;
            padding: 0;
            height: auto;
            box-sizing: border-box;
            text-align: center;
            .formItem {
              width: 51%;
              display: inline-block;
              height: auto;
              text-align: left;
              // position: relative;
              .alertMsg {
                position: absolute;
                width: auto;
                top: 54px;
                left: 50%;
                transform: translateX(-50%);
                .el-alert__content {
                  padding-right: 40px;
                }
              }
              .formItemLabel {
                display: inline-block;
                width: 100%;
                height: 32px;
                line-height: 30px;
                // text-align: right;
                font-size: 14px;
                padding-left: 16px;
                box-sizing: border-box;
                font-weight: bolder;
              }
              .formItemContent {
                width: 100%;
                float: right;
                // height: 40px;
                margin-bottom: 24px;
                .otherForm {
                  display: inline-block;
                  position: absolute;
                  right: 0;
                  top: 0px;
                  width: 240px;
                  .el-form-item__error {
                    position: absolute;
                  }
                }
                .otherInput {
                  width: 240px;
                  // width: 240px;
                  // margin-left: 16px;
                  // margin-bottom: 8px;
                  // top: -8px;
                  // float: right;
                }
                .el-radio-group {
                  display: inline-block;
                  // height: 40px;
                  font-size: 0;
                  line-height: 1;
                  .el-radio-button {
                    &:first-of-type {
                      margin-left: 16px;
                    }
                    &.is-checked .el-radio-button__inner {
                      border-color: #2080f7;
                      background-color: #2080f7;
                      color: #fff;
                    }
                  }
                }
                .el-radio {
                  height: 40px;
                  margin-left: 16px;
                  margin-bottom: 0px;
                  vertical-align: top;
                  &.otherRadio {
                    height: 48px;
                    max-width: 455px !important;
                  }
                }
              }
              .formItemContentChild {
                position: relative;
                left: 21px;
                .status-icon {
                  font-size: 14px;
                }
              }
            }
            .formItem:nth-of-type(1) {
              padding-top: 64px;
            }
            .exitRegistrationReason {
              height: auto;
              padding-bottom: 8px;
              box-sizing: border-box;
              background: #f2f2f2;
              .exitRegistrationReasonBox {
                height: 100%;
                background: #fff;
                position: relative;
              }
            }
            .exitRegistrationAutograph {
              height: 254px;
              box-sizing: border-box;
              background: #f2f2f2;
              .exitRegistrationAutographBox {
                height: 100%;
                background: #fff;
                .signItemTop {
                  > div {
                    float: left;
                  }
                }
              }
            }
            .titleContent {
              height: 42px;
              padding-left: 16px;
              line-height: 42px;
              border-bottom: 1px solid #ccc;
              box-sizing: border-box;
              font-size: 14px;
              text-align: left;
            }
          }
        }
      }
    }
    .footerBtn {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 48px;
      padding-top: 8px;
      box-sizing: border-box;
      text-align: center;
      border-top: 1px solid #ddd;
      background: #fff;
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
}
</style>
