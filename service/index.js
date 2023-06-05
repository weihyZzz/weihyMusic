// 依托网易云API，运行本地后端环境，可以根据需要进行更改
const BASE_URL = "http://localhost:3000"
class DiyRequest {
    request(url, method, params) {
        return new Promise((resolve, reject) => {
            wx.request({
              url: BASE_URL + url,
              method: method,
              data: params,
              success: function(res) {
                  resolve(res.data)
              },
              fail: reject
            })
        })
    }
    get(url, params) {
        return this.request(url, "GET", params)
    }
    post(url, params) {
        return this.request(url, "POST", data)
    }
}
const diyRequest = new DiyRequest()
export default diyRequest