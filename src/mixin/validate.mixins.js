/**
 * @Author: guozhenzhen
 * @Date: 2018-04-27 17:12:17
 * @Desc: 表单验证混入
 * @Desc: 如果需要新增新的验证类型，需要增加内容
 * @Desc: ①regexRule中增加正则，②info中增加提示，③增加validateXX方法，④obj.type下swith中增加类型判断，
 * @Params:
 */
const info = {
  required: '请输入必要信息',
  ip: '请输入有效的IP',
  // mac: '请输入有效的MAC',
  mobile: '请输入有效的手机号',
  name: '请输入1~32位数字、字母、中文',
  port: '请输入 1 到 65535 之间的整数',
  common: '不能包含 \' / \\ : * ? " < > | 这些特殊字符',
  code: '请输入有效的编号(字母、数字、下划线的组合)',
  url: '请输入有效的URL',
  email: '请输入有效的邮箱地址',
  tel: '请输入有效的电话号码',
  telOrMobile: '请输入有效的联系电话',
  mac: '请输入有效的mac地址',
  identity: '请输入有效的身份证号码',
  int: '请输入整数'
}

const regexRule = {
  ip: new RegExp('^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.' +
    '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
    '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
    '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$'),
  mobile: /^[1][1-9][0-9]{9}$/,
  name: /[^A-Za-z0-9\u4e00-\u9fa5]+/, // 姓名特殊字符校验
  common: /[\\/:*?"<|'>]/, // 不允许包含特殊字符\/:*?"<|'%>&+校验
  code: /[^A-Za-z0-9_]+/, // 编号只允许字母、数字和下划线！
  port: /^[1-9]\d*$/, // 非0开头的正整数
  // url: /((http|https):\/\/)(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*(\/[a-zA-Z0-9\&%_\.\/-~-]*)?/,
  email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,
  tel: /(^[0][1-9]{2,3}-[1-9]{1}[0-9]{6,8}$)|(^[1-9]{1}[0-9]{6,8}$)/,
  telOrMobile: /(^(\d{3,4}(-)?)?\d{7,8})$|(^[1][1-9][0-9]{9})$/,
  fixLength: 0,
  identity: {
    isIDCard1: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/, // 15位身份证
    isIDCard2: /^[1-9]\d{5}(19\d{2}|[2-9]\d{3})((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])(\d{4}|\d{3}X)$/i, // 18位身份证
    aCity: {
      11: '北京',
      12: '天津',
      13: '河北',
      14: '山西',
      15: '内蒙古',
      21: '辽宁',
      22: '吉林',
      23: '黑龙江',
      31: '上海',
      32: '江苏',
      33: '浙江',
      34: '安徽',
      35: '福建',
      36: '江西',
      37: '山东',
      41: '河南',
      42: '湖北',
      43: '湖南',
      44: '广东',
      45: '广西',
      46: '海南',
      50: '重庆',
      51: '四川',
      52: '贵州',
      53: '云南',
      54: '西藏',
      61: '陕西',
      62: '甘肃',
      63: '青海',
      64: '宁夏',
      65: '新疆',
      71: '台湾',
      81: '香港',
      82: '澳门',
      91: '国外'
    },
    stard: '10X98765432', // 最后一位身份证的号码
    first: [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 1-17系数
  }
}

export const validateIp = (rule, value, callback) => {
  if (value && value.length > 0) {
    var pattern = regexRule.ip
    if (value && (!pattern.test(value) || value === '255.255.255.255')) {
      callback(new Error(info.ip))
    }
    callback()
  }
  callback()
}

export const validateMobile = (rule, value, callback) => {
  if (value && value.length > 0) {
    if (regexRule.mobile.test(value)) {
      callback()
    }
    callback(new Error(info.mobile))
  }
  callback()
}

export const validateName = (rule, value, callback) => {
  if (value && value.length > 0) {
    if (regexRule.name.test(value)) {
      callback(new Error(info.name))
    }
    callback()
  }
  callback()
}

export const validatePort = (rule, value, callback) => {
  if (value && value.length > 0) {
    if (isNaN(value) || value > 65535 || value < 1 || !regexRule.port.test(value)) {
      callback(new Error(info.port))
    }
    callback()
  }
  callback()
}

export const validateCommon = (rule, value, callback) => {
  if (value && value.length > 0) {
    if (regexRule.common.test(value)) {
      callback(new Error(info.common))
    }
    callback()
  }
  callback()
}

export const validateCode = (rule, value, callback) => {
  if (value && value.length > 0) {
    if (regexRule.code.test(value)) {
      callback(new Error(info.code))
    }
    callback()
  }
  callback()
}

export const validateUrl = (rule, value, callback) => {
  if (value && value.length > 0) {
    if (regexRule.url.test(value)) {
      callback()
    }
    callback(new Error(info.url))
  }
  callback()
}

export const validateEmail = (rule, value, callback) => {
  if (value && value.length > 0) {
    if (regexRule.email.test(value)) {
      callback()
    }
    callback(new Error(info.email))
  }
  callback()
}

export const validateTel = (rule, value, callback) => {
  if (value && value.length > 0) {
    if (regexRule.tel.test(value)) {
      callback()
    }
    callback(new Error(info.tel))
  }
  callback()
}

export const validateTelOrMobile = (rule, value, callback) => {
  if (value && value.length > 0) {
    if (regexRule.telOrMobile.test(value)) {
      callback()
    }
    callback(new Error(info.telOrMobile))
  }
  callback()
}

export const validateMac = (rule, value, callback) => {
  if (value && value.length > 0) {
    let macs = null
    if (value.indexOf(':') > 0) {
      macs = value.split(':')
    } else {
      macs = value.split('-')
    }
    if (macs == null || macs.length !== 6) {
      callback(new Error(info.mac))
    }
    for (var s = 0; s < 6; s++) {
      var temp = parseInt(macs[s], 16)
      if (isNaN(temp) || temp < 0 || temp > 255) {
        callback(new Error(info.mac))
      }
    }
  }
  callback()
}

export const validateIdentity = (rule, value, callback) => {
  let sum = 0
  let year
  let month
  let day
  let birthday
  let isIDCard1 = regexRule.identity.isIDCard1
  let isIDCard2 = regexRule.identity.isIDCard2
  let aCity = regexRule.identity.aCity
  let first = regexRule.identity.first
  let stard = regexRule.identity.stard
  if (value.length === 15) {
    year = '19' + value.substr(6, 2)
    month = value.substr(8, 2)
    day = value.substr(10, 2)
    birthday = '19' + value.substr(6, 6)
    if (!isIDCard1.test(value)) {
      callback(new Error(info.identity))
    }
  } else if (value.length === 18) {
    year = value.substr(6, 4)
    month = value.substr(10, 2)
    day = value.substr(12, 2)
    birthday = value.substr(6, 8)
    if (!isIDCard2.test(value)) {
      callback(new Error(info.identity))
    }
    // 检测身份证最后一位是否合法
    for (var i = 0; i < value.length - 1; i++) {
      sum += value[i] * first[i]
    }
    var result = sum % 11
    var last = stard[result] // 计算出来的最后一位身份证号码
    if (value[value.length - 1].toUpperCase() !== last) {
      callback(new Error(info.identity))
    }
  }
  // 检测证件地区是否合法
  if (aCity[parseInt(value.substr(0, 2))] == null) {
    callback(new Error(info.identity))
  }
  // 检测出生年月是否合法
  if (birthday !== dateToString(new Date(year + '/' + month + '/' + day))) { // 校验日期是否合法
    callback(new Error(info.identity))
  }
  callback()
}

export const validateInt = (rule, val, callback) => {
  let value = val + ''
  if (value && value.length > 0) {
    if (/\D/.test(value)) {
      callback(new Error(info.int))
    } else {
      callback()
    }
  }
}

export const validateFixLength = (fixLength) => {
  return function (rule, value, callback) {
    if (value && value.length > 0) {
      if (value.length !== fixLength) {
        callback(new Error('请输入' + fixLength + '个字符'))
      }
      callback()
    }
    callback()
  }
}

export const dateToString = (date) => {
  if (date instanceof Date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    month = month < 10 ? '0' + month : month
    var day = date.getDate()
    day = day < 10 ? '0' + day : day
    return year + '' + month + '' + day
  }
  return ''
}
export default {
  // data () {
  //   return {
  //     rules: {
  //       ip: this.validateor({minLength: 1, maxLength: 18, type: 'ip'}),
  //       ipnotreq: this.validateor({minLength: 1, maxLength: 18, type: 'ip'}),
  //       name: this.validateor({required: true, type: 'name'}),
  //       identity: this.validateor({required: true, type: 'identity'}),
  //       mobile: this.validateor({required: true, type: 'mobile'}),
  //       port: this.validateor({required: true, type: 'port'}),
  //       code: this.validateor({required: true, type: 'code'}),
  //       url: this.validateor({required: true, type: 'url'}),
  //       email: this.validateor({required: true, type: 'email'}),
  //       mac: this.validateor({required: true, type: 'mac'}),
  //       tel: this.validateor({required: true, type: 'tel'}),
  //       telOrMobile: this.validateor({required: true, type: 'telOrMobile'}),
  //       common: this.validateor({fixLength: 2, type: 'common'}),
  //       common20: this.validateor({minLength: 1, maxLength: 20, type: 'common'}),
  //       extra: this.validateor({
  //         maxLength: 18,
  //         type: 'ip',
  //         extra: [
  //           {required: true, message: 'info required', trigger: 'blur'}
  //         ]
  //       }),
  //       int: this.validateor({required: true, type: 'int'})
  //     }
  //   }
  // },
  methods: {
    validateor (obj) {
      let validateorArray = []

      // 判断是否为必填
      if (obj.required === 'true' || obj.required === true || obj.required === 'required') {
        validateorArray.push({ required: true, message: info.required })
      }

      // 判断type的类型
      if (!(obj.type === 'undefined' || obj.type === undefined || obj.type === null)) {
        switch (obj.type) {
          case 'ip':
            validateorArray.push({ validator: validateIp, trigger: 'blur' })
            break
          // case 'mac':
          //   validateorArray.push({validator: validateMac, trigger: 'blur'})
          //   break
          case 'mobile':
            validateorArray.push({ validator: validateMobile, trigger: 'blur' })
            break
          case 'name':
            validateorArray.push({ validator: validateName, trigger: 'blur' })
            break
          case 'port':
            validateorArray.push({ validator: validatePort, trigger: 'blur' })
            break
          case 'common':
            validateorArray.push({ validator: validateCommon })
            break
          case 'code':
            validateorArray.push({ validator: validateCode, trigger: 'blur' })
            break
          case 'url':
            validateorArray.push({ validator: validateUrl, trigger: 'blur' })
            break
          case 'email':
            validateorArray.push({ validator: validateEmail, trigger: 'blur' })
            break
          case 'tel':
            validateorArray.push({ validator: validateTel, trigger: 'blur' })
            break
          case 'telOrMobile':
            validateorArray.push({ validator: validateTelOrMobile })
            break
          case 'mac':
            validateorArray.push({ validator: validateMac, trigger: 'blur' })
            break
          case 'identity':
            validateorArray.push({ validator: validateIdentity, trigger: 'blur' })
            break
          case 'int':
            validateorArray.push({ validator: validateInt })
            break
          default:
            console.error('【Validate Error】No such type')
            return []
        }
      }

      // 固定长度
      if (!(obj.fixLength === 'undefined' || obj.fixLength === undefined || obj.fixLength === null)) {
        if (isNaN(obj.fixLength)) {
          console.error('【Validate Error】fixLength is not a Number')
          return []
        }
        validateorArray.push({ validator: validateFixLength(obj.fixLength), trigger: 'blur' })
      }

      // 最小长度
      if (!(obj.minLength === 'undefined' || obj.minLength === undefined || obj.minLength === null)) {
        if (isNaN(obj.minLength)) {
          console.error('【Validate Error】minLength is not a Number')
          return []
        }
        validateorArray.push({ min: obj.minLength, message: '输入的项的长度不能少于' + obj.minLength + '个字符', trigger: 'blur' })
      }

      // 最大长度
      if (!(obj.maxLength === 'undefined' || obj.maxLength === undefined || obj.maxLength === null)) {
        if (isNaN(obj.maxLength)) {
          console.error('【Validate Error】maxLength is not a Number')
          return []
        }
        validateorArray.push({ max: obj.maxLength, message: '输入的项的长度不能超过' + obj.maxLength + '个字符', trigger: 'blur' })
      }

      // 自定义
      if (!(obj.extra === 'undefined' || obj.extra === undefined || obj.extra === null)) {
        if (Array.isArray(obj.extra)) {
          if (obj.extra.length > 0) {
            validateorArray = validateorArray.concat(obj.extra)
          }
        } else {
          console.error('【Validate Error】extra is not a Array')
          return []
        }
      }
      return validateorArray
    }
  }
}
