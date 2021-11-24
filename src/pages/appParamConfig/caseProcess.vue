<!--
 * @Description: 
 * @Version: 1.3
 * @Autor: jinxiaoxu
 * @Date: 2021-05-10 19:59:27
 * @LastEditors: jinxiaoxu
 * @LastEditTime: 2021-05-13 11:44:10
-->
<template>
  <div class="caseProcessPage">
    <el-scrollbar wrap-class="scrollbarWrap" view-class="scrollbarView">
      <div class="caseProcessFormBox">
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
          <el-form-item label="体温异常阈值" prop="temperatureThreshold">
            <el-input v-model.number="ruleForm.temperatureThreshold">
              <span slot="suffix" style="padding-right: 6px">℃</span>
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
</template>
<script>
import server from '../../server/appParamConfig'
export default {
  name: 'caseProcess',
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
        temperatureThreshold: null,
        appName: '',
      },
      rules: {
        temperatureThreshold: [
          { required: true, message: '体温异常阈值为空' },
          { type: 'number', message: '只能输入数字和小数点' },
          {
            validator: (rule, value, callback) => {
              let val = value + ''
              console.log(val)
              if (val.length > 5) {
                callback(
                  new Error('体温异常阈值长度限制为5个字符（数字和小数点）')
                )
              } else {
                callback()
              }
            },
          },
        ],
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
        if (data.data) {
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
        }
      } else {
        this.$messagebox(result)
      }
    },
    submitForm() {
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
.caseProcessPage {
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
  .caseProcessFormBox {
    width: 33%;
    height: auto;
    margin: 0 auto;
  }
}
</style>
