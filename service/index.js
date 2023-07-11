// 依托网易云API，运行本地后端环境，可以根据需要进行更改
const BASE_URL = "http://localhost:3000"
// 登录相关的后端,项目名：miniloginserver
const LOGIN_BASE_URL = "http://localhost:3010"
class DiyRequest {
    constructor(baseURL) {
        this.baseURL = baseURL
    }
    request(url, method, params, header = {}) {
        return new Promise((resolve, reject) => {
            wx.request({
              url: this.baseURL + url,
              method: method,
              header: header,
              data: params,
              success: function(res) {
                  resolve(res.data)
              },
              fail: reject
            })
        })
    }
    get(url, params, header) {
        return this.request(url, "GET", params, header)
    }
    post(url, data, header) {
        return this.request(url, "POST", data, header)
    }
}
const diyRequest = new DiyRequest(BASE_URL)
const diyLoginRequest = new DiyRequest(LOGIN_BASE_URL)

export default diyRequest
export {
    diyLoginRequest
}