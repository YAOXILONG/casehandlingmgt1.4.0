<template>
  <watermarkContent>
    <div class="hybilu-Config">
      <PathDesc :path-desc-arr="$breadcrumb" :is-back="false"></PathDesc>
      <div class="main-content">
        <div class="scrollbar-box">
          <el-scrollbar wrap-class="el-scrollbar__wrap">
            <el-form
              :model="ruleForm"
              ref="ruleForm"
              :rules="rules"
              label-position="top"
            >
              <div class="form-content">
                <el-form-item label="慧眼笔录平台地址" prop="cIp">
                  <h-ip-input
                    v-model="ruleForm.cIp"
                    tips="分为4段，每段范围为0~255的整数，参考格式：127.0.0.1。"
                  ></h-ip-input>
                </el-form-item>
                <el-form-item label="端口" prop="cPort">
                  <el-input
                    v-model="ruleForm.cPort"
                    tips="端口范围1~65535，包括1和65535。"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
                <el-form-item label="平台接入标识" prop="cUserName">
                  <el-input
                    v-model="ruleForm.cUserName"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
                <el-form-item label="秘钥" prop="cPassword">
                  <el-input
                    v-model="ruleForm.cPassword"
                    placeholder="请输入"
                    :type="password"
                  >
                    <i
                      slot="suffix"
                      class="el-input__icon"
                      :class="passwordIcon"
                      @mousedown="onMousedownClick"
                      @mouseup="onMouseupClick"
                    ></i>
                  </el-input>
                </el-form-item>
                <div slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="submitForm('ruleForm')">
                    保存
                  </el-button>
                </div>
              </div>
            </el-form>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </watermarkContent>
</template>
<script>
import server from "../../server/hybiluConfig";
import PathDesc from "./components/PathDesc";

export default {
  name: "hybiluConfig",
  data() {
    var checkExpendNumber = (rule, value, callback) => {
      if (!/^[0-9]+$/g.test(value) || value < 1 || value > 65535) {
        callback(new Error("请输入1~65535之间的整数"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        cIp: "",
        cPort: null,
        cUserName: "",
        cPassword: "",
      },
      rules: {
        cPort: [{ required: true,message: "请输入", },{ validator: checkExpendNumber, trigger: "change,blur" }],
        cIp: [{ required: true,message: "请输入", },{ trigger: "change,blur" }],
        cUserName: [{ required: true,message: "请输入", },{ trigger: "change,blur" }],
        cPassword: [{ required: true,message: "请输入", },{ trigger: "change,blur" }],
      },
      password: "password",
      passwordIcon: "h-icon-password_unvisible",
    };
  },
  mounted() {
    this.getBiluConfigFuc()
  },
  methods: {
    //保存表单
    submitForm() {
      this.$refs["ruleForm"].validate(async valid => {
        if (valid) {
          let params = {
            ...this.ruleForm,
          };
          const result = await server.saveBiluConfig(params);
          const { data } = result;
          if (data.code == "0") {
            this.getBiluConfigFuc()
            this.$message.success("保存成功");
          } else {
            this.$messagebox(result);
          }
        }else{
          return false
        }
      });
    },
    onMousedownClick(ev) {
      this.password = "text";
      this.passwordIcon = "h-icon-password_visible";
    },
    onMouseupClick(ev) {
      this.password = "password";
      this.passwordIcon = "h-icon-password_unvisible";
    },
    //获取慧眼笔录对接配置
    async getBiluConfigFuc() {
      const result = await server.getBiluConfig();
      const { data } = result;
      if(data.code == '0') {
        if(data.data) {
          this.ruleForm = {
            ...data.data,
          }
        }else{
          this.ruleForm = {
            cIp: "",
            cPort: null,
            cUserName: "",
            cPassword: "",
          }
        }
      }else {
        this.$messagebox(result)
      }
    }
  },
  mixins: [],
  components: { PathDesc },
};
</script>
<style lang="less" rel="stylesheet/less">
.hybilu-Config {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
  .main-content {
    background: #ffffff;
    height: ~"calc(100% - 52px)";
    vertical-align: top;
    display: inline-block;
    position: relative;
    width: 100%;
    .scrollbar-box {
      height: ~"calc(100% - 26px)";
      padding: 8px;
      border-top: solid 1px #e5e5e5;
      .dialog-footer {
        display: inline-block;
        width: 100%;
        text-align: center;
        height: 49px;
        background-color: white;
        .el-button {
          position: relative;
          top: 12px;
          right: 219px;
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
    .form-content {
      background: #ffffff;
      margin-bottom: 10px;
      .el-form-item {
        width: 532px;
        margin: 0 auto;
        padding: 16px 0px;
      }
    }
  }
}
</style>
