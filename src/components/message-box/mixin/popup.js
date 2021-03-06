import Vue from 'vue'
import PopupManager from './popup-manager'
import { getStyle, getScrollBarWidth, merge } from '../util/index'

let idSeed = 1
const transitions = []

const hookTransition = transition => {
  if (transitions.indexOf(transition) !== -1) return

  const getVueInstance = element => {
    let instance = element.__vue__
    if (!instance) {
      const textNode = element.previousSibling
      if (textNode.__vue__) {
        instance = textNode.__vue__
      }
    }
    return instance
  }

  Vue.transition(transition, {
    afterEnter (el) {
      const instance = getVueInstance(el)

      if (instance) {
        instance.doAfterOpen && instance.doAfterOpen()
      }
    },
    afterLeave (el) {
      const instance = getVueInstance(el)

      if (instance) {
        instance.doAfterClose && instance.doAfterClose()
      }
    }
  })
}

let scrollBarWidth

const getDOM = function (dom) {
  if (dom.nodeType === 3) {
    dom = dom.nextElementSibling || dom.nextSibling
    getDOM(dom)
  }
  return dom
}

export default {
  model: {
    prop: 'visible',
    event: 'visible-change'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    transition: {
      type: String,
      default: ''
    },
    openDelay: {},
    closeDelay: {},
    zIndex: {},
    modal: {
      type: Boolean,
      default: false
    },
    modalFade: {
      type: Boolean,
      default: true
    },
    modalClass: {},
    modalAppendToBody: {
      type: Boolean,
      default: false
    },
    lockScroll: {
      type: Boolean,
      default: true
    },
    closeOnPressEscape: {
      type: Boolean,
      default: false
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    }
  },

  created () {
    if (this.transition) {
      hookTransition(this.transition)
    }
  },

  beforeMount () {
    this._popupId = 'popup-' + idSeed++
    PopupManager.register(this._popupId, this)
  },

  beforeDestroy () {
    PopupManager.deregister(this._popupId)
    PopupManager.closeModal(this._popupId)
    if (
      this.modal &&
      this.bodyOverflow !== null &&
      this.bodyOverflow !== 'hidden'
    ) {
      document.body.style.overflow = this.bodyOverflow
      document.body.style.paddingRight = this.bodyPaddingRight
    }
    if (
      this.modal &&
      this.htmlOverflow !== null &&
      this.htmlOverflow !== 'hidden'
    ) {
      document.getElementsByTagName(
        'html'
      )[0].style.overflow = this.htmlOverflow
    }
    this.bodyOverflow = null
    this.bodyPaddingRight = null
    this.htmlOverflow = null
  },

  data () {
    return {
      opened: false,
      bodyOverflow: null,
      bodyOverflowX: null,
      bodyOverflowY: null,
      htmlOverflow: null,
      bodyPaddingRight: null,
      rendered: false
    }
  },

  watch: {
    visible (val) {
      if (val) {
        if (this._opening) return
        if (!this.rendered) {
          this.rendered = true
          Vue.nextTick(() => {
            this.open()
          })
        } else {
          this.open()
        }
      } else {
        this.close()
      }
    }
  },

  methods: {
    open (options) {
      if (!this.rendered) {
        this.rendered = true
        this.$emit('visible-change', true)
      }

      const props = merge({}, this.$props || this, options)

      if (this._closeTimer) {
        clearTimeout(this._closeTimer)
        this._closeTimer = null
      }
      clearTimeout(this._openTimer)

      const openDelay = Number(props.openDelay)
      if (openDelay > 0) {
        this._openTimer = setTimeout(() => {
          this._openTimer = null
          this.doOpen(props)
        }, openDelay)
      } else {
        this.doOpen(props)
      }
    },

    doOpen (props) {
      if (this.$isServer) return
      if (this.willOpen && !this.willOpen()) return
      if (this.opened) return

      this._opening = true

      this.$emit('visible-change', true)

      const dom = getDOM(this.$el)

      const modal = props.modal

      const zIndex = props.zIndex
      if (zIndex) {
        PopupManager.zIndex = zIndex
      }

      if (modal) {
        if (this._closing) {
          PopupManager.closeModal(this._popupId)
          this._closing = false
        }
        PopupManager.openModal({
          id: this._popupId,
          zIndex: PopupManager.nextZIndex(),
          dom: this.modalAppendToBody ? undefined : dom,
          modalClass: props.modalClass,
          modalFade: props.modalFade
        })
        if (props.lockScroll) {
          if (!this.bodyOverflow) {
            this.bodyPaddingRight = document.body.style.paddingRight
            this.bodyOverflow = document.body.style.overflow
          }
          if (!this.htmlOverflow) {
            this.htmlOverflow = document.getElementsByTagName(
              'html'
            )[0].style.overflow
          }
          scrollBarWidth = getScrollBarWidth()
          const bodyHasOverflow =
            document.documentElement.clientHeight < document.body.scrollHeight
          const bodyOverflowY = getStyle(document.body, 'overflowY')
          if (
            scrollBarWidth > 0 &&
            (bodyHasOverflow || bodyOverflowY === 'scroll')
          ) {
            document.body.style.paddingRight = scrollBarWidth + 'px'
          }
          document.body.style.overflow = 'hidden'
        }
      }

      if (getComputedStyle(dom).position === 'static') {
        dom.style.position = 'absolute'
      }

      dom.style.zIndex = PopupManager.nextZIndex()
      this.opened = true

      this.onOpen && this.onOpen()

      if (!this.transition) {
        this.doAfterOpen()
      }
    },

    doAfterOpen () {
      this._opening = false
    },

    close () {
      if (this.willClose && !this.willClose()) return

      if (this._openTimer !== null) {
        clearTimeout(this._openTimer)
        this._openTimer = null
      }
      clearTimeout(this._closeTimer)

      const closeDelay = Number(this.closeDelay)

      if (closeDelay > 0) {
        this._closeTimer = setTimeout(() => {
          this._closeTimer = null
          this.doClose()
        }, closeDelay)
      } else {
        this.doClose()
      }
    },

    doClose () {
      this.$emit('visible-change', false)
      this._closing = true

      this.onClose && this.onClose()

      if (this.lockScroll) {
        setTimeout(() => {
          if (this.modal && this.bodyOverflow !== 'hidden') {
            document.body.style.overflow = this.bodyOverflow
            document.body.style.paddingRight = this.bodyPaddingRight
          }
          if (this.modal && this.htmlOverflow !== 'hidden') {
            document.getElementsByTagName(
              'html'
            )[0].style.overflow = this.htmlOverflow
          }
          this.bodyOverflow = null
          this.bodyPaddingRight = null
          this.htmlOverflow = null
        }, 200)
      }

      this.opened = false

      if (!this.transition) {
        this.doAfterClose()
      }
    },

    doAfterClose () {
      PopupManager.closeModal(this._popupId)
      this._closing = false
    }
  }
}

export { PopupManager }
