<template>
  <div ref="wrap"></div>
</template>

<script>

export default {
  name: 'DynamicFrame',
  data () {
    return {
      wrap: null
    }
  },
  props: {
    tab: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  watch: {
    'tab.url' () {
      this.reloadFrame()
    }
  },
  mounted () {
    this.wrap = this.$refs.wrap
    this.addFrame()
  },
  methods: {
    reloadFrame () {
      this.removeFrame()
      this.addFrame()
    },
    getFrameName () {
      return `frame_${this.id}`
    },
    addFrame () {
      let newIframe = document.createElement('iframe')
      const id = `${this.tab.id}`.replace(/[.\\/:?#]/g, '')
      newIframe.setAttribute('id', id)
      newIframe.setAttribute('src', this.tab.url)
      newIframe.setAttribute('name', `frame_${this.tab.id}`)
      newIframe.setAttribute('frameborder', '0')
      newIframe.setAttribute('width', '100%')
      newIframe.setAttribute('height', '100%')
      newIframe.setAttribute('allowTransparency', 'true')
      const WrapRefs = this.wrap
      WrapRefs.appendChild(newIframe)
      newIframe.onload = () => {
        if (newIframe.contentWindow.location.href.indexOf('portal.html') > -1) {
          (top.window || window).location.reload()
          newIframe = null
        }
      }
      // console.log('==0=========添加新的frame节点')
    },
    removeFrame () {
      const WrapRefs = this.$refs.wrap
      if (!WrapRefs) {
        return
      }
      let frameDom = WrapRefs.firstChild
      if (frameDom) {
        frameDom.src = 'about:blank' // 释放大部分内存
        // console.log('==1=========src="about:blank"')
        if (frameDom.contentWindow) {
          try { // 跨域场景下无法操作
            frameDom.contentWindow.document.write('')
            frameDom.contentWindow.document.clear()
            frameDom.contentWindow.close()
            // console.log('==2=========处理contentWindow')
          } catch (e) {
            // todo
          }
        }
        const parentElement = frameDom.parentElement
        if (parentElement) {
          parentElement.removeChild(frameDom)
        }
        // console.log('==3=========删除旧的iframe节点')
        try { // IE下专属内存回收
          // tslint:disable-next-line
          window.CollectGarbage()
          // console.log('==4=========CollectGarbage')
        } catch (e) {
          // todo
        }
        frameDom = null
      }
    }
  }
}
</script>
