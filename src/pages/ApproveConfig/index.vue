<template>
  <watermarkContent>
    <div class="approve-config">
      <PathDesc :path-desc-arr="$breadcrumb" :is-back="false"></PathDesc>
      <div class="menu-box">
        <div class="menu-title">办案区</div>
        <div class="menu-list">
          <el-scrollbar wrap-class="el-scrollbar__wrap">
            <div
              class="menu-item"
              :class="{ active: areaIndexCode == item.areaIndexCode }"
              v-for="(item, index) in areaList"
              :key="index"
              @click="queryByAreaIndexCode(item)"
            >
              <div class="menu-item-name">
                {{ item.areaName }}
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div class="main-content" v-loading="saveLoading">
        <div class="scrollbar-box">
          <el-form
            :model="ruleForm"
            ref="ruleForm"
            :rules="rules"
            label-position="top"
            class="content-form"
          >
            <div class="form-content">
              <el-form-item label="入区审批" prop="entryApproval">
                <el-switch
                  v-model="ruleForm.entryApproval"
                  :active-value="1"
                  :inactive-value="0"
                >
                </el-switch>
                <div class="time-tips">
                  启用后，入区申请必须进行审批后才能在入区登记签到处显示。
                </div>
              </el-form-item>
              <el-form-item label="临时出区审批" prop="temporaryLeaveApproval">
                <el-switch
                  v-model="ruleForm.temporaryLeaveApproval"
                  :active-value="1"
                  :inactive-value="0"
                >
                </el-switch>
                <div class="time-tips">
                  启用后，必须先进行临时出区审批后才能提交涉案人员临时出区。
                </div>
              </el-form-item>
              <el-form-item label="最终出区审批" prop="leaveApproval">
                <el-switch
                  v-model="ruleForm.leaveApproval"
                  :active-value="1"
                  :inactive-value="0"
                >
                </el-switch>
                <div class="time-tips">
                  启用后，必须先进行出区审批后才能提交涉案人员最终出区。
                </div>
              </el-form-item>
              <el-form-item label="签到超时时间" prop="signOutTime">
                <el-input
                  class="el-input--width"
                  placeholder="请输入"
                  v-model="ruleForm.signOutTime"
                  clearable
                >
                  <span slot="suffix" style="padding-right: 6px">天</span>
                </el-input>
                <div class="time-tips">
                  审批或预约完成后超过该时间则无法签到。
                </div>
              </el-form-item>
              <div class="approvalPeople">审批人员<span style="color: red">*</span></div>
              <ShuttleBox
                ref="ShuttleBoxMultiple"
                @ShuttleEvent="ShuttleEvent"
                :tree-data="orgTreeMultiple"
                :left-table-data="personByOrg"
                :multiple="true"
                :loading="boxLoading"
              ></ShuttleBox>
              <div style="height: 75px"></div>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('ruleForm')">
                  保存
                </el-button>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </watermarkContent>
</template>
<script>
import server from "../../server/approveConfig";
import PathDesc from "./components/PathDesc";
import ShuttleBox from "@/components/ShuttleBoxDedicated/index";

export default {
  name: "ApproveConfig",
  data() {
    var checkExpendNumber = (rule, value, callback) => {
      if (!/^[0-9]+$/g.test(value) || value < 1 || value > 5) {
        callback(new Error("请输入1-5之间的数字"));
      } else {
        callback();
      }
    };
    return {
      orgTreeMultiple: [],
      boxLoading: false,
      personByOrg: [],
      saveLoading: false,
      areaIndexCode: "",
      areaList: [],
      applyConfigId: "",
      ruleForm: {
        entryApproval: 0, //1：开启 0：不开启
        temporaryLeaveApproval: 0, //1：开启 0：不开启
        leaveApproval: 0, //1：开启 0：不开启
        signOutTime: 1, //入区签到超时时间
      },
      defaultApprovalUser: "",
      selectedData: [],
      multiple: true,
      rules: {
        signOutTime: [
          {
            required: true,
            message: "请输入1-5之间的整数",
          },
          { validator: checkExpendNumber, trigger: "change,blur" },
        ],
      },
      flag: false,
      approvalUsers: ''
    };
  },
  mounted() {
    this.findAuthUserPlaceList();
    this.loadOrgTreeByIndexcode();
  },
  methods: {
    // 选择审批人员
    async ShuttleEvent(val) {
      if (val.type === "getLeftData") {
        let params = {
          deptIndexCodeList: val.payload.indexCode,
          personName: val.payload.personName,
          pageNo: 1,
          pageSize: 1000,
        };
        const { data } = await server.queryPagePersons(params);
        if (data.code == "0") {
          this.personByOrg = data.data.list;
        } else {
          this.$message.error(this.$t(data.code));
        }
      } else if (val.type === "close") {
        val.payload.close();
      } else if (val.type === "beforeCLose") {
        val.payload.done();
      } else if (val.type === "selectData") {
        let selectedData = val.payload.data;
        if(selectedData.length) {
          this.flag= true
          if (Array.isArray(selectedData)) {
            let list = [];
            selectedData.forEach((el) => {
              list.push({
                personIndexCode: el.personIndexCode,
                isDefaultApprovalUser: el.isDefaultApprovalUser,
              });
            });
            this.selectedData = list;
          }
        }else{
          this.flag = false
        }
        // val.payload.close();
      }
    },
    // 根据办案区查询配置参数
    queryByAreaIndexCode(item) {
      this.flag=false
      this.areaIndexCode = item.areaIndexCode;
      this.ruleForm = {
        entryApproval: 0, //1：开启 0：不开启
        temporaryLeaveApproval: 0, //1：开启 0：不开启
        leaveApproval: 0, //1：开启 0：不开启
        signOutTime: 1, //入区签到超时时间
      };
      this.applyConfigId = "";
      this.$refs.ShuttleBoxMultiple.setRightData([]);
      this.getApproval();
    },
    // 查询办案区列表
    async findAuthUserPlaceList() {
      const { data } = await server.findAuthUserPlaceList();
      if (data.code === "0") {
        this.areaList = data.data.list;
        this.areaIndexCode = data.data.list[0].areaIndexCode;
        this.getApproval();
      } else {
        this.$message.error(this.$i18n.t(data.code));
      }
    },
    // 查询办案区配置参数
    async getApproval() {
      const { data } = await server.getApproval({
        areaIndexCode: this.areaIndexCode,
      });
      if (data.code === "0") {
        if (data.data) {
          this.ruleForm = JSON.parse(JSON.stringify(data.data));
          this.defaultApprovalUser = this.ruleForm.defaultApprovalUser || "";
          this.applyConfigId = this.ruleForm.applyConfigId || "";
          if (this.ruleForm.approvalUserList.length) {
            this.loadOrgPersonInfo(this.ruleForm.approvalUserList);
          }
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
        var _data = data.data;
        _data.forEach((item) => {
          if (item.personIndexCode == this.defaultApprovalUser) {
            item.isDefaultApprovalUser = true;
          }
        });
        this.$refs.ShuttleBoxMultiple.setRightData(_data);
      } else {
        this.$message.error(this.$i18n.t(data.code));
      }
    },
    // 保存配置
    async saveApprovalConfig() {
      if(!this.flag){
        this.selectedData = []
        this.defaultApprovalUser = ''
        this.approvalUsers =""
      }
      if(this.selectedData.length < 1) {
        this.$message.error('请至少选择一个审批人！')
        return false
      }
      const param = {
        ...this.ruleForm,
        areaIndexCode: this.areaIndexCode,
        approvalUserList: this.selectedData,
        defaultApprovalUser: this.defaultApprovalUser,
        applyConfigId: this.applyConfigId,
        approvalUsers: this.approvalUsers
      };
      this.saveLoading = true;
      const { data } = await server.saveApprovalConfig(param);
      if (data.code === "0") {
        this.$message.success("保存成功");
        this.getApproval();
      } else {
        this.$message.error(this.$i18n.t(data.code));
      }
      this.saveLoading = false;
    },
    // 表单验证提交
    submitForm(formName) {
      this.$refs.ShuttleBoxMultiple.onsubmit();
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var newArrar = [];
          var newArr = [];
          this.selectedData.forEach((item) => {
            newArr.push(item.personIndexCode);
            if (item.isDefaultApprovalUser == true) {
              newArrar.push(item);
            }
          });
          var result = this.selectedData.findIndex(item =>{
             return item.isDefaultApprovalUser == true 
          });
          if(result < 0) {
            this.defaultApprovalUser = ''
          }
          this.selectedData = newArr;
          if (newArrar.length > 1) {
            this.$message.error("默认审批人只能设置一个！");
            return false;
          }
          if (newArrar.length == 1) {
            this.defaultApprovalUser = newArrar[0].personIndexCode;
          }
          if (this.selectedData.length > 10) {
            this.$message.error("审批人最多设置10个！");
            return false;
          } else {
            this.saveApprovalConfig();
          }
        } else {
          return false;
        }
      });
    },
    //查询组织树
    async loadOrgTreeByIndexcode() {
      const result = await server.loadOrgTree();
      const { data } = result;
      if (data.code === "0") {
        this.orgTreeMultiple = data.data;
      } else {
        this.$messagebox(result);
      }
    },
  },
  mixins: [],
  components: { PathDesc, ShuttleBox },
};
</script>
<style lang="less" rel="stylesheet/less">
.approve-config {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  // overflow-y: scroll;
  * {
    box-sizing: border-box;
  }
  .menu-box {
    display: inline-block;
    width: 280px;
    height: ~"calc(100% - 80px)";
    vertical-align: top;
    font-size: 14px;
    border-right: solid 1px #e5e5e5;
    .menu-title {
      font-size: 16px;
      height: 40px;
      line-height: 40px;
      padding-left: 15px;
      padding-right: 15px;
      width: 100%;
      background: #f5f5f5;
      border-bottom: solid 1px #e5e5e5;
      .menu-title-ctrl {
        font-size: 12px;
        color: #2080f7;
        float: right;
        cursor: pointer;
      }
    }
    .menu-list {
      height: ~"calc(100% - 40px)";
      padding: 0px 7px;
      position: relative;
      .el-scrollbar__wrap {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
      .menu-item {
        border-bottom: solid 1px #e5e5e5;
        height: 40px;
        padding-left: 8px;
        padding-top: 12px;
        cursor: pointer;
        &:hover {
          background: #f5f5f5;
        }
        &.active {
          background: #e9f2fe;
        }
      }
    }
  }
  .main-content {
    background: #FFFFFF;
    height: ~"calc(100% - 52px)";
    width: ~"calc(100% - 280px)";
    vertical-align: top;
    display: inline-block;
    position: relative;
    overflow-y: scroll;
    .scrollbar-box {
      height: ~"calc(100% - 40px)";
      padding: 8px;
      border-top: solid 1px #e5e5e5;
      .content-form {
        height: 100%;
      }
      .dialog-footer {
          position: fixed;
          display: inline-block;
          width: 100%;
          text-align: center;
          height: 49px;
          /* top: 42px; */
          left: 8px;
          background-color: white;
          bottom: -10px;
          border-top: 1px solid #e5e5e5;
          padding-bottom: 8px;
          z-index: 10000;
          .el-button {
            position: relative;
            top: 4px;
          }
      }
    }
    .el-scrollbar__wrap {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .time-tips {
      font-size: 14px;
      color: #777777;
    }
    .form-content {
      background: #ffffff;
      padding: 11px 0px 1px 18px;
      margin-bottom: 10px;
      .approvalPeople {
        position: relative;
        left: 10px;
        bottom: -9px;
        width: 90%;
      }
      .el-form-item {
        width: 532px;
        margin-left: 10px;
        margin-right: auto;
        margin-bottom: 10px !important;
        .el-input-group__append {
          color: #999999;
          border: none;
          position: relative;
          left: -40px;
          background: transparent;
        }
      }
    }
  }
}
</style>
