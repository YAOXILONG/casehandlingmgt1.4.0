<template>
  <el-dialog title="人员详情"
             :area="dialogArea"
             top="middle"
             custom-class="detailDialog"
             :close-on-click-modal="false"
             ref="detailDialog"
             :visible.sync="detailDialogVisible"
             :before-close="handleClose">
    <div id="distributionTable"
         class="distributionTable"
         v-show="(tableData && tableData.length)">
      <li v-for="(item,index) in tableData"
          :key="index"
          class="detailCard">
        <div class="detailCardItemphoto">
          <img v-if="item.registerPhotoUrl"
               :src="item.registerPhotoUrl"
               alt />
          <img v-else
               :src="require('../../assets/image/u5576.png')" />
        </div>
        <div class="detailCardItemText">
          <div class="detailCardLabel overflow"
               :title="'姓名：'+ (item.registerName || '')">
            <i class="detailCardLabel_l overflow">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</i>
            <span>：{{ item.registerName }}</span>
          </div>
          <div class="detailCardLabel overflow"
               :title="'性别：'+(sexMap[item.registerSex] ? sexMap[item.registerSex] :'')">
            <i class="detailCardLabel_l overflow">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</i>
            <span>：{{ sexMap[item.registerSex] ? sexMap[item.registerSex] :'' }}</span>
          </div>
          <div class="detailCardLabel overflow"
               :title="'年龄：'+(item.registerAge ? item.registerAge + '岁':'未知')">
            <i class="detailCardLabel_l">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;龄</i>
            <span v-if="item.registerAge">：{{ item.registerAge }}岁</span>
            <span v-else>：未知</span>
          </div>
          <div class="detailCardLabel overflow"
               :title="'办案民警：'+(item.hostPoliceName || '')">
            <i class="detailCardLabel_l overflow">办案民警</i>
            <span>：{{ item.hostPoliceName || '' }}</span>
          </div>
          <div class="detailCardLabel overflow"
               :title="'案件：'+(item.caseName || '')">
            <i class="detailCardLabel_l">案&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;件</i>
            <span>：{{ item.caseName || '' }}</span>
          </div>
        </div>
      </li>
    </div>
    <div class="distributionTable noData"
         v-show="!(tableData && tableData.length)">
      暂无数据
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click.stop.prevent="handleClose">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import bus from '../../views/waitingManagement/index'
export default {
  name: 'DistributionTable',
  props: {
    paramsDialog: {
      type: Object,
      default: () => {
        return {
          tableData: [],
          detailDialogVisible: false
        }
      }
    },
    inqDicts: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    paramsDialog: {
      handler: function (newV, oldV) {
        this.detailDialogVisible = newV.detailDialogVisible
        this.tableData = newV.tableData
        // this.computedArea()
      },
      immediate: true,
      deep: true
    },
    inqDicts: {
      handler: function (newV, oldV) {
        if (this.inqDicts) {
          this.personTypeMap = this.computedDic(this.inqDicts.suspectType)
          this.sexMap = this.computedDic(this.inqDicts.sex)
        }
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    return {
      tableData: [],
      detailDialogVisible: false,
      dialogArea: [1160, 556],
      personTypeMap: {},
      sexMap: {}
    }
  },
  methods: {
    handleClose (res) {
      bus.$emit('detailCloseDialog', false)
    },
    computedArea () {
      let el = document.querySelector('body')
      let _width = el.offsetHeight
      if (_width && _width - 70 >= 600) {
        this.dialogArea = [1160, 556]
      } else {
        let _height = _width - 200 < 400 ? 400 : _width - 200
        let $width = _height + 400
        let pre = Math.ceil($width / 284)
        this.dialogArea = [pre * 284 + 16, _height]
      }
      if (this.$refs.detailDialog) {
        this.$refs.detailDialog.updatePopper()
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
  mounted () { },
  created () {
    // window.addEventListener('resize',()=>{
    //   this.computedArea()
    // })
    if (this.inqDicts) {
      this.sexMap = this.computedDic(this.inqDicts.sex)
    }
    this.computedArea()
  }
}
</script>
<style lang="less" rel="stylesheet/less">
.detailDialog {
  .distributionTable {
    width: 100%;
    height: 250px;
    .detailCard {
      width: 270px;
      height: 130px;
      border: 1px solid #e6e6e6;
      margin: 8px 6px;
      float: left;
      list-style: none;
      .detailCardItemphoto {
        width: 100px;
        height: 100%;
        float: left;
        background-color: #f2f2f2;
        // background: url('../../assets/image/photo.png')no-repeat;
        background-size: 100% 100%;
        > img {
          width: 100%;
          height: 100%;
        }
      }
      .detailCardItemText {
        width: ~"calc(100% - 101px)";
        height: 100%;
        padding-left: 12px;
        padding-top: 4px;
        box-sizing: border-box;
        float: left;
        > .detailCardLabel {
          width: 100%;
          height: 24px;
          line-height: 24px;
          font-size: 14px;
          color: #999;
          position: relative;
          > span {
            padding-left: 61px;
            box-sizing: border-box;
          }
          .detailCardLabel_l {
            position: absolute;
            top: 0;
            left: 0;
            font-style: normal;
            display: inline-block;
            width: 60px;
            color: #333;
            // text-align-last:justify;
            // text-align:justify;
            // text-justify:distribute-all-lines; // 这行必加，兼容ie浏览器
          }
        }
      }
    }
    &.noData {
      line-height: 250px;
      text-align: center;
    }
  }
  .el-dialog__body {
    padding: 12px 0px;
    color: #666;
    font-size: 14px;
  }
  .el-dialog__body .el-dialog__body-wrapper {
    padding: 0 6px;
  }
}
</style>
