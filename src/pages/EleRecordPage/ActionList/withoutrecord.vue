<template>
  <div class="room_action">
    <template v-if="roomData.roomInfo.status===0">
      <i class="icon-video"
         style="font-size: 16px;margin-top: 18px;"
         :class="{'disableButton': !roomData.operateAuth}"
         @click="roomData.operateAuth && showVideo(roomData.roomInfo.roomIndexCode)"
         title="查看视频"></i>
    </template>
    <template v-else-if="roomData.roomInfo.status===2">
      <i class="h-icon-add"
         :class="{'disableButton': !roomData.operateAuth}"
         @click="roomData.operateAuth && editTrail(roomData.interrogationInfo, roomData.addInterrogation)"
         title="添加审讯"
         v-if="roomData.addInterrogation"></i>
      <i class="icon-edit"
         style="font-size: 16px;margin-top: 18px;"
         :class="{'disableButton': !roomData.operateAuth}"
         @click="roomData.operateAuth && editTrail(roomData.interrogationInfo, roomData.addInterrogation)"
         title="编辑审讯"
         v-else></i>
      <i class="h-icon-details"
         :class="{'disableButton': !roomData.operateAuth}"
         @click="roomData.operateAuth && startRecord(roomData,cuserName)"
         title="进入笔录"
         v-if="!roomData.addInterrogation"></i>
      <i class="icon-video"
         style="font-size: 16px;margin-top: 18px;"
         :class="{'disableButton': !roomData.operateAuth}"
         @click="roomData.operateAuth && showVideo(roomData.roomInfo.roomIndexCode)"
         title="查看视频"></i>
    </template>
  </div>
</template>
<script>
import server from '../../../server/elerecord'

export default {
  name: 'WithoutRecordPage',
  data () {
    return {}
  },
  props: {
    roomData: {
      type: Object,
      default () {
        return {
        }
      }
    },
   cuserName: {
      type: String,
      default () {
        return ''
      }
    }
  },
  mounted () {
    console.log(this.roomData)
  },
  methods: {
    editTrail ({ indexCode: id, roomCode, roomName, name }, addInterrogation) {
      console.log('编辑')
      if (!roomName) roomName = this.roomData.roomInfo.name
      this.$router.push({
        path: 'addtrialwithoutrecord',
        query: { id, roomCode, roomName, name, addInterrogation }
      })
    },
    async showVideo (roomIndexCode) {
      let loadingInstance = this.$loading.service({ fullscreen: true })
      const res1 = await server.previewByroomIndexCode({ roomIndexCode })
      const { data: cameraData } = res1
      const res2 = await server.platPlayer()
      const { data: paramData } = res2
      loadingInstance.close()
      if (cameraData.code === '0' && paramData.code === '0') {
        const camlist = cameraData.data.map(v => v.cameraIndexCode).join(',')
        const jsonObj = `{"comment":{"commenttype":"startapp", "context":"btoolsprotocol:", "commentcmd":"btoolsprotocol://CenterUrl:${paramData.data.protocol}://${paramData.data.nginxIp}:${paramData.data.nginxPort}/portal;Toollist:PROT_btoolinqplatformplayerprotocol;CmdLine:btoolinqplatformplayerprotocol://ReqType:PlayReal;Language:zh_CN;clear:1;WndCount:1;NginxIp:${paramData.data.nginxIp};NginxPort:${paramData.data.nginxPort};UserID:${paramData.data.userId};sg:${paramData.data.sg};protocol:${paramData.data.protocol};CamList:${camlist};appType:imap;archiveCode:;gridtrack:1;"}}`
        window.socketPlay.send(jsonObj)
      } else {
        if (cameraData.code === '0') {
          // this.$message.error(this.$t(paramData.code))
          this.$messagebox(res2)
        } else {
          // this.$message.error(this.$t(cameraData.code))
          this.$messagebox(res1)
        }
      }
    },
    endTrial (indexCode, compel) {
      let indexCode1 = indexCode
      let compel1 = compel
      this.$confirm('此操作将下载笔录文件并结束审讯, 是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'question'
      }).then(
        async() => {
          const params = {
            indexCode: indexCode1
          }
          let loadingInstance = this.$loading({ fullscreen: true })
          const res = await server.downloadBilu(params)
          const { data } = res
          loadingInstance.close()
          if(data.code == '0'&& data.data.fileUrl) {
            window.open(data.data.fileUrl, '_self')
            this.$message.success('笔录文件下载成功！')
            this.endTrialFuc(indexCode1,compel1)
          }else{
            this.$messagebox(res)
          }
        }
      ).catch(() => {
      })
    },
    async endTrialFuc(indexCode,compel) {
        const params = {
          indexCode,
          compel
        }
        let loadingInstance = this.$loading.service({ fullscreen: true })
        const res = await server.stopInterrogation(params)
        const { data } = res
        loadingInstance.close()
        if (data.code === '0') {
          this.$emit('endTrial')
        } else if (data.code === '0x1bf01616' ||
          data.code === '0x1bf01617' ||
          data.code === '0x1bf01625') {
          // this.$message.error(this.$t(data.code))
          this.$messagebox(res)
        } else {
          this.$message.error(this.$t(data.code))
          this.$confirm('结束审讯失败, 是否强制结束?', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'question'
          }).then(async () => {
            const params2 = {
              indexCode,
              compel: 1
            }
            let loadingInstance = this.$loading.service({ fullscreen: true })
            const res2 = await server.stopInterrogation(params2)
            const { data: data2 } = res2
            loadingInstance.close()
            if (data2.code === '0') {
              this.$emit('endTrial')
            } else {
              // this.$message.error(this.$t(data2.code))
              this.$messagebox(res2)
            }
          }).catch(() => {
          })
        }
      },
     async getpersonInfos(caseCode,roomCode,susptceCode) {
      const param = {
        caseCode: caseCode,
        roomIndexCode: roomCode
      }
      const res1 = await server.finaAllSuspect(param)
      const { data } = res1
      if(data.code == '0') {
        let suspectList = data.data || []
        if(suspectList.length) {
          let suspectObj = suspectList.find(obj => obj.indexCode == susptceCode)
          return suspectObj
        }
      }else{
        this.$messagebox(res1)
      }
    },
    async startRecord (roomData,cUserNameParams) {
       const suspectObj = await this.getpersonInfos(roomData.interrogationInfo.caseCode, roomData.roomInfo.roomIndexCode, roomData.interrogationInfo.suspectCode)
      // const params = {
      //   interrogationCode
      // }
      // let loadingInstance = this.$loading.service({ fullscreen: true })
      // const res = await server.getToolStartParam(params)
      // const { data } = res
      // loadingInstance.close()
      // if (data.code !== '0') return this.$messagebox(res)// this.$message.error(this.$t(data.code))
      // let jsonObj = `{"comment":{"commenttype":"startapp", "context":"btoolsprotocol:", "commentcmd":"btoolsprotocol://CenterUrl:${data.data.protocol}://${data.data.nginxIP}:${data.data.nginxport}/portal;Toollist:PROT_btoolercprotocol;CmdLine:btoolercprotocol://nginxIP:${data.data.nginxIP};nginxport:${data.data.nginxport};sg:${data.data.sg};protocol:${data.data.protocol};componentID:${data.data.componentID};servicetype:${data.data.servicetype};inquestID:${interrogationCode};language:${data.data.language};context:${data.data.context};"}}` // MiniUI:1;
      // window.socketPlay.send(jsonObj)
       let url = `{id:${roomData.interrogationInfo.indexCode},user:${cUserNameParams},xwcs:${roomData.interrogationInfo.count},xm:${roomData.interrogationInfo.suspectName},zjbh:${suspectObj.certificateNo || null},cym:${suspectObj.nameUsed || null},wh:${suspectObj.education ? Number(suspectObj.education) : null},gj:${suspectObj.nationality == '1' ? 1 : (suspectObj.nationality ? 2 : null )},xb:${suspectObj.sex == '1' ? 2 : (suspectObj.sex ? 1 : null )},mz:${suspectObj.nation ? Number(suspectObj.nation) : null},lxdh:${suspectObj.phoneNumber || null},hjdz:${suspectObj.registerAddress || null},xzz:${suspectObj.address || null},gzdw:${suspectObj.workUnit || null},zw:${suspectObj.job || null},csrq:${suspectObj.birthday || null}}`
      // let url = `{id:${roomData.interrogationInfo.indexCode},user:'${cUserNameParams}',xm:'${roomData.interrogationInfo.suspectName}'}`
      console.log('url',url)
      window.location.href = "hybilu://" + url
    },
  }
}
</script>
