<template>
  <div id="app"
       v-loading="loading">
    <keep-alive>
      <template v-if="$route.meta.keepAlive">
        <RouterView :type="type" />
      </template>
    </keep-alive>
    <template v-if="!$route.meta.keepAlive">
      <RouterView :type="type" />
    </template>
  </div>
</template>

<script>
import socket from '../../mixin/socket'
import server from '../../server/elerecord'

export default {
  name: 'Elerecordview',
  data () {
    return {
      type: '-1',
      loading: false
    }
  },
  mixins: [socket],
  created () {
    this.separateConfig()
  },
  methods: {
    async separateConfig () {
      this.loading = true
      const { data } = await server.separateConfig()
      this.loading = false
      if (data.code === '0') {
        // 1-审录分离 0-不分离
        // 执法办案不存在审讯分离的情况，所以直接写死type
        this.type = 0
      } else {
        this.$message.error(this.$t(data.code))
      }
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
