import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

import enLocale from '../Languages/en-US'
import zhCNLocale from '../Languages/zh-CN'
import zhCNLocale1 from 'hui/lib/locale/lang/zh-CN'
import enLocale1 from 'hui/lib/locale/lang/en'
const i18n = new VueI18n({
    locale: 'zh_CN', // 语言标识
    messages: {
        'en': Object.assign(enLocale, enLocale1),
        'zh_CN': Object.assign(zhCNLocale, zhCNLocale1)
    }
})
export default i18n