<template>
  <watermarkContent>
    <div class="entry-application-detail-box add-edit-from-box full">
      <PathDesc :path-desc-arr="pathDescArr" :is-back="true"></PathDesc>
      <el-scrollbar
        v-loading="loadingInstance"
        wrap-class="scrollbarWrap"
        view-class="scrollbarView"
        ref="scrollbar"
      >
        <div id="applicationDetailSituation" class="applicationDetailSituation">
        <div class="leftTableInfo">
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
                      :title="currentPerson.suspectName || ''"
                    >
                      {{ currentPerson.suspectName || "" }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="9">
                  <li class="tableItem">
                    <div class="tableItemLabel">性别</div>
                    <div
                      class="tableItemCon"
                      :title="sexMap[currentPerson.sex]"
                      v-if="sexMap[currentPerson.sex]"
                    >
                      {{ sexMap[currentPerson.sex] }}
                    </div>
                    <div class="tableItemCon" v-else>-</div>
                  </li>
                </el-col>
                <el-col :span="6">
                  <li class="tableItemPhoto">
                    <div class="tableItemCon" title="涉案人员照片">
                      <img
                        v-if="currentPerson.suspectPhotoUrl"
                        :src="currentPerson.suspectPhotoUrl"
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
                      :title="idcardTypeMap[currentPerson.certificateType]"
                    >
                      {{ idcardTypeMap[currentPerson.certificateType] }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="9">
                  <li class="tableItem">
                    <div class="tableItemLabel">证件号码</div>
                    <div
                      class="tableItemCon"
                      :title="currentPerson.certificateNo || ''"
                    >
                      {{ currentPerson.certificateNo || "" }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="9">
                  <li class="tableItem">
                    <div class="tableItemLabel">出生日期</div>
                    <div
                      class="tableItemCon"
                      :title="currentPerson.birthday || ''"
                    >
                      {{ currentPerson.birthday || "" }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="9">
                  <li class="tableItem">
                    <div class="tableItemLabel">联系方式</div>
                    <div
                      class="tableItemCon"
                      :title="currentPerson.telPhone || ''"
                    >
                      {{ currentPerson.telPhone || "" }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="24">
                  <li class="tableItem">
                    <div class="tableItemLabel">现住址</div>
                    <div
                      class="tableItemCon"
                      :title="currentPerson.currentAddress || ''"
                    >
                      {{ currentPerson.currentAddress || "" }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="24">
                  <li class="tableItem">
                    <div class="tableItemLabel">户籍地址</div>
                    <div
                      class="tableItemCon"
                      :title="currentPerson.permanentAddress || ''"
                    >
                      {{ currentPerson.permanentAddress || "" }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">人大代表</div>
                    <div
                      class="tableItemCon"
                      v-if="currentPerson.npcMember == 1"
                    >
                      是
                    </div>
                    <div class="tableItemCon" v-else>否</div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">曾用名</div>
                    <div
                      class="tableItemCon"
                      :title="currentPerson.usedName || ''"
                    >
                      {{ currentPerson.usedName || "" }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">国家/地区</div>
                    <div
                      class="tableItemCon"
                      :title="nationalityMap[currentPerson.nationality] || ''"
                    >
                      {{ nationalityMap[currentPerson.nationality] || "" }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">民族</div>
                    <div
                      class="tableItemCon"
                      :title="nationMap[currentPerson.nation] || ''"
                    >
                      {{ nationMap[currentPerson.nation] || "" }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">政治面貌</div>
                    <div
                      class="tableItemCon"
                      :title="politicalMap[currentPerson.political] || ''"
                    >
                      {{ politicalMap[currentPerson.political] || "" }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">文化程度</div>
                    <div
                      class="tableItemCon"
                      :title="educationMap[currentPerson.education] || ''"
                    >
                      {{ educationMap[currentPerson.education] || "" }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">工作单位</div>
                    <div
                      class="tableItemCon"
                      :title="currentPerson.workUnit || ''"
                    >
                      {{ currentPerson.workUnit || "" }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">担任职位</div>
                    <div class="tableItemCon" :title="currentPerson.job || ''">
                      {{ currentPerson.job || "" }}
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
                      :title="personTypeMap[currentPerson.suspectType] || ''"
                    >
                      {{ personTypeMap[currentPerson.suspectType] || "" }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">关联警情</div>
                    <div
                      class="tableItemCon"
                      :title="currentPerson.policeSituationNo || ''"
                    >
                      {{ currentPerson.policeSituationNo || "" }}
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
                      {{ currentPerson.caseName ? (currentPerson.caseName + "(" + currentPerson.caseNo + ")") : "" }}
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
                    <div class="tableItemLabel">主办民警</div>
                    <div
                      class="tableItemCon"
                      :title="currentPerson.hostPoliceName"
                    >
                      {{ currentPerson.hostPoliceName }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
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
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">快办</div>
                    <div
                      class="tableItemCon"
                      v-if="currentPerson.fastSolve == 1"
                    >
                      是
                    </div>
                    <div class="tableItemCon" v-else>否</div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">文书编号</div>
                    <div
                      class="tableItemCon"
                      :title="currentPerson.docNo || ''"
                    >
                      {{ currentPerson.docNo || "" }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="24">
                  <li class="tableItemTitle">
                    <div class="tableItemCon" title="申请信息">申请信息</div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">入区原由</div>
                    <div
                      class="tableItemCon"
                      :title="registerTypeMap[currentPerson.applyReason]"
                    >
                      {{ registerTypeMap[currentPerson.applyReason] }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">申请人</div>
                    <div
                      class="tableItemCon"
                      :title="currentPerson.applyUserName || ''"
                    >
                      {{ currentPerson.applyUserName || ''}}
                    </div>
                  </li>
                </el-col>
                <el-col :span="24">
                  <li class="tableItem">
                    <div class="tableItemLabel">预计到达时间</div>
                    <div
                      class="tableItemCon"
                      :title="
                        currentPerson.estimatedArrivalTime
                          ? $moment(currentPerson.estimatedArrivalTime).format(
                              'YYYY-MM-DD HH:mm:ss'
                            )
                          : ''
                      "
                    >
                      {{
                        currentPerson.estimatedArrivalTime
                          ? $moment(currentPerson.estimatedArrivalTime).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )
                          : ""
                      }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">审批人</div>
                    <div
                      class="tableItemCon"
                      :title="currentPerson.approvalUserName || '--'"
                    >
                      {{ currentPerson.approvalUserName || "--" }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">审批状态</div>
                    <div
                      class="tableItemCon"
                    >
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
                        v-if="currentPerson.applyStatus == 3"
                        >--</span
                      >
                    </div>
                  </li>
                </el-col>
                <el-col :span="24" v-if="currentPerson.applyStatus == 1">
                  <li class="tableItem">
                    <div class="tableItemLabel">退回原因</div>
                    <div
                      class="tableItemCon"
                      :title="currentPerson.approvalOpinion || ''"
                    >
                      {{ currentPerson.approvalOpinion || "" }}
                    </div>
                  </li>
                </el-col>
              </ul>
            </div>
          </div>
        </div>
        </div>
        <div class="rightSteps">
              <div class="rightStepsTitle">流转操作记录</div>
              <el-steps :space="150" direction="vertical" :active="active5">
                <el-step
                  v-for="(item, index) in applyCirculationInfo"
                  :key="index"
                  :title="operateTypeMap[item.operateType]"
                >
                 <template slot="icon" >
                  <h-feedback-icon :icon-name="iconMap[item.operateType]" />
                </template>
                  <template slot="description">
                    <div>
                      {{
                        $moment(item.operatingTime).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )
                      }}
                    </div>
                    <div>操作人: {{ item.operatePersonName }}</div>
                    <div v-show="item.reason" :title="item.reason" class="backReason">原因: {{ item.reason }}</div>
                  </template>
                </el-step>
              </el-steps>
            </div>
      </el-scrollbar>
      <div class="form-btns" v-if="currentPerson.applyStatus !== 1">
        <div class="form-btns-center" style="width:85%">
           <el-button class="add-edit-btn" @click="goBack"> 关闭 </el-button>
        </div>
      </div>
      <div class="form-btns" v-else>
        <div class="form-btns-center" style="width:85%">
         <el-button class="add-edit-btn" type="primary" @click="updateHandle">
          编辑
         </el-button>
         <el-button
          class="add-edit-btn"
          v-if="currentPerson.applyUser == currentUser"
          @click="cancelHandle(applyIndexCode)"
        >
          作废
         </el-button>
         <el-button class="add-edit-btn" @click="goBack"> 关闭 </el-button>
        </div>
      </div>
    </div>
  </watermarkContent>
</template>

<script>
import PathDesc from "./components/PathDesc";
import server from "../../server/entryApplication";
export default {
  name: "EntryApplicationDetails",
  data() {
    return {
      active5: 2,
      pathDescArr: ["入区申请", `${this.$route.query.id ? "详情" : ""}`],
      inqDictList: [],
      applyIndexCode: this.$route.query.id,
      currentUser: this.$route.query.currentUser,
      currentPerson: {},
      idcardTypeMap: {},
      registerTypeMap: {},
      personTypeMap: {},
      nationalityMap: {},
      politicalMap: {},
      nationMap: {},
      sexMap: {},
      briefMap: {},
      educationMap: {},
      loadingInstance: false,
      applyCirculationInfo: [],
      operateTypeMap: {
        1: "提交申请",
        2: "已通过",
        3: "已退回",
        4: "已作废",
      },
      iconMap: {
        1: "h-icon-feedback_success_md",
        2: "h-icon-feedback_success_md",
        3: "h-icon-feedback_error_md",
        4: "h-icon-feedback_error_md",
      },
    };
  },
  methods: {
    // 编辑跳转
    updateHandle() {
      this.applyIndexCode &&
        this.$router.push({
          path: "addEdit",
          query: { id: this.applyIndexCode },
        });
    },
    goBack() {
      this.$router.push({ name: "index", params: {} });
    },
    // 作废
    cancelHandle(rowId) {
      this.$nextTick(() => {
        let elMessageBox = document.getElementsByClassName("el-message-box--small")[0].style
        elMessageBox.position = 'relative'
        elMessageBox.left = '-7%'
      })
      this.$confirm("确认作废?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "question",
      }).then(async () => {
        let params = {
          applyIndexCode: rowId,
        };
        const result = await server.cancelEntryApplication(params);
        const { data } = result;
        if (data.code === "0") {
          this.$message.success("作废成功");
          this.goBack();
        } else {
          this.$messagebox(result);
        }
      });
    },
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
        this.nationalityMap = this.computedDic(this.inqDictList.nationality);
        this.idcardTypeMap = this.computedDic(this.inqDictList.certificateType);
        this.registerTypeMap = this.computedDic(this.inqDictList.registerType);
        this.nationMap = this.computedDic(this.inqDictList.nation);
        this.sexMap = this.computedDic(this.inqDictList.sex);
        this.politicalMap = this.computedDic(this.inqDictList.political);
        this.educationMap = this.computedDic(this.inqDictList.education);
        this.briefMap = this.computedDic(this.inqDictList.brief);
      } else {
        this.$messagebox(res);
      }
    },
    async getEntryApplication() {
      this.loadingInstance = true;
      let params = {
        applyIndexCode: this.applyIndexCode,
      };
      try {
        let res = await server.getEntryApplication(params);
        if (res.data.code === "0") {
          let data = res.data.data;
          if (data) {
            this.currentPerson = JSON.parse(JSON.stringify(data));
          } else {
            this.currentPerson = {};
            this.$message({
              type: "warning",
              message: "暂无人员信息",
            });
          }
          this.loadingInstance = false;
        } else {
          this.loadingInstance = false;
          this.$messagebox(res);
        }
      } catch {
        this.loadingInstance = false;
      }
    },
    //查询申请流转操作
    async applyCirculation() {
      let params = {
        applyIndexCode: this.applyIndexCode,
      };
      let res = await server.applyCirculation(params);
      if (res.data.code === "0") {
        let data = res.data.data;
        if (data) {
          this.applyCirculationInfo = data;
        } else {
          this.applyCirculationInfo = [];
        }
      } else {
        this.$messagebox(res);
      }
    },
  },
  created() {
    this.inqDict();
    this.getEntryApplication();
    this.applyCirculation();
  },
  components: { PathDesc },
};
</script>

<style lang="less" rel="stylesheet/less">
.entry-application-detail-box {
  min-width: 1366px;
  height: 100%;
  overflow: hidden;
  color: #4d4d4d;
  box-sizing: border-box;
  position: relative;

  * {
    box-sizing: border-box;
  }
  .el-scrollbar__wrap {
    margin-bottom:73px !important;
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
    .leftTableInfo{
      position: fixed;
      right: 14.92%;
      width: 85%;
      overflow: auto;
      height: 90%;
      // height: calc(100% - 98px);
      height: calc(~"100% - 98px");
      bottom: 50px;
      // top: 48px
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
  }
  .form-btns {
    position: fixed;
    bottom: 0px;
    z-index: 1000;
  }

  .rightSteps {
    width:15%;
    position: fixed;
    top: 48px;
    height: calc(~"100% - 98px");
    right: 0;
    padding-left: 27px;
    padding-top: 9px;
    border-left: 1px solid #D3D3D3;
    overflow-y: scroll;
    padding-bottom: 100px;
    .el-step:last-child {
      height: 240px!important
    }
    .rightStepsTitle {
      text-align: center;
      text-indent: -43px;
      // font-family: PingFangSC-Regular;
      font-weight: 700;
      font-style: normal;
      font-size: 18px;
      color: #4d4d4d;
      line-height: 33px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      // padding-left: 229px;
      position: relative;
      // right: 184px
    }
    // .backReason {
    //   display: -webkit-box;
    //   word-break: break-all;
    //   text-overflow: ellipsis;
    //   overflow: hidden;
    //   -webkit-box-orient: vertical;
    //   -webkit-line-clamp:2;
    // }
    .backReason {
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .el-step__line-inner {
      transition-delay: 0ms!important;
      border-left-width: 1px!important;
      height: 100%!important
    }
    // .iconColoroperateType1 {
    //    font-size: 40px;
    //    .el-step__icon>i {
    //     color: #358df8 !important;
    //    }
    // }
    // .iconColoroperateType3 {
    //   font-size: 40px;
    //    .el-step__icon>i {
    //     color: #d9001b !important;
    //    }
    // }
   .el-step__head.is-text.is-process {
      border-color:#FFFFFF; 
     background-color: #FFFFFF; 
    }
    .el-step__icon>i {
        font-size:28px
    }
    .h-icon-feedback_success_md:before {
      color: #358df8
     }
    .el-step__head.is-text.is-finish,.el-step__head.is-text.is-finish,.el-step__head.is-finish,.el-step__head.is-finish {
      border-color: #FFFFFF; 
      background-color: #FFFFFF
    }
    .el-step.is-vertical .el-step__main {
        display: inline-block;
        padding-left: 8px;
        // margin-top: -22px !important;
        width: calc(74%) !important;
    }
    .el-step--icon .el-step__head {
      border: none;
      height: 2px !important;
    }
  }
}
</style>
