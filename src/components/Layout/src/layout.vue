<template>
  <div class="ea-layout">
    <slot />
  </div>
</template>
<script>
export default {
  name: 'Layout',
  data () {
    return {}
  },
  beforeMount () {
    this.setLayout()
  },
  beforeUpdate () {
    this.setLayout()
  },
  methods: {
    setLayout () {
      let _this = this
      let tags = []
      _this.$slots && _this.$slots.default && _this.$slots.default.map(vnode => {
        const tag = vnode.componentOptions
        tag && tags.push(tag)
      })
      if (tags.length === 3 && tags[0].tag === 'Header' && tags[1].tag === 'Main' && tags[2].tag === 'Footer') {
        let _headerHeight = (tags[0].propsData && tags[0].propsData.height) || 96
        let _footerHeight = (tags[2].propsData && tags[2].propsData.height) || 96
        tags[1].propsData.heightDiff = _headerHeight + _footerHeight
      } else if (tags.length === 2 && tags[0].tag === 'Header' && tags[1].tag === 'Main') {
        let _headerHeight = (tags[0].propsData && tags[0].propsData.height) || 96
        tags[1].propsData.heightDiff = _headerHeight
      } else if (tags.length === 2 && tags[0].tag === 'Main' && tags[1].tag === 'Footer') {
        let _footerHeight = (tags[1].propsData && tags[1].propsData.height) || 96
        tags[0].propsData.heightDiff = _footerHeight
      } else if (tags.length === 2 && tags[0].tag === 'Sider' && tags[1].tag === 'Main') {
        let _siderWidth = (tags[0].propsData && tags[0].propsData.width) || 200
        tags[0].propsData.positionDiff = 'left'
        tags[1].propsData.widthDiff = _siderWidth
      } else if (tags.length === 2 && tags[0].tag === 'Main' && tags[1].tag === 'Sider') {
        let _siderWidth = (tags[1].propsData && tags[1].propsData.width) || 200
        tags[0].propsData.widthDiff = -1 * _siderWidth
        tags[1].propsData.positionDiff = 'right'
      } else {
        throw Error('["Header", "Main", "Footer"]或["Sider", "Main"]')
      }
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less">
  .ea-layout {
    width: 100%;
    height: 100%;
    position: relative;
    box-sizing: border-box;
    font-size: 0;
  }
</style>
