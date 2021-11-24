const SPECIAL_CHARS_REGEXP = /([:\-_]+(.))/g
const MOZ_HACK_REGEXP = /^moz([A-Z])/
const ieVersion = Number(document.documentMode)

/* istanbul ignore next */
const trim = function (string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}
/* istanbul ignore next */
const camelCase = function (name) {
  return name
    .replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter
    })
    .replace(MOZ_HACK_REGEXP, 'Moz$1')
}

/**
 * 合并对象
 * @param {Object} target 要合并到的对象
 * @returns {Object} 合并后的新对象
 */
export function merge (target) {
  for (let i = 1, j = arguments.length; i < j; i++) {
    // 从第二个参数开始
    const source = arguments[i] || {} // 获取该对象
    for (const prop in source) {
      if (source.hasOwnProperty(prop)) {
        // 只处理不是从原型链上继承来的属性
        const value = source[prop]
        if (value !== undefined) {
          target[prop] = value // 覆盖
        }
      }
    }
  }
  return target
}

const hasOwnProperty = Object.prototype.hasOwnProperty

export function noop () {
}

export function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

export function isVNode (node) {
  return typeof node === 'object' && hasOwn(node, 'componentOptions')
}

/* istanbul ignore next */
export function addClass (el, cls) {
  if (!el) return
  var curClass = el.className
  var classes = (cls || '').split(' ')

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName
      }
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

/* istanbul ignore next */
export function removeClass (el, cls) {
  if (!el || !cls) return
  var classes = cls.split(' ')
  var curClass = ' ' + el.className + ' '

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ')
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}

/* istanbul ignore next */
export function hasClass (el, cls) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1) {
    throw new Error('className should not contain space.')
  }
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

/* istanbul ignore next */
export const getStyle = ieVersion < 9 ? function (element, styleName) {
  if (!element || !styleName) return null
  styleName = camelCase(styleName)
  if (styleName === 'float') {
    styleName = 'styleFloat'
  }
  try {
    switch (styleName) {
    case 'opacity':
      try {
        return element.filters.item('alpha').opacity / 100
      } catch (e) {
        return 1.0
      }
    default:
      return element.style[styleName] || element.currentStyle
        ? element.currentStyle[styleName]
        : null
    }
  } catch (e) {
    return element.style[styleName]
  }
} : function (element, styleName) {
  if (!element || !styleName) return null
  styleName = camelCase(styleName)
  if (styleName === 'float') {
    styleName = 'cssFloat'
  }
  try {
    var computed = document.defaultView.getComputedStyle(element, '')
    return element.style[styleName] || computed
      ? computed[styleName]
      : null
  } catch (e) {
    return element.style[styleName]
  }
}

let scrollBarWidth

export function getScrollBarWidth (isChange) {
  if (!isChange) {
    // 防止鼠标缩放浏览器时scrollBarWidth不变化
    if (scrollBarWidth !== undefined && scrollBarWidth !== 0) {
      return scrollBarWidth
    }
  }

  const outer = document.createElement('div')
  outer.className = 'el-scrollbar__wrap'
  outer.style.visibility = 'hidden'
  outer.style.width = '100px'
  outer.style.position = 'absolute'
  outer.style.top = '-9999px'
  document.body.appendChild(outer)

  const widthNoScroll = outer.offsetWidth
  outer.style.overflow = 'scroll'

  const inner = document.createElement('div')
  inner.style.width = '100%'
  outer.appendChild(inner)

  const widthWithScroll = inner.offsetWidth
  outer.parentNode.removeChild(outer)
  scrollBarWidth = widthNoScroll - widthWithScroll

  return scrollBarWidth
}
