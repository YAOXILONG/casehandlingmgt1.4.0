import server from './server/common'

const getToken = async () => {
  let _language = 'zh_CN'
  const result = {
    token: {},
    skin: {
      clientLayout: 'topbottom',
      webLayout: 'topbottom',
      webSkin: 'blue',
      clientSkin: 'blue'
    },
    LanguageData: {}
  }
  const { data: language } = await server.currLanguage()
  if (language.code === '0') {
    _language = language.data
  }
  const [{ data: token }, { data: LanguageData }] = await Promise.all([server.csrfToken(), await server.multiLanguage({ multiLanguage: _language })])
  if (token.code === '0') {
    result.token = token.data || { token: '' }
  }
  /* if (skin.code === '0') {
    result.skin = skin.data
  } */
  if (LanguageData.code === '0') {
    result.LanguageData = LanguageData.data
  }

  return result
}

const setLanguage = (json, languageId = 'en_US', locales, i18n) => {
  return new Promise(resolve => {
    if (!json) throw new Error('参数json不能为空')
    if (!locales) throw new Error('多语言工具方法不能为空')
    if (!i18n) throw new Error('i18n对象不能为空')
    i18n.mergeLocaleMessage(languageId, json)    // 设置HUI多语言, 兼容之前非数组的写法
    locales = locales instanceof Array ? locales : [locales]
    locales.forEach((locale) => {
      locale.i18n((key, value) => {
        i18n.t(key, value)
      })
    })
    i18n.locale = languageId
    
    resolve()
  })
}

export { getToken, setLanguage }
