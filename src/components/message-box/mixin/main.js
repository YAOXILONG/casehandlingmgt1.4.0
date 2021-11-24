import Popup from '../mixin/popup'
import i18n from '../../../i18n'

export default {
  mixins: [Popup],

  props: {
    lockScroll: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    closeOnHashChange: {
      type: Boolean,
      default: true
    },
    customClassName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      i18n: i18n,
      uid: 1
    }
  },

  computed: {},

  watch: {
    visible (val) {
      if (val) this.uid++
    }
  },

  mounted () {
    if (this.closeOnHashChange) {
      window.addEventListener('hashchange', this.close)
    }
  },

  beforeDestroy () {
    if (this.closeOnHashChange) {
      window.removeEventListener('hashchange', this.close)
    }
  },

  methods: {
    doClose () {
      if (!this.visible) return
      this.visible = false

      if (this.lockScroll) {
        setTimeout(() => {
          if (this.modal && this.bodyOverflow !== 'hidden') {
            document.body.style.overflow = this.bodyOverflow
            document.body.style.paddingRight = this.bodyPaddingRight
          }
          this.bodyOverflow = null
          this.bodyPaddingRight = null
        }, 200)
      }
    },
    handleWrapperClick () {
      if (this.closeOnClickModal) {
        this.handleAction()
      }
    },
    handleAction () {
      this.doClose()
    }
  }
}
