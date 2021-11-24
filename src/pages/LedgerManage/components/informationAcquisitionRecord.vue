<template>
  <el-scrollbar v-loading="loadingInstance"
                wrap-class="scrollbarWrap"
                view-class="scrollbarView"
                ref="scrollbar">
    <div id="informationAcquisitionRecord"
         class="informationAcquisitionRecord">
      <div class="informationAcquisitionRecordTableBox">
        <div class="informationAcquisitionRecordTitle">
          <i></i>
          <span>信息采集记录</span>
        </div>
        <div class="tableContent">
          <ul class="informationAcquisitionRecordTable clearfix">
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  信息采集
                </div>
                <!-- doCollectedInfo  doCollected -->
                <div class="tableItemCon"
                     v-if="currentPerson.doCollectedInfo == 1">
                  是
                </div>
                <div class="tableItemCon"
                     v-else-if="currentPerson.doCollectedInfo == 0">
                  否
                </div>
                <div class="tableItemCon"
                     v-else>
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  采集项目
                </div>
                <div class="tableItemCon"
                     :title="computedCollectedItems(currentPerson.collectedItems)">
                  {{ computedCollectedItems(currentPerson.collectedItems) }}
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  信息入库
                </div>
                <div class="tableItemCon"
                     v-if="currentPerson.doStoraged == 1">
                  是
                </div>
                <div class="tableItemCon"
                     v-else-if="currentPerson.doStoraged == 0">
                  否
                </div>
                <div class="tableItemCon"
                     v-else>
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  核查对比
                </div>
                <div class="tableItemCon"
                     v-if="currentPerson.doCompared == 1">
                  是
                </div>
                <div class="tableItemCon"
                     v-else-if="currentPerson.doCompared == 0">
                  否
                </div>
                <div class="tableItemCon"
                     v-else>
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
                  开始时间
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.collectedStartTimeStr ? $moment(currentPerson.collectedStartTimeStr).format('YYYY-MM-DD HH:mm:ss'):''">
                  {{ currentPerson.collectedStartTimeStr ? $moment(currentPerson.collectedStartTimeStr).format('YYYY-MM-DD HH:mm:ss'):'' }}
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  结束时间
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.collectedEndTimeStr ? $moment(currentPerson.collectedEndTimeStr).format('YYYY-MM-DD HH:mm:ss'):''">
                  {{ currentPerson.collectedEndTimeStr ? $moment(currentPerson.collectedEndTimeStr).format('YYYY-MM-DD HH:mm:ss'):'' }}
                </div>
              </li>
            </el-col>
            <el-col :span="24">
              <li class="tableItem">
                <div class="tableItemLabel">
                  登记人
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.creatorUserName||''">
                  {{ currentPerson.creatorUserName || '' }}
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
      loadingInstance: false,
      collectItemMap: {}
    }
  },
  methods: {
    async findCollectedInfo () {
      this.loadingInstance = true
      try {
        let params = {
          registerId: this.currentRegisterId
        }
        let res = await server.findCollectedInfo(params)
        if (res.data.code === '0') {
          let data = res.data.data
          this.currentPerson = JSON.parse(JSON.stringify(data.collectedInfo)) || {}
          this.loadingInstance = false
        } else {
          this.loadingInstance = false
          this.$messagebox(res)
        }
      } catch {
        this.loadingInstance = false
      }
    },
    computedCollectedItems (string) {
      if (string) {
        let array = string.split(',')
        let _array = []
        for (let i = 0; i < array.length; i++) {
          _array.push(this.collectItemMap[array[i]])
        }
        return _array.join('，')
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
  watch: {
    inqDictList: {
      handler: function (newV, oldV) {
        if (this.inqDictList) {
          this.collectItemMap = this.computedDic(
            this.inqDictList.collectItem
          )
        }
      },
      immediate: true,
      deep: true
    }
  },
  created () {
    if (this.inqDictList) {
      this.collectItemMap = this.computedDic(
        this.inqDictList.collectItem
      )
    }
  },
  mounted () {
    this.findCollectedInfo()
  }
}
</script>

<style lang="less" rel="stylesheet/less">
.informationAcquisitionRecord {
  width: 100%;
  height: 100%;
  .informationAcquisitionRecordTableBox {
    width: 980px;
    padding: 40px;
    margin: 40px auto;
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.2);
    background: #fff;
    height: auto;
    box-sizing: border-box;
    .informationAcquisitionRecordTitle {
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
  .informationAcquisitionRecordTable {
    width: 100%;
    .el-col {
      height: 38px;
      .tableItem {
        width: 100%;
        height: 38px;
        border-bottom: 1px solid #ddd;
        .tableItemLabel {
          width: 120px;
          position: relative;
          text-indent: 14px;
          font-family: PingFangSC-Semibold;
          font-size: 14px;
          color: #999999;
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
          height: 38px;
          float: left;
          line-height: 38px;
          text-align: center;
          border-right: 1px solid #ddd;
        }
      }
    }
  }
}
</style>
