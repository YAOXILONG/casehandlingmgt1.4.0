<template>
  <div id="app">
    <RouterView/>
<!--    <keep-alive>-->
<!--      <router-view v-if="$route.meta.keepAlive"></router-view>-->
<!--    </keep-alive>-->
<!--    <router-view v-if="!$route.meta.keepAlive"></router-view>-->
  </div>
</template>

<script>

export default {
  name: 'terminalApplicationManage',
  data () {
    return {
      isPreview: false
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less">
  #app {
    width: 100%;
    height: 100%;
  }
</style>
