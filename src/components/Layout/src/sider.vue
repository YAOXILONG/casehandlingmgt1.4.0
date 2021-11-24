<template>
  <div
    :class="positionDiff"
    class="ea-sider"
    :style="{'width': width + 'px'}"
  >
    <slot />
  </div>
</template>
<script>
export default {
  name: 'Sider',
  data () {
    return {}
  },
  props: {
    width: {
      type: Number,
      default: 200
    },
    positionDiff: {
      type: String,
      default: 'left'
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less">
  .ea-sider {
    width: 200px;
    height: 100%;
    background: #fff;
    box-sizing: border-box;
    display: inline-block;
    vertical-align: top;
    transition: all .3s;
    position: absolute;
    top: 0;
    font-size: 12px;
    &.left {
      left: 0;
    }
    &.right {
      right: 0;
    }
  }
</style>
