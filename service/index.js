import { TOKEN_KEY } from '../constants/token-const'
const token = wx.getStorageSync(TOKEN_KEY) //获取到用户token，便于后续请求时添加token
// 依托网易云API，运行本地后端环境，可以根据需要进行更改
const BASE_URL = "http://localhost:3000"
// 登录相关的后端,项目名：miniloginserver
const LOGIN_BASE_URL = "http://localhost:3010"
class DiyRequest {
    constructor(baseURL, authHeader = {}) {
        this.baseURL = baseURL
        this.authHeader = authHeader
    }
    request(url, method, params, isAuth = false, header = {}) {
        // isAuth项用于表明是否需要添加类似token的验证字段
        const finalHeader = isAuth ? { ...this.authHeader, ...header }: header
        return new Promise((resolve, reject) => {
            wx.request({
              url: this.baseURL + url,
              method: method,
              header: finalHeader,
              data: params,
              success: function(res) {
                  resolve(res.data)
              },
              fail: reject
            })
        })
    }
    get(url, params, isAuth = false, header) {
        return this.request(url, "GET", params, isAuth, header)
    }
    post(url, data, isAuth = false, header) {
        return this.request(url, "POST", data, isAuth, header)
    }
}
const diyRequest = new DiyRequest(BASE_URL)
const diyLoginRequest = new DiyRequest(LOGIN_BASE_URL, {
    token
})

export default diyRequest
export {
    diyLoginRequest
}