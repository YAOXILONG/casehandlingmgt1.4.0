<template>
  <watermarkContent>
    <div class="AddTrialWithRecordPage" v-loading="loading">
      <div class="header breadcrumb">
        <!--      <el-breadcrumb separator="/">-->
        <!--        <el-button type="iconButton"-->
        <!--                   icon="h-icon-arrow_left"-->
        <!--                   @click="goBack"></el-button>-->
        <!--        <el-breadcrumb-item>本地审讯</el-breadcrumb-item>-->
        <!--        <template v-if="id && !addInterrogation">-->
        <!--          <el-breadcrumb-item>编辑审讯</el-breadcrumb-item>-->
        <!--        </template>-->
        <!--        <template v-else>-->
        <!--          <el-breadcrumb-item>添加审讯</el-breadcrumb-item>-->
        <!--        </template>-->
        <!--      </el-breadcrumb>-->
        <PathDesc
          :path-desc-arr="[
            '本地审讯',
            `${id && !addInterrogation ? '编辑' : '添加'}审讯`,
          ]"
          :is-back="true"
        ></PathDesc>
        <div class="subhead">当前房间：{{ roomName }}</div>
      </div>
      <template v-if="id === ''">
        <el-tabs>
          <el-tab-pane label="审讯信息">
            <el-scrollbar
              wrap-class="el-scrollbar__wrap"
              view-class="el-scrollbar__view"
            >
              <AddTrial ref="AddTrial" />
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="刻录参数">
            <el-scrollbar
              wrap-class="el-scrollbar__wrap"
              view-class="el-scrollbar__view"
            >
              <RecordConfigPage ref="RecordConfigPage" />
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
        <div class="btn-box" v-if="!id">
          <el-button type="primary" @click="submit(false)"> 保存 </el-button>
          <el-button type="primary" @click="submit(true)">
            保存并启动笔录
          </el-button>
          <el-button @click="goBack"> 取消 </el-button>
        </div>
      </template>
      <template v-else>
        <el-scrollbar
          wrap-class="el-scrollbar__wrap"
          view-class="el-scrollbar__view"
        >
          <AddTrial />
        </el-scrollbar>
      </template>
    </div>
  </watermarkContent>
</template>
<script>
import AddTrial from '../AddTrialPage/index'
import RecordConfigPage from '../RecordConfigPage/index'
import server from '../../server/elerecord'
import PathDesc from '../../components/PathDesc'

export default {
  name: 'AddTrialWithRecordPage',
  data() {
    return {
      id: '',
      roomName: '',
      roomCode: '',
      loading: false,
      addInterrogation: false,
      burnInfo: Boolean,
      interrogationInfo: {},
      processCode: 'inquestStart',
      cUserName: ''
    }
  },
  mounted() {
    this.id = this.$route.query.id || ''
    this.addInterrogation =
      this.$route.query.addInterrogation == 'false'
        ? false
        : this.$route.query.addInterrogation == 'true'
        ? true
        : ''
    this.roomName = this.$route.query.roomName
    this.roomCode = this.$route.query.roomCode
    this.getBiluConfigFuc()
  },
  methods: {
    goBack() {
      this.$router.push({ path: '/' })
    },
    async checkform(ref) {
      return new Promise((resolve, reject) => {
        this.$refs[ref].$refs['form'].validate((valid) => {
          resolve(valid)
        })
      })
    },
    //获取慧眼笔录对接配置
    async getBiluConfigFuc() {
      const result = await server.getBiluConfig();
      const { data } = result;
      if(data.code == '0') {
        if(data.data) {
          this.cUserName = data.data.cUserName
        }
      }else {
        this.$messagebox(result)
      }
    },
    async startRecord(interrogationCode) {
      // const params = {
      //   interrogationCode,
      // }
      // const res = await server.getToolStartParam(params)
      // const { data } = res
      // if (data.code !== '0') return this.$message.error(this.$t(data.code))
      // // protocol true string 协议类型
      // // sg true string
      // // nginxIP true string 代理ip
      // // nginxport true number 代理端口
      // // componentID true string 组建id
      // // servicetype true string
      // // inquestID true string 审讯code
      // // language true string 用户语言
      // let jsonObj = `{"comment":{"commenttype":"startapp", "context":"btoolsprotocol:", "commentcmd":"btoolsprotocol://CenterUrl:${data.data.protocol}://${data.data.nginxIP}:${data.data.nginxport}/portal;Toollist:PROT_btoolercprotocol;CmdLine:btoolercprotocol://nginxIP:${data.data.nginxIP};nginxport:${data.data.nginxport};sg:${data.data.sg};protocol:${data.data.protocol};componentID:${data.data.componentID};servicetype:${data.data.servicetype};inquestID:${interrogationCode};language:${data.data.language};context:/inqrecord/service/rs;heartbeatContext:${data.data.context};"}}` // MiniUI:1;
      // window.socketPlay.send(jsonObj)
      // setTimeout(() => {
      //   this.goBack()
      // }, 500)
      let count = this.$refs['AddTrial'].getSubmitParams().count
      let codeTemp = this.$refs['AddTrial'].getSubmitParams().suspectCode
      const params1 ={
        caseCode: this.$refs['AddTrial'].getSubmitParams().caseCode,
        roomIndexCode: this.$refs['AddTrial'].getSubmitParams().roomCode,
      }
      const res1 = await server.finaAllSuspect(params1)
      const { data } = res1
      if(data.code == '0') {
        let suspectList = data.data || []
        if(suspectList.length) {
          let suspectObj = suspectList.find(obj => obj.indexCode == codeTemp )
          // let url = `{id:${interrogationCode},user:'${this.cUserName}',xm:'${suspectObj.name}'}`
          let url = `{id:${interrogationCode},user:${this.cUserName},xwcs:${count},xm:${suspectObj.name},zjbh:${suspectObj.certificateNo || null},cym:${suspectObj.nameUsed || null},wh:${suspectObj.education ? Number(suspectObj.education) : null},gj:${suspectObj.nationality == '1' ? 1 : (suspectObj.nationality ? 2 : null )},xb:${suspectObj.sex == '1' ? 2 : (suspectObj.sex ? 1 : null )},mz:${suspectObj.nation ? Number(suspectObj.nation) : null},lxdh:${suspectObj.phoneNumber || null},hjdz:${suspectObj.registerAddress || null},xzz:${suspectObj.address || null},gzdw:${suspectObj.workUnit || null},zw:${suspectObj.job || null},csrq:${suspectObj.birthday || null}}`
          console.log('urlobj',url)
          window.location.href = "hybilu://" + url
          setTimeout(() => {
            this.goBack()
          }, 500)
        }
      }else{
        this.$messagebox(res1)
      }
    }, 
    async submit(UseRecord) {
      const AddTrialFormFlag = await this.checkform('AddTrial')
      const RecordConfigPageFormFlag = await this.checkform('RecordConfigPage')
      console.log(AddTrialFormFlag, RecordConfigPageFormFlag)
      if (!AddTrialFormFlag || !RecordConfigPageFormFlag) {
        this.$message.info('请填写审讯信息和刻录参数')
        return
      }
      let param = {
        registerIndexCode: this.$refs['AddTrial'].getSubmitParams().suspectCode,
        processCode: this.processCode,
      }
      const res = await server.getCaseAreaProcessConfig(param)
      if (res.data.code === '0') {
        let _data = res.data.data
        if (_data.indexOf(',') > -1) {
          this.$message.warning(`${_data.split(',')[1]}！`)
          return false
        }
      } else {
        this.$message.error(this.$i18n.t(res.data.code))
        return false
      }
      const burnInfo = this.$refs['RecordConfigPage'].getSubmitParams()
      const params = {
        roomIndexCode: this.roomCode,
        interrogationInfo: this.$refs['AddTrial'].getSubmitParams(),
        burnInfo,
      }
      this.loading = true
      const { data } = await server.startInterrogation(params)
      if (data.code === '0') {
        if (UseRecord) {
          this.startRecord(data.data)
        }
        if (!burnInfo.isBurn) {
          this.loading = false
          this.$message.success(`审讯开始成功`)
          return this.goBack()
        }
        const params2 = {
          roomIndexCode: this.roomCode,
          interrogationCode: data.data,
          burnInfo,
        }
        const { data: burnData } = await server.startInterrogation(params2)
        this.loading = false
        if (burnData.code === '0') {
          this.$message.success(`审讯开始成功，刻录开始成功`)
        } else {
          this.$message.warning(`审讯开始成功,${this.$t(burnData.code)}`)
        }
        this.goBack()
      } else if (data.code === '0x1bf01613') {
        this.loading = false
        this.$confirm('开启手动录像失败，是否继续开始审讯？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'question',
        })
          .then(async () => {
            const params = {
              roomIndexCode: this.roomCode,
              interrogationInfo: this.$refs['AddTrial'].getSubmitParams(),
            }
            params.interrogationInfo.compel = 1
            this.loading = true
            const res = await server.startInterrogation(params)
            const { data } = res
            if (data.code === '0') {
              if (UseRecord) {
                this.startRecord(data.data)
              }
              const burnInfo = this.$refs['RecordConfigPage'].getSubmitParams()
              if (!burnInfo.isBurn) {
                this.loading = false
                this.$message.success(`审讯开始成功`)
                return this.goBack()
              }
              const params2 = {
                roomIndexCode: this.roomCode,
                interrogationCode: data.data,
                burnInfo,
              }
              const { data: burnData } = await server.startInterrogation(
                params2
              )
              this.loading = false
              if (burnData.code === '0') {
                this.$message.success(`审讯开始成功，刻录开始成功`)
              } else {
                this.$message.warning(`审讯开始成功,${this.$t(burnData.code)}`)
              }
              this.goBack()
            } else {
              this.loading = false
              this.$messagebox(res)
              // this.$message.error(this.$t(data.code))
            }
          })
          .catch(() => {})
      } else {
        this.loading = false
        this.$message.error(this.$t(data.code))
      }
    },
  },
  components: {
    AddTrial,
    RecordConfigPage,
    PathDesc,
  },
}
</script>
<style lang="less" rel="stylesheet/less">
.AddTrialWithRecordPage {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    height: 94px;
    box-shadow: inset 0 -1px 0 0 #e5e5e5;
    box-sizing: border-box;
  }

  .breadcrumb {
    // padding: 14px 16px;
  }

  .el-tabs {
    flex: 1;
    /*background-color: #f2f2f2;*/
  }

  .el-tabs__header {
    margin: 0;
    background-color: #fff;
  }

  .el-tabs__item,
  .el-tabs__nav {
    height: 48px;
  }

  .el-tabs__item {
    padding: 12px 24px;
    line-height: 24px;
    font-size: 14px;
  }

  .el-scrollbar__wrap {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .el-tabs__content {
    height: calc(~'100% - 48px');
  }

  .el-tab-pane {
    height: 100%;
  }

  .btn-box {
    height: 48px;
    text-align: center;
    line-height: 48px;
    border-top: 1px solid #e5e5e5;
    overflow: hidden;

    button {
      min-width: 96px;
      vertical-align: middle;
    }
  }
}
</style>
