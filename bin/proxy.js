/*
 * @Description:
 * @Version: 1.3
 * @Autor: jinxiaoxu
 * @Date: 2020-08-12 15:02:29
 * @LastEditors: jinxiaoxu
 * @LastEditTime: 2021-05-19 09:45:35
 */
const proxyList = [
  {
    test: "/apis/*",
    // target: 'https://10.66.174.196/',
    // target: 'http://10.16.81.16:8384',
    // target: 'http://10.16.82.113:8384', //
    // target: 'http://10.12.66.118:9998/',//杨鸣
    // target: 'https://10.66.174.194/',
    // target: 'http://10.12.66.27:8373',
    // target: 'http://10.16.81.23:8373',
    // target: 'https://10.66.174.189/',
    // target: 'https://10.19.134.87/',
    target: 'https://10.19.134.150/',
    // target: 'http://10.16.82.29:8373/',
    Cookie: 'JSESSIONID=VKyZ4NJteWGH8gWHP0rk5idKCS7aR-z3_1DxSpR3',
    pathRewrite: {
      "^/apis": ""
    },
    ws: true
  }
];
const proxy = {};
proxyList.forEach(({ test, target, ws, Cookie, pathRewrite }) => {
  proxy[test] = {
    target,
    changeOrigin: true, // 是否跨域
    secure: false,
    ws, // websocket支持
    headers: {
      Referer: target,
      Cookie // target登录后的cookie
    },
    pathRewrite
  };
});
module.exports = proxy;
