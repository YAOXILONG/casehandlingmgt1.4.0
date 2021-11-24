<template>
  <el-scrollbar v-loading="loadingInstance"
                wrap-class="scrollbarWrap"
                view-class="scrollbarView"
                ref="scrollbar">
    <div id="basicPersonnelSituation"
         class="basicPersonnelSituation">
      <div class="basicPersonnelSituationTableBox">
        <div class="basicPersonnelSituationTitle">
          <i></i>
          <span>人员基本情况</span>
        </div>
        <div class="tableContent clearfix">
          <ul class="basicPersonnelSituationTable clearfix">
            <div class="personPhoto">
              <div class="personPhotoImg">
                <img v-if="currentPerson.registerPhotoUrl"
                     :src="currentPerson.registerPhotoUrl"
                     alt="">
                <img v-else
                     :src="require('../../../assets/image/u5576.png')">
                <div class="important-tag"
                     v-if="keyPersonTagList[0]">
                  <span>重点</span>
                </div>
              </div>
              <div class="person-tag"
                   v-if="currentPerson.keyPersonTag">
                <span class="person-tag-item"
                      v-for="(item,index) in keyPersonTagList"
                      :key="index"
                      :title="keyPersonVal[item]">
                  {{ keyPersonVal[item] }}
                </span>
              </div>
            </div>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  姓名
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.registerName || ''">
                  {{ currentPerson.registerName || '' }}
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  性别
                </div>
                <div class="tableItemCon"
                     :title="sexMap[currentPerson.registerSex]"
                     v-if="sexMap[currentPerson.registerSex]">
                  {{ sexMap[currentPerson.registerSex] }}
                </div>
                <div class="tableItemCon"
                     v-else>
                  -
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  联系方式
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.telPhone || ''">
                  {{ currentPerson.telPhone || '' }}
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  证件类型
                </div>
                <div class="tableItemCon"
                     :title="idcardTypeMap[currentPerson.idcardType]">
                  {{ idcardTypeMap[currentPerson.idcardType] }}
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  证件号码
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.idcardNo || ''">
                  {{ currentPerson.idcardNo || '' }}
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  工作单位
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.workUnit || ''">
                  {{ currentPerson.workUnit || '' }}
                </div>
              </li>
            </el-col>
            <el-col :span="24">
              <li class="tableItem">
                <div class="tableItemLabel">
                  现住址
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.address || ''">
                  {{ currentPerson.address || '' }}
                </div>
              </li>
            </el-col>
            <el-col :span="24">
              <li class="tableItem">
                <div class="tableItemLabel">
                  户籍地址
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.registerAddr || ''">
                  {{ currentPerson.registerAddr || '' }}
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  案件编号
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.caseNo || ''">
                  {{ currentPerson.caseNo || '' }}
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  案件名称
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.caseName || ''">
                  {{ currentPerson.caseName || '' }}
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  案由
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.caseCause || ''">
                  {{ currentPerson.caseCause || '' }}
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  办案类型
                </div>
                <div class="tableItemCon"
                     v-if="currentPerson.fastSolve == 1">
                  快办
                </div>
                <div class="tableItemCon"
                     v-else>
                  非快办
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  入区原由
                </div>
                <div class="tableItemCon"
                     :title="registerTypeMap[currentPerson.registerType]">
                  {{ registerTypeMap[currentPerson.registerType] }}
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  文书编号
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.docNo || ''">
                  {{ currentPerson.docNo || '' }}
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  办案区
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.areaName || ''">
                  {{ currentPerson.areaName || '' }}
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  办案部门
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.deptName || ''">
                  {{ currentPerson.deptName || '' }}
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  进入办案区时间
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.entryTime ? $moment(currentPerson.entryTime).format('YYYY-MM-DD HH:mm:ss'):''">
                  {{ currentPerson.entryTime ? $moment(currentPerson.entryTime).format('YYYY-MM-DD HH:mm:ss'):'' }}
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  主办民警
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.policeAccessName">
                  {{ currentPerson.policeAccessName }}
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  协办民警
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.policeAccessName2 || ''">
                  {{ currentPerson.policeAccessName2 || '' }}
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  登记人
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.creatorUserName || ''">
                  {{ currentPerson.creatorUserName || '' }}
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  办案民警签字
                </div>
                <div class="tableItemCon">
                  <div class="signContent">
                    <img :src="currentPerson.policeSignPhotoUrl || signImg"
                         alt="">
                  </div>
                  <!-- {{ currentPerson.policeSign }} -->
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  管理员签字
                </div>
                <div class="tableItemCon">
                  <div class="signContent">
                    <img :src="currentPerson.managerSignPhotoUrl ||signImg"
                         alt="">
                  </div>
                  <!-- {{ currentPerson.managerSign }} -->
                </div>
              </li>
            </el-col>
          </ul>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import server from '../../../server/ledgerManage'
export default {
  name: 'InformationAcquisitionRecord',
  props: {
    currentRegisterId: {
      type: Number,
      default: 1
    },
    inqDictList: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      currentPerson: {
        registerName: '',
        registerSex: 1,
        registerAge: null,
        idcardType: '',
        idcardNo: '',
        registerAddr: '',
        registerPhoto: '',
        registerPhoto2: '',
        telPhone: '',
        address: ''
      },
      idcardTypeMap: {},
      registerTypeMap: {},
      sexMap: {},
      keyPersonVal: {},
      loadingInstance: false,
      keyPersonTagList: [],
      personImg: 'data:image/png;base64,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',
      signImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABaCAIAAACwpMoFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYzRDBCN0JBMDdCRDExRTg4MUE0ODFBM0JDN0IzRUQwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjYzRDBCN0JCMDdCRDExRTg4MUE0ODFBM0JDN0IzRUQwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjNEMEI3QjgwN0JEMTFFODgxQTQ4MUEzQkM3QjNFRDAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjNEMEI3QjkwN0JEMTFFODgxQTQ4MUEzQkM3QjNFRDAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4bhszUAAAJtElEQVR42uyd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'
    }
  },
  watch: {
    inqDictList: {
      handler: function (newV, oldV) {
        if (this.inqDictList) {
          this.idcardTypeMap = this.computedDic(
            this.inqDictList.certificateType
          )
          this.registerTypeMap = this.computedDic(
            this.inqDictList.registerType
          )
          this.sexMap = this.computedDic(
            this.inqDictList.sex
          )
          this.keyPersonVal = this.computedDic(
            this.inqDictList.keyPersonTag
          )
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    async findRegisterInfo () {
      this.loadingInstance = true
      let params = {
        registerId: this.currentRegisterId
      }
      try {
        let res = await server.findRegisterInfo(params)
        if (res.data.code === '0') {
          let data = res.data.data
          if (data) {
            this.currentPerson = JSON.parse(JSON.stringify(data))
            // console.log('this.currentPerson', this.currentPerson)
            this.keyPersonTagList = this.currentPerson.keyPersonTag.split(',')
          } else {
            this.currentPerson = {}
            this.$message({
              type: 'warning',
              message: '暂无人员信息'
            })
          }
          this.loadingInstance = false
        } else {
          this.loadingInstance = false
          this.$messagebox(res)
        }
      } catch {
        this.loadingInstance = false
      }
    },
    computedDic (list) {
      let dicMap = {}
      if (list && list.length) {
        for (let i = 0; i < list.length; i++) {
          dicMap[list[i].key] = list[i].name
        }
      }
      return dicMap
    }
  },
  created () {
    if (this.inqDictList) {
      this.idcardTypeMap = this.computedDic(this.inqDictList.certificateType)
      this.registerTypeMap = this.computedDic(this.inqDictList.registerType)
      this.sexMap = this.computedDic(this.inqDictList.sex)
    }
    this.findRegisterInfo()
  }
}
</script>

<style lang="less" rel="stylesheet/less">
.basicPersonnelSituation {
  width: 100%;
  height: 100%;
  .basicPersonnelSituationTableBox {
    width: 980px;
    padding: 40px;
    margin: 40px auto;
    background: #fff;
    height: auto;
    box-sizing: border-box;
    background: #ffffff;
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.2);
    .basicPersonnelSituationTitle {
      height: 40px;
      padding-bottom: 16px;
      box-sizing: border-box;
      > i {
        background: #2080f7;
        display: inline-block;
        width: 4px;
        height: 12px;
        margin-top: 4px;
      }
      > span {
        display: inline-block;
        height: 20px;
        font-family: PingFangSC-Regular;
        margin-left: 16px;
        font-size: 14px;
        color: #4d4d4d;
        letter-spacing: 0;
        line-height: 20px;
      }
    }
  }
  .tableContent {
    width: 100%;
    border: 1px solid #ddd;
    border-right: 1px solid #fff;
    border-bottom: 1px solid #fff;
  }

  .basicPersonnelSituationTable {
    width: 100%;
    padding-right: 160px;
    box-sizing: border-box;
    position: relative;
    .personPhoto {
      width: 160px;
      height: 100%;
      border: 1px solid #ddd;
      border-left: none;
      border-top: none;
      box-sizing: border-box;
      position: absolute;
      top: 0;
      right: 0;
      .personPhotoImg {
        width: 136px;
        height: 170px;
        position: absolute;
        top: 18%;
        margin-left: -68px;
        left: 50%;
        margin-top: -85px;
        background-color: #f2f2f2;
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);
        background-size: 100% 100%;
        overflow: hidden;
        > img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .person-tag {
      display: inline-block;
      text-align: center;
      width: 100%;
      height: auto;
      position: absolute;
      top: 37%;
      left: 50%;
      margin-left: -78px;
    }
    .important-tag {
      position: absolute;
      top: 6px;
      right: -35px;
      width: 100px;
      height: 20px;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      background: #fe6967;
      font-size: 14px;
      white-space: nowrap;
      text-align: center;
      color: #ffffff;
    }
    .person-tag-item {
      background: #fff4f4;
      border: 1px solid #ff7070;
      border-radius: 16px;
      font-size: 14px;
      color: #ff3232;
      letter-spacing: 0;
      text-align: center;
      padding: 5px 16px;
      max-width: 298px;
      width: 100px;
      display: inline-block;
      margin: 8px 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .el-col {
      height: 40px;
      .tableItem {
        width: 100%;
        height: 40px;
        border-bottom: 1px solid #ddd;
        .tableItemLabel {
          width: 120px;
          text-indent: 14px;
          font-family: PingFangSC-Semibold;
          font-size: 14px;
          color: #999999;
          position: relative;
        }
        .tableItemLabel::before {
          content: "";
          display: block;
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0.3;
          top: 0;
          left: 0;
          z-index: 1;
          background: #f2f2f2;
        }
        .tableItemCon {
          width: ~"calc(100% - 122px)";
          text-align: left;
          text-indent: 14px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #4d4d4d;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        > div {
          height: 40px;
          float: left;
          line-height: 40px;
          text-align: center;
          border-right: 1px solid #ddd;
        }
      }
    }
    .el-col:nth-last-of-type(1),
    .el-col:nth-last-of-type(2) {
      height: 80px;
      .tableItem {
        height: 100%;
        .tableItemLabel,
        .tableItemCon {
          height: 100%;
          line-height: 80px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .signContent {
            width: 120px;
            height: 80px;
            padding: 4px;
            box-sizing: border-box;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
