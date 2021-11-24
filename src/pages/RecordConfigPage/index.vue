<template>
  <div class="RecordConfigPage">
    <el-form
      ref="form"
      :model="form"
      grid-layout
      :label-grid="labelGrid"
      :content-grid="contentGrid"
      :rules="rules"
    >
      <el-form-item
        label="是否刻录"
        prop="isBurn"
      >
        <el-radio-group v-model="form.isBurn">
          <el-radio :label="true">
            刻录
          </el-radio>
          <el-radio :label="false">
            不刻录
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="form.isBurn">
        <el-form-item
          label="刻录方式"
          prop="burnType"
        >
          <el-select
            v-model="form.burnType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in burnTypeList"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="刻录打印一体机"
          v-if="form.burnType === '2'"
          prop="burnServerCode"
        >
          <el-select
            v-model="form.burnServerCode"
            placeholder="请选择"
          >
            <el-option
              v-for="item in accessServiceList"
              :key="item.indexCode"
              :label="`${item.name}${item.status == 0 ? '（离线）':'（在线）'}`"
              :value="item.indexCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="刻录内容"
          prop="contentType"
        >
          <el-checkbox-group v-model="form.contentType">
            <el-checkbox
              label="isBurnNote"
            >
              笔录
            </el-checkbox>
            <el-checkbox
              label="isBurnAttachment"
            >
              附件
            </el-checkbox>
            <el-checkbox
              label="isBurnVideo"
              disabled
            >
              视频
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="刻录份数"
          v-if="form.burnType == 2"
          prop="copies"
        >
          <el-radio-group v-model="form.copies">
            <el-radio :label="1">
              单份
            </el-radio>
            <el-radio :label="2">
              双份
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="启用光盘密码"
          prop="isUsePassword"
        >
          <el-switch
            on-text=""
            off-text=""
            v-model="form.isUsePassword"
          ></el-switch>
        </el-form-item>
        <template v-if="form.isUsePassword">
          <el-form-item
            label="输入密码"
            prop="password"
          >
            <el-input
              type="password"
              v-model="form.password"
              :maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="确认密码"
            prop="passwordRepeat"
          >
            <el-input
              type="password"
              v-model="form.passwordRepeat"
              :maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="密码提示"
            prop="passwordHint"
          >
            <el-input
              v-model="form.passwordHint"
              :maxlength="30"
            ></el-input>
          </el-form-item>
        </template>
        <el-form-item
          label="光盘封面"
          prop="diskCover"
          v-if="form.burnType === '2'"
        >
          <Cd v-model="form.diskCover"></Cd>
        </el-form-item>
      </template>
      <el-form-item
        class="form-btns"
        v-if="id"
      >
        <el-button
          @click="onSubmit"
        >
          保存
        </el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import JSEncrypt from 'jsencrypt'
import server1 from '../../server/elerecord'
import server2 from '../../server/remote'
import Cd from '../../components/cd'

export default {
  name: 'RecordConfigPage',
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
        burnType: '',
        passwordHint: ''
      },
      rules: {
        isBurn: [
          {required: true, message: '请选择'}
        ],
        burnType: [
          {required: true, message: '请选择'}
        ],
        burnServerCode: [
          {required: true, message: '请选择'}
        ],
        contentType: [
          {required: true, message: '请选择'}
        ],
        copies: [
          {required: true, message: '请选择'}
        ],
        isUsePassword: [
          {required: true, message: '请选择'}
        ],
        password: [
          {required: true, message: '请输入'},
          {validator: validatePass}
        ],
        passwordRepeat: [
          {required: true, message: '请输入'},
          {validator: validatePass2}
        ],
        diskCover: [
          {required: true, message: '请选择'}
        ]
      },
      burnTypeList: [],
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
  props: {
    flag: {
      type: String,
      default () {
        return ''
      }
    }
  },
  mounted () {
    this.server = server1
    this.id = this.$route.query.id || ''
    this.roomCode = this.$route.query.roomCode || ''
    this.getPublicKey()
    this.getBurnType()
    this.findAccessService()
    this.loadDefaultDiskCover()
  },
  methods: {
    async findAccessService () {
      const result = await this.server.findAccessService()
      const {data} = result
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
      const result = await this.server.findAllAccessService()
       const {data} = result
      if (data.code === '0') {
        this.accessServiceList = data.data
      } else {
       this.$messagebox(result)
      }
    },
    async loadDefaultDiskCover () {
      const {data} = await this.server.loadDefaultDiskCover()
      if (data.code === '0') {
        this.form.diskCover = data.data
      } else {
        this.$message.error(this.$t(data.code))
      }
    },
    async getPublicKey () {
      const {data} = await this.server.getPublicKey()
      if (data.code === '0') {
        this.PublicKey = data.data.key
      } else {
        this.$message.error(this.$t(data.code))
      }
    },
    getSubmitParams () {
      if (!this.form.isBurn) return {isBurn: false}
      let password = null
      if (this.form.isUsePassword) {
        let encryptor = new JSEncrypt()
        encryptor.setPublicKey(this.PublicKey)
        password = encryptor.encrypt(this.form.password)
        if (password === false) password = this.form.password
      } else {
        password = this.form.password
      }
      return {
        isBurn: this.form.isBurn,
        burnServerCode: this.form.burnServerCode,
        isBurnVideo: Number(this.form.contentType.indexOf('isBurnVideo') > -1),
        isBurnNote: Number(this.form.contentType.indexOf('isBurnNote') > -1),
        isBurnAttachment: Number(this.form.contentType.indexOf('isBurnAttachment') > -1),
        copies: this.form.copies,
        isUsePassword: Number(this.form.isUsePassword),
        password,
        diskCover: this.form.diskCover,
        burnType: this.form.burnType,
        passwordHint: this.form.passwordHint
      }
    },
    onSubmit () {
      console.log('submit!')
    },
    async getBurnType () {
      const params = {
        roomIndexCode: this.roomCode
      }
      const {data} = await this.server.getBurnType(params)
      if (data.code === '0') {
        this.burnTypeList = data.data
        this.burnTypeList.forEach((v) => {
          if (v.key === '1') {
            this.form.burnType = '1'
          }
        })
      } else {
        this.$message.error(this.$t(data.code))
      }
    }
  },
  components: {
    Cd
  }
}
</script>
<style lang="less" rel="stylesheet/less">
  .RecordConfigPage {
    width: 100%;
    height: auto;
    background-color: #fff;

    .el-form {
      padding: 40px 0 16px;
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
  }
</style>
