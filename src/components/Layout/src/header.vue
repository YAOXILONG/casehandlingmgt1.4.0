<template>
  <div
    class="ea-header"
    :style="{'height': height + 'px'}"
  >
    <slot />
  </div>
</template>
<script>
export default {
  name: 'Header',
  data () {
    return {}
  },
  props: {
    height: {
      type: Number,
      default: 96
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less">
  .ea-header {
    width: 100%;
    height: 96px;
    background: #fff;
    box-sizing: border-box;
    transition: all .3s;
    font-size: 12px;
  }
</style>
