<template>
  <div
    class="ea-main"
    :style="{'padding':paddingDiff,'height':'calc(100% - ' + heightDiff + 'px)'}"
  >
    <slot />
  </div>
</template>
<script>
export default {
  name: 'Main',
  data () {
    return {
      position: 'left0'
    }
  },
  props: {
    heightDiff: {
      type: Number,
      default: 0
    },
    widthDiff: {
      type: Number,
      default: 0
    }
  },
  computed: {
    paddingDiff () {
      return this.widthDiff >= 0 ? '0 0 0 ' + this.widthDiff + 'px' : '0 ' + -1 * this.widthDiff + 'px 0 0'
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less">
  .ea-main {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: inline-block;
    vertical-align: top;
    transition: all .3s;
    font-size: 14px;
  }
</style>
