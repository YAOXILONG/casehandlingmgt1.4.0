<template>
  <div
    class="filter-search-content"
  >
    <slot />
  </div>
</template>
<script>

export default {
  name: 'FilterSearchContent',
  props: {
    isBtn: {
      type: Boolean,
      default: false
    },
    isCol2: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },
  mounted () {
  },
  methods: {

  },
  components: {}
}
</script>
<style lang="less" rel="stylesheet/less">
.filter-search-content {
  padding: 0px 16px 0px 16px;
  box-sizing: border-box;
}

</style>
