<template>
  <div
    class="filter-search-item"
    :class="{'search-btn':isBtn,'col-2':isCol2}"
  >
    <slot />
  </div>
</template>
<script>

export default {
  name: 'FilterSearchItem',
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

</style>
