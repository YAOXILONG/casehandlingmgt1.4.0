<template>
  <h-page-container class="terminal-application-manage">
    <h-page-header
      slot="pageHeader"
      :breadcrumb="$breadcrumb"
    />
    <h-layout direction="vertical">
      <h-layout-header>
        <el-tabs
          v-model="activeName"
          class="page-tabs"
          @tab-click="handleClick"
        >
          <el-tab-pane
            :label="item.deviceCategoryName"
            :name="item.deviceCategory"
            v-for="item in tabList"
            :key="item.deviceCategory"
          >
          </el-tab-pane>
        </el-tabs>
      </h-layout-header>
      <inOutApkList
        :file-type="activeName"
      ></inOutApkList>
    </h-layout>
  </h-page-container>
</template>
<script>
import server from '../../server/terminalApplicationManage'
// import theme from '../../mixin/theme'
// import PathDesc from '../../components/PathDesc'
import inOutApkList from './inOutApkList.vue'
export default {
  name: 'TerminalApplicationManage',
  data () {
    return {
      activeName: '',
      tabList: []
    }
  },
  created () {
    this.typeEnum()
  },
  mounted () {

  },

  methods: {
    handleClick () {
      console.log('this.activeName', this.activeName)
    },
    // 查询列表数据
    async typeEnum () {
      const result = await server.typeEnum()
      const { data } = result
      if (data.code === '0') {
        this.tabList = data.data || []
        this.activeName = this.tabList[0].deviceCategory
      } else {
        this.$message.error(data.code)
        // this.$message.error(this.$t(data.code))
      }
    }

  },
  components: { inOutApkList }
}
</script>
<style lang="less" rel="stylesheet/less">
.terminal-application-manage {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
  .el-tabs__item{
    line-height: 36px;
  }
  // .h-layout {
  //   // height: calc(100% - 48px);
  // }
  // .page-tabs {
  //   position: relative;
  //   width: 100%;
  //   height: 100%;
  //   -webkit-box-flex: 1;
  //   -ms-flex: 1 1 auto;
  //   flex: 1 1 auto;

  // }
  // .el-tabs__content {
  //   padding: 0px;
  //   position: relative;
  //   width: 100%;
  //   height: 100%;
  //   -webkit-box-flex: 1;
  //   -ms-flex: 1 1 auto;
  //   flex: 1 1 auto;
  //   // .el-tab-pane {
  //   //   height: 100%;
  //   // }
  // }
}
</style>
