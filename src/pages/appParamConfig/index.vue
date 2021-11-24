<!--
 * @Description: 
 * @Version: 1.3
 * @Autor: jinxiaoxu
 * @Date: 2021-05-10 19:59:27
 * @LastEditors: jinxiaoxu
 * @LastEditTime: 2021-05-13 11:42:55
-->
<template>
  <h-page-container class="appParamConfigPage">
    <h-page-header slot="pageHeader" :breadcrumb="$breadcrumb" />
    <el-tabs
      v-model="activeName"
      class="appParamConfigPage-page-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane
        :label="item.deviceCategoryName"
        :name="item.deviceCategory"
        v-for="item in tabList"
        :key="item.deviceCategory"
      >
        <component
          :is="item.deviceCategory"
          :fileType="item.deviceCategory"
          :currentType="activeName"
        ></component>
      </el-tab-pane>
    </el-tabs>
  </h-page-container>
</template>
<script>
import server from '../../server/appParamConfig'
// import theme from '../../mixin/theme'
// import PathDesc from '../../components/PathDesc'
import caseprocctrlapp from './caseProcess.vue'
import iwrctrlapp from './inquestProcess.vue'
import caseinspectapp from './caseinspectapp.vue'
export default {
  name: 'appParamConfig',
  data() {
    return {
      activeName: 'caseprocctrlapp',
      tabList: [
        {
          name: '执法流程管控',
          val: 'caseprocctrlapp',
        },
        {
          name: '候问讯问管控',
          val: 'iwrctrlapp',
        },
      ],
    }
  },
  created() {
    this.typeEnum()
  },
  mounted() {},

  methods: {
    handleClick() {
      console.log('this.activeName', this.activeName)
    },
    // 查询列表数据
    async typeEnum() {
      const result = await server.typeEnum()
      const { data } = result
      if (data.code === '0') {
        this.tabList = data.data || []
        this.activeName = this.tabList[0].deviceCategory
      } else {
        this.$messagebox(result)
      }
    },
  },
  components: { caseprocctrlapp, iwrctrlapp, caseinspectapp },
}
</script>
<style lang="less" rel="stylesheet/less">
.appParamConfigPage {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: block;
  * {
    box-sizing: border-box;
  }
  .appParamConfigPage-page-tabs {
    width: 100%;
    height: ~'calc(100% - 40px)';
    .el-tabs__content {
      height: ~'calc(100% - 40px)';
      .el-tab-pane {
        height: 100%;
      }
    }
  }
  .el-tabs__item {
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
