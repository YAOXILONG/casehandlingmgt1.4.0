<template>
  <el-scrollbar v-loading="loadingInstance"
                wrap-class="scrollbarWrap"
                view-class="scrollbarView"
                ref="scrollbar">
    <div id="drugAbuseTestingRecords"
         class="drugAbuseTestingRecords">
      <div class="drugAbuseTestingRecordsTableBox">
        <div class="drugAbuseTestingRecordsTitle">
          <i></i>
          <span>人员基本情况</span>
        </div>
        <div class="tableContent">
          <ul class="drugAbuseTestingRecordsTable clearfix">
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  检测结果
                </div>
                <div class="tableItemCon"
                     v-if="Number(currentPerson.checkResult) == 1">
                  阴
                </div>
                <div class="tableItemCon"
                     v-else-if="Number(currentPerson.checkResult) == 2">
                  阳
                </div>
                <div class="tableItemCon"
                     v-else>
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  检测地点
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.checkPlace || ''">
                  {{ currentPerson.checkPlace || '' }}
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  检测时间
                </div>
                <div class="tableItemCon"
                     :title="currentPerson.checkTimeStr ? $moment(currentPerson.checkTimeStr).format('YYYY-MM-DD HH:mm:ss'):''">
                  {{ currentPerson.checkTimeStr ? $moment(currentPerson.checkTimeStr).format('YYYY-MM-DD HH:mm:ss'):'' }}
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
                <div class="tableImgItemLabel">
                  检测结果图片
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableImgItemLabel">
                  被检测人抓拍
                </div>
              </li>
            </el-col>
            <el-col :span="12"
                    class="tableImg">
              <li class="tableImgItem">
                <div class="tableImgItemCon">
                  <img :src="currentPerson.checkPhotoUrl || signImg"
                       alt="">
                </div>
              </li>
            </el-col>
            <el-col :span="12"
                    class="tableImg">
              <li class="tableImgItem">
                <div class="tableImgItemCon">
                  <img :src="currentPerson.checkPhoto2Url || signImg"
                       alt="">
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  检测民警签字
                </div>
                <div class="tableItemCon">
                  <div class="signContent">
                    <img :src="currentPerson.policeSignPhotoUrl ||signImg"
                         alt="">
                  </div>
                </div>
              </li>
            </el-col>
            <el-col :span="12">
              <li class="tableItem">
                <div class="tableItemLabel">
                  被检测人签字
                </div>
                <div class="tableItemCon">
                  <div class="signContent">
                    <img :src="currentPerson.personSignPhotoUrl ||signImg"
                         alt="">
                  </div>
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
    }
  },
  data () {
    return {
      signImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABaCAIAAACwpMoFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYzRDBCN0JBMDdCRDExRTg4MUE0ODFBM0JDN0IzRUQwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjYzRDBCN0JCMDdCRDExRTg4MUE0ODFBM0JDN0IzRUQwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjNEMEI3QjgwN0JEMTFFODgxQTQ4MUEzQkM3QjNFRDAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjNEMEI3QjkwN0JEMTFFODgxQTQ4MUEzQkM3QjNFRDAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4bhszUAAAJtElEQVR42uyd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',
      currentPerson: {},
      loadingInstance: false
    }
  },
  methods: {
    async findDrugCheckInfo () {
      this.loadingInstance = true
      try {
        let params = {
          registerId: this.currentRegisterId
        }
        let res = await server.findDrugCheckInfo(params)
        if (res.data.code === '0') {
          let data = res.data.data
          this.currentPerson = JSON.parse(JSON.stringify(data.drugCheckInfo)) || {}
          this.loadingInstance = false
        } else {
          this.loadingInstance = false
          this.$messagebox(res)
        }
      } catch {
        this.loadingInstance = false
      }
    }
  },
  created () {
    this.findDrugCheckInfo()
  },
  mounted () {

  }
}
</script>

<style lang="less" rel="stylesheet/less">
.drugAbuseTestingRecords {
  width: 100%;
  height: 100%;
  .drugAbuseTestingRecordsTableBox {
    width: 980px;
    padding: 40px;
    margin: 40px auto;
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.2);
    background: #fff;
    height: auto;
    box-sizing: border-box;
    position: relative;
    .drugAbuseTestingRecordsTitle {
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
  .drugAbuseTestingRecordsTable {
    width: 100%;
    .el-col {
      height: 38px;
      .tableItem {
        width: 100%;
        height: 100%;
        border-bottom: 1px solid #ddd;
        .tableItemLabel {
          width: 120px;
          line-height: 38px;
          // text-align: center;
          text-indent: 14px;
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
          height: 100%;
          float: left;
          line-height: 38px;
          text-indent: 14px;
          border-right: 1px solid #ddd;
        }
      }
      .tableImgItemLabel {
        width: ~"calc(100% - 1px)";
        line-height: 38px;
        position: relative;
        font-size: 14px;
      }
      .tableImgItemLabel::before {
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
      &.tableImg {
        height: 240px;
        .tableImgItem {
          width: 100%;
          height: 100%;
          padding: 24px 88px;
          box-sizing: border-box;
          border-bottom: 1px solid #ddd;
          border-right: 1px solid #ddd;
          .tableImgItemCon {
            width: ~"calc(100% - 1px)";
            height: 100%;
            padding: 4px;
            box-sizing: border-box;
            border: 1px solid #ddd;
            > img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }

    .el-col:nth-last-of-type(1),
    .el-col:nth-last-of-type(2) {
      height: 80px;
      .tableItemLabel {
        line-height: 80px;
      }
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
</style>
