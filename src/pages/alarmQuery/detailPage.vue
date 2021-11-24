<template>
  <div class="add-edit-from-box">
      <PathDesc :path-desc-arr="pathDescArr"
                :is-back="true"></PathDesc>
    <h-page-group title=" " style="margin: 24px 24px 0px 150px">
      <h-page-detail style="padding: 0;">
        <h-page-detail-item label="报警ID">{{ruleForm.alarmId || '--'}}</h-page-detail-item>
        <h-page-detail-item label="报警编码">{{ruleForm.alarmIndexCode || '--'}}</h-page-detail-item>
        <h-page-detail-item label="报警类型">{{ruleForm.alarmType || '--'}}</h-page-detail-item>
        <h-page-detail-item label="报警名称">{{ruleForm.alarmTypeName || '--'}}</h-page-detail-item>
        <h-page-detail-item label="监控点编码">{{ruleForm.cameraIndexCode || '--'}}</h-page-detail-item>
        <h-page-detail-item label="报警时间">{{$moment(ruleForm.alarmTime).format('YYYY-MM-DD HH:mm:ss') || '--'}}</h-page-detail-item>
        <h-page-detail-item label="报警地点编码">{{ruleForm.roomIndexCode || '--'}}</h-page-detail-item>
        <h-page-detail-item label="报警地点">{{ruleForm.roomName || '--'}}</h-page-detail-item>
        <h-page-detail-item label="房间类型">{{ruleForm.roomType || '--'}}</h-page-detail-item>
        <h-page-detail-item label="关联人员">{{ruleForm.registerName || '--'}}</h-page-detail-item>
        <h-page-detail-item label="关联人员编码">{{ruleForm.registerIndexCode || '--'}}</h-page-detail-item>
        <h-page-detail-item label="报警级别">{{ruleForm.alarmLevel || '--'}}</h-page-detail-item>
        <h-page-detail-item label="创建时间">{{$moment(ruleForm.createTime).format('YYYY-MM-DD HH:mm:ss') || '--'}}</h-page-detail-item>
        <h-page-detail-item label="图片"><img :src="ruleForm.picUrl" height="200" width="200" alt=" " /></h-page-detail-item>
      </h-page-detail>
    </h-page-group>
      <el-button type="primary" style="position:absolute;left: 862px;top: 750px;"  @click="goBack">返回</el-button>
    </div>
</template>
<script>
import PathDesc from './components/PathDesc'
import server from '../../server/alarmQuery'

export default {
  name: 'detailPage',
  data () {
    let queryParam = this.$route.query
    return {
      accusationSlow: [],
      areaList: [],
      deptList: [],
      dictData: {
        brief: []
      },
      formLoading: false,
      pathDescArr: ['报警列表', '报警详情'],
      queryParam: queryParam,
      detailData: {},
      manufacturerList: [],
      ruleForm: {
        alarmId: '',
        alarmIndexCode: '',
        alarmType: '',
        alarmTypeName: '',
        cameraIndexCode: '',
        alarmTime: '',
        roomIndexCode: '',
        roomName: '',
        roomType: '',
        registerName: '',
        registerIndexCode: '',
        alarmLevel: '',
        createTime: '',
        picUrl: ''
      },
      deptShow: true,
      orgTreeSingle: [],
      personByOrg: [],
      boxLoading: false
    }
  },
  mounted () {
    this.inqDict()
  },
  beforeDestroy () {

  },
  methods: {
    // 获取详情
    async findAlarmInfoPage () {
      if (!this.queryParam.id) {
        return false
      }
      this.formLoading = true
      const params = { alarmId: this.queryParam.id,pageNo: 1,pageSize: 20 }
      const result = await server.findAlarmInfoPage(params)
      const { data } = result
      if (data.code === '0' && data.data) {
        let _data = data.data.list[0]
        if(_data.alarmLevel=== '0' ){
          this.ruleForm.alarmLevel = '低'
        }else if(_data.alarmLevel === '1') {
          this.ruleForm.alarmLevel= '中'
        }else{
          this.ruleForm.alarmLevel= '高'
        }
        this.ruleForm = {
          alarmId: _data.alarmId,
          alarmIndexCode: _data.alarmIndexCode,
          alarmType: _data.alarmType,
          alarmTypeName: _data.alarmTypeName,
          cameraIndexCode: _data.cameraIndexCode,
          alarmTime: _data.alarmTime,
          roomIndexCode: _data.roomIndexCode,
          roomName: _data.roomName,
          roomType: _data.roomType,
          registerName: _data.registerName,
          registerIndexCode: _data.registerIndexCode,
          createTime:_data.createTime,
          picUrl:_data.picUrl,
          alarmLevel: this.ruleForm.alarmLevel
        }
      } else {
        this.$messagebox(result)
      }
      this.formLoading = false
    },
    // 获取字典
    async inqDict () {
      const result = await server.inqDict()
      const { data } = result
      if (data.code === '0') {
        this.dictData = { brief: data.data.brief }
        this.findAlarmInfoPage()
      } else {
        this.$messagebox(result)
      }
    },
    goBack () {
      this.$router.push('/')
    },
  },
  components: {
    PathDesc
  }
}
</script>
<style lang="less" rel="stylesheet/less">
.appoint-manage-add-edit {
  &.add-edit-from-back {
    height: calc(~"100% - 48px");
    width: 100%;
    .scroll-box {
      height: ~"calc(100% - 100px)";
    }
  }
  .footerBtn {
    position: absolute;
    left: 100px;
    top: 100px;
    font-size: 12px;
    color: #2080f7;
    cursor: pointer;
    .footerBtnEX {
      position: relative;
      left:100px;
      top: 100px
    }
  }
}
.content-desc {
  padding: 20px;
  text-align: center;
  color: #565656;
  .content-desc-item {
    padding: 10px;
  }
}
</style>
