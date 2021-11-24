<template>
  <div class="cd">
    <div class="editCD"
         @click="showBigImage">
      <img class="cdimg"
           :src="value.pic"
           alt="cd">
      <div class="cd_name"
           :title="value.name">
        {{ value.name }}
      </div>
      <div class="cd_alert">
        点击缩略图可查看大图
      </div>
    </div>
    <el-button type="text"
               @click="changeCd">
      修改封面
    </el-button>
    <el-dialog :area="[900,600]"
               no-scrollbar
               top="middle"
               title="选择封面"
               :visible.sync="dialogVisible"
               size="small"
               class="cdDialog"
               :close-on-press-escape="false"
               :close-on-click-modal="false">
      <div class="cdbox">
        <div class="dialogheader">
          <div class="target_name">
            当前: {{ checkedItem.name }}
          </div>
          <el-input clearable
                    placeholder="搜索封面名称"
                    suffix-icon="h-icon-search"
                    v-model="name"
                    :on-icon-click="handleIconClick"
                    :clear-icon-click="clearIconClick">
          </el-input>
        </div>
        <div class="maincontent">
          <el-scrollbar wrap-class="el-scrollbar__wrap"
                        view-class="el-scrollbar__view">
            <template v-for="item in diskCoverList">
              <div class="cd_item"
                   :class="{'active': item.indexCode === checkedItem.indexCode}"
                   :key="item.indexCode"
                   @click="checkCd(item)">
                <div class="cd_item_name"
                     :title="item.name">
                  {{ item.name }}
                </div>
                <div class="cd_item_con">
                  <div class="defaultFlag"
                       v-if="item.default">
                    <span>默认</span>
                  </div>
                  <el-checkbox :value="item.indexCode === checkedItem.indexCode"></el-checkbox>
                  <img class="cd_item_img"
                       :src="item.pic"
                       alt="cd">
                </div>
              </div>
            </template>
          </el-scrollbar>
        </div>
        <el-pagination small
                       @current-change="handleCurrentChange"
                       :current-page="pagination.currentPage"
                       :page-size="pagination.pageSize"
                       :total="pagination.total"
                       layout="prev, pager, next">
        </el-pagination>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="submitCheckCd">
          确定
        </el-button>
        <el-button @click="cancelCheckCd">
          取消
        </el-button>
      </span>
    </el-dialog>

    <el-dialog class="showbigimg"
               :area="[517,557]"
               top="middle"
               no-scrollbar
               :visible.sync="dialogVisible2">
      <img :src="checkedItem.pic || value.pic"
           alt="cd">
    </el-dialog>
  </div>
</template>
<script>
import server1 from '../server/elerecord'
import server2 from '../server/remote'

export default {
  name: 'Cd',
  data () {
    return {
      dialogVisible: false,
      dialogVisible2: false,
      name: '',
      checked: false,
      diskCoverList: [],
      checkedItem: {},
      pagination: {
        currentPage: 1,
        pageSize: 8,
        total: 0
      },
      server: null
    }
  },
  props: {
    value: {
      type: null,
      default: () => {
        return null
      }
    }
  },
  watch: {
    value (val) {
      this.checkedItem = val
    }
  },
  mounted () {
    this.server = this.flag === 'remote' ? server2 : server1
    this.checkedItem = this.value
    this.getDiskCoverList()
  },
  methods: {
    handleIconClick () {
      this.getDiskCoverList()
    },
    clearIconClick () {
      this.$nextTick(() => {
        this.getDiskCoverList()
      })
    },
    handleCurrentChange (val) {
      this.pagination.currentPage = val
      this.getDiskCoverList()
    },
    submitCheckCd () {
      this.$emit('input', this.checkedItem)
      this.dialogVisible = false
    },
    cancelCheckCd () {
      this.checkedItem = this.value
      this.dialogVisible = false
    },
    checkCd (item) {
      this.checkedItem = item
    },
    async getDiskCoverList () {
      const params = {
        name: this.name,
        pageNo: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }
      const { data } = await this.server.getDiskCoverList(params)
      if (data.code === '0') {
        this.diskCoverList = data.data.list
        this.pagination.total = data.data.total
        // this.pagination.currentPage = data.data.pageNo
      } else {
        this.$message.error(data.code)
      }
    },
    showBigImage () {
      this.dialogVisible2 = true
    },
    changeCd () {
      this.dialogVisible = true
    }
  }
}
</script>
<style rel="stylesheet/less" lang="less">
.cd {
  .editCD {
    width: 234px;
    height: 114px;
    border: 1px dotted #cccccc;
    position: relative;
    cursor: pointer;
  }

  .cdimg {
    display: inline-block;
    position: absolute;
    width: 62px;
    height: 62px;
    top: 26px;
    left: 21px;
    border-radius: 100%;
    border: 1px solid #e5e5e5;
    overflow: hidden;
  }

  .cd_name {
    position: absolute;
    width: 120px;
    height: 20px;
    top: 35px;
    left: 98px;
    line-height: 20px;
    text-align: center;
    font-size: 12px;
    color: #4d4d4d;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cd_alert {
    position: absolute;
    width: 120px;
    height: 20px;
    top: 59px;
    left: 98px;
    line-height: 20px;
    text-align: center;
    font-size: 12px;
    color: #999999;
  }

  .el-scrollbar__wrap {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .el-dialog__body-wrapper {
    height: 100%;
  }

  .cdbox {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .dialogheader {
    height: 32px;
    margin: 24px 0;
    padding: 0px 13px;

    .el-input {
      vertical-align: top;
      float: right;
      width: 240px;

      &:after {
        clear: both;
      }
    }
  }

  .target_name {
    display: inline-block;
    width: 50%;
  }

  .maincontent {
    flex: 1;
    font-size: 0;
  }

  .el-pagination {
    height: 48px;
    padding: 12px;
    box-sizing: border-box;
    text-align: right;
  }

  .el-dialog__body {
    padding: 0 24px;
  }

  .cd_item {
    display: inline-block;
    width: 188px;
    height: 212px;
    margin: 8px 11px;
    background: #ffffff;
    border: 1px solid #e6e6e6;

    &.active {
      border: 1px solid #2080f7;
    }
  }

  .cd_item_name {
    height: 39px;
    line-height: 39px;
    text-align: center;
    font-size: 14px;
    color: #4d4d4d;
    border-bottom: 1px solid #e6e6e6;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .el-dialog__body .el-dialog__body-wrapper {
    padding: 0;
  }

  .dialog-footer {
    button {
      width: 96px;
    }
  }

  .cd_item_con {
    position: relative;
  }

  .cd_item_img {
    position: absolute;
    top: 23px;
    left: 31px;
    width: 126px;
    height: 126px;
    border-radius: 100%;
  }

  .el-checkbox {
    position: absolute;
    top: 0;
    left: 8px;
  }

  .defaultFlag {
    position: absolute;
    top: 0;
    right: 0;
    width: 38px;
    height: 38px;
    box-sizing: border-box;
    border-top: 19px solid #2080f7;
    border-right: 19px solid #2080f7;
    border-bottom: 19px solid transparent;
    border-left: 19px solid transparent;
    line-height: 38px;
    text-align: center;

    &:after {
      content: "";
      position: absolute;
      top: -19px;
      right: -19px;
      width: 16px;
      height: 16px;
      box-sizing: border-box;
      border-top: 8px solid #fff;
      border-right: 8px solid #fff;
      border-bottom: 8px solid transparent;
      border-left: 8px solid transparent;
    }

    span {
      position: absolute;
      top: -24px;
      right: -24px;
      width: 38px;
      height: 38px;
      transform: rotate(-315deg);
      font-size: 12px;
      color: #ffffff;
    }
  }

  .el-dialog__body-wrapper {
    .el-scrollbar {
      background-color: #fff;
    }
  }
}
.cdDialog {
  .el-dialog__body-wrapper {
    height: 100%;
  }

  .cdbox {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .dialogheader {
    height: 32px;
    margin: 24px 0;
    padding: 0px 13px;

    .el-input {
      vertical-align: top;
      float: right;
      width: 240px;

      &:after {
        clear: both;
      }
    }
  }

  .target_name {
    display: inline-block;
    width: 50%;
  }

  .maincontent {
    width: 100%;
    height: calc(~"100% - 56px");
    // flex: 1;
    // font-size: 0;
  }
  .el-scrollbar__wrap {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .el-pagination {
    height: 48px;
    padding: 12px;
    box-sizing: border-box;
    text-align: right;
  }

  .el-dialog__body {
    padding: 0 24px;
  }

  .cd_item {
    display: inline-block;
    width: 188px;
    height: 212px;
    margin: 8px 11px;
    background: #ffffff;
    border: 1px solid #e6e6e6;

    &.active {
      border: 1px solid #2080f7;
    }
  }
  .defaultFlag {
    position: absolute;
    top: 0;
    right: 0;
    width: 38px;
    height: 38px;
    box-sizing: border-box;
    border-top: 19px solid #2080f7;
    border-right: 19px solid #2080f7;
    border-bottom: 19px solid transparent;
    border-left: 19px solid transparent;
    line-height: 38px;
    text-align: center;

    &:after {
      content: "";
      position: absolute;
      top: -19px;
      right: -19px;
      width: 16px;
      height: 16px;
      box-sizing: border-box;
      border-top: 8px solid #fff;
      border-right: 8px solid #fff;
      border-bottom: 8px solid transparent;
      border-left: 8px solid transparent;
    }

    span {
      position: absolute;
      top: -24px;
      right: -24px;
      width: 38px;
      height: 38px;
      transform: rotate(-315deg);
      font-size: 14px;
      color: #ffffff;
    }
  }
  .cd_item_name {
    height: 39px;
    line-height: 39px;
    text-align: center;
    font-size: 14px;
    color: #4d4d4d;
    border-bottom: 1px solid #e6e6e6;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .el-dialog__body .el-dialog__body-wrapper {
    padding: 0;
  }

  .dialog-footer {
    button {
      width: 96px;
    }
  }

  .cd_item_con {
    position: relative;
  }

  .cd_item_img {
    position: absolute;
    top: 23px;
    left: 31px;
    width: 126px;
    height: 126px;
    border-radius: 100%;
  }

  .el-checkbox {
    position: absolute;
    top: 0;
    left: 8px;
  }
  .el-dialog__body-wrapper {
    .el-scrollbar {
      background-color: #fff;
    }
  }
}
.showbigimg {
  .el-dialog__body-wrapper {
    height: 100%;
  }
  img {
    height: 100%;
    width: 100%;
    display: inline-block;
    border-radius: 100%;
    border: 1px solid #e5e5e5;
    overflow: hidden;
  }
}
</style>
