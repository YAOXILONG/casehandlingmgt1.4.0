// 获取链接参数
export function getUrlParam (name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)') // 构造一个含有目标参数的正则表达式对象
  const r = window.location.search.substr(1).match(reg) // 匹配目标参数
  if (r != null) {
    return decodeURI(r[2])
  }
  return null // 返回参数值
}

/**
 * 获取密码的强度
 * 等级0（风险密码）：密码长度小于8位，或者只包含4类字符中的任意一类，或者密码与用户名一样，或者密码是用户名的倒写。
 * 等级1（弱密码）：包含两类字符，且组合为（数字+小写字母）或（数字+大写字母），且长度大于等于8位。
 * 等级2（中密码）：包含两类字符，且组合不能为（数字+小写字母）和（数字+大写字母），且长度大于等于8位。
 * 等级3（强密码）：包含三类字符及以上，且长度大于等于8位。
 * @date   2016-01-27
 * @param  {String}   szPwd 密码
 * @param  {String}   szUser 用户名
 * @return {Number}     密码强度
 */
export const getPwdRank = (szPwd, szUser) => {
  let iRank = 0
  if (szPwd.match(/[a-z]/g)) {
    iRank++
  }
  if (szPwd.match(/[A-Z]/g)) {
    iRank++
  }
  if (szPwd.match(/[0-9]/g)) {
    iRank++
  }
  if (szPwd.match(/[^a-zA-Z0-9]/g)) {
    iRank++
  }
  iRank = iRank > 3 ? 3 : iRank
  if (
    szPwd.length < 8 ||
    iRank === 1 ||
    szPwd === szUser ||
    szPwd ===
    szUser
      .split('')
      .reverse()
      .join('')
  ) {
    iRank = 0
  }
  if (iRank === 2) {
    if (
      (szPwd.match(/[0-9]/g) && szPwd.match(/[a-z]/g)) ||
      (szPwd.match(/[0-9]/g) && szPwd.match(/[A-Z]/g))
    ) {
      iRank = 1
    }
  }
  return iRank
}
