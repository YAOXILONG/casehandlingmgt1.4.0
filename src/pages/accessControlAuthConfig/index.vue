<!--
 * @Description: 
 * @Version: 1.3
 * @Autor: jinxiaoxu
 * @Date: 2021-05-10 19:59:27
 * @LastEditors: jinxiaoxu
 * @LastEditTime: 2021-05-13 15:18:23
-->
<template>
  <h-page-container class="accessControlAuthConfigPage">
    <h-page-header slot="pageHeader" :breadcrumb="$breadcrumb" />
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
    <div class="accessControlAuthConfigBox">
      <el-scrollbar wrap-class="scrollbarWrap" view-class="scrollbarView">
        <div class="accessControlAuthConfigFormBox">
          <el-form
            :model="ruleForm"
            label-position="top"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <!-- <el-form-item label="入区预约" prop="entryBooking">
              <el-switch
                on-text=""
                off-text=""
                v-model="ruleForm.entryBooking"
                @change="switchVal('entryTime', $event)"
              ></el-switch>
              <div class="switchInfo">
                开启后，入区预约成功后根据预计到达时间提前下发相关民警权限至相应门禁。
              </div>
            </el-form-item>
            <el-form-item
              label="入区预约门禁权限提前下发时间"
              prop="entryTime"
              v-if="ruleForm.entryBooking"
            >
              <el-input v-model.number="ruleForm.entryTime">
                <span slot="suffix" style="padding-right:6px">分钟</span>
              </el-input>
            </el-form-item> -->
            <el-form-item label="入区登记" prop="register ">
              <el-switch
                on-text=""
                off-text=""
                v-model="ruleForm.register"
              ></el-switch>
              <div class="switchInfo">
                开启后，入区登记成功后自动下发主办、协办民警权限至相应办案区门禁。
              </div>
            </el-form-item>
            <el-form-item label="候问分配" prop="waitRoom ">
              <el-switch
                on-text=""
                off-text=""
                @change="switchVal('waitLeaveTime', $event)"
                v-model="ruleForm.waitRoom"
              ></el-switch>
              <div class="switchInfo">
                开启后，涉案人员分配进去则下发相关民警权限至相应候问室门禁。
              </div>
            </el-form-item>
            <el-form-item
              label="候问带离延后取消门禁权限时间"
              prop="waitLeaveTime"
              v-show="ruleForm.waitRoom"
              :rules ="this.ruleForm.waitRoom ? this.rules.waitLeaveTime : []"
            >
              <el-input
                v-model.number="ruleForm.waitLeaveTime"
                placeholder="请输入0-30分钟"
              >
                <span slot="suffix" style="padding-right:6px">分钟</span>
              </el-input>
            </el-form-item>
            <el-form-item label="审讯分配" prop="interrogation">
              <el-switch
                on-text=""
                off-text=""
                @change="switchVal('interrogationLeaveTime', $event)"
                v-model="ruleForm.interrogation"
              ></el-switch>
              <div class="switchInfo">
                开启后，审讯分配完成，自动下发主办、协办民警权限至相应审讯室门禁；审讯分配取消，自动取消主办、协办民警审讯室门禁开门权限；审讯结束，自动取消主办、协办民警审讯室门禁开门权限。
              </div>
            </el-form-item>
            <el-form-item
              label="审讯分配取消/审讯结束延后取消门禁权限时间"
              prop="interrogationLeaveTime"
              v-show="ruleForm.interrogation"
              :rules ="this.ruleForm.interrogation ? this.rules.interrogationLeaveTime : []"
            >
              <el-input
                v-model.number="ruleForm.interrogationLeaveTime"
                placeholder="请输入0-30分钟"
              >
                <span slot="suffix" style="padding-right:6px">分钟</span>
              </el-input>
            </el-form-item>
            <el-form-item label="出区" prop="leave">
              <el-switch
                on-text=""
                off-text=""
                @change="switchVal('leaveTime', $event)"
                v-model="ruleForm.leave"
              ></el-switch>
              <div class="switchInfo">
                开启后，涉案人员出区自动取消主办、协办民警相应办案区门禁开门权限。
              </div>
            </el-form-item>
            <el-form-item
              label="出区登记延后取消门禁权限时间"
              prop="leaveTime"
              v-show="ruleForm.leave"
              :rules ="this.ruleForm.leave ? this.rules.leaveTime : []"
            >
              <el-input
                v-model.number="ruleForm.leaveTime"
                placeholder="请输入0-30分钟"
              >
                <span slot="suffix" style="padding-right:6px">分钟</span>
              </el-input>
            </el-form-item>
            <el-form-item class="demo-form-btns">
              <el-button type="primary" @click="submitForm('ruleForm')"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
    </div>
  </h-page-container>
</template>
<script>
import server from "../../server/accessControlAuthConfig";
export default {
  name: "accessControlAuthConfig",
  data() {
    return {
      ruleForm: {
        // entryBooking: true, //入区预约
        // entryTime: "",
        register: false, //入区登记
        waitRoom: false, //候问分配
        waitLeaveTime: "",
        interrogation: false, //审讯分配
        interrogationLeaveTime: "",
        leave: false,
        leaveTime: ""
      },
      areaList:[],
      areaIndexCode: '',
      rules: {
        waitLeaveTime: [
          { required: true, message: "请输入0-30之间的整数" },
          {
            validator: (rule, value, callback) => {
              console.log(value);
              if (isNaN(value)) {
                callback(new Error("请输入数字"));
              } else if (!/^([0-9]|[1-2][0-9]|30)$/.test(value)) {
                callback(new Error("只允许输入0-30的整数"));
              } else {
                callback();
              }
            }
          }
        ],
        interrogationLeaveTime: [
          { required: true, message: "请输入0-30之间的整数" },
          {
            validator: (rule, value, callback) => {
              console.log(value);
              if (isNaN(value)) {
                callback(new Error("请输入数字"));
              } else if (!/^([0-9]|[1-2][0-9]|30)$/.test(value)) {
                callback(new Error("只允许输入0-30的整数"));
              } else {
                callback();
              }
            }
          }
        ],
        leaveTime: [
          { required: true, message: "请输入0-30之间的整数" },
          {
            validator: (rule, value, callback) => {
              console.log(value);
              if (isNaN(value)) {
                callback(new Error("请输入数字"));
              } else if (!/^([0-9]|[1-2][0-9]|30)$/.test(value)) {
                callback(new Error("只允许输入0-30的整数"));
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },
  created() {},
  mounted() {
    // this.getDoorAccessConfig();
    this.findAuthUserPlaceList()
  },

  methods: {
   // 根据办案区查询配置参数
    queryByAreaIndexCode(item) {
      this.areaIndexCode = item.areaIndexCode;
      this.getDoorAccessConfig();
    },
    async getDoorAccessConfig() {
      this.$nextTick(()=>this.$refs.ruleForm.resetValidates())
      const result = await server.getDoorAccessConfig({areaCode: this.areaIndexCode});
      const { data } = result;
      if (data.code == "0") {
        if(data.data) {
          this.ruleForm = { ...data.data };
        }else{
          this.ruleForm = {
            ...this.ruleForm,
            id: '',
          }
        }
      } else {
        this.$messagebox(result);
      }
    },
    submitForm() {
      this.$refs["ruleForm"].validate(async valid => {
        if (valid) {
          let params = {
            ...this.ruleForm,
            areaCode: this.areaIndexCode
          };
          const result = await server.saveOrUpdateDoorAccessConfig(params);
          const { data } = result;
          if (data.code == "0") {
            this.getDoorAccessConfig();
            this.$message.success("保存成功");
          } else {
            this.$messagebox(result);
          }
        }
      });
    },
    switchVal(key, val) {
      console.log(key, val);
      // if (!val) {
      this.$nextTick(() => {
        this.ruleForm[key] = 10;
      });
      // }
    },
    // 查询办案区列表
    async findAuthUserPlaceList() {
      const { data } = await server.findAuthUserPlaceList();
      if (data.code === "0") {
        this.areaList = data.data.list;
        this.areaIndexCode = data.data.list[0].areaIndexCode;
        this.getDoorAccessConfig()
      } else {
        this.$message.error(this.$i18n.t(data.code));
      }
    },
  }
};
</script>
<style lang="less" rel="stylesheet/less">
.accessControlAuthConfigPage {
  height: ~"calc(100% - 40px)";
  width: 100%;
  box-sizing: border-box;
  display: block;
  * {
    box-sizing: border-box;
  }
  .menu-box {
    display: inline-block;
    position: absolute;
    width: 280px;
    height: ~"calc(100%)";
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
      z-index: 1000;
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

  .accessControlAuthConfigBox {
    width: 100%;
    height: ~"calc(100%)";
    .scrollbarWrap {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }
    .accessControlAuthConfigFormBox {
      width: 33%;
      height: auto;
      margin: 24px auto 0;
      .switchInfo {
        margin-top: 4px;
        color: #aaa;
        line-height: 24px;
        font-size: 14px;
      }
    }
  }
}
</style>
