<!--
 * @Description: 
 * @Version: 1.3
 * @Autor: jinxiaoxu
 * @Date: 2021-05-10 19:59:27
 * @LastEditors: jinxiaoxu
 * @LastEditTime: 2021-05-13 11:40:46
-->
<template>
  <div class="inquestProcessPage">
    <el-scrollbar wrap-class="scrollbarWrap" view-class="scrollbarView">
      <div class="inquestProcessFormBox">
        <el-form
          :model="ruleForm"
          label-position="top"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="APP标题" prop="appName">
            <el-input v-model="ruleForm.appName"></el-input>
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
</template>
<script>
import server from '../../server/appParamConfig'
export default {
  name: 'inquestProcess',
  props: {
    fileType: {
      type: String,
      default: '',
    },
    currentType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      ruleForm: {
        appType: this.fileType,
        temperature: null,
        appName: '',
      },
      rules: {
        appName: [
          { required: true, message: '请输入' },
          { min: 1, max: 15, message: 'APP标题名称长度不超过15个字符' },
          // {
          //   validator: (rule, value, callback) => {
          //      if (/[\\/:*?"<|'%>&+.]/.test(value)) {
          //       callback(new Error("不允许包含特殊字符\\/:*?\"<|'%>&+."));
          //     } else {
          //       callback();
          //     }
          //   }
          // }
        ],
      },
    }
  },
  mounted() {},
  watch: {
    currentType: {
      handler: function (val) {
        if (val && val == this.fileType) {
          this.loadCaseProcessConfig()
        }
      },
      immediate: true,
    },
  },
  methods: {
    async loadCaseProcessConfig() {
      const result = await server.loadCaseProcessConfig()
      const { data } = result
      if (data.code == '0') {
        data.data.forEach((v) => {
          if (v.appType == this.fileType) {
            this.ruleForm = {
              ...v,
              temperatureThreshold: v.temperatureThreshold
                ? Number(v.temperatureThreshold)
                : null,
            }
          }
        })
      } else {
        this.$messagebox(result)
      }
    },
    async submitForm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let params = {
            ...this.ruleForm,
          }
          const result = await server.saveCaseProcessConfig(params)
          const { data } = result
          if (data.code === '0') {
            this.$message.success('保存成功')
          } else {
            this.$messagebox(result)
          }
        }
      })
    },
  },
}
</script>
<style lang="less" rel="stylesheet/less">
.inquestProcessPage {
  width: 100%;
  height: 100%;
  padding: 12px;
  padding-bottom: 0;
  box-sizing: border-box;
  .scrollbarWrap {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  .inquestProcessFormBox {
    width: 33%;
    height: auto;
    margin: 0 auto;
  }
}
</style>
