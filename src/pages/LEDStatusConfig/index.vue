<template>
  <watermarkContent>
    <div class="ledStatus-config">
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
          <el-tabs
            class="tabRoom"
            v-model="activeName"
            @tab-click="handleClick"
          >
            <el-tab-pane label="审讯室" name="0"> </el-tab-pane>
            <el-tab-pane label="候问室" name="1"> </el-tab-pane>
          </el-tabs>
          <div class="form-content">
            <el-row type="flex" justify="center" style="height: 40%;position: relative;right: 100px;">
              <el-col :span="15">
                <div class="subTitle">第一行内容</div>
                <div class="buttonSelected">
                  <span
                    v-for="item in firstContent"
                    :key="item.key"
                    class="tagsSelect"
                  >
                    {{ "{" + item.name + "}" }}
                  </span>
                </div>
                <div class="buttonSelect">
                  <el-button
                    v-for="item in tagsList"
                    :key="item.key"
                    :value="item.key"
                    v-show="activeName == item.used"
                    class="tagsSelect"
                    @click="tagsHandleClick(item, firstContent)"
                    :disabled="
                      secondContent.find((_item) => _item.key == item.key) ? true : false
                    "
                  >
                    {{ item.name }}
                  </el-button>
                </div>
              </el-col>
              <el-col :span="6" class="contentBehind">
                <div class="contentBehindContent">
                  <div class="subheading fontStyle">字号</div>
                  <el-radio-group v-model="ruleForm.fontSize" size="large">
                    <el-radio-button label="10"></el-radio-button>
                    <el-radio-button label="12"></el-radio-button>
                    <el-radio-button label="14"></el-radio-button>
                  </el-radio-group>
                </div>
                <div class="contentBehindContent">
                  <div class="subheading">颜色区分</div>
                  <el-switch v-model="ruleForm.color"> </el-switch>
                  <el-tooltip
                    content="开启后，不同房间状态将显示不同颜色"
                    placement="right-start"
                  >
                    <span>
                      <i class="h-icon-help"></i>
                    </span>
                  </el-tooltip>
                </div>
                <div class="contentBehindContent">
                  <el-checkbox v-model="ruleForm.rolling">支持滚动</el-checkbox>
                </div>
              </el-col>
            </el-row>
            <el-row type="flex" justify="center" style="height: 32%;position: relative;right: 100px;">
              <el-col :span="15">
                <div class="subTitle">第二行内容</div>
                <el-switch
                  v-model="ruleForm.enableSecondContent"
                  class="secondSwitch"
                ></el-switch>
                <div class="buttonSelected">
                  <span
                    v-for="item in secondContent"
                    :key="item.key"
                    class="tagsSelect"
                  >
                    {{ "{" + item.name + "}" }}
                  </span>
                </div>
                <div class="buttonSelect">
                  <el-button
                    :disable-transitions="false"
                    v-for="item in tagsList"
                    :key="item.key"
                    :value="item.key"
                    v-show="activeName == item.used"
                    class="tagsSelect"
                    @click="tagsHandleClick(item, secondContent)"
                    :disabled="
                      firstContent.find((_item) => _item.key == item.key) ? true : false
                    "
                  >
                    {{ item.name }}
                  </el-button>
                </div>
              </el-col>
              <el-col :span="6" class="contentBehind">
                <div class="contentBehindContent">
                  <div class="subheading fontStyle" >字号</div>
                  <el-radio-group
                    v-model="ruleForm.secondFontSize"
                    size="large"
                  >
                    <el-radio-button label="10"></el-radio-button>
                    <el-radio-button label="12"></el-radio-button>
                    <el-radio-button label="14"></el-radio-button>
                  </el-radio-group>
                </div>
                <div class="contentBehindContent">
                  <div class="subheading">颜色区分</div>
                  <el-switch v-model="ruleForm.secondColor"> </el-switch>
                  <el-tooltip
                    content="开启后，不同房间状态将显示不同颜色"
                    placement="right-start"
                  >
                    <span>
                      <i class="h-icon-help"></i>
                    </span>
                  </el-tooltip>
                </div>
                <div class="contentBehindContent">
                  <el-checkbox v-model="ruleForm.secondRolling"
                    >支持滚动</el-checkbox
                  >
                </div>
              </el-col>
            </el-row>
            <el-button type="primary" class="btn" @click="saveLedConfig"
              >保存</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </watermarkContent>
</template>
<script>
import server from "../../server/ledStatusConfig";
import PathDesc from "./components/PathDesc";

export default {
  name: "LEDStatusConfig",
  data() {
    return {
      activeName: "0",
      boxLoading: false,
      saveLoading: false,
      areaIndexCode: "",
      areaList: [],
      ruleForm: {
        fontSize: 12,
        color: true,
        rolling: false,
        secondFontSize: 12,
        secondColor: true,
        secondRolling: false,
        enableSecondContent: true,
      },
      tagsList: [
        { typeCode: "tags", key: 0, name: "房间名称", used: 0 },
        { typeCode: "tags", key: 1, name: "房间状态", used: 0 },
        { typeCode: "tags", key: 2, name: "审讯人员", used: 0 },
        { typeCode: "tags", key: 3, name: "涉案人员", used: 0 },
        { typeCode: "tags", key: 4, name: "案件名称", used: 0 },
        { typeCode: "tags", key: 5, name: "房间名称", used: 1 },
        { typeCode: "tags", key: 6, name: "关押人数", used: 1 },
        { typeCode: "tags", key: 7, name: "人员姓名", used: 1 },
        { typeCode: "tags", key: 8, name: "房间状态", used: 1 },
      ],
      firstContent: [],
      secondContent: [],
    };
  },
  mounted() {
    this.findAuthUserPlaceList();
  },
  methods: {
    //tags点击事件
    tagsHandleClick(val, list) {
      if (list.length > 0) {
        var index = list.findIndex((item) => item.name === val.name);
        if (index == -1) {
          list.push(val);
        } else {
          list.splice(index, 1);
        }
      } else {
        list.push(val);
      }
    },
    // 根据办案区查询配置参数
    queryByAreaIndexCode(item) {
      this.areaIndexCode = item.areaIndexCode;
      this.getLedConfig();
    },
    // 查询办案区列表
    async findAuthUserPlaceList() {
      const { data } = await server.findAuthUserPlaceList();
      if (data.code === "0") {
        this.areaList = data.data.list;
        this.areaIndexCode = data.data.list[0].areaIndexCode;
        this.getLedConfig();
      } else {
        this.$message.error(this.$i18n.t(data.code));
      }
    },
    // 查询办案区配置参数
    async getLedConfig() {
      const { data } = await server.getLedConfig({
        areaIndexCode: this.areaIndexCode,
        type: this.activeName,
      });
      if (data.code === "0") {
        if(data.data){
        this.ruleForm = JSON.parse(JSON.stringify(data.data));
        if (this.ruleForm.firstContent) {
          var tempArr = this.ruleForm.firstContent.split(",");
          this.firstContent = [];
          for (var i = 0; i < tempArr.length; i++) {
            for (var j = 0; j < this.tagsList.length; j++) {
              if (tempArr[i] == this.tagsList[j].key) {
                this.firstContent.push(this.tagsList[j]);
              }
            }
          }
        } 
        if (this.ruleForm.secondContent) {
          var tempArr2 = this.ruleForm.secondContent.split(",");
          this.secondContent = [];
          for (var i = 0; i < tempArr2.length; i++) {
            for (var j = 0; j < this.tagsList.length; j++) {
              if (tempArr2[i] == this.tagsList[j].key) {
                this.secondContent.push(this.tagsList[j]);
              }
            }
          }
        } 
        if(!this.ruleForm.firstContent) {
          this.firstContent = []
        }
        if(!this.ruleForm.secondContent) {
          this.secondContent = []
        }
        }
        else{
          this.ruleForm.id = ''
          if (this.activeName == "0") {
            this.firstContent = [
              { typeCode: "tags", key: 0, name: "房间名称", used: 0 },
            ];
            this.secondContent = [
              { typeCode: "tags", key: 1, name: "房间状态", used: 0 },
            ];
          } else {
            this.firstContent = [
              { typeCode: "tags", key: 5, name: "房间名称", used: 1 },
            ];
            this.secondContent = [
              { typeCode: "tags", key: 6, name: "关押人数", used: 1 },
            ];
          }
          this.ruleForm = {
            ...this.ruleForm,
              fontSize: 12,
              color: true,
              rolling: false,
              secondFontSize: 12,
              secondColor: true,
              secondRolling: false,
              enableSecondContent: true,
          }
        }
      } else {
        this.$message.error(this.$i18n.t(data.code));
      }
    },
    // 保存配置
    async saveLedConfig() {
      if(!this.firstContent.length) {
        this.$message.error('第一行内容不能为空！')
        return false
      }
      if(this.ruleForm.enableSecondContent && this.secondContent.length == 0) {
        this.$message.error('第二行开启时，内容不能为空！')
        return false
      }
      var firstContentArr = [];
      this.firstContent.forEach((item) => {
        firstContentArr.push(item.key);
      });
      var secondContentArr = [];
      this.secondContent.forEach((item) => {
        secondContentArr.push(item.key);
      });
      const param = {
        ...this.ruleForm,
        areaIndexCode: this.areaIndexCode,
        firstContent: firstContentArr.join(",").toString(),
        secondContent: secondContentArr.join(",").toString(),
        type: this.activeName,
      };
      this.saveLoading = true;
      const { data } = await server.saveLedConfig(param);
      if (data.code === "0") {
        this.$message.success("保存成功");
        this.getLedConfig();
      } else {
        this.$message.error(this.$i18n.t(data.code));
      }
      this.saveLoading = false;
    },
    //切换选项卡触发的事件
    handleClick(tab, event) {
      this.getLedConfig();
    },
  },
  mixins: [],
  components: { PathDesc },
};
</script>
<style lang="less" rel="stylesheet/less">
.ledStatus-config {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow-y: scroll;

  * {
    box-sizing: border-box;
  }
  .menu-box {
    display: inline-block;
    width: 280px;
    height: ~"calc(100% - 48px)";
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
    // background: #f2f2f2;
    height: ~"calc(100% - 48px)";
    width: ~"calc(100% - 280px)";
    vertical-align: top;
    display: inline-block;
    position: relative;
    .scrollbar-box {
      height: ~"calc(100% - 40px)";
      padding: 8px;
      .btn {
        position: absolute;
        bottom: 119px;
        left: 4%;
      }
      .tabRoom {
        height: 4%;
      }
      .el-tabs {
        position: relative;
        bottom: 15px;
      }
      .el-tabs_item {
        line-height: 60px !important;
      }
      .content-form {
        height: 100%;
      }
    }
    .el-scrollbar__wrap {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .form-content {
      background: #ffffff;
      padding: 34px 0px 1px 62px;
      margin-bottom: 10px;
      height: 100%;
      .contentBehind {
        // position: relative; top: 20px;
        .contentBehindContent {
          margin-top: 25px;
          .el-tooltip {
            position: relative;
            bottom: 30px;
            left: 8px;
          }
          .h-icon-help {
            font-size: 24px;
            position: relative;
            top: 6px;
          }
        }
      }
      .subTitle {
        border-width: 0px;
        width: 92px;
        height: 28px;
        display: inline-block;
        font-family: "微软雅黑 Bold", "微软雅黑 Regular", "微软雅黑";
        font-weight: 700;
        font-style: normal;
        font-size: 18px;
        color: #4d4d4d;
        line-height: 7px;
      }
      .subheading {
        border-width: 0px;
        width: 71px;
        height: 20px;
        display: flex;
        font-family: "微软雅黑";
        font-weight: 400;
        font-style: normal;
        color: #4d4d4d;
        line-height: 2px;
        position: relative;
        top: 8px;
        margin-top: 4px;
      }
      .fontStyle {
        margin-bottom: 7px;
      }
      .content-config {
        display: flex;
        justify-content: space-around;
        position: relative;
        top: 51px;
        .secondSwitch {
          position: absolute;
          right: 500px;
          top: -12px;
        }
      }
      .buttonSelected {
        width: 563px;
        height: 128px;
        border-width: 1px;
        border-style: solid;
        border-color: rgba(228, 228, 228, 1);
        border-radius: 2px;
        padding-left: 17px;
        padding-top: 8px;
      }
      .buttonSelect {
        width: 563px;
        height: 52px;
        border-width: 1px;
        border-style: solid;
        border-color: rgba(228, 228, 228, 1);
        border-radius: 2px;
        padding-top: 9px;
        display: inline-block;
        text-align: center;
        .tagsSelect {
          margin: 0px 3px;
          cursor: pointer;
        }
      }
      .el-radio-group {
        .el-radio {
          width: 72px;
        }
      }
    }
  }
}
</style>
