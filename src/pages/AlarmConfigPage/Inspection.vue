<template>
  <div class="HelpPage">
    <div class="content">
      <div class="title">
        {{ alarmTypeName }}
      </div>
      <div class="helpWarp">
        <el-scrollbar>
          <div class="mainContentWrapper">
            <div class="mainContent">
              <el-form label-width="120px" ref="form" :model="$data" :rules="rules">
                <alarm-enable
                  :label-name="alarmTypeName"
                  :enable="enable"
                  @enableChange="handleAlarmEnableChange"
                >
                  <span>启用此功能后，当{{ alarmTypeName }}时系统将会显示报警信息</span>
                </alarm-enable>
                <template v-if="!!enable">
                  <alarm-enable
                  :label-name="voice"
                  :enable="voiceFlag"
                  @enableChange="handleAlarmEnableChangeVoice"
                >
                </alarm-enable>
                  <alarm-level
                    @alarmLevelChange="handleAlarmLevelChange"
                    :level="level"
                  ></alarm-level>
                </template>
                <el-form-item>
                  <el-button
                    class="btn96"
                    type="primary"
                    @click="handleSave"
                  >
                    保存
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import AlarmEnable from '@/model/AlarmEnable'
import AlarmLevel from '@/model/AlarmLevel'
import server from '../../server/alarmconfig'

export default {
  name: 'Currency',
  props: ['currentEnable','areaIndexCode','alarmTypeName',"alarmConfigId",'alarmType','locationAbility'],
  data () {
    return {
      type: '',
      enable: this.currentEnable,
      level: 0,
      voiceFlag: false,
      voice: '声音状态',
      intervalTime: '',
      alarmConfigIndexCode:'',
      rules: {
        intervalTime: [
          {required: true, message: '请输入'},
          {
            validator: (rule, value, callback) => {
              if (!/^\d+(\.\d+)?$/.test(value) || Number(value) === 0) {
                callback(new Error('请输入正数'))
              } else {
                if (value > 24) {
                  callback(new Error('输入的数字不得大于24'))
                }
                callback()
              }
            },
            trigger: 'blur'
          }
        ],

      }
    }
  },
  methods: {
    async getInfo () {
      if(!this.alarmConfigId){
        this.type = ''
        this.enable = false
        this.alarmConfigIndexCode = ''
        this.voiceFlag = false
        this.level = 0
        this.intervalTime = ''
        return 
      }
      let params = {
        alarmConfigId:  this.alarmConfigId
      }
      const res = await server.queyByType(params)
      if (res.data.code === '0') {
        const datas = res.data.data
        if(datas){
          this.type = datas.alarmConfigId
          this.enable = datas.useFlag
          this.alarmConfigIndexCode = datas.alarmConfigIndexCode
          this.voiceFlag = datas.voiceFlag
          this.level = Number(datas.alarmLevel)
          this.intervalTime = datas.intervalTime
        }
        
      } else {
        this.$message.error(this.$t(res.data.code))
      }
    },
    handleAlarmEnableChange (val) {
      this.enable = val
    },
    handleAlarmEnableChangeVoice (val) {
      this.voiceFlag = val
    },
    handleAlarmLevelChange (val) {
      this.level = val
    },
    handleSave () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.save()
        }
      })
    },
    async save () {
      let params = {
        alarmType: this.alarmType,
        alarmTypeName: this.alarmTypeName,
        alarmConfigId: this.type,
        alarmConfigIndexCode: this.alarmConfigIndexCode,
        alarmLevel: this.level.toString(),
        voiceFlag: Boolean(this.voiceFlag),
        useFlag: Boolean(this.enable),
        intervalTime: this.intervalTime,
        areaIndexCode:this.areaIndexCode
      }
      const res = await server.save(params)
      if (res.data.code === '0') {
        this.$message.success('保存成功')
        let alarmTypeVal = params.alarmType
        this.$emit('save',alarmTypeVal)
      } else {
        this.$message.error(this.$t(res.data.code))
      }
    }
  },
  components: {
    AlarmEnable,
    AlarmLevel
  },
  watch:{
    alarmType:{
      handler:function(val){
        this.getInfo()
      },
      deep:true,
      immediate:true
    }
  },
  created () {
    
    console.log(typeof this.currentEnable)
  }
}
</script>

<style lang="less" rel="stylesheet/less">
   @mainContentWidth: 660px;
  .HelpPage {
    height: 100%;
    padding: 8px;
    background: #f2f2f2;
    box-sizing: border-box;
    overflow: hidden;
   
    .content {
      background: #fff;
      height: 100%;
      width: 100%;
      .title {
        height: 64px;
        line-height: 64px;
        padding-left: 16px;
        font-size: 16px;
        font-weight: bold;
        border-bottom: 1px solid #e5e5e5;
        box-sizing: border-box;
      }
       .helpWarp{
         width: 100%;
         height:  calc(~"100% - 64px");
        background: #f2f2f2;
         .mainContentWrapper {
          position: relative;
          padding: 40px 0;
          background: #ffffff;
          .mainContent {
            width: @mainContentWidth;
            margin: 0 auto;
            .el-input {
              width: calc(~"100% - 32px")
            }
            .input-tip {
              display: inline-block;
              vertical-align: middle;
              color: #8484A4;
              font-size: 12px;
              margin-left: 4px;
            }
            .el-button{
              &.gradientBtn{
                width: 96px;
                box-sizing: border-box;
                background-image: linear-gradient(-90deg, rgba(25,109,217,0.98) 0%, #28AEF0 100%);
              }
            }
          }
        }
      }
      
    }
  }
</style>
