<template>
  <watermarkContent>
    <div class="RecordPage"
         v-loading="loading">
      <div class="header breadcrumb">
        <PathDesc :path-desc-arr="pathDescArr"
                  :is-back="true"></PathDesc>
        <!-- <el-breadcrumb separator="/">
        <el-button
          type="iconButton"
          icon="h-icon-arrow_left"
          @click="goBack"
        ></el-button>
        <el-breadcrumb-item> 办案区台账</el-breadcrumb-item>
        <el-breadcrumb-item>涉案人员台账</el-breadcrumb-item>
        <el-breadcrumb-item>刻录</el-breadcrumb-item>
      </el-breadcrumb> -->
      </div>
      <el-scrollbar wrap-class="el-scrollbar__wrap"
                    view-class="el-scrollbar__view">
        <el-form ref="form"
                 :model="form"
                 grid-layout
                 :label-grid="labelGrid"
                 :content-grid="contentGrid"
                 :rules="rules">
          <el-form-item label="刻录打印一体机"
                        prop="burnServerCode">
            <el-select v-model="form.burnServerCode"
                       placeholder="请选择">
              <el-option v-for="item in accessServiceList"
                         :key="item.indexCode"
                         :label="`${item.name}${item.status == 0 ? '（离线）':'（在线）'}`"
                         :value="item.indexCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="刻录份数"
                        prop="copies">
            <el-radio-group v-model="form.copies">
              <el-radio :label="1">
                单份
              </el-radio>
              <el-radio :label="2">
                双份
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="启用光盘密码"
                        prop="isUsePassword">
            <el-switch on-text=""
                       off-text=""
                       v-model="form.isUsePassword"></el-switch>
          </el-form-item>
          <template v-if="form.isUsePassword">
            <el-form-item label="输入密码"
                          prop="password">
              <el-input type="password"
                        v-model="form.password"
                        :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="确认密码"
                          prop="passwordRepeat">
              <el-input type="password"
                        v-model="form.passwordRepeat"
                        :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="密码提示"
                          prop="passwordHint">
              <el-input v-model="form.passwordHint"
                        :maxlength="30"></el-input>
            </el-form-item>
          </template>
          <el-form-item label="光盘封面"
                        prop="diskCover">
            <Cd v-model="form.diskCover"></Cd>
          </el-form-item>
          <el-form-item class="form-btns">
            <el-button type="primary"
                       @click="onSubmit">
              保存
            </el-button>
            <el-button @click="goBack">
              取消
            </el-button>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>
  </watermarkContent>
</template>
<script>
import JSEncrypt from 'jsencrypt'
import server from '../../server/ledgerManage'
import Cd from './cd'
import PathDesc from './components/PathDesc'

export default {
  name: 'RecordPage',
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.passwordRepeat !== '') {
          this.$refs.form.validateField('passwordRepeat')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      pathDescArr: ['办案区台账', '涉案人员台账', '刻录'],
      loading: false,
      id: '',
      form: {
        isBurn: true,
        burnServerCode: '',
        contentType: ['isBurnVideo', 'isBurnNote', 'isBurnAttachment'],
        copies: 2,
        isUsePassword: false,
        password: '',
        passwordRepeat: '',
        diskCover: {},
        passwordHint: ''
      },
      rules: {
        isBurn: [
          { required: true, message: '请选择' }
        ],
        burnType: [
          { required: true, message: '请选择' }
        ],
        burnServerCode: [
          { required: true, message: '请选择' }
        ],
        contentType: [
          { required: true, message: '请选择' }
        ],
        copies: [
          { required: true, message: '请选择' }
        ],
        isUsePassword: [
          { required: true, message: '请选择' }
        ],
        password: [
          { required: true, message: '请输入' },
          { validator: validatePass }
        ],
        passwordRepeat: [
          { required: true, message: '请输入' },
          { validator: validatePass2 }
        ],
        diskCover: [
          { required: true, message: '请选择' }
        ]
      },
      accessServiceList: [],
      labelGrid: {
        xl: 8,
        lg: 8,
        md: 8,
        sm: 8,
        xs: 8
      },
      contentGrid: {
        xl: 8,
        lg: 8,
        md: 8,
        sm: 8,
        xs: 8
      },
      server: null,
      PublicKey: ''
    }
  },
  mounted () {
    this.id = this.$route.query.id || ''
    this.roomCode = this.$route.query.roomCode || ''
    this.getPublicKey()
    this.findAccessService()
    this.loadDefaultDiskCover()
  },
  methods: {
    async findAccessService () {
      const result = await server.findAccessService()
      const { data } = result
      if (data.code === '0') {
        if(data.data && data.data.list && data.data.list.length){
          this.accessServiceList = data.data.list
        } else {
          this.findAllAccessService()
        }
      } else {
        this.$messagebox(result)
      }
    },
    async findAllAccessService () {
      const result = await server.findAllAccessService()
      const {data} = result
      if (data.code === '0') {
        this.accessServiceList = data.data
      } else {
         this.$messagebox(result)
      }
    },
    async loadDefaultDiskCover () {
      const result = await server.loadDefaultDiskCover()
      const { data } = result
      if (data.code === '0') {
        this.form.diskCover = data.data
      } else {
        this.$messagebox(result)
      }
    },
    async getPublicKey () {
      const result = await server.getPublicKey()
      const { data } = result
      if (data.code === '0') {
        this.PublicKey = data.data.key
      } else {
        this.$messagebox(result)
      }
    },
    getSubmitParams () {
      let password = null
      if (this.form.isUsePassword) {
        let encryptor = new JSEncrypt()
        encryptor.setPublicKey(this.PublicKey)
        password = encryptor.encrypt(this.form.password)
      } else {
        password = this.form.password
      }
      return {
        registerId: this.id,
        burnServerCode: this.form.burnServerCode,
        isBurnVideo: Number(this.form.contentType.indexOf('isBurnVideo') > -1),
        isBurnNote: Number(this.form.contentType.indexOf('isBurnNote') > -1),
        isBurnAttachment: Number(this.form.contentType.indexOf('isBurnAttachment') > -1),
        copies: this.form.copies,
        isUsePassword: Number(this.form.isUsePassword),
        password,
        diskCover: this.form.diskCover,
        passwordHint: this.form.passwordHint
      }
    },
    async onSubmit () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          const params = this.getSubmitParams()
          this.loading = true
          const result = await server.startBurning(params)
          const { data } = result
          this.loading = false
          if (data.code === '0') {
            this.$message.success('操作成功')
            this.goBack()
          } else {
            this.$messagebox(result)
          }
        }
      })
    },
    goBack () {
      this.$router.push({ path: '/' })
    }
  },
  components: {
    Cd,
    PathDesc
  }
}
</script>
<style lang="less" rel="stylesheet/less">
.RecordPage {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    height: 48px;
    box-shadow: inset 0 -1px 0 0 #e5e5e5;
    box-sizing: border-box;
  }

  .breadcrumb {
    padding: 7px 16px;
  }

  .el-scrollbar {
    flex: 1;
    background-color: #f2f2f2;
  }

  .el-form {
    padding: 40px 0 16px;
    background-color: #fff;
  }

  .el-form-item__content {
    position: relative;
  }

  .extendbtn {
    position: absolute;
    top: 0;
    right: -96px;
  }

  .form-btns {
    button {
      width: 96px;
    }
  }

  .el-scrollbar__wrap {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
