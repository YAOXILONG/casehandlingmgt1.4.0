<template>
  <watermarkContent>
    <div class="temApplication-add-box add-edit-from-box full">
      <PathDesc :path-desc-arr="pathDescArr" :is-back="true"></PathDesc>
      <el-scrollbar
        v-loading="loadingInstance"
        wrap-class="scrollbarWrap"
        view-class="scrollbarView"
        ref="scrollbar"
      >
        <div id="applicationDetailSituation" class="applicationDetailSituation">
          <div class="applicationDetailSituationTableBox">
            <div class="tableContent clearfix">
              <ul class="applicationDetailSituationTable clearfix">
                <el-col :span="24">
                  <li class="tableItemTitle">
                    <div class="tableItemCon" title="涉案人员信息">
                      涉案人员信息
                    </div>
                  </li>
                </el-col>
                <el-col :span="9">
                  <li class="tableItem">
                    <div class="tableItemLabel">姓名</div>
                    <div
                      class="tableItemCon"
                      :title="
                        currentPerson.registerName ||
                        currentPerson.suspectName ||
                        ''
                      "
                    >
                      {{
                        currentPerson.registerName ||
                        currentPerson.suspectName ||
                        ""
                      }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="9">
                  <li class="tableItem">
                    <div class="tableItemLabel">性别</div>
                    <div
                      class="tableItemCon"
                      :title="
                        sexMap[currentPerson.registerSex] ||
                        sexMap[currentPerson.sex]
                      "
                      v-if="
                        sexMap[currentPerson.registerSex] ||
                        sexMap[currentPerson.sex]
                      "
                    >
                      {{
                        sexMap[currentPerson.registerSex] ||
                        sexMap[currentPerson.sex]
                      }}
                    </div>
                    <div class="tableItemCon" v-else>-</div>
                  </li>
                </el-col>
                <el-col :span="6">
                  <li class="tableItemPhoto">
                    <div class="tableItemCon" title="涉案人员照片">
                      <img
                        v-if="
                          currentPerson.registerPhotoUrl ||
                          currentPerson.suspectPhotoUrl
                        "
                        :src="
                          currentPerson.registerPhotoUrl ||
                          currentPerson.suspectPhotoUrl
                        "
                        width="90px"
                        height="119px"
                         alt=""
                      />
                      <img
                        v-else
                        :src="require('../../assets/image/u5576.png')"
                        width="90px"
                        height="119px"
                      />
                    </div>
                  </li>
                </el-col>
                <el-col :span="9">
                  <li class="tableItem">
                    <div class="tableItemLabel">证件类型</div>
                    <div
                      class="tableItemCon"
                      :title="
                        idcardTypeMap[currentPerson.idcardType] ||
                        idcardTypeMap[currentPerson.certificateType]
                      "
                    >
                      {{
                        idcardTypeMap[currentPerson.idcardType] ||
                        idcardTypeMap[currentPerson.certificateType]
                      }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="9">
                  <li class="tableItem">
                    <div class="tableItemLabel">证件号码</div>
                    <div
                      class="tableItemCon"
                      :title="
                        currentPerson.idcardNo ||
                        currentPerson.certificateNo ||
                        ''
                      "
                    >
                      {{
                        currentPerson.idcardNo ||
                        currentPerson.certificateNo ||
                        ""
                      }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="9">
                  <li class="tableItem">
                    <div class="tableItemLabel">出生日期</div>
                    <div
                      class="tableItemCon"
                      :title="
                        currentPerson.registerBirth ||
                        currentPerson.birthday ||
                        ''
                      "
                    >
                      {{
                        currentPerson.registerBirth ||
                        currentPerson.birthday ||
                        ""
                      }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="9">
                  <li class="tableItem">
                    <div class="tableItemLabel">联系方式</div>
                    <div
                      class="tableItemCon"
                      :title="
                        currentPerson.telPhone || currentPerson.mobile || ''
                      "
                    >
                      {{ currentPerson.telPhone || currentPerson.mobile || "" }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="24">
                  <li class="tableItemTitle">
                    <div class="tableItemCon" title="办案信息">办案信息</div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">办案区</div>
                    <div
                      class="tableItemCon"
                      :title="currentPerson.areaName || ''"
                    >
                      {{ currentPerson.areaName || "" }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">人员类型</div>
                    <div
                      class="tableItemCon"
                      :title="
                        personTypeMap[currentPerson.personType] ||
                        personTypeMap[currentPerson.suspectType] ||
                        ''
                      "
                    >
                      {{
                        personTypeMap[currentPerson.personType] ||
                        personTypeMap[currentPerson.suspectType] ||
                        ""
                      }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">关联警情</div>
                    <div
                      class="tableItemCon"
                      :title="
                        currentPerson.policeSituationNo ||
                        currentPerson.policingAlertNo ||
                        ''
                      "
                    >
                      {{
                        currentPerson.policeSituationNo ||
                        currentPerson.policingAlertNo ||
                        ""
                      }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">关联案件</div>
                    <div
                      class="tableItemCon"
                      :title="(currentPerson.caseName + '(' + currentPerson.caseNo + ')') || ''"
                    >
                      {{  currentPerson.caseName ? (currentPerson.caseName + "(" + currentPerson.caseNo + ")") : ""}}
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">办案部门</div>
                    <div
                      class="tableItemCon"
                      :title="currentPerson.deptName || ''"
                    >
                      {{ currentPerson.deptName || "" }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">案由</div>
                    <div
                      class="tableItemCon"
                      :title="briefMap[currentPerson.caseCause] || ''"
                    >
                      {{ briefMap[currentPerson.caseCause] || "" }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">入区原由</div>
                    <div
                      class="tableItemCon"
                      :title="
                        registerTypeMap[currentPerson.registerType]
                      "
                    >
                      {{
                        registerTypeMap[currentPerson.registerType]
                      }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">主办民警</div>
                    <div
                      class="tableItemCon"
                      :title="currentPerson.hostPoliceName"
                    >
                      {{ currentPerson.hostPoliceName }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="24">
                  <li class="tableItem">
                    <div class="tableItemLabel">协办民警</div>
                    <div
                      class="tableItemCon"
                      :title="currentPerson.auxiliaryPoliceName || ''"
                    >
                      {{ currentPerson.auxiliaryPoliceName || "" }}
                    </div>
                  </li>
                </el-col>
              </ul>
            </div>
          </div>
          <div class="applyInfo">
            <div class="applyInfoTitle">申请信息</div>
            <el-form
              class="applyInfoForm"
              label-position="top"
              :model="ruleForm"
              :rules="rules"
              label-width="90px"
              content-width="480px"
              ref="ruleForm"
            >
              <el-col :span="12">
                <el-form-item label="出区原由" prop="applyReason">
                <el-select
                  v-model="ruleForm.applyReason"
                  placeholder="请选择"
                  filterable
                  clear
                >
                  <el-option
                    v-for="item in temporaryLeaveReasonList"
                    :key="item.key"
                    :label="item.name"
                    :value="item.key"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              </el-col>
              <el-col :span="12">
              <el-form-item label="审批人" prop="approvalUser">
                <el-select
                  v-model="ruleForm.approvalUser"
                  placeholder="请选择"
                  filterable
                  clear
                >
                  <el-option
                    v-for="item in approvalUserList"
                    :key="item.personIndexCode"
                    :label="`${item.personName}(${item.deptName})`"
                    :value="item.personIndexCode"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              </el-col>
              <el-col :span="12">
              <el-form-item label="申请人" prop="applyUser">
                <el-input
                  v-model="ruleForm.applyUserName"
                  placeholder="请选择"
                  readonly
                >
                  <template slot="append"
                    ><el-button @click="changeApplyUser"
                      >选择</el-button
                    ></template
                  >
                </el-input>
            </el-form-item>
              </el-col>
            </el-form>
          </div>
        </div>
      </el-scrollbar>
      <div class="form-btns">
        <el-button
          class="add-edit-btn"
          type="primary"
          @click="submitForm('ruleForm')"
        >
          确定
        </el-button>
        <el-button class="add-edit-btn" @click="goBack"> 取消 </el-button>
      </div>
    </div>
      <ShuttleBox
        ref="ShuttleBoxSingle2"
        @ShuttleEvent="ShuttleEvent2"
        :currentCodes="ruleForm.applyUser"
        :disabledData="disabledDataForApplyUser"
        :tree-data="orgTreeSingle2"
        :left-table-data="personByOrg"
        :multiple="false"
      ></ShuttleBox>
  </watermarkContent>
</template>

<script>
import PathDesc from "./components/PathDesc";
import server from "../../server/exitApplication";
import ShuttleBox from "@/components/ShuttleBoxNew/index";
export default {
  name: "ExitApplicationAdd",
  data() {
    return {
      pathDescArr: [
        "临时出区申请",
        `${this.$route.query.id ? "编辑" : "新建"}`,
      ],
      inqDictList: [],
      currentPerson: {},
      idcardTypeMap: {},
      registerTypeMap: {},
      personTypeMap: {},
      sexMap: {},
      briefMap: {},
      loadingInstance: false,
      applyType: 4,
      ruleForm: {
        applyReason: "",
        approvalUser: "",
        applyUser: "",
        applyUserData: {},
        applyUserName: "",
      },
      submitFormLoading: false,
      temporaryLeaveReasonList: [],
      orgTreeSingle2: [],
      personByOrg: [],
      rules: {
        applyReason: [
          { required: true, message: "请选择", trigger: "change,blur" },
        ],
        approvalUser: [
          { required: true, message: "请选择", trigger: "change,blur" },
        ],
        applyUser: [
          { required: true, message: "请选择", trigger: "change,blur" },
        ]
      },
      approvalUserList: [],
      disabledDataForApplyUser: ""
    };
  },
  methods: {
    computedDic(list) {
      let dicMap = {};
      if (list && list.length) {
        for (let i = 0; i < list.length; i++) {
          dicMap[list[i].key] = list[i].name;
        }
      }
      return dicMap;
    },
    // 数据字典
    async inqDict() {
      let res = await server.inqDict();
      if (res.data.code === "0") {
        let data = res.data.data;
        this.inqDictList = data;
        let sexData = data.sex;
        let personType = data.suspectType;
        this.sexMap = this.computedDic(sexData);
        this.personTypeMap = this.computedDic(personType);
        this.idcardTypeMap = this.computedDic(this.inqDictList.certificateType);
        this.registerTypeMap = this.computedDic(this.inqDictList.registerType);
        this.briefMap = this.computedDic(this.inqDictList.brief);
        this.temporaryLeaveReasonList = this.inqDictList.temporaryLeaveReason;
        if(this.$route.query.currentUserInfo) {
            this.ruleForm ={
              ...this.ruleForm,
              applyUser: this.$route.query.currentUserInfo.personCode || "",
              applyUserData: {
                personName: this.$route.query.currentUserInfo.name || "",
                personIndexCode: this.$route.query.currentUserInfo.personCode || "",
                certificateNumber: this.$route.query.currentUserInfo.cardNo || "",
              },
              applyUserName: this.$route.query.currentUserInfo.name || "",
            }
      }
      } else {
        this.$messagebox(res);
      }
    },
    //选择申请人
    async changeApplyUser() {
      const result = await server.loadOrgTree();
      const { data } = result;
      if (data.code === "0") {
        this.orgTreeSingle2 = data.data;
        this.$refs.ShuttleBoxSingle2.dialogFormVisible = true;
      } else {
        this.$messagebox(result);
      }
    },
     ShuttleEvent2(val) {
      if (val && val.type == "close") {
        val.payload.close();
      } else if (val.type == "getLeftData") {
        if (
          this.$refs.ShuttleBoxSingle2 &&
          !this.$refs.ShuttleBoxSingle2.dialogFormVisible
        ) {
          return;
        }
        let params = {
          deptIndexCodeList: [val.payload.indexCode],
          personName: val.payload.personName ? val.payload.personName : "",
        };
        this.queryPagePersons(1, params);
      } else if (val.type == "selectData") {
        this.ruleForm.applyUser =
          val.payload.data.personIndexCode;
        this.ruleForm.applyUserData = val.payload.data;
        this.ruleForm.applyUserName = `${val.payload.data.personName}`;
        val.payload.close();
      } else if (val.type == "beforeCLose") {
        val.payload.done();
      }
    },
    // 获取警员账号信息
    async queryPagePersons(number, param) {
      let params = {
        ...param,
        pageNo: number,
        pageSize: 1000,
      };
      const result = await server.queryPagePersons(params);
      const { data } = result;
      if (data.code === "0") {
        if (number == 1) {
          this.personByOrg = data.data.list;
        } else {
          this.personByOrg = this.personByOrg.concat(data.data.list);
        }
        if (data.data.pageNo != Math.floor(data.data.total / 1000) + 1) {
          // console.log("hhh", 1);
          this.queryPagePersons(data.data.pageNo - 0 + 1, param);
        }
      } else {
        this.$messagebox(result);
      }
    },
    // 查询办案区配置参数
    async getApproval(areaCode) {
      const { data } = await server.getApproval({
        areaIndexCode: areaCode,
      });
      if (data.code === "0") {
        if (data.data) {
          var _data = JSON.parse(JSON.stringify(data.data));
          if(!this.$route.query.id)
          this.ruleForm = {
            ...this.ruleForm,
            approvalUser: _data.defaultApprovalUser || "",
          };
          if (_data.approvalUserList.length) {
            this.loadOrgPersonInfo(_data.approvalUserList);
          }
        }else{
          this.ruleForm.approvalUser = ''
        }
      } else {
        this.$message.error(this.$i18n.t(data.code));
      }
    },
    //根据人员编码列表查找人员详细信息
    async loadOrgPersonInfo(approvalUserList) {
      const param = {
        personIndexCodes: approvalUserList,
      };
      const { data } = await server.loadOrgPersonInfo(param);
      if (data.code == "0") {
        this.approvalUserList = data.data;
      } else {
        this.$message.error(this.$i18n.t(data.code));
      }
    },
    submitForm(formName) {
      if (this.submitFormLoading) {
        return false;
      }
      // if(!this.ruleForm.approvalUser) {
      //   this.$message.error('该办案区还未配置审批人！')
      //   return false;
      // }
      this.$refs[formName].validate(async (valid) => {
       if(this.approvalUserList.length) {
          var result = this.approvalUserList.findIndex(item =>{
            return item.personIndexCode == this.ruleForm.approvalUser
          });
          if(result < 0) {
            this.ruleForm = {
              ...this.ruleForm,
              approvalUser: ''
            }
            return false
          }
        }
        if (valid) {
          let applyUserName = "";
          let applyUserNo ="";
          applyUserName = this.ruleForm.applyUserData.personName;
          applyUserNo = this.ruleForm.applyUserData.certificateNumber;
          let params = {
            applyIndexCode: this.currentPerson.applyIndexCode,
            registerIndexCode: this.currentPerson.registerCode || this.currentPerson.registerIndexCode,
            applyType: this.applyType,
            ...this.ruleForm,
            applyUserName,
            applyUserNo,
          };
          this.submitFormLoading = true;
          if (this.$route.query.id) {
            const result = await server.updateExitApplication(params);
            const { data } = result;
            if (data.code === "0") {
              this.$message.success("保存成功");
              this.submitFormLoading = false;
              this.goBack();
            } else {
              this.submitFormLoading = false;
              this.$messagebox(result);
            }
          } else {
            const result = await server.addExitApplication(params);
            const { data } = result;
            if (data.code === "0") {
              this.$message.success("保存成功");
              this.submitFormLoading = false;
              this.goBack();
            } else {
              this.submitFormLoading = false;
              this.$messagebox(result);
            }
          }
        } else {
          return false;
        }
      });
    },
    goBack() {
      this.$router.push({ name: "index", params: {} });
    },
    async getExitApplication() {
      this.loadingInstance = true;
      let params = {
        applyIndexCode: this.$route.query.id,
      };
      try {
        let res = await server.getExitApplication(params);
        if (res.data.code === "0") {
          let data = res.data.data;
          if (data) {
            this.currentPerson = JSON.parse(JSON.stringify(data));
            this.ruleForm = {
              ...this.ruleForm,
              applyReason: this.currentPerson.applyReason || '',
              approvalUser: this.currentPerson.approvalUser || '',
              applyUser: this.currentPerson.applyUser || "",
              applyUserData: {
                  personName: this.currentPerson.applyUserName || "",
                  personIndexCode: this.currentPerson.applyUser || "",
                  certificateNumber: this.currentPerson.applyUserNo || "",
                },
              applyUserName: this.currentPerson.applyUserName || "",
            };
          } else {
            this.currentPerson = {};
            this.$message({
              type: "warning",
              message: "暂无人员信息",
            });
          }
          this.getApproval(this.currentPerson.areaIndexCode);
          this.loadingInstance = false;
        } else {
          this.loadingInstance = false;
          this.$messagebox(res);
        }
      } catch {
        this.loadingInstance = false;
      }
    },
  },
  created() {
    this.inqDict();
    if (!this.$route.query.id) {
      this.currentPerson = JSON.parse(
        JSON.stringify(this.$route.query.peosonCurrentItem)
      );
      this.getApproval(this.currentPerson.areaCode);
    } else {
      this.getExitApplication();
    }
  },
  components: { PathDesc, ShuttleBox},
};
</script>

<style lang="less" rel="stylesheet/less">
.temApplication-add-box {
  min-width: 1366px;
  height: 100%;
  overflow: hidden;
  color: #4d4d4d;
  box-sizing: border-box;
  position: relative;

  * {
    box-sizing: border-box;
  }
  .el-scrollbar .has-gutter{
     height: calc(100% - 49px)
   }
  .el-scrollbar__wrap {
    margin-bottom: 86px !important;
  }
  .el-scrollbar__bar.is-vertical {
    height: calc(100% - 100px)!important
   }
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
            // font-family: PingFangSC-Semibold;
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
            width: ~"calc(100% - 120px)";
            text-align: left;
            text-indent: 14px;
            // font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #4d4d4d;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .status-icon {
            padding: 0px 12px 0px 0px !important;
            font-size: 16px;
          }
          > div {
            height: 40px;
            float: left;
            line-height: 40px;
            text-align: center;
            border-right: 1px solid #ddd;
          }
        }
        .tableItemTitle {
          width: 100%;
          height: 40px;
          border-bottom: 1px solid #ddd;
          .tableItemCon {
            width: ~"calc(100%)";
            text-align: center;
            text-indent: 14px;
            // font-family: PingFangSC-Regular;

            font-weight: 700;
            font-style: normal;
            font-size: 18px;
            color: #4d4d4d;
            line-height: 38px;

            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          > div {
            height: 40px;
            float: left;
            line-height: 40px;
            text-align: center;
            border-right: 1px solid #ddd;
          }
        }
        .tableItemPhoto {
          width: 100%;
          height: 120px;
          border-bottom: 1px solid #ddd;
          .tableItemCon {
            width: ~"calc(100%)";
            text-align: center;
            text-indent: 14px;
            // font-family: PingFangSC-Regular;
            font-weight: 700;
            font-style: normal;
            font-size: 18px;
            color: #4d4d4d;
            line-height: 33px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          > div {
            height: 120px;
            float: left;
            line-height: 120px;
            text-align: center;
            border-right: 1px solid #ddd;
          }
        }
      }
    }
    .applyInfo {
      .applyInfoTitle {
        width: ~"calc(100% - 2px)";
        text-align: left;
        text-indent: 14px;
        // font-family: PingFangSC-Regular;
        font-weight: 700;
        font-style: normal;
        font-size: 18px;
        color: #4d4d4d;
        line-height: 33px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        // position: relative;
        // left: 96px;
        display: inline-block;
        text-align: center;
      }
      .applyInfoForm {
        margin-top: 20px;
        // display: flex;
        // justify-content: space-around
        .el-col:first-child,.el-col:last-child {
          padding-left: 21%
        }
        .el-col:nth-child(2) {
          padding-left: 3.5%
        }
        .el-col:last-child {
          .div:first-child{
            margin-bottom: 69px;
          }
        }
      }
    }
  }
  .form-btns {
    position: fixed;
    bottom: 0px;
    z-index: 1000;
  }
}
</style>
