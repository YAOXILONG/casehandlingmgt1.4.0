<!--
 * @Description: 
 * @Version: 1.3
 * @Autor: jinxiaoxu
 * @Date: 2020-08-12 16:19:12
 * @LastEditors: jinxiaoxu
 * @LastEditTime: 2021-01-18 14:58:40
-->
<template>
  <div id="app" class="CaseAreaProcessConfigApp">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: "CaseAreaProcessConfig",
};
</script>

<style lang="less" rel="stylesheet/less">
#app {
  height: 100%;
  width: 100%;
  .el-table {
    border: none;
    thead {
      border-top: solid 1px #e5e5e5;
      tr {
        background: #fafafa;
      }
    }
    .el-table__body-wrapper:before,
    &:after,
    &:before {
      background-color: transparent;
    }
    .el-table__body-wrapper {
      position: absolute;
      top: 37px !important;
      bottom: 0px;
    }
  }

  .el-row {
    height: 100%;
    .el-col {
      height: 100%;
    }
  }
}
.CaseAreaProcessConfigApp {
  .el-tabs {
    width: 100%;
    height: 100%;
    .el-tabs__header {
      margin: 0;
      .el-tabs__nav-next,
      .el-tabs__nav-prev {
        line-height: 48px;
      }
      .el-tabs__item {
        height: 48px;
        line-height: 48px;
        padding: 0px 28px;
        font-size: 14px;
      }
      .el-tabs__nav {
        height: 48px;
        line-height: 48px;
      }
    }
    .el-tabs__content {
      width: 100%;
      height: calc(~"100% - 48px");
      .el-tab-pane {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
