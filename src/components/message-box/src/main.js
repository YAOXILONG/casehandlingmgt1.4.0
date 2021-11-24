import Vue from 'vue'
import msgboxVue from './main.vue'
import contentVue from './content.vue'

const defaults = {
  showClose: true,
  closeOnClickModal: false,
  closeOnPressEscape: false,
  closeOnHashChange: true
}

const MessageBoxConstructor = Vue.extend(msgboxVue)
const ContentBoxConstructor = Vue.extend(contentVue)

const instances = []
let seed = 1

const initMessageBoxInstance = () => {
  const instance = new MessageBoxConstructor({
    el: document.createElement('div')
  })
  const id = 'messagebox_' + seed++
  instance.id = id
  return instance
}

const initContentBoxInstance = () => {
  const instance = new ContentBoxConstructor({
    el: document.createElement('div')
  })
  const id = 'messagebox_' + seed++
  instance.id = id
  return instance
}

const showMsgBox = (options, instance) => {
  if (options.callback) {
    instance.callback = options.callback
  } else {
    instance.callback = () => {
    }
  }
  for (const prop in options) {
    if (options.hasOwnProperty(prop)) {
      instance[prop] = options[prop]
    }
  }

  Object.keys(defaults).forEach(prop => {
    if (instance[prop] === undefined) {
      instance[prop] = true
    }
  })
  document.body.appendChild(instance.$el)

  Vue.nextTick(() => {
    instance.visible = true
  })

  const userOnClose = instance.doClose
  instance.close = function () {
    CloseInstance(instance.id, userOnClose)
  }

  instances.push(instance)
}

const MessageBox = function (options, callback) {
  if (!options.callback && callback) {
    options.callback = callback
  }
  const instance = initMessageBoxInstance()
  showMsgBox(options, instance)
}

const ContentBox = function (options, callback) {
  if (!options.callback && callback) {
    options.callback = callback
  }
  const instance = initContentBoxInstance()
  showMsgBox(options, instance)
}

function CloseInstance (id, userOnClose) {
  const len = instances.length
  for (let i = 0; i < len; i++) {
    const ins = instances[i]
    if (id === ins.id) {
      if (typeof userOnClose === 'function') {
        userOnClose(ins)
      }
      instances.splice(i, 1)
      setTimeout(() => {
        document.body.removeChild(ins.$el)
      }, 300)
      break
    }
  }
}

// function CloseAllInstance () {
//   for (let i = instances.length - 1; i >= 0; i--) {
//     instances[i].close()
//   }
// }

export { MessageBox, ContentBox }
