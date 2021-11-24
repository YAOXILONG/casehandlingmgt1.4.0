<template>
  <watermarkContent>
    <div class="caseAreaProcess-config">
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
        <el-alert
          title="选择人员类型对应的必须完成项目。勾选后如果该步骤未做，则其后续步骤无法进行，但可临时出区。"
          type="info"
          simple
          show-icon
          class="alertTitle"
        ></el-alert>
        <div class="scrollbar-box">
          <el-form
            :model="ruleForm"
            ref="ruleForm"
            label-position="top"
            class="content-form"
          >
            <el-form-item
              v-for="item in dictData.suspectType"
              :prop="item.name"
              :key="item.key"
              :value="item.key"
            >
              <div class="subTitle">{{ item.name }}</div>
              <el-checkbox-group v-model="configs[item.key]" style="margin-left: 33px">
                <el-checkbox
                  v-for="item in caseProcessList"
                  :key="item.key"
                  :label="item.key"
                  style="margin-right: 92px"
                >{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <!-- <div style="height: 0px"></div> -->
          <div slot="footer" class="footer-btn">
          <el-button type="primary" @click="saveBusinessInfo">保存</el-button>
          </div>
        </div>
      </div>
    </div>
  </watermarkContent>
</template>
<script>
import server from "../../server/caseAreaProcessConfig";
import PathDesc from "./components/PathDesc";

export default {
  name: "CaseAreaProcessConfig",
  data() {
    return {
      dictData: {},
      configs: {},
      boxLoading: false,
      saveLoading: false,
      areaIndexCode: "",
      areaList: [],
      ruleForm: {
      },
      rules: {
      },
      caseProcessList:[
        {key: 'safeCheck',name: '人身检查'},
        {key: 'goodsStore',name: '物品登记'},
        {key: 'collected',name: '信息采集'},
        {key: 'drugCheck',name: '吸毒检测'},
        {key: 'inquestStart',name: '本地审讯'}
      ],
      id: ''
    };
  },
  mounted() {
    this.findAuthUserPlaceList();
    this.inqDict(); // 获取字典列表
  },
  methods: {
    // 根据办案区查询配置参数
    queryByAreaIndexCode(item) {
      this.areaIndexCode = item.areaIndexCode;
      this.findBusinessInfoList();
    },
    // 查询办案区列表
    async findAuthUserPlaceList() {
      const { data } = await server.findAuthUserPlaceList();
      if (data.code === "0") {
        this.areaList = data.data.list;
        this.areaIndexCode = data.data.list[0].areaIndexCode;
        this.findBusinessInfoList();
      } else {
        this.$message.error(this.$i18n.t(data.code));
      }
    },
    // 查询办案区配置参数
    async findBusinessInfoList() {
      this.configs={}
      var obj = {}
      this.id= ''
      let params = {
          areaCode: this.areaIndexCode
      }
      const { data } = await server.getCaseAreaProcessConfig(params);
      if (data.code === "0") {
        let configs = []
        if(data.data.configs) {
          configs = JSON.parse(data.data.configs)
          configs.forEach((item) => {
              (Object.values(item)).join().indexOf(',') > -1 ? (obj[(Object.keys(item)).join()] = Object.values(item)[0].split(',')) : obj[Object.keys(item).join()] = Object.values(item)[0].split()
          })
          this.$nextTick(() => {
              this.configs = obj
          })
          this.id= data.data.id
        }
      } else {
        this.$message.error(this.$i18n.t(data.code));
      }
    },
    // 保存配置
    async saveBusinessInfo() {
      let configs = []
      for (var index in this.configs) {
        var obj1 ={}
        obj1[index] =this.configs[index].join()
        configs.push(obj1)
      }
      const param = {
        areaCode: this.areaIndexCode,
        configs: JSON.stringify(configs),
        id: this.id,
        // configs: '123'
      };
      this.saveLoading = true;
      const { data } = await server.saveBusinessInfo(param);
      if (data.code === "0") {
        this.$message.success("保存成功");
        this.findBusinessInfoList();
      } else {
        this.$message.error(this.$i18n.t(data.code));
      }
      this.saveLoading = false;
    },
    // 获取字典
    async inqDict() {
      const result = await server.inqDict();
      const { data } = result;
      if (data.code === "0") {
        this.dictData = {
          suspectType: data.data.suspectType,
        };
      } else {
        this.$messagebox(result);
      }
    },
  },
  mixins: [],
  components: { PathDesc },
};
</script>
<style lang="less" rel="stylesheet/less">
.caseAreaProcess-config {
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
   .alertTitle{
      position: fixed
    }
  .main-content {
    background: #FFFFFF;
    height: ~"calc(100% - 52px)";
    width: ~"calc(100% - 280px)";
    vertical-align: top;
    display: inline-block;
    position: relative;
    padding-bottom: 35px;
    .scrollbar-box {
      height: ~"calc(100% - 40px)";
      overflow-y: scroll;
      margin: 35px 0px;
      padding: 8px;
      .content-form {
        height: 100%;
        // margin-top: 10px;
       .el-form-item:last-child {
        margin-bottom: 40px!important
      }
      }
      .btn {
        position: absolute;
        top: 642px;
        left: 45px;
      }
      .footer-btn {
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
    .subTitle {
      border-width: 0px;
      position: relative;
      left: 37px;
      /* top: 157px; */
      width: 112px;
      height: 28px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      font-family: "\5FAE\8F6F\96C5\9ED1 Bold", "\5FAE\8F6F\96C5\9ED1 Regular",
        "\5FAE\8F6F\96C5\9ED1";
      font-weight: 700;
      font-style: normal;
      font-size: 18px;
      color: #4d4d4d;
      line-height: 28px;
      margin: 28px 0px;
    }
    .el-scrollbar__wrap {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .form-title {
      height: 40px;
      line-height: 40px;
      background: #ffffff;
      border-bottom: solid 1px #e5e5e5;
      padding-left: 15px;
      font-size: 14px;
      .time-tips {
        font-size: 12px;
        color: #777777;
        margin-left: 10px;
      }
    }
    .form-content {
      background: #ffffff;
      padding: 11px 0px 1px 18px;
      margin-bottom: 10px;
      .approvalPeople {
        position: relative;
        left: 10px;
        bottom: 13px;
        width: 90%;
      }
      &.table-content {
        height: ~"calc(100% - 245px)";
        padding: 10px;
        .table-ctrl-btn {
          border-right: solid 1px #e6e6e6;
          padding: 0px 8px;
          font-size: 12px;
          color: #2080f7;
          cursor: pointer;
          &:first-child {
            padding-left: initial;
          }
          &:last-child {
            padding-right: initial;
            border-right: none;
          }
        }
      }
      .form-content-title {
        font-size: 14px;
        padding-left: 40px;
        padding-bottom: 16px;
        position: relative;
        &:before {
          content: "";
          display: block;
          height: 16px;
          width: 4px;
          background: #2080f7;
          position: absolute;
          left: 40px;
          top: 2px;
        }
      }
      .el-radio-group {
        .el-radio {
          width: 72px;
        }
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

      // .el-form-item__content {
      //   min-width: 424px;
      // }
    }
    .btn-box {
      text-align: center;
      height: 40px;
      line-height: 40px;
      background: #ffffff;
      width: 100%;
      padding-top: 8px;
    }
  }
}
</style>
